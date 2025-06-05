// Dashboard header toolbar with date range pill, period filter dropdown, widget customization trigger, and export button
'use client';

import React from 'react';
import { Calendar, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardHeaderProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onOpenWidgetModal: () => void;
}

export function DashboardHeader({
  selectedPeriod,
  onPeriodChange,
  onOpenWidgetModal,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Range Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-medium text-slate-700 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>01 Sep 2026 - 09 Sep 2026</span>
        </div>

        {/* Period Dropdown */}
        <Select
          value={selectedPeriod}
          onValueChange={(val) => onPeriodChange(val)}
        >
          <SelectTrigger className="w-[140px] h-9 rounded-xl border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50">
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
            <SelectItem value="today" className="text-xs font-medium">Hari Ini</SelectItem>
            <SelectItem value="7_days" className="text-xs font-medium">7 Hari Terakhir</SelectItem>
            <SelectItem value="30_days" className="text-xs font-medium">30 Hari Terakhir</SelectItem>
            <SelectItem value="semester" className="text-xs font-medium">Semester Ganjil</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Widget Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenWidgetModal}
          className="h-9 px-3.5 rounded-xl border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500 mr-1" />
          <span>Add widget</span>
        </Button>

        {/* Primary Export Button */}
        <Button
          size="sm"
          onClick={() => window.print()}
          className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-white mr-1.5" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
}
