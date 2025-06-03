import { ReactNode } from "react";

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
  icon: ReactNode;
}
export type Faculty = {
  id: number;
  type: CardType
  title: string;
  icon: ReactNode;
  slug: string;
};
export type Class = {
  id: number;
  type: 'n1' | 'n2' | 'n3' | 'n4';
  title: string;
  icon: ReactNode;
  slug: string;
};

//Absen
export type getStudents = {
  id?: number;
  nis: string;
  nama: string;
  rfid: string;
  jurusan: string;
  kelas: string;
  pararel: string;
};

export interface StudentTableProps {
  students: getStudents[];
  absensi: Absensi[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  showAddButton?: boolean;
  onDeleteStudent: (id: number) => void;
  onEditStudent: (student: getStudents) => void;
  onEditAbsensi: (absen: Absensi) => void;
  onEditFormSubmit: (editedStudent: Omit<getStudents, 'id'>) => void;
  onEditAbsenSubmit: (editedAbsen: Omit<Absensi, 'id'>) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSearch: (query: string) => void;
  onAddStudent: () => void;
  onDateChange?: (date: string) => void;
}

//Absensi
export interface Absensi {
  id: number;
  siswa_id: number;
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  pararel: string;
  tanggal: string;
  jam: string;
  status: string;
  keterangan: string;
}

// Pie Chart
export type PieChartDatum = {
  id: string;
  label: string;
  value: number;
  color: string;
};

// DataType
export type DataType = {
  month: string;
  "Siswa Hadir": number;
  "Siswa Absen": number;
};


// Custom layer component for center text
export interface CenterTextProps {
  centerX: number;
  centerY: number;
  labelTop: string;
  labelBottom: string | number;
}


export interface StudentDataFormProps {
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  initialData?: StudentFormData, 
  initialAbsenFormData?: AbsensFormData; 
}

export interface StudentFormData {
  nis: string;
  rfid_uid: number;
  nama: string;
  kelas_id: number;
  jurusan_id: number;
  pararel_id: number;
}

export interface AbsensFormData {
  id: number;
  siswa_id: number;
  tanggal: string;
  jam: string;
  status: string;
  keterangan: string;
}

export interface BarDatum {
  [key: string]: string | number;
}

export interface MyResponsiveBarProps {
  data: BarDatum[];
}