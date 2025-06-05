'use client';

// Standardized Attendance Directory Data Table utilizing TanStack Table and DataTable primitives
import React, { useMemo, useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  FilterFn,
} from '@tanstack/react-table';
import { RombelClassItem } from '../types/attendance';
import { DataTable } from '@/components/ui/data-table';
import { getAttendanceColumns } from './attendance-columns';

interface AttendanceTableProps {
  classes: RombelClassItem[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  searchQuery: string;
  selectedJurusan: string;
  selectedTingkat: string;
  onDetail: (item: RombelClassItem) => void;
  onResetFilters?: () => void;
}

export function AttendanceTable({
  classes,
  loading = false,
  error = null,
  onRetry,
  searchQuery,
  selectedJurusan,
  selectedTingkat,
  onDetail,
  onResetFilters,
}: AttendanceTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const columns = useMemo(
    () => getAttendanceColumns({ onDetail }),
    [onDetail]
  );

  const globalFilterFn: FilterFn<RombelClassItem> = (row, columnId, filterValue) => {
    if (!filterValue) return true;
    const search = String(filterValue).toLowerCase().trim();
    const namaKelas = row.original.namaKelas.toLowerCase();
    const jurusan = row.original.jurusan.toLowerCase();
    const waliKelas = (row.original.waliKelas || '').toLowerCase();
    return namaKelas.includes(search) || jurusan.includes(search) || waliKelas.includes(search);
  };

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (selectedJurusan && selectedJurusan !== 'ALL') {
      filters.push({ id: 'jurusan', value: selectedJurusan });
    }
    if (selectedTingkat && selectedTingkat !== 'ALL') {
      filters.push({ id: 'tingkat', value: selectedTingkat });
    }
    return filters;
  }, [selectedJurusan, selectedTingkat]);

  const table = useReactTable({
    data: classes,
    columns,
    state: {
      sorting,
      columnFilters,
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
  }, [searchQuery, selectedJurusan, selectedTingkat, table]);

  return (
    <div className="mt-2">
      <DataTable
        table={table}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={onRetry}
        onResetFilters={onResetFilters}
        emptyTitle="Tidak ada rombel kelas ditemukan."
        emptyDescription="Belum ada rombongan belajar yang terdaftar di sistem."
        searchEmptyTitle="Data rombel yang sesuai dengan pencarian tidak ditemukan."
        searchEmptyDescription="Coba ubah kata kunci pencarian atau sesuaikan filter jurusan dan tingkat kelas."
        pageSizeOptions={[10, 15, 30, 50, 100]}
      />
    </div>
  );
}
