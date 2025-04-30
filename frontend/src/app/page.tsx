"use client";

import React, { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import AttendanceCard from "@/components/card";
import Topbar from "@/components/Header";

interface AttendanceItem {
  id: number;
  type: "present" | "leave" | "sick" | "absent";
  title: string;
  count: string;
  icon: ReactNode;
}

// Icons
const Icons = {
  present: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  leave: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  sick: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
    </svg>
  ),
  absent: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

export default function AttendancePage() {
  const attendanceData: AttendanceItem[] = [
    { id: 1, type: "present", title: "Masuk", count: "31 Siswa", icon: Icons.present },
    { id: 2, type: "leave", title: "Izin", count: "1 Siswa", icon: Icons.leave },
    { id: 3, type: "sick", title: "Sakit", count: "1 Siswa", icon: Icons.sick },
    { id: 4, type: "absent", title: "Tanpa Keterangan", count: "1 Siswa", icon: Icons.absent },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar user={{ name: "Musfiq", role: "Guru" }} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-gray-900">Absensi Hari Ini</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Kelas
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {attendanceData.map((item) => (
                <AttendanceCard
                  key={item.id}
                  type={item.type}
                  title={item.title}
                  count={item.count}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}