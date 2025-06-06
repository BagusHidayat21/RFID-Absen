'use client';

// Filter toolbar for student directory with search input and select dropdowns
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JurusanItem, KelasItem, PararelItem } from '@/lib/api';

interface StudentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterJurusan: string;
  onJurusanChange: (jurusan: string) => void;
  filterKelas: string;
  onKelasChange: (kelas: string) => void;
  filterPararel: string;
  onPararelChange: (pararel: string) => void;
  jurusanList: JurusanItem[];
  kelasList: KelasItem[];
  pararelList: PararelItem[];
  isFilterActive: boolean;
  onReset: () => void;
}

export function StudentFilters({
  searchQuery,
  onSearchChange,
  filterJurusan,
  onJurusanChange,
  filterKelas,
  onKelasChange,
  filterPararel,
  onPararelChange,
  jurusanList,
  kelasList,
  pararelList,
  isFilterActive,
  onReset,
}: StudentFiltersProps) {
  return (
    <div className="mt-5 pb-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama siswa, NIS, atau RFID..."
          className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white transition-all shadow-2xs h-9"
        />
      </div>

      {/* Multi-dropdown Filter Controls */}
      <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5">
        {/* Jurusan Dropdown */}
        <Select
          value={filterJurusan || 'all'}
          onValueChange={(val) => onJurusanChange(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-full sm:w-[150px] h-9 rounded-xl border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50">
            <SelectValue placeholder="Semua Jurusan" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
            <SelectItem value="all" className="text-xs font-medium">Semua Jurusan</SelectItem>
            {jurusanList.map((j) => (
              <SelectItem key={j.id} value={j.nama} className="text-xs font-medium">
                {j.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Kelas Dropdown */}
        <Select
          value={filterKelas || 'all'}
          onValueChange={(val) => onKelasChange(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-full sm:w-[130px] h-9 rounded-xl border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
            <SelectItem value="all" className="text-xs font-medium">Semua Kelas</SelectItem>
            {kelasList.map((k) => (
              <SelectItem key={k.id} value={k.nama} className="text-xs font-medium">
                Kelas {k.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Pararel Dropdown */}
        <Select
          value={filterPararel || 'all'}
          onValueChange={(val) => onPararelChange(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-full sm:w-[130px] h-9 rounded-xl border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50">
            <SelectValue placeholder="Semua Rombel" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
            <SelectItem value="all" className="text-xs font-medium">Semua Rombel</SelectItem>
            {pararelList.map((p) => (
              <SelectItem key={p.id} value={p.nama} className="text-xs font-medium">
                Rombel {p.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Filter Button */}
        {isFilterActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border-none text-xs font-medium cursor-pointer shadow-none"
            title="Reset Filter"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
