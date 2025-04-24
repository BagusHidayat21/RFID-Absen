// src/interface/index.ts

export interface Siswa {
  id?: number;           // ID bisa opsional
  nisn: string;          // Nomor Induk Siswa Nasional
  nama: string;          // Nama Siswa
  rfid: string;          // RFID untuk identifikasi
  jurusan: string;       // Jurusan yang diambil
  kelas: string;         // Kelas Siswa
  kelas_paralel: string; // Kelas paralel (misalnya A, B, C)
}

// Kamu bisa menambahkan interface lainnya di sini, contohnya:
// export interface Teacher {
//   id: number;
//   name: string;
//   subject: string;
// }

export interface Absen {
    id?: number;
    siswa_id: number;
    waktu: string;
    status: 'hadir' | 'izin' | 'sakit' | 'alpa'; // misalnya enum status
}