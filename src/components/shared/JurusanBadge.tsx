import React from 'react';
import { cn } from '@/lib/utils';

// Color token mappings for all 9 vocational departments at SMKN 1 Jenangan
export const JURUSAN_COLOR_STYLES: Record<string, string> = {
  RPL: 'bg-blue-50 text-blue-700 border-blue-200/70',
  EI: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
  OI: 'bg-cyan-50 text-cyan-700 border-cyan-200/70',
  DPIB: 'bg-amber-50 text-amber-700 border-amber-200/70',
  TKP: 'bg-orange-50 text-orange-700 border-orange-200/70',
  TSM: 'bg-rose-50 text-rose-700 border-rose-200/70',
  TPM: 'bg-purple-50 text-purple-700 border-purple-200/70',
  TLAS: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  TPTUP: 'bg-teal-50 text-teal-700 border-teal-200/70',
};

interface JurusanBadgeProps {
  jurusan: string;
  className?: string;
}

export default function JurusanBadge({ jurusan, className }: JurusanBadgeProps) {
  const code = jurusan.toUpperCase();
  const style = JURUSAN_COLOR_STYLES[code] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border",
        style,
        className
      )}
    >
      {jurusan}
    </span>
  );
}
