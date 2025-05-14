'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { Faculty } from '@/types/index';
import Topbar from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { IoCubeOutline } from 'react-icons/io5';
import { IoChevronDown } from 'react-icons/io5';
import Jurusan from '@/components/Jurusan';

export default function Home() {
  const [facultyData, setFacultyData] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const Icons = {
    all: <IoCubeOutline size={24} color="white" />
  };

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const endpoint = "/jurusan";

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}${endpoint}`);
        
        // Transform API data to match the Faculty type if needed
        const transformedData = response.data.data.map((item: any, index: number) => {
          // Use nama field for title and prepare slug
          const title = item.nama || item.name || item.title || "";
          const slug = prepareSlug(title) || `JURUSAN-${index+1}`;
          
          return {
            id: item.id || index + 1,
            type: determineType(index + 1), // Determine type based on index
            title: title, // Use "nama" field for title
            icon: Icons.all,
            slug: slug // Convert nama to proper slug format
          };
        });
        
        setFacultyData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching faculty data:', err);
        setError('Failed to load jurusan data');
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, [baseURL, selectedMonth, selectedYear]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to determine type based on index
  const determineType = (id: number) => {
    const types = ["n1", "n2", "n3", "n4"];
    return types[(id - 1) % types.length];
  };
  
  // Function to clean and prepare slug from name
  const prepareSlug = (text: string) => {
    if (!text) return "";
    return text.trim().replace(/\s+/g, "-").toUpperCase();
  };

  const handleMonthYearSelect = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setIsDropdownOpen(false);
    // You could add an API call here with the new month/year if needed
  };
  
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
              
              {/* Month & Year ComboBox */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm min-w-40"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{months[selectedMonth]} {selectedYear}</span>
                  <IoChevronDown 
                    size={16} 
                    className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-64 py-2">
                    <div className="px-3 py-2 font-medium text-gray-700 border-b border-gray-100">
                      Pilih Bulan & Tahun
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {years.map(year => (
                        <div key={year} className="px-3 py-2">
                          <div className="font-medium text-gray-700">{year}</div>
                          <div className="grid grid-cols-3 gap-1 mt-1">
                            {months.map((month, idx) => (
                              <button
                                key={`${year}-${idx}`}
                                onClick={() => handleMonthYearSelect(idx, year)}
                                className={`text-xs p-1 rounded text-center ${
                                  selectedMonth === idx && selectedYear === year
                                    ? 'bg-blue-100 text-gray-900'
                                    : 'hover:bg-gray-100 text-gray-900'
                                }`}
                              >
                                {month.substring(0, 3)}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading data jurusan...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {facultyData.map((item) => (
                  <Link key={item.id} href={`/absen/${item.slug}`} className="block">
                    <div className={`p-4 rounded-lg shadow-md ${
                      item.type === 'n1' ? 'bg-pink-50' : 
                      item.type === 'n2' ? 'bg-amber-50' : 
                      item.type === 'n3' ? 'bg-green-50' : 
                      'bg-purple-50'}`}>
                      <Jurusan 
                        type={item.type} 
                        title={item.title}
                        icon={item.icon}
                      />
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