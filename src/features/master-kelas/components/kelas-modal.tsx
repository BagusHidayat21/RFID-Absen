// Modal dialog for adding and editing class level master data
'use client';

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
import { KelasItem } from '@/lib/api';
import { Save, Loader2 } from 'lucide-react';

interface KelasModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: KelasItem | null;
  mode: 'create' | 'edit';
  onSave: (name: string) => Promise<void>;
  isSaving: boolean;
}

export function KelasModal({
  isOpen,
  onClose,
  item,
  mode,
  onSave,
  isSaving,
}: KelasModalProps) {
  const [kelasName, setKelasName] = useState('');

  useEffect(() => {
    if (item && mode === 'edit') {
      setKelasName(item.nama);
    } else {
      setKelasName('');
    }
  }, [item, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kelasName.trim()) {
      toast.warning('Nama tingkat kelas wajib diisi.');
      return;
    }
    await onSave(kelasName.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Tingkat Kelas' : 'Tambah Tingkat Kelas Baru'}
          </DialogTitle>
          <DialogDescription>
            Jenjang akademik (contoh: X, XI, XII)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Tingkat
            </label>
            <Input
              type="text"
              required
              value={kelasName}
              onChange={(e) => setKelasName(e.target.value)}
              placeholder="Contoh: X atau XI atau XII"
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
