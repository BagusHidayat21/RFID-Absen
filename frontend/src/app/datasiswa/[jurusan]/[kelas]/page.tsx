"use client";

import React, { useState, useEffect } from 'react';
import StudentTable from '@/components/StudentTable';
import { useRouter, useParams } from 'next/navigation'; 
import { getStudents, Absensi } from '@/types';
import axios from 'axios';

const StudentPage: React.FC = () => {
  const router = useRouter();
  const [students, setStudents] = useState<getStudents[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<getStudents[]>([]);
  const [absensi, setAbsensi] = useState<Absensi[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = useParams();
  const jurusan = params?.jurusan as string;
  const kelas = params?.kelas as string;

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get(`/siswa/${jurusan}/${kelas}`);
        setStudents(response.data.data);
        setTotalItems(response.data.data.length);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchAbsensi = async () => {
      try {
        const response = await axiosInstance.get('/absen');
        setAbsensi(response.data.data);
      } catch (error) {
        console.error("Error fetching absensi:", error);
      }
    };

    fetchStudents();
    fetchAbsensi();
  }, [jurusan, kelas]);

  useEffect(() => {
    let result = [...students];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(student =>
        student.nama.toLowerCase().includes(query) ||
        student.nis.toLowerCase().includes(query) ||
        (student.rfid && student.rfid.toLowerCase().includes(query)) ||
        student.kelas.includes(query) ||
        student.pararel.includes(query) ||
        student.jurusan.includes(query)
      );
    }
    setTotalItems(result.length);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResult = result.slice(startIndex, startIndex + itemsPerPage);

    setFilteredStudents(paginatedResult);
  }, [students, currentPage, itemsPerPage, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleAddStudent = () => {
    setShowAddForm(true);
  };

  const handleAddFormSubmit = (newStudent: Omit<getStudents, 'id'>) => {
    const studentWithId: getStudents = {
      ...newStudent,
      id: students.length > 0 ? Math.max(...students.map(s => s.id!)) + 1 : 1
    };

    setStudents(prev => [...prev, studentWithId]);
    setShowAddForm(false);
  };

  const handleAddAbsenSubmit = (newAbsen: Omit<Absensi, 'id'>) => {
    const absenWithId: Absensi = {
      ...newAbsen,
      id: absensi.length > 0 ? Math.max(...absensi.map(s => s.id!)) + 1 : 1
    };

    setAbsensi(prev => [...prev, absenWithId]);
    setShowAddForm(false);
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      await axiosInstance.delete(`/siswa/${id}`);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEditStudent = (student: getStudents) => {
    router.push(`/datasiswa/${jurusan}/${kelas}/edit?id=${student.id}`);
  };

  const handleEditAbsensi = (absen: Absensi) => {
    router.push(`/absen/${jurusan}/${kelas}/edit?id=${absen.id}`);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow p-6">
          <StudentTable
            students={filteredStudents}
            absensi={absensi}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onSearch={handleSearch}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onEditStudent={handleEditStudent} 
            onEditAbsensi={handleEditAbsensi}
            onEditFormSubmit={handleAddFormSubmit}
            onEditAbsenSubmit={handleAddAbsenSubmit}
            showAddButton={true}
          />
        </div>
      </main>
    </div>
  );
};

export default StudentPage;

