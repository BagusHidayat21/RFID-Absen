'use client';

// Standard shadcn/ui Data Table pagination toolbar showing data range and page navigation controls
import React from 'react';
import { Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalRows?: number;
}

export function DataTablePagination<TData>({
  table,
  totalRows,
}: DataTablePaginationProps<TData>) {
  const rowCount = totalRows !== undefined ? totalRows : table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalPages = table.getPageCount();

  const startRow = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3.5 py-3 border-t border-slate-100 bg-slate-50/50">
      {/* Range Info */}
      <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
        {rowCount === 0 ? (
          <span>Tidak ada data</span>
        ) : (
          <span>
            Menampilkan <strong className="font-semibold text-slate-800">{startRow}–{endRow}</strong> dari{' '}
            <strong className="font-semibold text-slate-800">{rowCount}</strong> data
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Page Counter */}
        <div className="text-xs font-medium text-slate-600">
          Halaman <span className="font-semibold text-slate-800">{totalPages === 0 ? 0 : pageIndex + 1}</span> dari{' '}
          <span className="font-semibold text-slate-800">{totalPages}</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 sm:flex rounded-lg border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title="Halaman Pertama"
          >
            <span className="sr-only">Ke halaman pertama</span>
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Halaman Sebelumnya"
          >
            <span className="sr-only">Ke halaman sebelumnya</span>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Halaman Berikutnya"
          >
            <span className="sr-only">Ke halaman berikutnya</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 sm:flex rounded-lg border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
            title="Halaman Terakhir"
          >
            <span className="sr-only">Ke halaman terakhir</span>
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
