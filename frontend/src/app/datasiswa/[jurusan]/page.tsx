'use client'
import Link from 'next/link';
import { useParams } from 'next/navigation'; // ✅ gunakan ini di App Router

import {Class} from '@/types/index';
import Topbar from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { IoCubeOutline } from 'react-icons/io5';
import Jurusan from '@/components/Jurusan';

export default function JurusanDetailPage() {
  const params = useParams();
  const jurusan = params?.jurusan as string;

  const Icons = {
    all: <IoCubeOutline size={24} color="white" />
  };

  const ClassData: Class[] = [
    { id: 1, type: "n1", title: "X", count: "-- 31 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "X" },
    { id: 2, type: "n2", title: "XI", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "XI" },
    { id: 3, type: "n3", title: "XII", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "XII" },
    { id: 4, type: "n4", title: "XIII", count: "-- 1 Siswa", rombel:"-- rombel", icon: Icons.all, slug: "XIII" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar user={{ name: "Musfiq", role: "Guru" }} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-gray-900">Kelas {jurusan?.toUpperCase()}</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Bulan & Tahun
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {ClassData.map((item) => (
                <Link key={item.id} href={`/datasiswa/${jurusan}/${item.slug}`} className="block">
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
