'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Siswa, Absen } from '../interface/index';
import Topbar from '@/components/Header'; // Assume Topbar component is in components folder
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [latestUID, setLatestUID] = useState<string | null>(null);
  const [prevUID, setPrevUID] = useState<string | null>(null);
  const [siswaData, setSiswaData] = useState<Siswa | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get('https://rfid-absen.vercel.app/api/latest-uid');
        const uid = res.data.uid;

        if (uid && uid !== prevUID) {
          setLatestUID(uid);
          setPrevUID(uid);
          setSiswaData(null);
          setStatus('');
        }
      } catch (error) {
        console.error('Gagal ambil UID:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prevUID]);

  useEffect(() => {
    const fetchSiswa = async () => {
      if (!latestUID) return;

      try {
        const response = await axios.get('https://rfid-absen.vercel.app/api/siswa');
        const siswaList: Siswa[] = Array.isArray(response.data)
          ? response.data
          : response.data.data;

        const siswa = siswaList.find((student) => student.rfid === latestUID);

        if (siswa) {
          setSiswaData(siswa);
        } else {
          setSiswaData(null);
          setStatus('Siswa tidak ditemukan!');
        }
      } catch (error) {
        console.error('Gagal mencari siswa:', error);
        setStatus('Terjadi kesalahan!');
      }
    };

    fetchSiswa();
  }, [latestUID]);

  useEffect(() => {
    const handleAbsen = async () => {
      if (!siswaData) return;

      const today = new Date().toISOString().split('T')[0];
      const storageKey = `sudahAbsen-${siswaData.id}-${today}`;

      if (localStorage.getItem(storageKey) === 'true') {
        setStatus('Siswa sudah absen hari ini!');
        return;
      }

      try {
        const absenResponse = await axios.post(
          'https://rfid-absen.vercel.app/api/absen',
          {
            siswa_id: siswaData.id,
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

    if (siswaData) handleAbsen();
  }, [siswaData]);

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
          {siswaData && (
            <div>
              <p><strong>Nama:</strong> {siswaData.nama}</p>
              <p><strong>ID:</strong> {siswaData.id}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

