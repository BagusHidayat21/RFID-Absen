import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock } from 'lucide-react';

// Reusable presence status badge with animated pulse for active live sessions
export type AttendanceStatusType = 'live' | 'selesai' | 'belum' | 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpha';

interface StatusBadgeProps {
  status: AttendanceStatusType | string;
  label?: string;
  sublabel?: string;
  className?: string;
}

export default function StatusBadge({ status, label, sublabel, className }: StatusBadgeProps) {
  const normStatus = status.toLowerCase();

  if (normStatus === 'live') {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70",
          className
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>{label || 'Live'} {sublabel && `• ${sublabel}`}</span>
      </span>
    );
  }

  if (normStatus === 'selesai' || normStatus === 'hadir' || normStatus === 'tepat waktu') {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70",
          className
        )}
      >
        <CheckCircle2 className="w-3 h-3 text-blue-600" />
        <span>{label || 'Selesai'} {sublabel && `• ${sublabel}`}</span>
      </span>
    );
  }

  if (normStatus === 'terlambat') {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/70",
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        <span>{label || 'Terlambat'} {sublabel && `• ${sublabel}`}</span>
      </span>
    );
  }

  if (normStatus === 'izin' || normStatus === 'sakit') {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/70",
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
        <span>{label || normStatus} {sublabel && `• ${sublabel}`}</span>
      </span>
    );
  }

  if (normStatus === 'alpha') {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70",
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        <span>{label || 'Alpha'} {sublabel && `• ${sublabel}`}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200/60",
        className
      )}
    >
      <Clock className="w-3 h-3 text-slate-400" />
      <span>{label || 'Belum Presensi'}</span>
    </span>
  );
}
