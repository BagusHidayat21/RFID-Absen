import { ReactNode } from "react";
import { LayoutDashboard, Users, CalendarCheck } from "lucide-react";

//Header Component
export interface User {
    name: string;
    role: string;
  }
export interface TopbarProps {
    user: User;
    language?: string;
  }

//Sidebar Component
export interface SidebarItem {
  label: string;
  icon: ReactNode;
  href: string;
}

//Card Component
export type CardType = 'n1' | 'n2' | 'n3' | 'n4';
export type CardType2 = 'present' | 'leave' | 'sick' | 'absent';
export interface AttendanceItem {
    id: number;
    type: "present" | "leave" | "sick" | "absent";
    title: string;
    count: string;
    icon: ReactNode;
  }
export interface CardProps {
    type: CardType2;
    title: string;
    count: string;
    icon: ReactNode;
  }

//Jurusan Component
export interface JurusanProps {
  type: CardType;
  title: string;
  count: string;
  rombel: string;
  icon: ReactNode;
}
export type Faculty = {
  id: number;
  type: 'n1' | 'n2' | 'n3' | 'n4';
  title: string;
  count: string;
  rombel: string;
  icon: ReactNode;
  slug: string;
};
export type Class = {
  id: number;
  type: 'n1' | 'n2' | 'n3' | 'n4';
  title: string;
  count: string;
  rombel: string;
  icon: ReactNode;
  slug: string;
};

//Absen
export type Students = {
  id?: number;
  nisn: string;
  nama: string;
  rfid: string;
  jurusan: string;
  kelas: string;
  kelas_paralel: string;
};
export interface StudentTableProps {
  students: Students[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSearch: (query: string) => void;
  onAddStudent: () => void;
}

