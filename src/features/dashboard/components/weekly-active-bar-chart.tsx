// Weekly bar chart component highlighting active daily attendance patterns
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import { WeeklyDayItem } from '../types/dashboard';

interface WeeklyActiveBarChartProps {
  weeklyDays: WeeklyDayItem[];
}

export function WeeklyActiveBarChart({ weeklyDays }: WeeklyActiveBarChartProps) {
  return (
    <Card className="p-6 shadow-2xs h-full flex flex-col justify-between sm:col-span-1 lg:col-span-1">
      <div>
        <div className="flex items-center justify-between pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hari Paling Aktif</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Distribusi presensi mingguan</p>
          </div>
          <button
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 flex items-end justify-between h-44 px-2 select-none">
          {weeklyDays.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
              {item.active ? (
                <div className="text-[10px] font-bold text-slate-800 font-mono tracking-tight animate-bounce">
                  {item.count}
                </div>
              ) : (
                <div className="h-4"></div>
              )}

              <div
                style={{ height: `${item.height}px` }}
                className={`w-7 rounded-t-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-blue-600 shadow-sm shadow-blue-500/30'
                    : 'bg-slate-100 group-hover:bg-slate-200'
                }`}
              />

              <span
                className={`text-[11px] font-medium transition-colors ${
                  item.active ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}
              >
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Puncak Kehadiran:</span>
        <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
          Senin (94.2%)
        </span>
      </div>
    </Card>
  );
}
