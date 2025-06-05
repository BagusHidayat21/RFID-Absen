'use client';

// Presentational component rendering the 4 top summary metric cards for attendance feature
import React from 'react';
import { Card } from '@/components/ui/card';
import { PresensiKPIStats } from '../types/attendance';
import { GraduationCap, Clock, CheckCircle2, Users, ArrowUpRight } from 'lucide-react';

interface AttendanceKPICardsProps {
  stats: PresensiKPIStats;
  loading?: boolean;
}

export function AttendanceKPICards({ stats, loading }: AttendanceKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Rombel Kelas */}
      <Card className="p-5 shadow-2xs hover:shadow-xs transition-shadow h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Rombel Kelas</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : stats.totalClasses}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">
              9 Jurusan
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-normal">
          Tingkat X, XI, XII terdaftar aktif
        </p>
      </Card>

      {/* Card 2: Sesi Presensi Live */}
      <Card className="p-5 shadow-2xs hover:shadow-xs transition-shadow h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sesi Sedang Berlangsung</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : stats.activeLiveClasses}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-normal">
          Tap kartu RFID pintu masuk aktif
        </p>
      </Card>

      {/* Card 3: Tingkat Kehadiran Hari Ini */}
      <Card className="p-5 shadow-2xs hover:shadow-xs transition-shadow h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tingkat Kehadiran Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : `${stats.overallAttendanceRate}%`}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
              <ArrowUpRight className="w-3 h-3" />
              +1.2%
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-normal">
          Standar ketuntasan tercapai (&gt;85%)
        </p>
      </Card>

      {/* Card 4: Total Siswa Hadir */}
      <Card className="p-5 shadow-2xs hover:shadow-xs transition-shadow h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Siswa Hadir</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : stats.totalStudentsPresent.toLocaleString('id-ID')}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
              Siswa
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-normal">
          Terverifikasi via scan RFID
        </p>
      </Card>
    </div>
  );
}
