'use client';

// Modal component displaying vocational department details and registered students counter
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
import { JurusanRowData } from '../types/master-jurusan';
import JurusanBadge from '@/components/shared/JurusanBadge';
import { GraduationCap, Users, Hash } from 'lucide-react';

interface JurusanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: JurusanRowData | null;
  onEdit?: (item: JurusanRowData) => void;
}

export function JurusanDetailModal({
  isOpen,
  onClose,
  item,
  onEdit,
}: JurusanDetailModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Detail Konsentrasi Keahlian
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Informasi program kejuruan terdaftar di SMKN 1 Jenangan
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nama Program</p>
              <p className="text-sm font-bold text-slate-900">{item.nama}</p>
            </div>
            <JurusanBadge jurusan={item.nama} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Hash className="w-3.5 h-3.5" />
                <span>ID Program</span>
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
              Edit Jurusan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
