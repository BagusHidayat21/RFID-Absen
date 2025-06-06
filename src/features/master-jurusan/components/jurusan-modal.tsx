'use client';

// Modal dialog for adding and editing vocational department master data
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
import { JurusanItem } from '@/lib/api';
import { saveJurusanRecord } from '../services/master-jurusan-service';
import { Save, Loader2 } from 'lucide-react';

interface JurusanModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: JurusanItem | null;
  mode: 'create' | 'edit';
  onSuccess: () => Promise<void>;
}

export function JurusanModal({
  isOpen,
  onClose,
  item,
  mode,
  onSuccess,
}: JurusanModalProps) {
  const [jurusanName, setJurusanName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item && mode === 'edit') {
      setJurusanName(item.nama);
    } else {
      setJurusanName('');
    }
  }, [item, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jurusanName.trim()) {
      toast.warning('Nama jurusan wajib diisi.');
      return;
    }

    try {
      setIsSaving(true);
      if (mode === 'edit' && item?.id) {
        await saveJurusanRecord(item.id, jurusanName.trim());
        toast.success('Nama konsentrasi keahlian berhasil diperbarui.');
      } else {
        await saveJurusanRecord(null, jurusanName.trim());
        toast.success('Konsentrasi keahlian baru berhasil ditambahkan.');
      }

      await onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving jurusan:', err);
      toast.error(err?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Konsentrasi Keahlian' : 'Tambah Jurusan Baru'}
          </DialogTitle>
          <DialogDescription>
            Gunakan singkatan atau nama standar kejuruan (contoh: RPL, EI, OI, dsb)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Konsentrasi Keahlian
            </label>
            <Input
              type="text"
              required
              value={jurusanName}
              onChange={(e) => setJurusanName(e.target.value)}
              placeholder="Contoh: Rekayasa Perangkat Lunak"
              className="w-full text-xs h-9"
              autoFocus
            />
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
                  <span>{mode === 'edit' ? 'Simpan Perubahan' : 'Simpan'}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
