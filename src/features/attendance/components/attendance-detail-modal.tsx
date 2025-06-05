'use client';

// Modal component displaying class attendance roster with inline status correction without navigating away
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RombelClassItem, ClassStudentAttendance, AttendanceRecordStatus } from '../types/attendance';
import {
  fetchClassRosterAttendance,
  updateStudentAttendanceRecord,
} from '../services/attendance-service';
import JurusanBadge from '@/components/shared/JurusanBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import { Users, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AttendanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: RombelClassItem | null;
  onDataUpdated: () => Promise<void>;
}

export function AttendanceDetailModal({
  isOpen,
  onClose,
  classItem,
  onDataUpdated,
}: AttendanceDetailModalProps) {
  const [roster, setRoster] = useState<ClassStudentAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (!classItem || !isOpen) return;

    let mounted = true;
    async function loadRoster() {
      try {
        setLoading(true);
        if (!classItem) return;
        const data = await fetchClassRosterAttendance(
          classItem.jurusan,
          classItem.tingkat,
          classItem.pararel
        );
        if (mounted) {
          setRoster(data);
        }
      } catch (err) {
        console.error('Failed to load class attendance roster:', err);
        toast.error('Gagal memuat data presensi siswa kelas ini.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadRoster();

    return () => {
      mounted = false;
    };
  }, [classItem, isOpen]);

  const handleStatusChange = async (
    item: ClassStudentAttendance,
    newStatus: AttendanceRecordStatus
  ) => {
    try {
      setUpdatingId(item.siswaId);
      await updateStudentAttendanceRecord(item.id, item.siswaId, newStatus);
      toast.success(`Status ${item.nama} diubah menjadi ${newStatus}`);

      // Update local roster immediately
      setRoster((prev) =>
        prev.map((s) => (s.siswaId === item.siswaId ? { ...s, status: newStatus } : s))
      );

      // Revalidate parent attendance directory
      await onDataUpdated();
    } catch (err: any) {
      console.error('Error updating student attendance:', err);
      toast.error(err?.message || 'Gagal memperbarui status presensi.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!classItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <JurusanBadge jurusan={classItem.jurusan} />
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600">Kelas {classItem.tingkat}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-mono text-slate-500">Rombel {classItem.pararel}</span>
                </div>
                <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
                  Rekap Presensi: {classItem.namaKelas}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400">
                  Wali Kelas: {classItem.waliKelas} • Total {classItem.jumlahSiswa} siswa terdaftar
                </DialogDescription>
              </div>

              {/* Status Pill */}
              <div className="self-start sm:self-auto">
                <StatusBadge
                  status={classItem.statusPresensi}
                  label={classItem.statusPresensi === 'live' ? 'Live' : classItem.statusPresensi === 'selesai' ? 'Selesai' : 'Belum Sesi'}
                  sublabel={`${classItem.hadirCount}/${classItem.jumlahSiswa} Hadir`}
                />
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Roster Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs font-medium text-slate-600">Memuat daftar siswa...</span>
            </div>
          ) : roster.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada siswa yang terdaftar pada rombel ini.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-100 overflow-hidden shadow-2xs">
              <table className="min-w-full divide-y divide-slate-100 text-xs text-left">
                <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3.5">NIS</th>
                    <th className="py-2.5 px-3.5">Nama Siswa</th>
                    <th className="py-2.5 px-3.5">Waktu Scan</th>
                    <th className="py-2.5 px-3.5">Status Presensi</th>
                    <th className="py-2.5 px-3.5 text-right">Koreksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {roster.map((student) => (
                    <tr key={student.siswaId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3.5 font-mono text-slate-500">{student.nis}</td>
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900">{student.nama}</td>
                      <td className="py-2.5 px-3.5 text-slate-500 font-mono">
                        {student.jam ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{student.jam}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5">
                        <StatusBadge status={student.status} label={student.status} />
                      </td>
                      <td className="py-2.5 px-3.5 text-right">
                        <div className="inline-flex items-center justify-end">
                          <Select
                            value={student.status}
                            onValueChange={(val) =>
                              handleStatusChange(student, val as AttendanceRecordStatus)
                            }
                            disabled={updatingId === student.siswaId}
                          >
                            <SelectTrigger className="h-7 w-[105px] rounded-lg text-[11px] font-semibold border-slate-200 bg-white shadow-2xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
                              <SelectItem value="Hadir" className="text-xs font-medium">Hadir</SelectItem>
                              <SelectItem value="Terlambat" className="text-xs font-medium">Terlambat</SelectItem>
                              <SelectItem value="Izin" className="text-xs font-medium">Izin</SelectItem>
                              <SelectItem value="Sakit" className="text-xs font-medium">Sakit</SelectItem>
                              <SelectItem value="Alpha" className="text-xs font-medium">Alpha</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Koreksi status akan langsung tersinkronisasi ke database
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
