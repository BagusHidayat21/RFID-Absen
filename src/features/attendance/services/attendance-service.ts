// Data access service for attendance directory and in-modal class roster attendance details
import { supabase } from '@/lib/supabase/client';
import {
  RombelClassItem,
  PresensiKPIStats,
  ClassStudentAttendance,
  AttendanceRecordStatus,
} from '../types/attendance';

export interface RawAttendanceDataset {
  students: any[];
  jurusan: any[];
  kelas: any[];
  pararel: any[];
  absensi: any[];
}

function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function fetchAttendanceDirectoryDataset(): Promise<RawAttendanceDataset> {
  const today = getTodayDateString();

  const [studentsRes, jurusanRes, kelasRes, pararelRes, absensiRes] = await Promise.all([
    supabase.from('siswa').select('id, nama, nis, rfid_uid, kelas_id, jurusan_id, pararel_id'),
    supabase.from('jurusan').select('id, nama'),
    supabase.from('kelas').select('id, nama'),
    supabase.from('pararel').select('id, nama'),
    supabase.from('absensi').select('id, siswa_id, status, jam, tanggal').gte('tanggal', today),
  ]);

  if (studentsRes.error) {
    throw new Error(`Gagal memuat data siswa: ${studentsRes.error.message}`);
  }

  return {
    students: studentsRes.data || [],
    jurusan: jurusanRes.data || [],
    kelas: kelasRes.data || [],
    pararel: pararelRes.data || [],
    absensi: absensiRes.data || [],
  };
}

export function generateAllClassRombels(dataset: RawAttendanceDataset): RombelClassItem[] {
  const { students, jurusan, kelas, pararel, absensi } = dataset;
  const rombels: RombelClassItem[] = [];

  const absensiMap = new Map<number, any>();
  absensi.forEach((a) => {
    absensiMap.set(a.siswa_id, a);
  });

  const sortedKelas = [...kelas].sort((a, b) => a.id - b.id);
  const sortedJurusan = [...jurusan].sort((a, b) => a.id - b.id);
  const sortedPararel = [...pararel].sort((a, b) => a.id - b.id);

  sortedKelas.forEach((k) => {
    sortedJurusan.forEach((j) => {
      sortedPararel.forEach((p) => {
        const classStudents = students.filter(
          (s) => s.jurusan_id === j.id && s.kelas_id === k.id && s.pararel_id === p.id
        );

        if (classStudents.length === 0) return;

        let hadirCount = 0;
        let terlambatCount = 0;
        let izinCount = 0;
        let sakitCount = 0;
        let alphaCount = 0;

        classStudents.forEach((s) => {
          const record = absensiMap.get(s.id);
          if (!record) {
            alphaCount++;
          } else {
            const status = (record.status || '').toLowerCase();
            if (status === 'hadir' || status === 'tepat waktu') hadirCount++;
            else if (status === 'terlambat') terlambatCount++;
            else if (status === 'izin') izinCount++;
            else if (status === 'sakit') sakitCount++;
            else alphaCount++;
          }
        });

        const totalScanned = hadirCount + terlambatCount;
        const rate = classStudents.length > 0 ? Math.round((totalScanned / classStudents.length) * 100) : 0;

        let statusPresensi: 'live' | 'selesai' | 'belum' = 'belum';
        if (totalScanned > 0 && totalScanned < classStudents.length) {
          statusPresensi = 'live';
        } else if (totalScanned === classStudents.length && classStudents.length > 0) {
          statusPresensi = 'selesai';
        } else if (totalScanned > 0) {
          statusPresensi = 'live';
        }

        const tingkatNormalized = (k.nama.toUpperCase().replace('KELAS', '').trim() as 'X' | 'XI' | 'XII') || 'X';

        rombels.push({
          id: `${tingkatNormalized}-${j.nama}-${p.nama}`,
          namaKelas: `${tingkatNormalized} ${j.nama} ${p.nama}`,
          jurusan: j.nama,
          tingkat: tingkatNormalized,
          pararel: p.nama,
          waliKelas: `Wali ${tingkatNormalized} ${j.nama} ${p.nama}`,
          jumlahSiswa: classStudents.length,
          hadirCount,
          terlambatCount,
          izinCount,
          sakitCount,
          alphaCount,
          statusPresensi,
          rate,
        });
      });
    });
  });

  return rombels;
}

