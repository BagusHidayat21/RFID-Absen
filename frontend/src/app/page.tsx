// Example of how to use the TypeScript AttendanceCard component
import React, { ReactNode } from 'react';
import AttendanceCard from '../component/card';


// Define an interface for attendance data
interface AttendanceItem {
  id: number;
  type: 'present' | 'leave' | 'sick' | 'absent';
  title: string;
  count: string;
  icon: ReactNode;
}

// Icons as React components
const Icons = {
  present: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  leave: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  sick: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
    </svg>
  ),
  absent: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )
};

export default function AttendancePage() {
  // Sample data - in a real app, this might come from an API
  const attendanceData: AttendanceItem[] = [
    { id: 1, type: 'present', title: 'Masuk', count: '31 Siswa', icon: Icons.present },
    { id: 2, type: 'leave', title: 'Izin', count: '1 Siswa', icon: Icons.leave },
    { id: 3, type: 'sick', title: 'Sakit', count: '1 Siswa', icon: Icons.sick },
    { id: 4, type: 'absent', title: 'Tanpa Keterangan', count: '1 Siswa', icon: Icons.absent },
    { id: 5, type: 'present', title: 'Masuk', count: '31 Siswa', icon: Icons.present },
    { id: 6, type: 'leave', title: 'Jurusan', count: '', icon: Icons.leave },
    { id: 7, type: 'sick', title: 'Musfiq', count: 'Musafiq', icon: Icons.sick },
    { id: 8, type: 'absent', title: 'Siswa', count: '10', icon: Icons.absent }
  ];
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">Absensi Hari Ini</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Kelas
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {attendanceData.map(item => (
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
  );
}