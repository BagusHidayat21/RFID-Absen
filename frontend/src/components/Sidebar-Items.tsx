// types/sidebar.ts
import { ReactNode } from 'react';

export interface SidebarItem {
    label: string;
    icon: ReactNode;
    href: string;
}

import { LayoutDashboard, Users, CalendarCheck } from "lucide-react";

export const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard />, href: "/" },
  { label: "Data Siswa", icon: <Users />, href: "/datasiswa" },
  { label: "Absensi Siswa", icon: <CalendarCheck />, href: "/absen" },
];
