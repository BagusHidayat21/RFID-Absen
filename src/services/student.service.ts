import {
  getAllStudents,
  getJurusanList,
  getKelasList,
  getPararelList,
  createStudent,
  updateStudent,
  deleteStudent,
  getLatestScannedUID,
  JurusanItem,
  KelasItem,
  PararelItem,
} from '@/lib/api';
import { getStudents } from '@/types';

// Service layer handling student management and hardware RFID scanning synchronization
export interface StudentDirectoryDataset {
  students: getStudents[];
  jurusan: JurusanItem[];
  kelas: KelasItem[];
  pararel: PararelItem[];
}

export async function fetchStudentDirectoryDataset(): Promise<StudentDirectoryDataset> {
  const [students, jurusan, kelas, pararel] = await Promise.all([
    getAllStudents(),
    getJurusanList(),
    getKelasList(),
    getPararelList(),
  ]);

  return {
    students,
    jurusan,
    kelas,
    pararel,
  };
}

export async function saveStudent(
  id: number | null,
  payload: {
    nama: string;
    nis: string;
    rfid_uid: string;
    kelas_id: number;
    jurusan_id: number;
    pararel_id: number;
  }
) {
  if (id) {
    return await updateStudent(id, payload);
  }
  return await createStudent(payload);
}

export async function removeStudent(id: number): Promise<boolean> {
  return await deleteStudent(id);
}

export async function pollLatestRfidUID(): Promise<string> {
  return await getLatestScannedUID();
}
