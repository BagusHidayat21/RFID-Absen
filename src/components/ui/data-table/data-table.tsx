'use client';

// Generic shadcn/ui Data Table component with top page size selection and bottom pagination
import React from 'react';
import {
  ColumnDef,
  flexRender,
  Table as TanstackTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTablePagination } from './data-table-pagination';
import { AlertCircle, Loader2, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData, any>[];
  totalRows?: number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  searchEmptyTitle?: string;
  searchEmptyDescription?: string;
  onResetFilters?: () => void;
  showPagination?: boolean;
  showPageSizeTop?: boolean;
  pageSizeOptions?: number[];
}

export function DataTable<TData>({
  table,
  columns,
  totalRows,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'Tidak ada data ditemukan.',
  emptyDescription = 'Belum ada data yang tersimpan pada sistem saat ini.',
  searchEmptyTitle = 'Data yang sesuai dengan pencarian tidak ditemukan.',
  searchEmptyDescription = 'Coba ubah kata kunci pencarian atau sesuaikan filter yang sedang aktif.',
  onResetFilters,
  showPagination = true,
  showPageSizeTop = true,
  pageSizeOptions = [10, 20, 50, 100],
}: DataTableProps<TData>) {
  const isFiltering =
    Boolean(table.getState().globalFilter) ||
    table.getState().columnFilters.length > 0;

  const rowCount = totalRows !== undefined ? totalRows : table.getFilteredRowModel().rows.length;
  const currentPageSize = table.getState().pagination.pageSize;

  return (
    <div className="space-y-3">
      {/* Top Controls Toolbar: Pilihan Tampil Data & Filter Count */}
      {showPageSizeTop && !loading && !error && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1 pb-1">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="text-slate-500">Tampilkan</span>
            <Select
              value={`${currentPageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[76px] rounded-lg border-slate-200/90 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50">
                <SelectValue placeholder={currentPageSize} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`} className="text-xs font-medium">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-slate-500">data per halaman</span>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Total <strong className="text-slate-700 font-semibold">{rowCount}</strong> data ditemukan
          </div>
        </div>
      )}

      {/* Main Table View */}
      <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-slate-100">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="py-3 px-3.5 text-xs font-semibold text-slate-400">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className="divide-y divide-slate-50">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-44 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-xs font-medium text-slate-600">Memuat data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-44 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-500 py-6">
                      <AlertCircle className="h-6 w-6 text-rose-500" />
                      <p className="text-xs font-semibold text-slate-800">Gagal memuat data.</p>
                      <p className="text-[11px] text-slate-400 max-w-sm">{error}</p>
                      {onRetry && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onRetry}
                          className="mt-2 h-8 px-3 rounded-lg border-slate-200 text-xs font-medium text-slate-700"
                        >
                          Coba Lagi
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-3.5 text-xs align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-44 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        {isFiltering ? <SearchX className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        {isFiltering ? searchEmptyTitle : emptyTitle}
                      </p>
                      <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                        {isFiltering ? searchEmptyDescription : emptyDescription}
                      </p>
                      {isFiltering && onResetFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onResetFilters}
                          className="mt-2 h-8 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border-slate-200 text-xs font-medium text-slate-700"
                        >
                          Reset Filter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Integrated Single Source of Truth Bottom Pagination */}
        {showPagination && !loading && !error && rowCount > 0 && (
          <DataTablePagination table={table} totalRows={totalRows} />
        )}
      </div>
    </div>
  );
}
