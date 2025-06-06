// Data access service for Master Jurusan feature
import { supabase } from '@/lib/supabase/client';
import { JurusanItem } from '@/lib/api';
import { JurusanRowData } from '../types/master-jurusan';

export async function fetchJurusanDirectory(): Promise<{
  jurusan: JurusanItem[];
  students: { id: number; jurusan: string }[];
}> {
  const [jurusanRes, studentsRes] = await Promise.all([
    supabase.from('jurusan').select('id, nama').order('id', { ascending: true }),
    supabase.from('siswa').select('id, jurusan:jurusan_id ( nama )'),
  ]);

  if (jurusanRes.error) {
    throw new Error(`Gagal memuat jurusan: ${jurusanRes.error.message}`);
  }

  const students = (studentsRes.data || []).map((s: any) => ({
    id: s.id,
    jurusan: s.jurusan?.nama || '',
  }));

  return {
    jurusan: jurusanRes.data || [],
    students,
  };
}

export async function saveJurusanRecord(id: number | null, nama: string): Promise<void> {
  if (id) {
    const { error } = await supabase.from('jurusan').update({ nama }).eq('id', id);
    if (error) throw new Error(`Gagal memperbarui jurusan: ${error.message}`);
  } else {
    const { error } = await supabase.from('jurusan').insert([{ nama }]);
    if (error) throw new Error(`Gagal menambahkan jurusan: ${error.message}`);
  }
}

export async function removeJurusanRecord(id: number): Promise<void> {
  const { error } = await supabase.from('jurusan').delete().eq('id', id);
  if (error) throw new Error(`Gagal menghapus jurusan: ${error.message}`);
}
