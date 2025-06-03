"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { StudentFormData, StudentDataFormProps, AbsensFormData, } from '@/types/index';
import Swal from 'sweetalert2';

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

  const [absenFormData, setAbsenFormData] = useState<AbsensFormData>({
    id: 0,
    siswa_id: 0,
    tanggal: '',
    jam: '',
    status: '',
    keterangan: ''
  });

  const pathname = usePathname();
  const isAbsenPage = pathname.includes('/absen');

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
        const response = await axios.get(`${baseURL}/latest-uid`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
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
          axios.get(`${baseURL}/jurusan`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }),
          axios.get(`${baseURL}/kelas`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }),
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

  // Ambil data siswa untuk edit berdasarkan idParam (hanya untuk halaman non-absen)
  useEffect(() => {
    if (!idParam || isAbsenPage) return;

    const fetchStudentById = async () => {
      try {
        const response = await axios.get(`${baseURL}/siswa/${idParam}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
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
  }, [baseURL, idParam, isAbsenPage]);

  // Fetch absensi by id (hanya untuk halaman absen)
  useEffect(() => {
    const fetchAbsenById = async () => {
      if (!idParam || !isAbsenPage) return;

      try {
        const response = await axios.get(`${baseURL}/absen/${idParam}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const absen = Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;
        console.log('Fetched absen by id:', absen);
                
        setAbsenFormData({
          id: absen.id || 0,
          siswa_id: absen.siswa_id || 0,
          tanggal: absen.tanggal,
          jam: absen.jam || '',
          status: absen.status || '',
          keterangan: absen.keterangan || ''
        });

        // Ambil data siswa berdasarkan siswa_id dari absen
        if (absen.siswa_id) {
          fetchStudentBySiswaId(absen.siswa_id);
        }
      } catch (error) {
        console.error('Error fetching absen by id:', error);
        setAbsenFormData({
          id: 0,
          siswa_id: 0,
          tanggal: '',
          jam: '',
          status: '',
          keterangan: ''
        });
      }
    };

    const fetchStudentBySiswaId = async (siswaId: number) => {
      try {
        const response = await axios.get(`${baseURL}/siswa/${siswaId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const student = response.data.data;
        console.log('Fetched student by siswa_id:', student);

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
        console.error('Error fetching student by siswa_id:', error);
      }
    };

    fetchAbsenById();
  }, [baseURL, idParam, isAbsenPage]);

  // Update siswa_id in absenFormData when formData.nis changes
  useEffect(() => {
    if (formData.nis && isAbsenPage) {
      setAbsenFormData(prev => ({
        ...prev,
        siswa_id: Number(formData.nis)
      }));
    }
  }, [formData.nis, isAbsenPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (['rfid_uid', 'kelas_id', 'jurusan_id', 'pararel_id'].includes(name)) {
      const numValue = value === '' ? 0 : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle changes for absen form
  const handleAbsenChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let updatedData;
    
    if (name === 'siswa_id') {
      updatedData = {
        ...absenFormData,
        [name]: Number(value)
      };
    } else {
      updatedData = {
        ...absenFormData,
        [name]: value
      };
    }
    
    // Update state terlebih dahulu
    setAbsenFormData(updatedData);
    
    // Gunakan data yang sudah diupdate untuk API call
    axios.put(`${baseURL}/absen/${absenFormData.id}`, updatedData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    .then(res => {
      console.log('Berhasil update absen:', res.data);
      setAbsenFormData(res.data.data);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data absen berhasil diupdate',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    })
    .catch(err => {
      console.error('Error update absen:', err.response.data);
      Swal.fire({
        title: 'Gagal!',
        text: err.response.data.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  };

  const handleSubmit = () => {
    if (isAbsenPage) {
      // Untuk halaman absen, tidak ada submit karena hanya view data
      return;
    } else {
      onSubmit?.(formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      nis: '',
      rfid_uid: 0,
      nama: '',
      kelas_id: 0,
      jurusan_id: 0,
      pararel_id: 0
    });
    setAbsenFormData({
      id: 0,
      siswa_id: 0,
      tanggal: '',
      jam: '',
      status: '',
      keterangan: ''
    });
    onCancel?.();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-semibold text-center text-indigo-500 mb-6">
        {isAbsenPage ? 'Input Kehadiran Siswa' : 'Masukan Data Siswa'}
      </h1>
  
      {isAbsenPage ? (
        <div className="space-y-4">
          <input
            type="text"
            value={formData.nama}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
            placeholder="Nama"
          />
          <input
            type="text"
            value={kelasList.find(k => k.id === formData.kelas_id)?.nama || ''}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
            placeholder="Kelas"
          />
          <input
            type="text"
            value={jurusanList.find(j => j.id === formData.jurusan_id)?.nama || ''}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
            placeholder="Jurusan"
          />
          <input
            type="text"
            value={
              formData.pararel_id === 1
                ? 'A'
                : formData.pararel_id === 2
                ? 'B'
                : formData.pararel_id === 3
                ? 'C'
                : formData.pararel_id === 4
                ? 'D'
                : ''
            }
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
            placeholder="Pararel"
          />
          <input
            type="text"
            value={absenFormData.tanggal}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
            placeholder="Tanggal"
          />
          <input
            type="text"
            value={absenFormData.jam}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
            placeholder="Jam"
          />
          <select
            value={absenFormData.status}
            onChange={handleAbsenChange}
            name="status"
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
            disabled={false}
          >
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Sakit">Sakit</option>
            <option value="Alpha">Alpha</option>
          </select>
  
          <div className="space-y-3 mt-6">
            <button
              onClick={handleCancel}
              className="w-full px-4 py-3 bg-white text-gray-400 border border-gray-300 font-medium rounded hover:bg-gray-50"
            >
              KEMBALI
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* === KIRI === */}
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
              type="text"
              name="rfid_uid"
              placeholder="RFID UID"
              value={formData.rfid_uid}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
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
  
          {/* === KANAN === */}
          <div className="space-y-4">
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
  
          <div className="md:col-span-2 space-y-3 mt-6">
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
      )}
    </div>
  );  
}