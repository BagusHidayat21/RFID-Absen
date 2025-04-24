'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
    const interval = setInterval(async () => {
      try {
        const res = await axios.get('https://rfid-absen.vercel.app/api/latest-uid');
        const newUID = res.data.uid;

        if (newUID && newUID !== latestUID) {
          setLatestUID(newUID); // update UID, trigger useEffect bawah
        }
      } catch (error) {
        console.error('Gagal mengambil UID terbaru:', error);
      }
    },); // 2 detik

    return () => clearInterval(interval); // bersihin interval
  }, [latestUID]);

  // Cek apakah UID cocok dengan siswa dan lakukan absen
  useEffect(() => {
    if (latestUID) {
      const checkStudent = async () => {
        setLoading(true);
        try {
          const response = await axios.get('https://rfid-absen.vercel.app/api/siswa');
          const siswaList: Siswa[] = Array.isArray(response.data)
            ? response.data
            : response.data.data;

          const siswa = siswaList.find(student => student.rfid === latestUID);

          if (siswa) {
            setSiswaData(siswa);

            // Cek apakah sudah absen hari ini
            const absenHistoryResponse = await axios.get(`https://rfid-absen.vercel.app/api/absen?siswa_id=${siswa.id}`);
            const absenList = absenHistoryResponse.data.data || [];

            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            const sudahAbsen = absenList.some((absen: any) => {
              const absenDate = new Date(absen.waktu).toISOString().split('T')[0];
              return absenDate === today;
            });

            if (sudahAbsen) {
              setStatus('Siswa sudah absen hari ini!');
            } else {
              const absenResponse = await axios.post('https://rfid-absen.vercel.app/api/absen', {
                siswa_id: siswa.id,
                waktu: new Date().toISOString(),
                status: 'hadir',
              });

              if (absenResponse.status === 200) {
                setStatus('Absen berhasil!');
              } else {
                setStatus('Absen gagal');
              }
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
  

  // return (
  //   <div style={{ textAlign: 'center', marginTop: '50px' }}>
  //     <h1>Deteksi RFID dan Absen</h1>
  //     <p>{status}</p>
  //     {loading && <p>Loading...</p>}
  //     <div>
  //       <p>UID terakhir: {latestUID}</p>
  //       {siswaData && (
  //         <div>
  //           <p>Nama Siswa: {siswaData.nama}</p>
  //           <p>ID Siswa: {siswaData.id}</p>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}