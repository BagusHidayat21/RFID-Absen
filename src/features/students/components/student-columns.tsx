'use client';

// Column definitions for students table featuring shadcn DropdownMenu row actions
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit3, Trash2, Tag, ShieldCheck } from 'lucide-react';
import { Student } from '../types/student';
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

interface GetStudentColumnsProps {
  onDetail: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function getStudentColumns({
  onDetail,
  onEdit,
  onDelete,
}: GetStudentColumnsProps): ColumnDef<Student>[] {
  return [
    {
      accessorKey: 'nis',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="NIS" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-slate-500 font-medium">
          {row.original.nis}
        </span>
      ),
    },
    {
      accessorKey: 'nama',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="NAMA SISWA" />
      ),
      cell: ({ row }) => (
        <div className="font-semibold text-slate-900 leading-tight">
          {row.original.nama}
        </div>
      ),
    },
    {
      accessorKey: 'jurusan',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="JURUSAN" />
      ),
      cell: ({ row }) => (
        <JurusanBadge jurusan={row.original.jurusan} />
      ),
      filterFn: (row, id, value) => {
        if (!value || value === 'all') return true;
        return row.original.jurusan.toLowerCase() === String(value).toLowerCase();
      },
    },
    {
      accessorKey: 'kelas',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="KELAS" />
      ),
      cell: ({ row }) => {
        const tingkat = row.original.kelas ? row.original.kelas.toUpperCase().replace('KELAS', '').trim() : '';
        return (
          <span className="font-semibold text-slate-800">
            {tingkat} {row.original.jurusan} {row.original.pararel}
          </span>
        );
      },
    },
    {
      accessorKey: 'rfid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="RFID UID" />
      ),
      cell: ({ row }) => {
        const uid = row.original.rfid;
        if (!uid) {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
              Belum terhubung
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-50 text-slate-700 border border-slate-200/60 shadow-2xs">
            <Tag className="w-3 h-3 text-slate-400" />
            <span>{uid}</span>
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pr-2">
          AKSI
        </div>
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="text-right pr-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="sr-only">Buka menu aksi</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-200 shadow-lg p-1.5">
                <DropdownMenuItem
                  onClick={() => onDetail(student)}
                  className="text-xs font-medium text-slate-700 rounded-lg cursor-pointer py-2 focus:bg-slate-50"
                >
                  <Eye className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  <span>Detail</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEdit(student)}
                  className="text-xs font-medium text-slate-700 rounded-lg cursor-pointer py-2 focus:bg-slate-50"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <DropdownMenuItem
                  onClick={() => onDelete(student)}
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
