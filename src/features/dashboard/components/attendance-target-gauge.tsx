// Radial gauge component rendering semester attendance goals and detail dialog
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';

export function AttendanceTargetGauge() {
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const handleShowDetails = () => {
    confirm({
      title: 'Target Capaian Kehadiran',
      description: 'Capaian 68% semester ini telah memenuhi standar minimal ketuntasan absensi Disdik Jawa Timur (85%).',
      confirmText: 'Tutup',
    });
  };

  return (
    <Card className="p-6 shadow-2xs h-full flex flex-col justify-between sm:col-span-1 lg:col-span-1 text-center">
      <div>
        <div className="flex items-center justify-between pb-2 text-left">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Target Capaian Kehadiran</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Target semester berjalan</p>
          </div>
          <button
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="relative mt-5 flex items-center justify-center">
          <svg className="w-48 h-28 overflow-visible" viewBox="0 0 200 110">
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="12"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
            <path
              d="M 20 100 A 80 80 0 0 1 160 55"
              fill="none"
              stroke="#10B981"
              strokeWidth="12"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">68%</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
              On track for 85% target
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowDetails}
          className="w-full py-2 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer h-9"
        >
          Show details
        </Button>
      </div>

      <ConfirmDialog />
    </Card>
  );
}
