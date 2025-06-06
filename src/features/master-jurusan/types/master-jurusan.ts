// Domain types for Master Jurusan feature
import { JurusanItem } from '@/lib/api';

export interface JurusanRowData extends JurusanItem {
  studentCount: number;
}

export type JurusanModalType =
  | { type: 'create' }
  | { type: 'edit'; item: JurusanItem }
  | { type: 'detail'; item: JurusanRowData }
  | null;
