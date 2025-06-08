// Public TV activation endpoint — validates display code, returns safe config (no auth required)
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const code = String(body.display_code ?? '').toUpperCase().trim();

    if (!code) {
      return NextResponse.json({ error: 'display_code is required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('attendance_displays')
      .select('id, display_code, display_name, location, is_enabled')
      .eq('display_code', code)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Kode display tidak ditemukan' }, { status: 404 });
    }

    if (!data.is_enabled) {
      return NextResponse.json({ error: 'Display ini dinonaktifkan oleh administrator' }, { status: 403 });
    }

    // Update last_seen_at on activation
    await supabase
      .from('attendance_displays')
      .update({ last_seen_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', data.id);

    return NextResponse.json({
      display_id: data.id,
      display_code: data.display_code,
      display_name: data.display_name,
      location: data.location,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
