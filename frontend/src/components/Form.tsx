"use client"
import { useState } from 'react';
import { useParams } from 'next/navigation'; // ✅ gunakan ini di App Router
import { StudentFormData } from '@/types/index';
import { StudentDataFormProps } from '@/types/index';


export default function StudentDataForm({ onSubmit, onCancel }: StudentDataFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    nis: '',
    rfid_uid: 0,
    nama: '',
    kelas: 0,
    jurusan: 0,
    pararel: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Konversi nilai sesuai dengan tipe data yang dibutuhkan
    if (name === 'rfid_uid' || name === 'kelas' || name === 'jurusan' || name === 'pararel') {
      const numValue = value === '' ? 0 : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    // Reset form data to initial state
    setFormData({
      nis: '',
      rfid_uid: 0,
      nama: '',
      kelas: 0,
      jurusan: 0,
      pararel: 0
    });
    
    // Call onCancel if provided
    if (onCancel) {
      onCancel();
    }
  };

  const params = useParams();
    const jurusanParam = params?.jurusan as string;
    const kelasParam = params?.kelas as string;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-semibold text-center text-indigo-500 mb-6">Masukan Data Siswa</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              name="nis"
              placeholder="NISN"
              value={formData.nis}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          
          <div>
            <input
              type="text"
              name="rfid_uid"
              placeholder="RFID"
              value={formData.rfid_uid}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          
          <div>
            <input
              type="text"
              name="nama"
              placeholder="Nama Siswa"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          <div className="relative">
            <select
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none"
            >
              <option value="">{jurusanParam}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none"
            >
              <option value="">{kelasParam}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select
              name="pararel"
              value={formData.pararel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none"
            >
              <option value="" disabled>Kelas Paralel</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-3 bg-indigo-500 text-white font-medium rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          SIMPAN
        </button>
        
        <button
          onClick={handleCancel}
          className="w-full px-4 py-3 bg-white text-gray-400 font-medium rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          BATAL
        </button>
      </div>
    </div>
  );
}