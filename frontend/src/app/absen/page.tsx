'use client';
import { useState, useEffect } from 'react';

interface Siswa {
  id: number;
  siswa_id: number;
  nama: string;
  rfid: string;
}

export default function Home() {
  const [latestUID, setLatestUID] = useState<string | null>(null);
  const [siswaData, setSiswaData] = useState<Siswa | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLatestUID = async () => {
      const response = await fetch('http://192.168.67.217:5000/api/latest-uid');
      const data = await response.json();
      setLatestUID(data.uid);
    };

    if (!latestUID) {
      fetchLatestUID();
    }
  }, [latestUID]);

  useEffect(() => {
    if (latestUID) {
      const checkStudent = async () => {
        // Ambil semua siswa dari API
        const response = await fetch('http://192.168.67.217:5000/api/siswa');
        const data: Siswa[] = await response.json();

        // Cari siswa berdasarkan RFID
        const siswa = data.find(student => student.rfid === latestUID);

        if (siswa) {
          setSiswaData(siswa);

          // Kirim data absensi ke API
          const absenResponse = await fetch('http://192.168.67.217:5000/api/absen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              idsiswa: siswa.siswa_id,
              waktu: new Date().toISOString(),
              status: 'hadir',
            }),
          });

          if (absenResponse.ok) {
            setStatus('Absen berhasil!');
          } else {
            setStatus('Absen gagal!');
          }
        } else {
          setStatus('Siswa tidak ditemukan!');
        }
      };

      checkStudent();
    }
  }, [latestUID]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Deteksi RFID dan Absen</h1>
      <p>{status}</p>
      {loading && <p>Loading...</p>}
      <div>
        <p>UID terakhir: {latestUID}</p>
        {siswaData && (
          <div>
            <p>Nama Siswa: {siswaData.nama}</p>
            <p>ID Siswa: {siswaData.id}</p>
          </div>
        )}
      </div>
    </div>
  );
}
