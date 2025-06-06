'use client';

// Reusable modal dialog for creating and editing student records with RFID scanner integration
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JurusanItem, KelasItem, PararelItem } from '@/lib/api';
import { Student } from '../types/student';
import { saveStudent, pollLatestRfidUID } from '../services/student-service';
import { Radio, Save, Loader2 } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  mode: 'create' | 'edit';
  jurusanList: JurusanItem[];
  kelasList: KelasItem[];
  pararelList: PararelItem[];
  onSuccess: () => Promise<void>;
}

export function StudentFormModal({
  isOpen,
  onClose,
  student,
  mode,
  jurusanList,
  kelasList,
  pararelList,
  onSuccess,
}: StudentFormModalProps) {
  const [formNama, setFormNama] = useState('');
  const [formNis, setFormNis] = useState('');
  const [formJurusanId, setFormJurusanId] = useState<number>(1);
  const [formKelasId, setFormKelasId] = useState<number>(1);
  const [formPararelId, setFormPararelId] = useState<number>(1);
  const [formRfidUid, setFormRfidUid] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isDetectingRfid, setIsDetectingRfid] = useState(false);

  useEffect(() => {
    if (student && mode === 'edit') {
      setFormNama(student.nama);
      setFormNis(student.nis);
      setFormRfidUid(student.rfid || '');

      const matchJ = jurusanList.find(
        (j) => j.nama.toLowerCase() === student.jurusan.toLowerCase()
      );
      const matchK = kelasList.find(
        (k) => k.nama.toLowerCase() === student.kelas.toLowerCase()
      );
      const matchP = pararelList.find(
        (p) => p.nama.toLowerCase() === student.pararel.toLowerCase()
      );

      setFormJurusanId(matchJ?.id || jurusanList[0]?.id || 1);
      setFormKelasId(matchK?.id || kelasList[0]?.id || 1);
      setFormPararelId(matchP?.id || pararelList[0]?.id || 1);
    } else {
      setFormNama('');
      setFormNis('');
      setFormRfidUid('');
      setFormJurusanId(jurusanList[0]?.id || 1);
      setFormKelasId(kelasList[0]?.id || 1);
      setFormPararelId(pararelList[0]?.id || 1);
    }
  }, [student, mode, jurusanList, kelasList, pararelList, isOpen]);

  const handleDetectRfid = async () => {
    try {
      setIsDetectingRfid(true);
      const uid = await pollLatestRfidUID();
      if (uid) {
        setFormRfidUid(uid);
        toast.success(`Kartu Terdeteksi: ${uid}`);
      } else {
        toast.info('Belum ada kartu RFID yang terbaca oleh scanner.');
      }
    } catch (err) {
      console.error('Error detecting RFID:', err);
      toast.error('Gagal membaca data dari scanner RFID.');
    } finally {
      setIsDetectingRfid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formNis.trim()) {
      toast.warning('Nama Siswa dan NIS wajib diisi.');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        nama: formNama,
        nis: formNis,
        rfid_uid: formRfidUid,
        jurusan_id: formJurusanId,
        kelas_id: formKelasId,
        pararel_id: formPararelId,
      };

      if (mode === 'edit' && student?.id) {
        await saveStudent(student.id, payload);
        toast.success('Data siswa berhasil diperbarui.');
      } else {
        await saveStudent(null, payload);
        toast.success('Data siswa baru berhasil ditambahkan.');
      }

      await onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving student:', err);
      toast.error(err?.message || 'Terjadi kesalahan saat menyimpan data siswa.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            {mode === 'edit' ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Lengkapi data diri siswa dan tautkan kartu RFID untuk presensi
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nama Siswa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Lengkap
            </label>
            <Input
              type="text"
              required
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
              placeholder="Contoh: Bagus Hidayat"
              className="w-full text-xs h-9"
              autoFocus
            />
          </div>

          {/* NIS */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nomor Induk Siswa (NIS)
            </label>
            <Input
              type="text"
              required
              value={formNis}
              onChange={(e) => setFormNis(e.target.value)}
              placeholder="Contoh: 12345/001.065"
              className="w-full text-xs h-9"
            />
          </div>

          {/* Jurusan Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Konsentrasi Keahlian / Jurusan
            </label>
            <Select
              value={String(formJurusanId)}
              onValueChange={(val) => setFormJurusanId(Number(val))}
            >
              <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 text-xs font-medium text-slate-700">
                <SelectValue placeholder="Pilih Jurusan" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
                {jurusanList.map((j) => (
                  <SelectItem key={j.id} value={String(j.id)} className="text-xs font-medium">
                    {j.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kelas & Pararel */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tingkat Kelas
              </label>
              <Select
                value={String(formKelasId)}
                onValueChange={(val) => setFormKelasId(Number(val))}
              >
                <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 text-xs font-medium text-slate-700">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
                  {kelasList.map((k) => (
                    <SelectItem key={k.id} value={String(k.id)} className="text-xs font-medium">
                      Kelas {k.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rombel Pararel
              </label>
              <Select
                value={String(formPararelId)}
                onValueChange={(val) => setFormPararelId(Number(val))}
              >
                <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 text-xs font-medium text-slate-700">
                  <SelectValue placeholder="Pilih Rombel" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
                  {pararelList.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)} className="text-xs font-medium">
                      Rombel {p.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* RFID UID Input & Scanner Trigger */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              RFID UID Kartu
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={formRfidUid}
                onChange={(e) => setFormRfidUid(e.target.value)}
                placeholder="Scan kartu atau masukkan UID manual"
                className="flex-1 font-mono text-xs h-9"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDetectRfid}
                disabled={isDetectingRfid}
                className="h-9 px-3 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                title="Deteksi Kartu dari Scanner RFID"
              >
                <Radio className={`w-3.5 h-3.5 mr-1 ${isDetectingRfid ? 'animate-pulse text-blue-600' : 'text-slate-500'}`} />
                <span>{isDetectingRfid ? 'Scanning...' : 'Scan'}</span>
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
              className="h-9 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving}
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1" />
                  <span>{mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Siswa'}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
