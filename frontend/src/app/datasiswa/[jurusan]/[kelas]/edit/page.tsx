'use client'
import axios from 'axios';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import StudentDataForm from '@/components/Form';
import Swal from 'sweetalert2';
import type { StudentFormData } from '@/types/index';

export default function TambahSiswaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

      const isEditPage = pathname.includes('/edit');
      const id = searchParams.get('id');

      if (jurusan && kelas && isEditPage && id) {
        // Jalankan PUT
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/siswa/${id}`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.status === 200) {
          Swal.fire({
            title: 'Berhasil!',
            text: 'Data siswa berhasil di update',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              router.push(`/datasiswa/${jurusan}/${kelas}`);
            }
          });
        }
      } else {
        // Jalankan POST
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/siswa`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.status === 201) {
          Swal.fire({
            title: 'Berhasil!',
            text: 'Data siswa berhasil di tambahkan',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              router.push(`/datasiswa/${jurusan}/${kelas}`);
            }
          });
        }
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
