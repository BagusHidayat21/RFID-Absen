"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Siswa } from '../interface/index'; // Sesuaikan path kalau beda

type FormData = Siswa;

export default function StudentForm() {
  const [students, setStudents] = useState<Siswa[]>([]);
  const [formData, setFormData] = useState<FormData>({
    nisn: '',
    nama: '',
    rfid: '',
    jurusan: '',
    kelas: '',
    kelas_paralel: ''
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        // UPDATE
        const response = await axios.put(`https://rfid-absen.vercel.app/api/siswa/${formData.id}`, formData);
        const updatedStudents = [...students];
        if (editIndex !== null) {
          updatedStudents[editIndex] = response.data;
        }
        setStudents(updatedStudents);
        resetForm();
      } else {
        // CREATE
        const response = await axios.post('https://rfid-absen.vercel.app/api/siswa', formData);
        setStudents(prev => [...prev, response.data]);
        resetForm();
      }
    } catch (error) {
      console.error('Gagal submit data:', error);
      setError('Gagal submit data.');
    }
  };

  const resetForm = () => {
    setFormData({
      nisn: '',
      nama: '',
      rfid: '',
      jurusan: '',
      kelas: '',
      kelas_paralel: ''
    });
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    setFormData(students[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = async (index: number) => {
    const studentId = students[index].id;
    try {
      await axios.delete(`https://rfid-absen.vercel.app/api/siswa/${studentId}`);
      setStudents(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Gagal menghapus:', error);
      setError('Gagal menghapus siswa.');
    }
  };

  // Fetch UID terbaru setiap 2 detik
  useEffect(() => {
    const fetchUID = async () => {
      try {
        const response = await axios.get('https://rfid-absen.vercel.app/api/latest-uid');
        const latestUID = response?.data?.uid;

        if (!isEditing && latestUID && typeof latestUID === 'string') {
          setFormData(prev => ({
            ...prev,
            rfid: latestUID
          }));
        }
      } catch (error) {
        console.error('Gagal ambil UID:', error);
      }
    };

    const interval = setInterval(fetchUID, 2000);
    return () => clearInterval(interval);
  }, [isEditing]);

  // Fetch data siswa
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://rfid-absen.vercel.app/api/siswa');
        console.log('Response:', response.data);
        
        if (Array.isArray(response.data)) {
          setStudents(response.data);
        } else if (Array.isArray(response.data.data)) {
          setStudents(response.data.data);
        } else {
          throw new Error('Format data tidak dikenali.');
        }

      } catch (error) {
        console.error('Gagal mengambil data siswa:', error);
        setError('Gagal mengambil data siswa.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Data Siswa</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-md">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">
            {isEditing ? 'Edit Data Siswa' : 'Input Data Siswa'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Fields */}
              {[
                { label: 'NISN', name: 'nisn', type: 'text', placeholder: 'Masukan NISN' },
                { label: 'Nama', name: 'nama', type: 'text', placeholder: 'Masukan Nama' },
                { label: 'RFID', name: 'rfid', type: 'text', placeholder: 'RFID akan terisi otomatis ketika di Scan', readOnly: true }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
                  <input
                    placeholder={field.placeholder}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof FormData]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    readOnly={field.readOnly}
                  />
                </div>
              ))}

              {/* Select Fields */}
              {[
                { label: 'Jurusan', name: 'jurusan', options: ['RPL', 'TKJ', 'MM', 'AKL', 'OTKP'] },
                { label: 'Kelas', name: 'kelas', options: ['X', 'XI', 'XII'] },
                { label: 'Kelas Paralel', name: 'kelas_paralel', options: ['A', 'B', 'C', 'D'] }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
                  <select
                    name={field.name}
                    value={formData[field.name as keyof FormData]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih {field.label}</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                {isEditing ? 'Update' : 'Simpan'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="ml-3 px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">Data Siswa</h2>

          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-700">
                    {['No', 'NISN', 'Nama', 'RFID', 'Jurusan', 'Kelas', 'Paralel', 'Aksi'].map((header, idx) => (
                      <th key={idx} className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {students.map((student, index) => (
                    <tr key={student.id || index}>
                      <td className="px-4 py-3 text-gray-300">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-300">{student.nisn}</td>
                      <td className="px-4 py-3 text-gray-300">{student.nama}</td>
                      <td className="px-4 py-3 text-gray-300">{student.rfid}</td>
                      <td className="px-4 py-3 text-gray-300">{student.jurusan}</td>
                      <td className="px-4 py-3 text-gray-300">{student.kelas}</td>
                      <td className="px-4 py-3 text-gray-300">{student.kelas_paralel}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(index)}
                          className="px-3 py-1 bg-yellow-600 text-white rounded-md mr-2 hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">Belum ada data siswa</p>
          )}
        </div>
      </div>
    </div>
  );
}
