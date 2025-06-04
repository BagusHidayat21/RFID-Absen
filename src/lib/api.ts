// Supabase data access layer replacing legacy Express/Laravel API endpoints
import { supabase } from './supabase/client';
import { Absensi, getStudents } from '@/types';

export interface JurusanItem {
  id: number;
  nama: string;
}

export interface KelasItem {
  id: number;
  nama: string;
}

export interface PararelItem {
  id: number;
  nama: string;
}

// Fetch all attendance records with joined student information
export async function getAbsenList(): Promise<Absensi[]> {
  const { data, error } = await supabase
    .from('absensi')
    .select(`
      id,
      siswa_id,
      tanggal,
      jam,
      status,
      keterangan,
      siswa:siswa_id (
        id,
        nama,
        nis,
        rfid_uid,
        kelas:kelas_id ( nama ),
        jurusan:jurusan_id ( nama ),
        pararel:pararel_id ( nama )
      )
    `)
    .order('tanggal', { ascending: false });

  if (error) {
    console.error('Error fetching attendance list:', error);
    return [];
  }

  return (data || []).map((item: any) => {
    const student = item.siswa || {};
    return {
      id: item.id,
      siswa_id: item.siswa_id,
      nama: student.nama || '',
      nis: student.nis || '',
      kelas: student.kelas?.nama || '',
      jurusan: student.jurusan?.nama || '',
      pararel: student.pararel?.nama || '',
      tanggal: item.tanggal,
      jam: item.jam,
      status: item.status || 'Hadir',
      keterangan: item.keterangan || '',
    };
  });
}

// Fetch single attendance record by ID
export async function getAbsenById(id: number) {
  const { data, error } = await supabase
    .from('absensi')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching absen by id:', error);
    return null;
  }
  return data;
}

// Update attendance record
export async function updateAbsen(id: number, payload: {
  siswa_id?: number;
  tanggal?: string;
  jam?: string;
  status?: string;
  keterangan?: string;
  [key: string]: any;
}) {
  const { data, error } = await supabase
    .from('absensi')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fetch all Jurusan
export async function getJurusanList(): Promise<JurusanItem[]> {
  const { data, error } = await supabase
    .from('jurusan')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching jurusan:', error);
    return [];
  }
  return data || [];
}

// Create new Jurusan
export async function createJurusan(nama: string): Promise<JurusanItem> {
  const { data, error } = await supabase.from('jurusan').insert([{ nama }]).select().single();
  if (error) throw error;
  return data;
}

