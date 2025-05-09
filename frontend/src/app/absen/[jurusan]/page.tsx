'use client'
import Link from "next/link"
import { useParams } from "next/navigation"

import { Class } from "@/types";
import Topbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { IoCubeOutline } from "react-icons/io5";
import Jurusan from "@/components/Jurusan";

export default function JurusanDetailPage() {
    const params = useParams();
    const jurusan = params?.jurusan as string;

    const Icons = {
        all: <IoCubeOutline size = {24} color="white" />
    };

    const ClassData: Class[] = [
        {id: 1, type: "n1", title: "X", count: "31 Siswa", rombel: "3 Rombel", icon: Icons.all, slug: "X" },
        {id: 2, type: "n2", title: "XI", count: "1 Siswa", rombel: "3 Rombel", icon: Icons.all, slug: "XI" },
        {id: 3, type: "n3", title: "XII", count: "1 Siswa", rombel: "3 Rombel", icon: Icons.all, slug: "XII" },
        {id: 4, type: "n4", title: "XII", count: "1 Siswa", rombel: "3 Rombel", icon: Icons.all, slug: "XIII" }
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar user={{ name: "musfiq", role: "Guru"}} />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 rounded-lg text-sm">
                            <h1 className="text-xl font-semibold text-gray-900">Kelas {jurusan?.toUpperCase()}</h1>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                                Bulan & Tahun
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {ClassData.map((item) => (
                                <Link key={item.id} href={`/absen/${jurusan}/${item.slug}`} className="block">
                                    <div className={`p-4 rounded-lg shadow-md ${item.type === 'n1' ? 'bg-pink-50' : item.type === 'n2' ? 'bg-amber-50' : item.type === 'n3' ? 'bg-green-50' : 'bg-purple-50'}`}>
                                        <Jurusan
                                            type={item.type}
                                            title={item.title}
                                            count={item.count}
                                            rombel={item.rombel}
                                            icon={item.icon}
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
