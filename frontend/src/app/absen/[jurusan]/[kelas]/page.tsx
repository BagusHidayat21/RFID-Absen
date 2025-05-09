"use client";

import React, { useState, useEffect} from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Header";
import StudentTable from "@/components/StudentTable";
import { Students } from "@/types/index";
import { useParams } from "next/navigation";

import axios from "axios"


 const StudentPage: React.FC = () => {
    const [students, setStudents] = useState<Students[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Students[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const params = useParams();
    const jurusan = params?.jurusan as string;
    const kelas = params?.kelas as string;
    
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${baseURL}absen`);
                setStudents(response.data.data);
                setTotalItems(response.data.data.length);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, [baseURL]);

    useEffect(() => {
        let result = [...students];
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(student =>
                student.nama.toLowerCase().includes(query) ||
                student.nis.toLowerCase().includes(query) ||
                (student.rfid && student.rfid.toLowerCase().includes(query)) ||
                student.kelas_id ||
                student.pararel_id ||
                student.jurusan_id 
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

    const handleItemsPerPageChange = (items : number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };
    
    const handleAddStudent = () => {
        setShowAddForm(true);
    };

    const handleAddFormSubmit = (newStudent: Omit<Students, 'id'>) => {
        const studentWithId: Students = {
            ...newStudent,
            id: students.length > 0 ? Math.max(...students.map(s => s.id!)) + 1 : 1
        };

        setStudents(prev => [...prev, studentWithId]);
        setShowAddForm(false);
    };

    const handleAddFormCancel = () => {
        setShowAddForm(false);
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex  flex-col">
                <Topbar user={{ name: "User Name", role: "User Role" }} />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow p-6">
                        <StudentTable
                          students={filteredStudents}
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalItems={totalItems}
                          itemsPerPage={itemsPerPage}
                          onPageChange={handlePageChange}
                          onItemsPerPageChange={handleItemsPerPageChange}
                          onSearch={handleSearch}
                          onAddStudent={handleAddStudent}
                          showAddButton={false}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
 };

 export default StudentPage