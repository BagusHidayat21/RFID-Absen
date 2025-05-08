'use client'
import Link from 'next/link';
import Topbar from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Jurusan from '@/components/Jurusan';
import StudentDataForm from '@/components/Form';
import type { StudentFormData } from '@/types/index';

export default function YourPage() {
  
  const handleSubmit = (data: StudentFormData) => {
    console.log('Form data:', data);
   
  };

  const handleCancel = () => {
    
  };

  return (
    <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Topbar user={{ name: "Musfiq", role: "Guru" }} />
            <main className="flex-1 p-6 overflow-y-auto">
            <StudentDataForm 
              onSubmit={handleSubmit} 
              onCancel={handleCancel} 
            />
            </main>
          </div>
        </div>
  );
}

