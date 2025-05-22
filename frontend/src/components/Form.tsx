"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { StudentFormData, StudentDataFormProps } from '@/types/index';

interface Jurusan {
  id: number;
  nama: string;
}

interface Kelas {
  id: number;
  nama: string;
}

export default function StudentDataForm({ onSubmit, onCancel }: StudentDataFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    nis: '',
    rfid_uid: 0,
    nama: '',
    kelas_id: 0,
    jurusan_id: 0,
    pararel_id: 0
  });

  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = useParams();
  const jurusanParam = params?.jurusan as string;
  const kelasParam = params?.kelas as string;

  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');

  // Tentukan mode edit berdasarkan ada tidaknya idParam
  const isEditMode = !!idParam;

  // Ambil data RFID UID secara berkala hanya kalau bukan mode edit
  useEffect(() => {
    if (isEditMode) {
      // Kalau edit, skip update RFID UID berkala
      return;
    }

    const fetchRFIDUid = async () => {
      try {
        const response = await axios.get(`${baseURL}/latest-uid`);
        setFormData(prev => ({ ...prev, rfid_uid: response.data.uid }));
      } catch (error) {
        console.error('Error fetching RFID UID:', error);
      }
    };

    fetchRFIDUid(); // fetch sekali saat mount

    const intervalId = setInterval(fetchRFIDUid, 2000);
    return () => clearInterval(intervalId);
  }, [baseURL, isEditMode]);

  // Ambil data jurusan dan kelas (static)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jurusanRes, kelasRes] = await Promise.all([
          axios.get(`${baseURL}/jurusan`),
          axios.get(`${baseURL}/kelas`)
        ]);

        const jurusanData = jurusanRes.data.data;
        const kelasData = kelasRes.data.data;

        setJurusanList(jurusanData);
        setKelasList(kelasData);

        // Jika ada param jurusan & kelas, isi default di form
        const foundJurusan = jurusanData.find((j: Jurusan) => j.nama.toLowerCase() === jurusanParam?.toLowerCase());
        const foundKelas = kelasData.find((k: Kelas) => k.nama.toLowerCase() === kelasParam?.toLowerCase());

        setFormData(prev => ({
          ...prev,
          jurusan_id: foundJurusan?.id || 0,
          kelas_id: foundKelas?.id || 0
        }));
      } catch (error) {
        console.error('Error fetching jurusan/kelas:', error);
      }
    };

    if (jurusanParam && kelasParam) {
      fetchData();
    }
  }, [baseURL, jurusanParam, kelasParam]);

  // Ambil data siswa untuk edit berdasarkan idParam
  useEffect(() => {
    if (!idParam) return;

    const fetchStudentById = async () => {
      try {
        const response = await axios.get(`${baseURL}/siswa/${idParam}`);
        const student = response.data.data;
        console.log('Fetched student by id:', student);

        // Isi form dengan data siswa yang didapat
        setFormData({
          nis: student.nis || '',
          rfid_uid: student.rfid_uid || 0,
          nama: student.nama || '',
          kelas_id: student.kelas_id || 0,
          jurusan_id: student.jurusan_id || 0,
          pararel_id: student.pararel_id || 0
        });
      } catch (error) {
        console.error('Error fetching student by id:', error);
      }
    };
    fetchStudentById();
  }, [baseURL, idParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (['rfid_uid', 'kelas_id', 'jurusan_id', 'pararel_id'].includes(name)) {
      const numValue = value === '' ? 0 : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => onSubmit?.(formData);

  const handleCancel = () => {
    setFormData({
      nis: '',
      rfid_uid: 0,
      nama: '',
      kelas_id: 0,
      jurusan_id: 0,
      pararel_id: 0
    });
    onCancel?.();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-semibold text-center text-indigo-500 mb-6">Masukan Data Siswa</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-black">
        <div className="space-y-4">
          <input
            type="text"
            name="nis"
            placeholder="NISN"
            value={formData.nis}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />

          <input
            readOnly
            type="text"
            name="rfid_uid"
            placeholder="RFID"
            value={formData.rfid_uid}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
          />

          <input
            type="text"
            name="nama"
            placeholder="Nama Siswa"
            value={formData.nama}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="space-y-4">
          <select
            name="jurusan_id"
            value={formData.jurusan_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
          >
            <option value="">{jurusanParam || 'Pilih Jurusan'}</option>
            {jurusanList.map(j => (
              <option key={j.id} value={j.id}>{j.nama}</option>
            ))}
          </select>

          <select
            name="kelas_id"
            value={formData.kelas_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
          >
            <option value="">{kelasParam || 'Pilih Kelas'}</option>
            {kelasList.map(k => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>

          <select
            name="pararel_id"
            value={formData.pararel_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
          >
            <option value={0} disabled>Pilih Kelas Paralel</option>
            <option value={1}>A</option>
            <option value={2}>B</option>
            <option value={3}>C</option>
            <option value={4}>D</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 mt-8">
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-3 bg-indigo-500 text-white font-medium rounded hover:bg-indigo-600"
        >
          SIMPAN
        </button>

        <button
          onClick={handleCancel}
          className="w-full px-4 py-3 bg-white text-gray-400 border border-gray-300 font-medium rounded hover:bg-gray-50"
        >
          BATAL
        </button>
      </div>
    </div>
  );
}