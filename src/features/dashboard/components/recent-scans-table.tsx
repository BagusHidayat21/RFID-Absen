// Recent real-time RFID check-in scans table for operational monitoring
'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { Absensi } from '@/types';
import StatusBadge from '@/components/shared/StatusBadge';

interface RecentScansTableProps {
  scans: Absensi[];
}

export function RecentScansTable({ scans }: RecentScansTableProps) {
  return (
    <Card className="p-6 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Aktivitas Pemindaian RFID Terbaru</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Daftar tap kartu realtime siswa di gerbang SMKN 1 Jenangan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/absen"
            prefetch={true}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Lihat Semua
          </Link>
          <button
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            aria-label="Opsi tabel"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-2">
        <Table className="min-w-full text-xs">
          <TableHeader>
            <TableRow className="border-b border-slate-100 text-left font-semibold">
              <TableHead className="py-3 px-2 text-slate-400 font-semibold text-xs">ID / NIS</TableHead>
              <TableHead className="py-3 px-3 text-slate-400 font-semibold text-xs">NAMA SISWA</TableHead>
              <TableHead className="py-3 px-3 text-slate-400 font-semibold text-xs">KELAS &amp; JURUSAN</TableHead>
              <TableHead className="py-3 px-3 text-slate-400 font-semibold text-xs">WAKTU TAP</TableHead>
              <TableHead className="py-3 px-3 text-right text-slate-400 font-semibold text-xs">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-50">
            {scans.map((scan) => {
              const isLate =
                scan.keterangan?.toLowerCase().includes('terlambat') ||
                (scan.jam && scan.jam > '07:15:00');

              return (
                <TableRow key={scan.id} className="hover:bg-slate-50/60 transition-colors">
                  <TableCell className="py-3 px-2 font-mono text-slate-500 whitespace-nowrap">
                    #{scan.nis || scan.id}
                  </TableCell>
                  <TableCell className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        {scan.nama ? scan.nama.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <span className="font-semibold text-slate-900">{scan.nama}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">
                      {scan.kelas ? scan.kelas.toUpperCase().replace('KELAS', '').trim() : ''} {scan.jurusan} {scan.pararel}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-3 font-mono font-medium text-slate-700 whitespace-nowrap">
                    {scan.jam || '07:00:00'} WIB
                  </TableCell>
                  <TableCell className="py-3 px-3 text-right whitespace-nowrap">
                    {isLate ? (
                      <StatusBadge status="terlambat" label="Terlambat" />
                    ) : (
                      <StatusBadge status="hadir" label="Tepat Waktu" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
