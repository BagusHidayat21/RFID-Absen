"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Student {
  id?: number;
  nisn: string;
  nama: string;
  rfid: string;
  jurusan: string;
  kelas: string;
  kelas_paralel: string;
}

type FormData = Student;

export default function StudentForm() {
  const [students, setStudents] = useState<Student[]>([]);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (isEditing && formData.id) {
      // UPDATE
      axios.put(`http://192.168.67.217:5000/api/siswa/${formData.id}`, formData)
        .then(response => {
          const updatedStudents = [...students];
          if (editIndex !== null) {
            updatedStudents[editIndex] = response.data;
          }
          setStudents(updatedStudents);
          setIsEditing(false);
          setEditIndex(null);
          setFormData({
            nisn: '',
            nama: '',
            rfid: '',
            jurusan: '',
            kelas: '',
            kelas_paralel: '',
          });
        })
        .catch(error => console.error('Gagal update:', error));
    } else {
      // CREATE
      axios.post('http://192.168.67.217:5000/api/siswa', formData)
        .then(response => {
          setStudents(prev => [...prev, response.data]);
          setFormData({
            nisn: '',
            nama: '',
            rfid: '',
            jurusan: '',
            kelas: '',
            kelas_paralel: ''
          });
        })
        .catch(error => console.error('Gagal tambah:', error));
    }
  };
  

  const handleEdit = (index: number) => {
    setFormData(students[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const studentId = students[index].id;
    axios.delete(`http://192.168.67.217:5000/api/siswa/${studentId}`)
      .then(() => {
        const filtered = students.filter((_, i) => i !== index);
        setStudents(filtered);
      })
      .catch(error => console.error('Gagal menghapus:', error));
  };

  // Ambil UID terbaru dari backend setiap 2 detik
  useEffect(() => {
    const fetchUID = async () => {
      try {
        const response = await axios.get('http://192.168.67.217:5000/api/latest-uid');
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

    const interval = setInterval(() => {
      fetchUID();
    }, 2000);

    return () => clearInterval(interval);
  }, [isEditing]);

  useEffect(() => {
    axios.get('http://192.168.67.217:5000/api/siswa')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => console.error('Gagal mengambil data siswa:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Data Siswa</h1>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">
            {isEditing ? 'Edit Data Siswa' : 'Input Data Siswa'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">NISN</label>
                <input
                  placeholder='Masukan NISN'
                  type="text"
                  name="nisn"
                  value={formData.nisn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nama</label>
                <input
                  placeholder='Masukan Nama'
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">RFID</label>
                <input
                  placeholder='RFID akan terisi otomatis ketika di Scan'
                  type="text"
                  name="rfid"
                  value={formData.rfid}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  readOnly
                  
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Jurusan</label>
                <select
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Jurusan</option>
                  <option value="RPL">RPL</option>
                  <option value="TKJ">TKJ</option>
                  <option value="MM">MM</option>
                  <option value="AKL">AKL</option>
                  <option value="OTKP">OTKP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Kelas</label>
                <select
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Kelas Paralel</label>
                <select
                  name="kelas_paralel"
                  value={formData.kelas_paralel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Kelas Paralel</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>

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
                  onClick={() => {
                    setIsEditing(false);
                    setEditIndex(null);
                    setFormData({
                      nisn: '',
                      nama: '',
                      rfid: '',
                      jurusan: '',
                      kelas: '',
                      kelas_paralel: ''
                    });
                  }}
                  className="ml-3 px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">Data Siswa</h2>

          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase">No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase">NISN</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase">Nama</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase">RFID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase">Jurusan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase">Kelas</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase">Paralel</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {students.map((student, index) => (
                    <tr key={index}>
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
