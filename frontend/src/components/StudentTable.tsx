// StudentTable.tsx
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation'; 
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Filter, ChevronDown, Search } from 'lucide-react';
import Button from './Button';
import { StudentTableProps } from '@/types/index';


const StudentTable: React.FC<StudentTableProps> = ({
  students,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onSearch,
  onAddStudent,
  showAddButton = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [rowsPerPageOpen, setRowsPerPageOpen] = useState(false);
  const pathname = usePathname();
  const isAbsenPage = pathname.includes('/absen');

    // Available options for rows per page
    const rowsPerPageOptions = [5, 10, 20, 50];

    // Handle class filter change
  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(event.target.value);
  };

  // Filter students based on selected class
  const filteredStudents = selectedClass 
    ? students.filter(student => student.pararel === selectedClass) 
    : students;

  const params = useParams();
  const jurusan = params?.jurusan as string;
  const kelas = params?.kelas as string;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setRowsPerPageOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value);
            }}
          />
          <button className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Filter className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter kelas:</span>
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Kelas</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        
        {showAddButton !== false && (
        <Link href={isAbsenPage
          ?`/absen/${jurusan}/${kelas}/tambahsiswa`
          :`/datasiswa/${jurusan}/${kelas}/tambahsiswa`
        }>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
          <span className="mr-1">+</span> Tambahkan Siswa
        </button>
        </Link>
        )}
      </div>
        
      {/* Table section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              {!isAbsenPage && (
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                NISN
              </th>
              )}
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAMA
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                KELAS
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                PARALLEL
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                JURUSAN
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                AKSI
              </th>
              {isAbsenPage && (
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  {!isAbsenPage && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nis}</td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{student.kelas}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{student.pararel || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{student.jurusan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    <Button variant='edit' className="mr-2">Edit</Button>
                    <Button variant='hapus'>Hapus</Button>
                  </td>
                  {isAbsenPage && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {student.pararel || '-'}
                  </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAbsenPage ? 7 : 8} className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination section */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="text-sm text-gray-700 mt-2 sm:mt-0">
          Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} data
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-700">Data per halaman:</span>
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRowsPerPageOpen(!rowsPerPageOpen);
                  }}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  id="menu-button"
                  aria-expanded={rowsPerPageOpen}
                  aria-haspopup="true"
                >
                  {itemsPerPage}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </div>

              {/* Dropdown menu for rows per page */}
              {rowsPerPageOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1" role="none">
                    {rowsPerPageOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          onItemsPerPageChange(option);
                          setRowsPerPageOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          itemsPerPage === option ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        role="menuitem"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center ml-4">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-4 text-sm text-gray-700">
              {currentPage}/{totalPages}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;