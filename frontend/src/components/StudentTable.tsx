'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Filter, ChevronDown, Search } from 'lucide-react';
import Button from './Button';
import { StudentTableProps } from '@/types/index';
import Swal from 'sweetalert2';

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  absensi,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onDeleteStudent,
  onPageChange,
  onItemsPerPageChange,
  onSearch,
  onEditStudent,
  editingStudent,
  onEditFormSubmit,
  showAddButton = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPageOpen, setRowsPerPageOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState("");

  const pathname = usePathname();
  const isAbsenPage = pathname.includes('/absen');

  const rowsPerPageOptions = [5, 10, 20, 50];

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(event.target.value);
  };

  // Get all available students based on the selected class filter
  const filteredStudents = selectedClass
    ? students.filter(student => student.pararel === selectedClass)
    : students;

  const params = useParams();
  const jurusan = params?.jurusan as string;
  const kelas = params?.kelas as string;

  // For the absen page, filter absensi records based on:
  // 1. Finding the corresponding student for each absensi record
  // 2. Filtering by the selected class (parallel)
  // 3. Filtering by the selected date if specified
  const filteredAbsensi = isAbsenPage
    ? absensi.filter(absen => {
        const student = students.find(student => student.id === absen.siswa_id);
        
        // Check if we have a valid student and filter by parallel class
        if (!student) return false;
        
        const matchClass = selectedClass 
          ? student.pararel === selectedClass // Use pararel for filtering, not kelas
          : true;
          
        const matchDate = selectedDate 
          ? absen.tanggal.substring(0, 10) === selectedDate 
          : true;
          
        return matchClass && matchDate;
      })
    : [];

  useEffect(() => {
    const handleClickOutside = () => {
      setRowsPerPageOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Set data source based on page type
  const dataSource: (typeof students[number] | typeof absensi[number])[] = isAbsenPage
    ? filteredAbsensi
    : filteredStudents;

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

        <div className="flex items-center gap-4">
          {/* Filter Kelas */}
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

          {isAbsenPage && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter tanggal:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {showAddButton && (
          <Link
            href={
              isAbsenPage
                ? `/absen/${jurusan}/${kelas}/tambahsiswa`
                : `/datasiswa/${jurusan}/${kelas}/tambahsiswa`
            }
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
              <span className="mr-1">+</span> Tambahkan Siswa
            </button>
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
              {!isAbsenPage && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
              )}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">KELAS</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PARALLEL</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">JURUSAN</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {isAbsenPage ? 'STATUS' : 'AKSI'}
              </th>
              {isAbsenPage && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TANGGAL</th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {dataSource.length > 0 ? (
              dataSource.map((item, index) => {
                // For absen page, find the corresponding student for the absensi record
                const student = isAbsenPage
                  ? students.find((s) => s.id === (item as any).siswa_id)
                  : (item as typeof students[number]);

                if (!student) return null;

                let status = '-';
                let borderColor = '';

                if (isAbsenPage) {
                  status = (item as typeof absensi[number]).status;
                  switch (status) {
                    case 'Hadir':
                      borderColor = 'border-green-500 bg-green-500 text-white'; break;
                    case 'Alpa':
                      borderColor = 'border-red-500 bg-red-500 text-white'; break;
                    case 'Izin':
                      borderColor = 'border-blue-500 bg-blue-500 text-white'; break;
                    case 'Sakit':
                      borderColor = 'border-yellow-500 bg-yellow-500 text-white'; break;
                    default:
                      borderColor = 'border-red-500 bg-red-500 text-white';
                  }
                }

                return (
                  <tr key={isAbsenPage ? `absen-${index}` : student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    {!isAbsenPage && (
                      <td className="px-6 py-4 text-sm text-gray-900">{student.nis}</td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-900">{student.nama}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{student.kelas}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{student.pararel || '-'}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{student.jurusan}</td>

                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {isAbsenPage ? (
                        <span className={`inline-block px-2 py-1 border ${borderColor} rounded`}>
                          {status}
                        </span>
                      ) : (
                        <>
                          <Button variant="edit" className="mr-2" onClick={() => onEditStudent?.(student)}>Edit</Button>
                          <Button
                          variant="hapus"
                          onClick={() => {
                            Swal.fire({
                              title: 'Apakah kamu yakin?',
                              text: "Data siswa akan dihapus permanen!",
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#d33',
                              cancelButtonColor: '#3085d6',
                              confirmButtonText: 'Ya, hapus!',
                              cancelButtonText: 'Batal'
                            }).then((result) => {
                              if (result.isConfirmed) {
                                onDeleteStudent?.(student.id!);
                                Swal.fire('Terhapus!', 'Data siswa berhasil dihapus.', 'success');
                              }
                            });
                          }}
                        >
                          Hapus
                        </Button>
                        </>
                      )}
                    </td>

                    {isAbsenPage && (
                      <td className="px-6 py-4 text-center text-sm text-gray-900">  
                        {new Date((item as typeof absensi[number]).tanggal).toISOString().substring(0, 10)}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAbsenPage ? 8 : 7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm text-gray-700 mt-2 sm:mt-0">
          Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} data
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-700">Data per halaman:</span>
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setRowsPerPageOpen(!rowsPerPageOpen);
                }}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                {itemsPerPage}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>

              {rowsPerPageOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
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