export function calculatePresensiKPIStats(classes: RombelClassItem[]): PresensiKPIStats {
  let activeLiveClasses = 0;
  let completedClasses = 0;
  let pendingClasses = 0;
  let totalStudentsPresent = 0;
  let totalStudentsLate = 0;
  let totalStudentsAbsent = 0;
  let totalStudents = 0;

  classes.forEach((c) => {
    if (c.statusPresensi === 'live') activeLiveClasses++;
    else if (c.statusPresensi === 'selesai') completedClasses++;
    else pendingClasses++;

    totalStudentsPresent += c.hadirCount;
    totalStudentsLate += c.terlambatCount;
    totalStudentsAbsent += c.alphaCount + c.izinCount + c.sakitCount;
    totalStudents += c.jumlahSiswa;
  });

  const overallAttendanceRate =
    totalStudents > 0 ? Math.round(((totalStudentsPresent + totalStudentsLate) / totalStudents) * 100) : 0;

  return {
    totalClasses: classes.length,
    activeLiveClasses,
    completedClasses,
    pendingClasses,
    overallAttendanceRate,
    totalStudentsPresent,
    totalStudentsLate,
    totalStudentsAbsent,
  };
}

export async function fetchClassRosterAttendance(
  jurusanNama: string,
  tingkatNama: string,
  pararelNama: string
): Promise<ClassStudentAttendance[]> {
  const today = getTodayDateString();

  const [jurusanRes, kelasRes, pararelRes] = await Promise.all([
    supabase.from('jurusan').select('id').ilike('nama', jurusanNama).maybeSingle(),
    supabase.from('kelas').select('id').ilike('nama', tingkatNama).maybeSingle(),
    supabase.from('pararel').select('id').ilike('nama', pararelNama).maybeSingle(),
  ]);

  if (!jurusanRes.data || !kelasRes.data || !pararelRes.data) {
    return [];
  }

  const [studentsRes, absensiRes] = await Promise.all([
    supabase
      .from('siswa')
      .select('id, nama, nis, rfid_uid')
      .eq('jurusan_id', jurusanRes.data.id)
      .eq('kelas_id', kelasRes.data.id)
      .eq('pararel_id', pararelRes.data.id)
      .order('nama', { ascending: true }),
    supabase
      .from('absensi')
      .select('id, siswa_id, status, jam, tanggal')
      .gte('tanggal', today),
  ]);

  const absensiMap = new Map<number, any>();
  (absensiRes.data || []).forEach((a) => {
    absensiMap.set(a.siswa_id, a);
  });

  return (studentsRes.data || []).map((s: any) => {
    const record = absensiMap.get(s.id);
    return {
      id: record?.id || 0,
      siswaId: s.id,
      nama: s.nama || '',
      nis: s.nis || '',
      rfidUid: s.rfid_uid || '',
      status: (record?.status || 'Alpha') as AttendanceRecordStatus,
      jam: record?.jam || null,
      tanggal: record?.tanggal || today,
    };
  });
}

export async function updateStudentAttendanceRecord(
  attendanceId: number,
  siswaId: number,
  status: AttendanceRecordStatus
): Promise<void> {
  const today = getTodayDateString();
  const now = new Date().toTimeString().split(' ')[0];

  if (attendanceId && attendanceId > 0) {
    const { error } = await supabase
      .from('absensi')
      .update({ status, jam: now })
      .eq('id', attendanceId);
    if (error) throw new Error(`Gagal memperbarui status presensi: ${error.message}`);
  } else {
    const { error } = await supabase.from('absensi').insert([
      {
        siswa_id: siswaId,
        tanggal: today,
        jam: now,
        status,
        keterangan: 'Diperbarui secara manual oleh Admin',
      },
    ]);
    if (error) throw new Error(`Gagal mencatat presensi: ${error.message}`);
  }
}
