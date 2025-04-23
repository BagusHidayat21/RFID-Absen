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

  // Fetch UID terbaru
  useEffect(() => {
    const fetchLatestUID = async () => {
      try {
        const response = await fetch('http://192.168.105.41:5000/api/latest-uid');
        const data = await response.json();
        console.log('UID terbaru:', data);
        setLatestUID(data.uid);
      } catch (error) {
        console.error('Gagal fetch UID:', error);
        setStatus('Gagal mengambil UID');
      }
    };

    if (!latestUID) {
      fetchLatestUID();
    }
  }, [latestUID]);

  // Cek apakah UID cocok dengan siswa dan lakukan absen
  useEffect(() => {
    if (latestUID) {
      const checkStudent = async () => {
        setLoading(true);
        try {
          const response = await fetch('http://192.168.105.41:5000/api/siswa');
          const json = await response.json();

          console.log('Response API siswa:', json);
          
          // Jika json.data adalah array siswa
          const siswaList: Siswa[] = Array.isArray(json) ? json : json.data;

          const siswa = siswaList.find(student => student.rfid === latestUID);

          if (siswa) {
            setSiswaData(siswa);

            const absenResponse = await fetch('http://192.168.105.41:5000/api/absen', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                siswa_id: siswa.id,
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
        } catch (error) {
          console.error('Gagal memproses absen:', error);
          setStatus('Terjadi kesalahan!');
        } finally {
          setLoading(false);
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
