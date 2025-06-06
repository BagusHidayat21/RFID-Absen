// Master Kelas feature root component coordinating Dual Data Tables and in-page Modal CRUD
'use client';

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { School, Layers, Plus, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useMasterKelas } from '../hooks/use-master-kelas';
import { getKelasColumns } from './kelas-columns';
import { getPararelColumns } from './pararel-columns';
import { KelasModal } from './kelas-modal';
import { KelasDetailModal } from './kelas-detail-modal';
import { PararelModal } from './pararel-modal';
import { PararelDetailModal } from './pararel-detail-modal';

export function MasterKelasPage() {
  const {
    kelasTableData,
    pararelTableData,
    loading,
    error,
    isSaving,
    kelasModal,
    pararelModal,
    openAddKelas,
    openEditKelas,
    openDetailKelas,
    closeKelasModal,
    handleSaveKelas,
    handleDeleteKelas,
    openAddPararel,
    openEditPararel,
    openDetailPararel,
    closePararelModal,
    handleSavePararel,
    handleDeletePararel,
    refreshData,
    ConfirmDialog,
  } = useMasterKelas();

  // Kelas table state
  const [kelasSorting, setKelasSorting] = useState<SortingState>([]);
  const [kelasPagination, setKelasPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Pararel table state
  const [pararelSorting, setPararelSorting] = useState<SortingState>([]);
  const [pararelPagination, setPararelPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const kelasColumns = useMemo(
    () =>
      getKelasColumns({
        onDetail: openDetailKelas,
        onEdit: openEditKelas,
        onDelete: handleDeleteKelas,
      }),
    [openDetailKelas, openEditKelas, handleDeleteKelas]
  );

  const pararelColumns = useMemo(
    () =>
      getPararelColumns({
        onDetail: openDetailPararel,
        onEdit: openEditPararel,
        onDelete: handleDeletePararel,
      }),
    [openDetailPararel, openEditPararel, handleDeletePararel]
  );

  const kelasTable = useReactTable({
    data: kelasTableData,
    columns: kelasColumns,
    state: {
      sorting: kelasSorting,
      pagination: kelasPagination,
    },
    onSortingChange: setKelasSorting,
    onPaginationChange: setKelasPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const pararelTable = useReactTable({
    data: pararelTableData,
    columns: pararelColumns,
    state: {
      sorting: pararelSorting,
      pagination: pararelPagination,
    },
    onSortingChange: setPararelSorting,
    onPaginationChange: setPararelPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Master Data Tingkat Kelas &amp; Rombel
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola jenjang tingkat kelas (X, XI, XII) dan rombongan belajar pararel (1, 2, 3, dst)
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          className="h-9 px-3 rounded-xl border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors self-start sm:self-auto"
          title="Muat Ulang Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Tingkat Kelas */}
        <Card className="p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                <School className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Jenjang Tingkat Kelas</h3>
                <p className="text-[11px] text-slate-400">Total {kelasTableData.length} tingkat terdaftar</p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={openAddKelas}
              className="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Tambah Tingkat</span>
            </Button>
          </div>

          <div className="mt-2">
            <DataTable
              table={kelasTable}
              columns={kelasColumns}
              loading={loading}
              error={error}
              onRetry={refreshData}
              emptyTitle="Tidak ada tingkat kelas."
              emptyDescription="Belum ada tingkat kelas yang terdaftar."
              pageSizeOptions={[5, 10, 20, 50]}
            />
          </div>
        </Card>

        {/* Section 2: Rombel Pararel */}
        <Card className="p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Rombongan Belajar (Pararel)</h3>
                <p className="text-[11px] text-slate-400">Total {pararelTableData.length} rombel terdaftar</p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={openAddPararel}
              className="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Tambah Pararel</span>
            </Button>
          </div>

          <div className="mt-2">
            <DataTable
              table={pararelTable}
              columns={pararelColumns}
              loading={loading}
              error={error}
              onRetry={refreshData}
              emptyTitle="Tidak ada rombel pararel."
              emptyDescription="Belum ada rombel pararel yang terdaftar."
              pageSizeOptions={[5, 10, 20, 50]}
            />
          </div>
        </Card>
      </div>

      {/* Modals for Tingkat Kelas */}
      <KelasModal
        isOpen={kelasModal?.type === 'create' || kelasModal?.type === 'edit'}
        onClose={closeKelasModal}
        mode={kelasModal?.type === 'edit' ? 'edit' : 'create'}
        item={kelasModal?.type === 'edit' ? kelasModal.item : null}
        onSave={handleSaveKelas}
        isSaving={isSaving}
      />

      <KelasDetailModal
        isOpen={kelasModal?.type === 'detail'}
        onClose={closeKelasModal}
        item={kelasModal?.type === 'detail' ? kelasModal.item : null}
        onEdit={(item) => openEditKelas(item)}
      />

      {/* Modals for Rombel Pararel */}
      <PararelModal
        isOpen={pararelModal?.type === 'create' || pararelModal?.type === 'edit'}
        onClose={closePararelModal}
        mode={pararelModal?.type === 'edit' ? 'edit' : 'create'}
        item={pararelModal?.type === 'edit' ? pararelModal.item : null}
        onSave={handleSavePararel}
        isSaving={isSaving}
      />

      <PararelDetailModal
        isOpen={pararelModal?.type === 'detail'}
        onClose={closePararelModal}
        item={pararelModal?.type === 'detail' ? pararelModal.item : null}
        onEdit={(item) => openEditPararel(item)}
      />

      <ConfirmDialog />
    </div>
  );
}
