'use client';

// Filter toolbar for attendance directory supporting search, department, and grade tabs
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { DEFAULT_JURUSAN } from '@/lib/presensi.utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AttendanceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedJurusan: string;
  onJurusanChange: (jurusan: string) => void;
  selectedTingkat: string;
  onTingkatChange: (tingkat: string) => void;
  isFilterActive: boolean;
  onReset: () => void;
}

export function AttendanceFilters({
  searchQuery,
  onSearchChange,
  selectedJurusan,
  onJurusanChange,
  selectedTingkat,
  onTingkatChange,
  isFilterActive,
  onReset,
}: AttendanceFiltersProps) {
  return (
    <div className="mt-5 pb-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Left section: Search Input & Jurusan Dropdown & Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
        {/* Search Pill */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama kelas, jurusan, atau wali kelas..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white transition-all shadow-2xs h-9"
          />
        </div>

        {/* Jurusan Dropdown Pill */}
        <Select
          value={selectedJurusan || 'ALL'}
          onValueChange={(val) => onJurusanChange(val)}
        >
          <SelectTrigger className="w-full sm:w-[190px] h-9 rounded-xl border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50">
            <SelectValue placeholder="Semua Jurusan (9)" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
            <SelectItem value="ALL" className="text-xs font-medium">Semua Jurusan (9)</SelectItem>
            {DEFAULT_JURUSAN.map((j) => (
              <SelectItem key={j.code} value={j.code} className="text-xs font-medium">
                {j.code} - {j.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {isFilterActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border-none text-xs font-medium cursor-pointer shadow-none"
            title="Reset Filter"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        )}
      </div>

      {/* Right section: Tingkat Filter Segmented Tabs */}
      <div className="flex items-center overflow-x-auto max-w-full">
        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 self-start lg:self-auto flex-nowrap">
          {['ALL', 'X', 'XI', 'XII'].map((t) => (
            <button
              key={t}
              onClick={() => onTingkatChange(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedTingkat === t
                  ? 'bg-white text-blue-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {t === 'ALL' ? 'Semua Tingkat' : `Kelas ${t}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