// Update Jurusan
export async function updateJurusan(id: number, nama: string): Promise<JurusanItem> {
  const { data, error } = await supabase.from('jurusan').update({ nama }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Delete Jurusan
export async function deleteJurusan(id: number): Promise<boolean> {
  const { error } = await supabase.from('jurusan').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Fetch all Kelas
export async function getKelasList(): Promise<KelasItem[]> {
  const { data, error } = await supabase
    .from('kelas')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching kelas:', error);
    return [];
  }
  return data || [];
}

// Create new Kelas
export async function createKelas(nama: string): Promise<KelasItem> {
  const { data, error } = await supabase.from('kelas').insert([{ nama }]).select().single();
  if (error) throw error;
  return data;
}

// Update Kelas
export async function updateKelas(id: number, nama: string): Promise<KelasItem> {
  const { data, error } = await supabase.from('kelas').update({ nama }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Delete Kelas
export async function deleteKelas(id: number): Promise<boolean> {
  const { error } = await supabase.from('kelas').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Fetch all Pararel
export async function getPararelList(): Promise<PararelItem[]> {
  const { data, error } = await supabase
    .from('pararel')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching pararel:', error);
    return [];
  }
  return data || [];
}

// Create new Pararel
export async function createPararel(nama: string): Promise<PararelItem> {
  const { data, error } = await supabase.from('pararel').insert([{ nama }]).select().single();
  if (error) throw error;
  return data;
}

// Update Pararel
export async function updatePararel(id: number, nama: string): Promise<PararelItem> {
  const { data, error } = await supabase.from('pararel').update({ nama }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Delete Pararel
export async function deletePararel(id: number): Promise<boolean> {
  const { error } = await supabase.from('pararel').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Fetch students for a specific jurusan and kelas
export async function getStudentsByKelas(jurusan: string, kelas: string): Promise<getStudents[]> {
  const { data, error } = await supabase
    .from('siswa')
    .select(`
      id,
      nama,
      nis,
      rfid_uid,
      jurusan:jurusan_id!inner ( nama ),
      kelas:kelas_id!inner ( nama ),
      pararel:pararel_id ( nama )
    `)
    .eq('jurusan.nama', jurusan)
    .eq('kelas.nama', kelas)
    .order('nama', { ascending: true });

  if (error) {
    console.error('Error fetching students by class:', error);
    return [];
  }

  return (data || []).map((s: any) => ({
    id: s.id,
    nama: s.nama,
    nis: s.nis,
    rfid: s.rfid_uid,
    jurusan: s.jurusan?.nama || jurusan,
    kelas: s.kelas?.nama || kelas,
    pararel: s.pararel?.nama || '',
  }));
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetStudentsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  jurusan?: string;
  kelas?: string;
  pararel?: string;
}

// Fetch students with database-level pagination, search, and filtering
export async function getStudentsPaginated({
  page = 1,
  pageSize = 10,
  search = '',
  jurusan = '',
  kelas = '',
  pararel = '',
}: GetStudentsParams = {}): Promise<PaginatedResult<getStudents>> {
  const hasJurusan = Boolean(jurusan && jurusan !== 'all');
  const hasKelas = Boolean(kelas && kelas !== 'all');
  const hasPararel = Boolean(pararel && pararel !== 'all');

  const jJoin = hasJurusan ? '!inner' : '';
  const kJoin = hasKelas ? '!inner' : '';
  const pJoin = hasPararel ? '!inner' : '';

  let query = supabase
    .from('siswa')
    .select(`
      id,
      nama,
      nis,
      rfid_uid,
      jurusan:jurusan_id${jJoin} ( id, nama ),
      kelas:kelas_id${kJoin} ( id, nama ),
      pararel:pararel_id${pJoin} ( id, nama )
    `, { count: 'exact' });

  if (search && search.trim()) {
    const term = search.trim();
    query = query.or(`nama.ilike.%${term}%,nis.ilike.%${term}%,rfid_uid.ilike.%${term}%`);
  }

  if (hasJurusan) {
    query = query.eq('jurusan.nama', jurusan);
  }

  if (hasKelas) {
    query = query.eq('kelas.nama', kelas);
  }

  if (hasPararel) {
    query = query.eq('pararel.nama', pararel);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query
    .order('nama', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('Error in getStudentsPaginated:', error);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const total = count ?? 0;
  const mapped: getStudents[] = (data || []).map((s: any) => ({
    id: s.id,
    nama: s.nama,
    nis: s.nis,
    rfid: s.rfid_uid,
    jurusan: s.jurusan?.nama || '',
    kelas: s.kelas?.nama || '',
    pararel: s.pararel?.nama || '',
  }));

  return {
    data: mapped,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Fetch all students with full relation joins across Jurusan, Kelas, and Pararel
export async function getAllStudents(): Promise<getStudents[]> {
  const { data, error } = await supabase
    .from('siswa')
    .select(`
      id,
      nama,
      nis,
      rfid_uid,
      jurusan:jurusan_id ( id, nama ),
      kelas:kelas_id ( id, nama ),
      pararel:pararel_id ( id, nama )
    `)
    .order('nama', { ascending: true });

  if (error) {
    console.error('Error fetching all students:', error);
    return [];
  }

  return (data || []).map((s: any) => ({
    id: s.id,
    nama: s.nama,
    nis: s.nis,
    rfid: s.rfid_uid,
    jurusan: s.jurusan?.nama || '',
    kelas: s.kelas?.nama || '',
    pararel: s.pararel?.nama || '',
  }));
}

// Fetch single student by ID
export async function getStudentById(id: number) {
  const { data, error } = await supabase
    .from('siswa')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching student by id:', error);
    return null;
  }
  return data;
}

// Create new student record
export async function createStudent(payload: {
  nama: string;
  nis: string;
  rfid_uid: string;
  kelas_id: number;
  jurusan_id: number;
  pararel_id: number;
}) {
  const { data, error } = await supabase
    .from('siswa')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update student record
export async function updateStudent(id: number, payload: {
  nama?: string;
  nis?: string;
  rfid_uid?: string;
  kelas_id?: number;
  jurusan_id?: number;
  pararel_id?: number;
}) {
  const { data, error } = await supabase
    .from('siswa')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete student record
export async function deleteStudent(id: number) {
  const { error } = await supabase
    .from('siswa')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Fetch the latest scanned RFID UID directly from Supabase
export async function getLatestScannedUID(): Promise<string> {
  const { data, error } = await supabase
    .from('latest_rfid_scan')
    .select('uid')
    .eq('id', 1)
    .single();

  if (error || !data) return '';
  return data.uid || '';
}
