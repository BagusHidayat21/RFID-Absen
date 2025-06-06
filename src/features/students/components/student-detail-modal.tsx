'use client';

// Modal component displaying complete student details without navigating away from directory
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
import { Student } from '../types/student';
import JurusanBadge from '@/components/shared/JurusanBadge';
import { User, Tag, School, BookOpen, Hash, CheckCircle2 } from 'lucide-react';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit?: (student: Student) => void;
}

export function StudentDetailModal({
  isOpen,
  onClose,
  student,
  onEdit,
}: StudentDetailModalProps) {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Detail Profil Siswa
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Informasi data akademik dan identitas kartu RFID
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 py-2">
          {/* Nama Siswa */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nama Lengkap</p>
              <p className="text-sm font-bold text-slate-900">{student.nama}</p>
            </div>
            <JurusanBadge jurusan={student.jurusan} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* NIS */}
            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Hash className="w-3.5 h-3.5" />
                <span>NIS</span>
              </div>
              <p className="text-xs font-bold font-mono text-slate-800">{student.nis}</p>
            </div>

            {/* Kelas & Rombel */}
            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <School className="w-3.5 h-3.5" />
                <span>Kelas</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                {student.kelas ? student.kelas.toUpperCase().replace('KELAS', '').trim() : ''} {student.jurusan} {student.pararel}
              </p>
            </div>
          </div>

          {/* RFID Card Details */}
          <div className="p-3.5 rounded-xl border border-slate-100 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Tag className="w-3.5 h-3.5" />
                <span>Kartu RFID</span>
              </div>
              {student.rfid ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Terhubung
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-400">Belum dipetakan</span>
              )}
            </div>

            <p className="text-xs font-mono font-semibold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
              {student.rfid || 'Tidak ada UID terdaftar'}
            </p>
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
                onEdit(student);
              }}
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              Edit Siswa
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
