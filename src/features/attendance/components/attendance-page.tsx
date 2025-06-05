'use client';

// Main feature page for attendance management orchestrating KPI cards, directory table, and in-modal detail inspection
import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import { useAttendance } from '../hooks/use-attendance';
import { AttendanceKPICards } from './attendance-kpi-cards';
import { AttendanceFilters } from './attendance-filters';
import { AttendanceTable } from './attendance-table';
import { AttendanceDetailModal } from './attendance-detail-modal';

export function AttendancePage() {
  const {
    loading,
    error,
    classes,
    kpiStats,
    searchQuery,
    setSearchQuery,
    selectedJurusan,
    setSelectedJurusan,
    selectedTingkat,
    setSelectedTingkat,
    resetFilters,
    isFilterActive,
    selectedClassDetail,
    openDetailModal,
    closeDetailModal,
    refreshData,
  } = useAttendance();

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-10">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Presensi Siswa' }]} />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Presensi Siswa - Semua Kelas</h1>
          <p className="text-xs text-slate-400 mt-1">
            Pantau status kehadiran dan rekapitulasi presensi seluruh rombongan belajar secara terpadu
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="h-9 px-3 rounded-xl border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-medium text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>09 Sep 2026</span>
          </div>

          <Button
            size="sm"
            onClick={() => window.print()}
            className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-white" />
            <span>Export Rekap</span>
          </Button>
        </div>
      </div>

      {/* Top Summary KPI Metric Cards */}
      <AttendanceKPICards stats={kpiStats} loading={loading} />

      {/* Main Unified Attendance Directory Card */}
      <Card className="p-6 shadow-2xs">
        {/* Table Header with Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Daftar Rekapitulasi Presensi Seluruh Kelas</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pilih rombel kelas untuk melihat rekapitulasi kehadiran mendalam atau gunakan filter di bawah
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <AttendanceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedJurusan={selectedJurusan}
          onJurusanChange={setSelectedJurusan}
          selectedTingkat={selectedTingkat}
          onTingkatChange={setSelectedTingkat}
          isFilterActive={isFilterActive}
          onReset={resetFilters}
        />

        {/* Standardized TanStack Data Table */}
        <AttendanceTable
          classes={classes}
          loading={loading}
          error={error}
          onRetry={refreshData}
          searchQuery={searchQuery}
          selectedJurusan={selectedJurusan}
          selectedTingkat={selectedTingkat}
          onDetail={openDetailModal}
          onResetFilters={resetFilters}
        />
      </Card>

      {/* Class Student Roster Attendance Detail Modal */}
      <AttendanceDetailModal
        isOpen={Boolean(selectedClassDetail)}
        onClose={closeDetailModal}
        classItem={selectedClassDetail}
        onDataUpdated={refreshData}
      />
    </div>
  );
}

export default AttendancePage;
