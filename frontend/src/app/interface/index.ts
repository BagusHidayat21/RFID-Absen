import { ReactNode } from "react";

export type Siswa = {
  id?: number;
  nisn: string;
  nama: string;
  rfid: string;
  jurusan: string;
  kelas: string;
  kelas_paralel: string;
};

export type Absen = {
  id?: number;
  siswa_id: number;
  waktu: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpa';
};

export type Faculty = {
  id: number;
  type: 'n1' | 'n2' | 'n3' | 'n4';
  title: string;
  count: string;
  rombel: string;
  icon: ReactNode;
};