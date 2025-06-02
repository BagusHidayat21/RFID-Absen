'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Class } from '@/types/index';
import Jurusan from '@/components/Jurusan';
import { BookOpen } from 'lucide-react';

export default function JurusanDetailPage() {
  const params = useParams();
  const jurusan = params?.jurusan as string;
  const kelas = params?.kelas as string;

  // State for dropdown and data
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Semua Kelas');
  const [absenData, setAbsenData] = useState([]);
  const [loading, setLoading] = useState(true);

  const Icons = {
    all: <BookOpen size={24} color="white" />
  };

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ;
  
  // Fetch absen data based on API routes
  useEffect(() => {
    const fetchAbsenData = async () => {
      try {
        setLoading(true);
        // If kelas parameter exists, fetch specific data by ID
        const endpoint = kelas ? `/absen/${kelas}` : '/absen';
        const response = await fetch(`${baseURL}${endpoint}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setAbsenData(data);
      } catch (error) {
        console.error('Error fetching absen data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAbsenData();
  }, [baseURL, kelas]);

  const ClassData: Class[] = [
    { id: 1, type: "n1", title: "X", icon: Icons.all, slug: "X" },
    { id: 2, type: "n2", title: "XI", icon: Icons.all, slug: "XI" },
    { id: 3, type: "n3", title: "XII", icon: Icons.all, slug: "XII" }
  ];

  // Filter options for the dropdown
  const filterOptions = ['Semua Kelas', 'X', 'XI', 'XII', 'XIII'];

  // Filter the class data based on selected filter
  const filteredClasses = selectedFilter === 'Semua Kelas' 
    ? ClassData 
    : ClassData.filter(item => item.title === selectedFilter);

  return (
    <div className="flex h-screen bg-gray-50">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-gray-900">Kelas {jurusan?.toUpperCase()}</h1>
              
              {/* Dropdown component */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-40"
                >
                  <span>{selectedFilter}</span>
                  {isDropdownOpen ? <BookOpen /> : <BookOpen />}
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {filterOptions.map((option) => (
                      <div 
                        key={option} 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedFilter(option);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredClasses.map((item) => (
                  <Link key={item.id} href={`/absen/${jurusan}/${item.slug}`} className="block">
                    <div className={`p-4 rounded-lg shadow-md ${
                      item.type === 'n1' ? 'bg-pink-50' : 
                      item.type === 'n2' ? 'bg-amber-50' : 
                      item.type === 'n3' ? 'bg-green-50' : 'bg-purple-50'
                    }`}>
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
  );
}