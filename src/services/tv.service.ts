// Service for fetching safe student + attendance data for TV display rendering
import { supabase } from '@/lib/supabase/client';
import { TvAttendanceEvent } from '@/types';

// Fetch minimal display-safe data for a given absensi insert ID
export async function getAbsensiEventById(
  absensiId: number
): Promise<TvAttendanceEvent | null> {
  const { data, error } = await supabase
    .from('absensi')
    .select(`
      id,
      tanggal,
      jam,
      status,
      keterangan,
      siswa:siswa_id (
        nama,
        kelas:kelas_id ( nama ),
        jurusan:jurusan_id ( nama ),
        pararel:pararel_id ( nama )
      )
    `)
    .eq('id', absensiId)
    .single();

  if (error || !data) return null;

  const s = data.siswa as any;
  return {
    absensi_id: data.id,
    nama: s?.nama ?? '',
    kelas: s?.kelas?.nama ?? '',
    jurusan: s?.jurusan?.nama ?? '',
    pararel: s?.pararel?.nama ?? '',
    jam: data.jam,
    tanggal: data.tanggal,
    status: data.status,
    keterangan: data.keterangan ?? '',
    code: 'ATTENDANCE_RECORDED',
  };
}

// Fetch latest N absensi records for today on initial TV load
export async function getLatestAbsensiToday(limit = 1): Promise<TvAttendanceEvent[]> {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  const { data, error } = await supabase
    .from('absensi')
    .select(`
      id,
      tanggal,
      jam,
      status,
      keterangan,
      siswa:siswa_id (
        nama,
        kelas:kelas_id ( nama ),
        jurusan:jurusan_id ( nama ),
        pararel:pararel_id ( nama )
      )
    `)
    .eq('tanggal', today)
    .order('id', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((item: any) => {
    const s = item.siswa as any;
    return {
      absensi_id: item.id,
      nama: s?.nama ?? '',
      kelas: s?.kelas?.nama ?? '',
      jurusan: s?.jurusan?.nama ?? '',
      pararel: s?.pararel?.nama ?? '',
      jam: item.jam,
      tanggal: item.tanggal,
      status: item.status,
      keterangan: item.keterangan ?? '',
      code: 'ATTENDANCE_RECORDED' as const,
    };
  });
}
