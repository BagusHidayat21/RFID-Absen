import {
  getJurusanList,
  getKelasList,
  getPararelList,
  getAllStudents,
  getAbsenList,
  JurusanItem,
  KelasItem,
  PararelItem,
} from '@/lib/api';
import { Absensi, getStudents } from '@/types';

// Service layer handling all asynchronous data fetching for attendance directories
export interface PresensiRawDataset {
  jurusan: JurusanItem[];
  kelas: KelasItem[];
  pararel: PararelItem[];
  students: getStudents[];
  absensi: Absensi[];
}

export async function fetchPresensiDirectoryDataset(): Promise<PresensiRawDataset> {
  const [jurusan, kelas, pararel, students, absensi] = await Promise.all([
    getJurusanList(),
    getKelasList(),
    getPararelList(),
    getAllStudents(),
    getAbsenList(),
  ]);

  return {
    jurusan,
    kelas,
    pararel,
    students,
    absensi,
  };
}
