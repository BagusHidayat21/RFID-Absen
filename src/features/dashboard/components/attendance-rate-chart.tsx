// Area line chart visualizing attendance rates across the selected timeframe
'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { AttendanceMetrics, ChartPoint } from '../types/dashboard';

interface AttendanceRateChartProps {
  metrics: AttendanceMetrics;
  chartPoints: ChartPoint[];
  hoveredPoint: number | null;
  onHoverPoint: (idx: number) => void;
}

const DEFAULT_POINTS: ChartPoint[] = [
  { x: 30, y: 110, label: 'Tgl 1', displayVal: '0', prevVal: '0' },
  { x: 130, y: 100, label: 'Tgl 3', displayVal: '0', prevVal: '0' },
  { x: 230, y: 80, label: 'Tgl 5', displayVal: '0', prevVal: '0' },
  { x: 330, y: 90, label: 'Tgl 7', displayVal: '0', prevVal: '0' },
  { x: 470, y: 60, label: 'Tgl 9', displayVal: '0', prevVal: '0' },
];

export function AttendanceRateChart({
  metrics,
  chartPoints,
  hoveredPoint,
  onHoverPoint,
}: AttendanceRateChartProps) {
  const points = useMemo(() => {
    if (chartPoints && chartPoints.length >= 2) {
      return chartPoints;
    }
    return DEFAULT_POINTS;
  }, [chartPoints]);

  const pathD = useMemo(() => {
    if (!points || points.length < 2) return '';
    return points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = points[i - 1];
      const midX = prev.x + (pt.x - prev.x) / 2;
      return `${acc} C ${midX} ${prev.y}, ${midX} ${pt.y}, ${pt.x} ${pt.y}`;
    }, '');
  }, [points]);

  const areaD = useMemo(() => {
    if (!pathD || points.length < 2) return '';
    const first = points[0];
    const last = points[points.length - 1];
    return `${pathD} L ${last.x} 145 L ${first.x} 145 Z`;
  }, [pathD, points]);

  const activePoint = hoveredPoint !== null && points[hoveredPoint] ? points[hoveredPoint] : points[0];

  return (
    <Card className="p-6 shadow-2xs h-full flex flex-col justify-between sm:col-span-2 lg:col-span-1">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Tingkat Kehadiran Siswa</p>
            <div className="mt-1 flex items-baseline gap-2.5">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {metrics.onTimePct}%
              </h2>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                {metrics.comparisonOnTime || '24.4% vs. periode lalu'}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span>15k</span>
            <span>10k</span>
            <span>5k</span>
          </div>
        </div>

        {/* Smooth SVG Area Line Chart with Interactive Tooltip */}
        <div className="relative mt-4 h-44 w-full select-none">
          <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

            {/* Area fill */}
            {areaD && (
              <path
                d={areaD}
                fill="url(#chartGradient)"
                className="transition-all duration-300"
              />
            )}

            {/* Stroke line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            )}

            {/* Data Points */}
            {points.map((pt, idx) => (
              <g key={idx} className="cursor-pointer" onClick={() => onHoverPoint(idx)}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint === idx ? 5 : 3.5}
                  fill="#2563EB"
                  stroke="#FFFFFF"
                  strokeWidth={hoveredPoint === idx ? 2.5 : 2}
                  className="transition-all duration-150"
                />
              </g>
            ))}
          </svg>

          {/* Tooltip Card */}
          {hoveredPoint !== null && activePoint && (
            <div
              className="absolute pointer-events-none transition-all duration-200 z-10"
              style={{
                left: `${(activePoint.x / 500) * 100}%`,
                top: `${(activePoint.y / 150) * 100 - 45}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="bg-white rounded-xl border border-slate-200/90 p-2.5 shadow-lg min-w-[130px] text-left">
                <p className="text-[10px] font-bold text-slate-800">
                  {activePoint.label} 2026
                </p>
                <div className="flex items-center justify-between gap-3 text-[11px] font-semibold text-blue-600 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {activePoint.displayVal} tap
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  {activePoint.prevVal} periode lalu
                </p>
              </div>
            </div>
          )}

          {/* X-Axis labels */}
          <div className="flex justify-between px-2 text-[10px] font-medium text-slate-400 mt-2">
            {points.map((pt, i) => (
              <span key={i}>{pt.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 3 Sub-Metric Blocks */}
      <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center space-x-2.5">
          <div className="w-1.5 h-7 rounded-full bg-blue-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {metrics.total > 0 ? metrics.total.toLocaleString('id-ID') : '324'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">Total Presensi</p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center space-x-2.5">
          <div className="w-1.5 h-7 rounded-full bg-emerald-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {metrics.onTime.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-slate-400 truncate">Tepat Waktu</p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center space-x-2.5">
          <div className="w-1.5 h-7 rounded-full bg-amber-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {metrics.late.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-slate-400 truncate">Terlambat</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
