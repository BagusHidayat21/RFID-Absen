// Data access service handling Supabase queries and mutations for students feature
import { supabase } from '@/lib/supabase/client';
import { Student, StudentFormData, StudentDataset } from '../types/student';
import { getStudentsPaginated, GetStudentsParams, PaginatedResult } from '@/lib/api';

export async function fetchStudentsPaginated(params: GetStudentsParams): Promise<PaginatedResult<Student>> {
  return await getStudentsPaginated(params);
}

export async function fetchStudentFilterOptions() {
  const [jurusanRes, kelasRes, pararelRes] = await Promise.all([
    supabase.from('jurusan').select('id, nama').order('nama', { ascending: true }),
    supabase.from('kelas').select('id, nama').order('nama', { ascending: true }),
    supabase.from('pararel').select('id, nama').order('nama', { ascending: true }),
  ]);
  return {
    jurusan: jurusanRes.data || [],
    kelas: kelasRes.data || [],
    pararel: pararelRes.data || [],
  };
}

export async function fetchStudentsDataset(): Promise<StudentDataset> {
  const [studentsRes, jurusanRes, kelasRes, pararelRes] = await Promise.all([
    supabase
      .from('siswa')
      .select(`
        id,
        nama,
        nis,
        rfid_uid,
        kelas:kelas_id ( id, nama ),
        jurusan:jurusan_id ( id, nama ),
        pararel:pararel_id ( id, nama )
      `)
      .order('nama', { ascending: true }),
    supabase.from('jurusan').select('id, nama').order('nama', { ascending: true }),
    supabase.from('kelas').select('id, nama').order('nama', { ascending: true }),
    supabase.from('pararel').select('id, nama').order('nama', { ascending: true }),
  ]);

  if (studentsRes.error) {
    throw new Error(`Gagal memuat data siswa: ${studentsRes.error.message}`);
  }

  const students: Student[] = (studentsRes.data || []).map((item: any) => ({
    id: item.id,
    nama: item.nama || '',
    nis: item.nis || '',
    rfid: item.rfid_uid || '',
    kelas: item.kelas?.nama || '',
    jurusan: item.jurusan?.nama || '',
    pararel: item.pararel?.nama || '',
  }));

  return {
    students,
    jurusan: jurusanRes.data || [],
    kelas: kelasRes.data || [],
    pararel: pararelRes.data || [],
  };
}

export async function saveStudent(
  id: number | null,
  data: StudentFormData
): Promise<void> {
  const payload = {
    nama: data.nama.trim(),
    nis: data.nis.trim(),
    rfid_uid: data.rfid_uid.trim(),
    jurusan_id: Number(data.jurusan_id),
    kelas_id: Number(data.kelas_id),
    pararel_id: Number(data.pararel_id),
  };

  if (id) {
    const { error } = await supabase.from('siswa').update(payload).eq('id', id);
    if (error) throw new Error(`Gagal memperbarui data siswa: ${error.message}`);
  } else {
    const { error } = await supabase.from('siswa').insert([payload]);
    if (error) throw new Error(`Gagal menambahkan data siswa: ${error.message}`);
  }
}

export async function removeStudent(id: number): Promise<void> {
  const { error } = await supabase.from('siswa').delete().eq('id', id);
  if (error) throw new Error(`Gagal menghapus data siswa: ${error.message}`);
}

export async function pollLatestRfidUID(): Promise<string | null> {
  try {
    const res = await fetch('/api/latest-uid');
    if (!res.ok) return null;
    const json = await res.json();
    return json.uid || null;
  } catch (err) {
    console.error('Failed to poll RFID scanner:', err);
    return null;
  }
}
