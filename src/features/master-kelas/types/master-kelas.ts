// Domain types for Master Kelas & Rombel Pararel feature
import { KelasItem, PararelItem } from '@/lib/api';

export interface KelasRowData extends KelasItem {
  studentCount: number;
}

export interface PararelRowData extends PararelItem {
  studentCount: number;
}

export type KelasModalType =
  | { type: 'create' }
  | { type: 'edit'; item: KelasItem }
  | { type: 'detail'; item: KelasRowData }
  | null;

export type PararelModalType =
  | { type: 'create' }
  | { type: 'edit'; item: PararelItem }
  | { type: 'detail'; item: PararelRowData }
  | null;
