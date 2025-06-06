'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import StudentDataForm from '@/components/Form';
import type { StudentFormData } from '@/types/index';
import Swal from 'sweetalert2';

export default function TambahSiswaPage() {
  const router = useRouter();

  const handleSubmit = async (data: StudentFormData) => {
    try {
      const jurusanResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jurusan/${data.jurusan_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const kelasResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/kelas/${data.kelas_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      const jurusan = jurusanResponse.data.data.nama;
      const kelas = kelasResponse.data.data.nama;
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/siswa`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.status === 201) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data siswa berhasil ditambahkan',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(`/datasiswa/${jurusan}/${kelas}`);
          }
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCancel = () => {
    router.push('/datasiswa');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-6 overflow-y-auto">
        <StudentDataForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </main>
    </div>
  );
}

