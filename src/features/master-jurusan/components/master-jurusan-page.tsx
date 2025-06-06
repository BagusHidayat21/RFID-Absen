'use client';

// Main feature page for Master Jurusan orchestrating table, search, and modal-based CRUD
import React from 'react';
import { GraduationCap, Plus, Search, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMasterJurusan } from '../hooks/use-master-jurusan';
import { JurusanTable } from './jurusan-table';
import { JurusanModal } from './jurusan-modal';
import { JurusanDetailModal } from './jurusan-detail-modal';

export function MasterJurusanPage() {
  const {
    tableData,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    modalState,
    openCreateModal,
    openEditModal,
    openDetailModal,
    closeModal,
    handleDelete,
    refreshData,
    ConfirmDialog,
  } = useMasterJurusan();

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-10">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Master Data Konsentrasi Keahlian
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola daftar program keahlian / jurusan kejuruan di SMKN 1 Jenangan
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
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
            <span>Tambah Jurusan</span>
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="p-6 shadow-2xs">
        {/* Table Title and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Jurusan Kejuruan</h3>
              <p className="text-[11px] text-slate-400">
                Total {tableData.length} konsentrasi keahlian terdaftar
              </p>
            </div>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama jurusan..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white transition-all shadow-2xs h-9"
            />
          </div>
        </div>

        {/* Standardized TanStack Data Table */}
        <JurusanTable
          data={tableData}
          loading={loading}
          error={error}
          onRetry={refreshData}
          searchQuery={searchQuery}
          onDetail={openDetailModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onResetFilters={() => setSearchQuery('')}
        />
      </Card>

      {/* Add / Edit Dialog */}
      <JurusanModal
        isOpen={modalState?.type === 'create' || modalState?.type === 'edit'}
        onClose={closeModal}
        item={modalState?.type === 'edit' ? modalState.item : null}
        mode={modalState?.type === 'edit' ? 'edit' : 'create'}
        onSuccess={refreshData}
      />

      {/* Detail Dialog */}
      <JurusanDetailModal
        isOpen={modalState?.type === 'detail'}
        onClose={closeModal}
        item={modalState?.type === 'detail' ? modalState.item : null}
        onEdit={(item) => openEditModal(item)}
      />

      <ConfirmDialog />
    </div>
  );
}

export default MasterJurusanPage;
