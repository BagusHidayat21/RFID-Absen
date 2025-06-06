// Standardized Student Data Table utilizing TanStack Table server-side pagination and shadcn primitives
'use client';

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Student } from '../types/student';
import { DataTable } from '@/components/ui/data-table';
import { getStudentColumns } from './student-columns';

interface StudentTableProps {
  students: Student[];
  totalRows: number;
  totalPages: number;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onDetail: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onResetFilters?: () => void;
}

export function StudentTable({
  students,
  totalRows,
  totalPages,
  pagination,
  onPaginationChange,
  loading = false,
  error = null,
  onRetry,
  onDetail,
  onEdit,
  onDelete,
  onResetFilters,
}: StudentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => getStudentColumns({ onDetail, onEdit, onDelete }),
    [onDetail, onEdit, onDelete]
  );

  const table = useReactTable({
    data: students,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange,
    manualPagination: true,
    pageCount: totalPages,
    rowCount: totalRows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-2">
      <DataTable
        table={table}
        columns={columns}
        totalRows={totalRows}
        loading={loading}
        error={error}
        onRetry={onRetry}
        onResetFilters={onResetFilters}
        emptyTitle="Tidak ada data siswa ditemukan."
        emptyDescription="Belum ada data siswa yang tersimpan di sistem."
        searchEmptyTitle="Data yang sesuai dengan pencarian tidak ditemukan."
        searchEmptyDescription="Coba ubah kata kunci pencarian atau sesuaikan filter jurusan, kelas, dan rombel."
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </div>
  );
}
