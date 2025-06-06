'use client';

// Standardized Master Jurusan Data Table utilizing TanStack Table and DataTable primitives
import React, { useMemo, useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  FilterFn,
} from '@tanstack/react-table';
import { JurusanRowData } from '../types/master-jurusan';
import { JurusanItem } from '@/lib/api';
import { DataTable } from '@/components/ui/data-table';
import { getJurusanColumns } from './jurusan-columns';

interface JurusanTableProps {
  data: JurusanRowData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  searchQuery: string;
  onDetail: (item: JurusanRowData) => void;
  onEdit: (item: JurusanItem) => void;
  onDelete: (item: JurusanRowData) => void;
  onResetFilters?: () => void;
}

export function JurusanTable({
  data,
  loading = false,
  error = null,
  onRetry,
  searchQuery,
  onDetail,
  onEdit,
  onDelete,
  onResetFilters,
}: JurusanTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => getJurusanColumns({ onDetail, onEdit, onDelete }),
    [onDetail, onEdit, onDelete]
  );

  const globalFilterFn: FilterFn<JurusanRowData> = (row, columnId, filterValue) => {
    if (!filterValue) return true;
    const search = String(filterValue).toLowerCase().trim();
    const id = String(row.original.id);
    const nama = row.original.nama.toLowerCase();
    return id.includes(search) || nama.includes(search);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: searchQuery,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    table.setPageIndex(0);
  }, [searchQuery, table]);

  return (
    <div className="mt-2">
      <DataTable
        table={table}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={onRetry}
        onResetFilters={onResetFilters}
        emptyTitle="Tidak ada jurusan ditemukan."
        emptyDescription="Belum ada data konsentrasi keahlian yang tersimpan."
        searchEmptyTitle="Jurusan tidak ditemukan."
        searchEmptyDescription="Coba ubah kata kunci pencarian Anda."
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </div>
  );
}
