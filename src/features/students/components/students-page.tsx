'use client';

// Main feature page for student directory orchestrating data table, filters, and modal-based CRUD
import React from 'react';
import { Users, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useStudents } from '../hooks/use-students';
import { StudentFilters } from './student-filters';
import { StudentTable } from './student-table';
import { StudentFormModal } from './student-form-modal';
import { StudentDetailModal } from './student-detail-modal';

export function StudentsPage() {
  const {
    students,
    totalRows,
    totalPages,
    pagination,
    setPagination,
    jurusanList,
    kelasList,
    pararelList,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filterJurusan,
    setFilterJurusan,
    filterKelas,
    setFilterKelas,
    filterPararel,
    setFilterPararel,
    isFilterActive,
    resetFilters,
    modalState,
    openCreateModal,
    openEditModal,
    openDetailModal,
    closeModal,
    handleDelete,
    refreshData,
    ConfirmDialog,
  } = useStudents();

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-10">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Siswa</h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola data profil siswa dan pemetaan kartu RFID untuk presensi otomatis
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="h-9 px-3 rounded-xl border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            size="sm"
            onClick={openCreateModal}
            className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Tambah Siswa</span>
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="p-6 shadow-2xs">
        {/* Table Title and Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Siswa Terdaftar</h3>
              <p className="text-[11px] text-slate-400">Total {totalRows} siswa tersimpan di sistem</p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <StudentFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterJurusan={filterJurusan}
          onJurusanChange={setFilterJurusan}
          filterKelas={filterKelas}
          onKelasChange={setFilterKelas}
          filterPararel={filterPararel}
          onPararelChange={setFilterPararel}
          jurusanList={jurusanList}
          kelasList={kelasList}
          pararelList={pararelList}
          isFilterActive={isFilterActive}
          onReset={resetFilters}
        />

        {/* Unified Data Table with Dropdown Actions */}
        <StudentTable
          students={students}
          totalRows={totalRows}
          totalPages={totalPages}
          pagination={pagination}
          onPaginationChange={setPagination}
          loading={loading}
          error={error}
          onRetry={refreshData}
          onDetail={openDetailModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onResetFilters={resetFilters}
        />
      </Card>

      {/* Create & Edit Modal Dialog */}
      <StudentFormModal
        isOpen={modalState?.type === 'create' || modalState?.type === 'edit'}
        onClose={closeModal}
        student={modalState?.type === 'edit' ? modalState.student : null}
        mode={modalState?.type === 'edit' ? 'edit' : 'create'}
        jurusanList={jurusanList}
        kelasList={kelasList}
        pararelList={pararelList}
        onSuccess={refreshData}
      />

      {/* Detail Inspection Modal Dialog */}
      <StudentDetailModal
        isOpen={modalState?.type === 'detail'}
        onClose={closeModal}
        student={modalState?.type === 'detail' ? modalState.student : null}
        onEdit={(student) => openEditModal(student)}
      />

      <ConfirmDialog />
    </div>
  );
}

export default StudentsPage;
