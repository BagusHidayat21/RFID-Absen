// Domain types and modal states for student management feature
import { JurusanItem, KelasItem, PararelItem } from '@/lib/api';
import { getStudents } from '@/types';

export type Student = getStudents;

export interface StudentFormData {
  nama: string;
  nis: string;
  rfid_uid: string;
  jurusan_id: number;
  kelas_id: number;
  pararel_id: number;
}

export interface StudentFilterState {
  searchQuery: string;
  filterJurusan: string;
  filterKelas: string;
  filterPararel: string;
}

export type StudentModalType =
  | { type: 'create' }
  | { type: 'edit'; student: Student }
  | { type: 'detail'; student: Student }
  | null;

export interface StudentDataset {
  students: Student[];
  jurusan: JurusanItem[];
  kelas: KelasItem[];
  pararel: PararelItem[];
}
