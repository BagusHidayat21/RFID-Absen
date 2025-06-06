import {
  getJurusanList,
  createJurusan,
  updateJurusan,
  deleteJurusan,
  getKelasList,
  createKelas,
  updateKelas,
  deleteKelas,
  getPararelList,
  createPararel,
  updatePararel,
  deletePararel,
  getAllStudents,
  JurusanItem,
  KelasItem,
  PararelItem,
} from '@/lib/api';
import { getStudents } from '@/types';

// Service layer handling Master Data CRUD for departments, class levels, and parallels
export interface MasterJurusanDataset {
  jurusan: JurusanItem[];
  students: getStudents[];
}

export interface MasterKelasDataset {
  kelas: KelasItem[];
  pararel: PararelItem[];
  students: getStudents[];
}

export async function fetchMasterJurusanDataset(): Promise<MasterJurusanDataset> {
  const [jurusan, students] = await Promise.all([
    getJurusanList(),
    getAllStudents(),
  ]);
  return { jurusan, students };
}

export async function saveJurusan(id: number | null, nama: string): Promise<JurusanItem> {
  if (id) {
    return await updateJurusan(id, nama);
  }
  return await createJurusan(nama);
}

export async function removeJurusan(id: number): Promise<boolean> {
  return await deleteJurusan(id);
}

export async function fetchMasterKelasDataset(): Promise<MasterKelasDataset> {
  const [kelas, pararel, students] = await Promise.all([
    getKelasList(),
    getPararelList(),
    getAllStudents(),
  ]);
  return { kelas, pararel, students };
}

export async function saveKelas(id: number | null, nama: string): Promise<KelasItem> {
  if (id) {
    return await updateKelas(id, nama);
  }
  return await createKelas(nama);
}

export async function removeKelas(id: number): Promise<boolean> {
  return await deleteKelas(id);
}

export async function savePararel(id: number | null, nama: string): Promise<PararelItem> {
  if (id) {
    return await updatePararel(id, nama);
  }
  return await createPararel(nama);
}

export async function removePararel(id: number): Promise<boolean> {
  return await deletePararel(id);
}
