// Service layer for attendance display device management (admin + TV heartbeat)
import { supabase } from '@/lib/supabase/client';
import { AttendanceDisplay, TodaySummary } from '@/types';

function generateCode(): string {
  const prefix = ['GATE', 'HALL', 'LOBBY', 'BLDG', 'TV'][Math.floor(Math.random() * 5)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

// Fetch all registered displays ordered by creation date
export async function listDisplays(): Promise<AttendanceDisplay[]> {
  const { data, error } = await supabase
    .from('attendance_displays')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error listing displays:', error);
    return [];
  }
  return data || [];
}

// Validate and return a display config by activation code
export async function getDisplayByCode(
  code: string
): Promise<AttendanceDisplay | null> {
  const { data, error } = await supabase
    .from('attendance_displays')
    .select('*')
    .eq('display_code', code.toUpperCase().trim())
    .eq('is_enabled', true)
    .single();

  if (error || !data) return null;
  return data;
}

// Create a new display with an auto-generated unique code
export async function createDisplay(
  display_name: string,
  location: string | null
): Promise<AttendanceDisplay & { generated_code: string }> {
  let code = generateCode();
  let attempts = 0;

  // Retry if code collision (extremely unlikely)
  while (attempts < 5) {
    const { data, error } = await supabase
      .from('attendance_displays')
      .insert([{ display_code: code, display_name, location }])
      .select()
      .single();

    if (!error && data) {
      return { ...data, generated_code: code };
    }
    if (error?.code === '23505') {
      code = generateCode();
      attempts++;
    } else {
      throw error;
    }
  }
  throw new Error('Failed to generate unique display code after 5 attempts');
}

// Update display name, location, or enabled status
export async function updateDisplay(
  id: number,
  patch: Partial<Pick<AttendanceDisplay, 'display_name' | 'location' | 'is_enabled'>>
): Promise<AttendanceDisplay> {
  const { data, error } = await supabase
    .from('attendance_displays')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Remove a display registration
export async function deleteDisplay(id: number): Promise<void> {
  const { error } = await supabase
    .from('attendance_displays')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Update last_seen_at for a display (heartbeat)
export async function heartbeat(display_code: string): Promise<void> {
  const { error } = await supabase
    .from('attendance_displays')
    .update({ last_seen_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('display_code', display_code);

  if (error) console.error('Heartbeat error:', error);
}

// Count today's attendance for the daily summary footer
export async function getTodaySummary(): Promise<TodaySummary> {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());

  const [absensiRes, siswaRes] = await Promise.all([
    supabase
      .from('absensi')
      .select('id', { count: 'exact', head: true })
      .eq('tanggal', today),
    supabase
      .from('siswa')
      .select('id', { count: 'exact', head: true }),
  ]);

  const hadir = absensiRes.count ?? 0;
  const total = siswaRes.count ?? 0;
  return { hadir, total, belum: Math.max(0, total - hadir) };
}
