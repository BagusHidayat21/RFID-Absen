'use client';
import { useState } from 'react';
import Link from 'next/link';

import {Faculty } from '@/types/index';
import Topbar from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { IoCubeOutline } from 'react-icons/io5';
import Jurusan from '@/components/Jurusan';

export default function Home() {
  const Icons = {
    all: <IoCubeOutline size={24} color="white" />
  };

  const facultyData: Faculty[] = [
    { id: 1, type: "n1", title: "TEI", count: "-- 31 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "TEI" },
    { id: 2, type: "n2", title: "TKP", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "TKP" },
    { id: 3, type: "n3", title: "TOI", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "TOI" },
    { id: 4, type: "n4", title: "TLAS", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "TLAS" },
    { id: 5, type: "n1", title: "DPIB", count: "-- 31 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "DPIB" },
    { id: 6, type: "n2", title: "RPL", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "RPL" },
    { id: 7, type: "n3", title: "TPM", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "TPM" },
    { id: 8, type: "n4", title: "TSM", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "TSM" },
    { id: 9, type: "n1", title: "TPTU", count: "-- 31 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "TPU" }
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
                Bulan & Tahun
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {facultyData.map((item) => (
                <Link key={item.id} href={`/datasiswa/${item.slug}`} className="block">
                  <div className={`p-4 rounded-lg shadow-md ${item.type === 'n1' ? 'bg-pink-50' : item.type === 'n2' ? 'bg-amber-50' : item.type === 'n3' ? 'bg-green-50' : 'bg-purple-50'}`}>
                    <Jurusan 
                      type={item.type} 
                      title={item.title} 
                      count={item.count} 
                      rombel={item.rombel} 
                      icon={item.icon}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}