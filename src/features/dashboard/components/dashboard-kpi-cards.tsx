// Presentational component rendering four equal-height attendance metric cards
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { AttendanceMetrics } from '../types/dashboard';
import {
  Eye,
  Clock,
  FileText,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface DashboardKPICardsProps {
  metrics: AttendanceMetrics;
  loading?: boolean;
}

export function DashboardKPICards({ metrics, loading }: DashboardKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Hadir Tepat Waktu */}
      <Card className="p-5 shadow-2xs hover:shadow-xs transition-shadow h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Hadir Tepat Waktu</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : metrics.onTime.toLocaleString('id-ID')}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
              <ArrowUpRight className="w-3 h-3" />
              15.5%
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-normal">
          {metrics.comparisonOnTime}
        </p>
      </Card>

      {/* Card 2: Terlambat */}
      <Card className="p-5 shadow-2xs hover:shadow-xs transition-shadow h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Terlambat (&gt; 07:15)</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : metrics.late.toLocaleString('id-ID')}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
              <ArrowUpRight className="w-3 h-3" />
              8.4%
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-normal">
          {metrics.comparisonLate}
        </p>
      </Card>

      {/* Card 3: Izin & Sakit */}
      <Card className="p-5 shadow-2xs hover:shadow-xs transition-shadow h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Izin &amp; Sakit</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : metrics.excused.toLocaleString('id-ID')}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex-shrink-0">
              <ArrowDownRight className="w-3 h-3" />
              10.5%
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-normal">
          {metrics.comparisonExcused}
        </p>
      </Card>

      {/* Card 4: Tanpa Keterangan */}
      <Card className="p-5 shadow-2xs hover:shadow-xs transition-shadow h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tanpa Keterangan</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : metrics.unexcused.toLocaleString('id-ID')}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
              <ArrowUpRight className="w-3 h-3" />
              4.4%
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-normal">
          {metrics.comparisonUnexcused}
        </p>
      </Card>
    </div>
  );
}
