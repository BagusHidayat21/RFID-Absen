'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Students } from '@/types';
import Topbar from '@/components/Header'; 
import Sidebar from '@/components/Sidebar';


const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Home() {
  const [latestUID, setLatestUID] = useState<string | null>(null);
  const [prevUID, setPrevUID] = useState<string | null>(null);
  const [StudentsData, setStudentsData] = useState<Students | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${baseURL}latest-uid`);
        const uid = res.data.uid;

        if (uid && uid !== prevUID) {
          setLatestUID(uid);
          setPrevUID(uid);
          setStudentsData(null);
          setStatus('');
        }
      } catch (error) {
        console.error('Gagal ambil UID:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prevUID]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!latestUID) return;

      try {
        const response = await axios.get('https://rfid-absen.vercel.app/api/Students');
        const StudentsList: Students[] = Array.isArray(response.data)
          ? response.data
          : response.data.data;

        const Students = StudentsList.find((student) => student.rfid === latestUID);

        if (Students) {
          setStudentsData(Students);
        } else {
          setStudentsData(null);
          setStatus('Students tidak ditemukan!');
        }
      } catch (error) {
        console.error('Gagal mencari Students:', error);
        setStatus('Terjadi kesalahan!');
      }
    };

    fetchStudents();
  }, [latestUID]);

  useEffect(() => {
    const handleAbsen = async () => {
      if (!StudentsData) return;

      const today = new Date().toISOString().split('T')[0];
      const storageKey = `sudahAbsen-${StudentsData.id}-${today}`;

      if (localStorage.getItem(storageKey) === 'true') {
        setStatus('Students sudah absen hari ini!');
        return;
      }

      try {
        const absenResponse = await axios.post(
          'https://rfid-absen.vercel.app/api/absen',
          {
            Students_id: StudentsData.id,
            waktu: new Date().toISOString(),
            status: 'hadir',
          }
        );

        if (absenResponse.status === 201) {
          setStatus('Absen berhasil!');
          localStorage.setItem(storageKey, 'true');
        } else {
          setStatus('Absen gagal.');
        }
      } catch (error) {
        console.error('Gagal proses absen:', error);
        setStatus('Terjadi kesalahan!');
      }
    };

    if (StudentsData) handleAbsen();
  }, [StudentsData]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        <Topbar user={{ name: "Musfiq", role: "Guru" }} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <h1>Absen RFID</h1>
          <p><strong>UID:</strong> {latestUID || 'Menunggu scan...'}</p>
          {status && <p>{status}</p>}
          {StudentsData && (
            <div>
              <p><strong>Nama:</strong> {StudentsData.nama}</p>
              <p><strong>ID:</strong> {StudentsData.id}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

