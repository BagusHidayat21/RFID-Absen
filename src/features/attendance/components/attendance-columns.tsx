'use client';

// Column definitions for attendance directory table with modal-based detail inspection
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Users, Eye, MoreHorizontal, Printer } from 'lucide-react';
import { RombelClassItem } from '../types/attendance';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import JurusanBadge from '@/components/shared/JurusanBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GetAttendanceColumnsProps {
  onDetail: (item: RombelClassItem) => void;
}

export function getAttendanceColumns({
  onDetail,
}: GetAttendanceColumnsProps): ColumnDef<RombelClassItem>[] {
  return [
    {
      accessorKey: 'namaKelas',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="NAMA KELAS" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
              {item.tingkat}
            </div>
            <div>
              <span className="font-semibold text-slate-900 block leading-tight">
                {item.namaKelas}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Pararel {item.pararel}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'jurusan',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="JURUSAN" />
      ),
      cell: ({ row }) => <JurusanBadge jurusan={row.original.jurusan} />,
    },
    {
      accessorKey: 'tingkat',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="TINGKAT" />
      ),
      cell: ({ row }) => (
        <span className="text-slate-600 font-medium">
          Kelas {row.original.tingkat}
        </span>
      ),
    },
    {
      accessorKey: 'waliKelas',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="WALI KELAS" className="hidden lg:flex" />
      ),
      cell: ({ row }) => (
        <span className="text-slate-400 hidden lg:table-cell font-normal">
          {row.original.waliKelas}
        </span>
      ),
    },
    {
      accessorKey: 'jumlahSiswa',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="JUMLAH SISWA" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.original.jumlahSiswa} Siswa</span>
        </div>
      ),
    },
    {
      accessorKey: 'statusPresensi',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="STATUS PRESENSI" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        if (item.statusPresensi === 'live') {
          return (
            <StatusBadge
              status="live"
              label="Live"
              sublabel={`${item.hadirCount}/${item.jumlahSiswa} Hadir`}
            />
          );
        }
        if (item.statusPresensi === 'selesai') {
          return (
            <StatusBadge
              status="selesai"
              label="Selesai"
              sublabel={`${item.hadirCount}/${item.jumlahSiswa}`}
            />
          );
        }
        return <StatusBadge status="belum" label="Belum Presensi" />;
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
        const item = row.original;
        return (
          <div className="flex items-center justify-end gap-1 pr-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDetail(item)}
              className="h-8 px-3 rounded-lg border-slate-200/80 bg-white hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-600 shadow-2xs transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              <span>Detail</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="sr-only">Menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 rounded-xl border-slate-200 shadow-lg p-1.5">
                <DropdownMenuItem
                  onClick={() => onDetail(item)}
                  className="text-xs font-medium text-slate-700 rounded-lg cursor-pointer py-2 focus:bg-slate-50"
                >
                  <Eye className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  <span>Lihat Rombel</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.print()}
                  className="text-xs font-medium text-slate-700 rounded-lg cursor-pointer py-2 focus:bg-slate-50"
                >
                  <Printer className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  <span>Cetak Rekap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
