// Domain types for attendance management feature
export type AttendanceStatus = 'live' | 'selesai' | 'belum';
export type AttendanceRecordStatus = 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Alpha';

export interface RombelClassItem {
  id: string;
  namaKelas: string;
  jurusan: string;
  tingkat: 'X' | 'XI' | 'XII';
  pararel: string;
  waliKelas: string;
  jumlahSiswa: number;
  hadirCount: number;
  terlambatCount: number;
  izinCount: number;
  sakitCount: number;
  alphaCount: number;
  statusPresensi: AttendanceStatus;
  rate: number;
}

export interface PresensiKPIStats {
  totalClasses: number;
  activeLiveClasses: number;
  completedClasses: number;
  pendingClasses: number;
  overallAttendanceRate: number;
  totalStudentsPresent: number;
  totalStudentsLate: number;
  totalStudentsAbsent: number;
}

export interface ClassStudentAttendance {
  id: number;
  siswaId: number;
  nama: string;
  nis: string;
  rfidUid: string;
  status: AttendanceRecordStatus;
  jam: string | null;
  tanggal: string | null;
}
