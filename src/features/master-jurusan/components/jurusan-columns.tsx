'use client';

// Column definitions for Master Jurusan table with DropdownMenu actions
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Users, MoreHorizontal, Eye, Edit3, Trash2 } from 'lucide-react';
import { JurusanRowData } from '../types/master-jurusan';
import { JurusanItem } from '@/lib/api';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import JurusanBadge from '@/components/shared/JurusanBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GetJurusanColumnsProps {
  onDetail: (item: JurusanRowData) => void;
  onEdit: (item: JurusanItem) => void;
  onDelete: (item: JurusanRowData) => void;
}

export function getJurusanColumns({
  onDetail,
  onEdit,
  onDelete,
}: GetJurusanColumnsProps): ColumnDef<JurusanRowData>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-slate-400">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'kode',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="KODE" />
      ),
      cell: ({ row }) => <JurusanBadge jurusan={row.original.nama} />,
      sortingFn: (rowA, rowB) => rowA.original.nama.localeCompare(rowB.original.nama),
    },
    {
      accessorKey: 'nama',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="NAMA KONSENTRASI KEAHLIAN" />
      ),
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">{row.original.nama}</span>
      ),
    },
    {
      accessorKey: 'studentCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="TOTAL SISWA" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.original.studentCount} Siswa</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pr-2">
          AKSI
        </div>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="text-right pr-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="sr-only">Buka menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 rounded-xl border-slate-200 shadow-lg p-1.5">
                <DropdownMenuItem
                  onClick={() => onDetail(item)}
                  className="text-xs font-medium text-slate-700 rounded-lg cursor-pointer py-2 focus:bg-slate-50"
                >
                  <Eye className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  <span>Detail</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEdit(item)}
                  className="text-xs font-medium text-slate-700 rounded-lg cursor-pointer py-2 focus:bg-slate-50"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <DropdownMenuItem
                  onClick={() => onDelete(item)}
                  className="text-xs font-medium text-rose-600 rounded-lg cursor-pointer py-2 focus:bg-rose-50 focus:text-rose-700"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2 text-rose-500" />
                  <span>Hapus</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
