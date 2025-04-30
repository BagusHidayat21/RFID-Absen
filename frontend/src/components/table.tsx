"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Header";
import { Siswa } from "@/app/interface";

export default function StudentTable() {
  const [students, setStudents] = useState<Siswa[]>([
    { id: 1, nisn: "1234567890", rfid: "A1B2C3", nama: "Ahmad", kelas: "X", kelas_paralel: "A", jurusan: "Teknik Informatika" },
    { id: 2, nisn: "0987654321", rfid: "D4E5F6", nama: "Budi", kelas: "XI", kelas_paralel: "B", jurusan: "Akuntansi" },
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar user={{ name: "Musfiq", role: "Guru" }} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Data Siswa</h1>

            {/* Tabel Data Siswa */}
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">NISN</th>
                  <th className="border border-gray-300 px-4 py-2">RFID</th>
                  <th className="border border-gray-300 px-4 py-2">Nama</th>
                  <th className="border border-gray-300 px-4 py-2">Kelas</th>
                  <th className="border border-gray-300 px-4 py-2">Parallel</th>
                  <th className="border border-gray-300 px-4 py-2">Jurusan</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border border-gray-200">
                    <td className="border border-gray-300 px-4 py-2">{student.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{student.nisn}</td>
                    <td className="border border-gray-300 px-4 py-2">{student.rfid}</td>
                    <td className="border border-gray-300 px-4 py-2">{student.nama}</td>
                    <td className="border border-gray-300 px-4 py-2">{student.kelas}</td>
                    <td className="border border-gray-300 px-4 py-2">{student.kelas_paralel}</td> 
                    <td className="border border-gray-300 px-4 py-2">{student.jurusan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}