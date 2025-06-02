'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Faculty } from '@/types/index';
import Jurusan from '@/components/Jurusan';
import { BookOpen } from 'lucide-react';

export default function Home() {
  const [facultyData, setFacultyData] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const Icons = {
    all: <BookOpen size={24} color="white" />
  };

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const endpoint = "/jurusan";

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('Access token tidak ditemukan, silakan login terlebih dahulu.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${baseURL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Mapping data ke tipe Faculty
        const transformedData = response.data.data.map((item: any, index: number) => {
          const title = item.nama || item.name || item.title || "";
          const slug = prepareSlug(title) || `jurusan-${index + 1}`;
          return {
            id: item.id || index + 1,
            type: determineType(index + 1),
            title: title,
            icon: Icons.all,
            slug: slug
          };
        });

        setFacultyData(transformedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching faculty data:', err);
        setError('Gagal memuat data jurusan.');
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, [baseURL, selectedMonth, selectedYear]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const determineType = (id: number) => {
    const types = ["n1", "n2", "n3", "n4"];
    return types[(id - 1) % types.length];
  };

  const prepareSlug = (text: string) => {
    if (!text) return "";
    return text.trim();
  };

  const handleMonthYearSelect = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setIsDropdownOpen(false);
    // Bisa tambahkan fetch ulang data kalau perlu
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-gray-900">Jurusan</h1>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading data jurusan...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center py-8 text-red-600">
                <p>{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {facultyData.map((item) => (
                  <Link key={item.id} href={`/absen/${item.slug}`} className="block">
                    <div
                      className={`p-4 rounded-lg shadow-md ${
                        item.type === 'n1'
                          ? 'bg-pink-50'
                          : item.type === 'n2'
                          ? 'bg-amber-50'
                          : item.type === 'n3'
                          ? 'bg-green-50'
                          : 'bg-purple-50'
                      }`}
                    >
                      <Jurusan type={item.type} title={item.title} icon={item.icon} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}