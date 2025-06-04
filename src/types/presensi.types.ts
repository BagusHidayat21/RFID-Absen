// Type definitions for the Presensi Siswa domain model, filters, and directory records
export interface RombelClassItem {
  id: string;
  namaKelas: string;
  jurusan: string;
  tingkat: string;
  pararel: string;
  waliKelas: string;
  jumlahSiswa: number;
  statusPresensi: 'live' | 'selesai' | 'belum';
  hadirCount: number;
  href: string;
}

export interface PresensiFilterState {
  selectedJurusan: string;
  selectedTingkat: string;
  searchQuery: string;
}

export interface PresensiSortState {
  field: 'namaKelas' | 'jurusan' | 'tingkat' | 'jumlahSiswa';
  direction: 'asc' | 'desc';
}

export interface PresensiKPIStats {
  totalClasses: number;
  liveClasses: number;
  averageAttendancePct: number;
  totalMonitoredStudents: number;
}
