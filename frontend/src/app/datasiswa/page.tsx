'use client';
import { useState, useEffect } from 'react';
import React, { ReactNode } from "react";
import { Siswa, Faculty } from '../interface/index';
import Topbar from '@/components/Header'; // Assume Topbar component is in components folder
import Sidebar from '@/components/Sidebar';
import { IoCubeOutline } from 'react-icons/io5';
import FacultyCard from '@/components/datasiswacard';

export default function Home() {
  const [latestUID, setLatestUID] = useState<string | null>(null);
  const [prevUID, setPrevUID] = useState<string | null>(null);
  const [siswaData, setSiswaData] = useState<Siswa | null>(null);
  const [status, setStatus] = useState<string>('');
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const Icons = {
    all: <IoCubeOutline size={24} color="white" />
  };

  const facultyData: Faculty[] = [
    { id: 1, type: "n1", title: "TEI", count: "-- 31 Siswa", rombel:"-- rombel", icon: Icons.all },
    { id: 2, type: "n2", title: "TKP", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all },
    { id: 3, type: "n3", title: "TOI", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all },
    { id: 4, type: "n4", title: "PENGELASAN", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all },
    { id: 1, type: "n1", title: "DPIB", count: "-- 31 Siswa", rombel:"-- rombel", icon: Icons.all },
    { id: 2, type: "n2", title: "RPL", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all },
    { id: 3, type: "n3", title: "PERMESINAN", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all },
    { id: 4, type: "n4", title: "TSM", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all },
    { id: 1, type: "n1", title: "TPTU", count: "-- 31 Siswa", rombel:"-- rombel", icon: Icons.all }
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
              <h1 className="text-xl font-semibold text-gray-900">Jurusan</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Bulan & Tahun
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {facultyData.map((item) => (
              <FacultyCard 
                key={item.id} 
                type={item.type} 
                title={item.title} 
                count={item.count} 
                rombel={item.rombel} 
                icon={item.icon} 
                onClick={() => {
                  console.log(item);
                  setSelectedFaculty(item);
                }}                
              />
            ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}