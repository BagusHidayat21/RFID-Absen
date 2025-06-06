// Modal component displaying class level details and student count
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { KelasRowData } from '../types/master-kelas';
import { School, Users, Hash } from 'lucide-react';

interface KelasDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: KelasRowData | null;
  onEdit?: (item: KelasRowData) => void;
}

export function KelasDetailModal({
  isOpen,
  onClose,
  item,
  onEdit,
}: KelasDetailModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <School className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Detail Tingkat Kelas
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Informasi jenjang pendidikan terdaftar di sekolah
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Jenjang Kelas</p>
              <p className="text-sm font-bold text-slate-900">Kelas {item.nama}</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700">
              Tingkat {item.nama}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Hash className="w-3.5 h-3.5" />
                <span>ID Tingkat</span>
              </div>
              <p className="text-xs font-bold font-mono text-slate-800">#{item.id}</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Total Siswa</span>
              </div>
              <p className="text-xs font-bold text-slate-800">{item.studentCount} Siswa</p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-slate-100 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Tutup
          </Button>
          {onEdit && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              Edit Tingkat
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
