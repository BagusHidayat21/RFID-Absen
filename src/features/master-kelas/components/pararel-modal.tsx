// Modal dialog for adding and editing parallel study group master data
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
import { PararelItem } from '@/lib/api';
import { Save, Loader2 } from 'lucide-react';

interface PararelModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PararelItem | null;
  mode: 'create' | 'edit';
  onSave: (name: string) => Promise<void>;
  isSaving: boolean;
}

export function PararelModal({
  isOpen,
  onClose,
  item,
  mode,
  onSave,
  isSaving,
}: PararelModalProps) {
  const [pararelName, setPararelName] = useState('');

  useEffect(() => {
    if (item && mode === 'edit') {
      setPararelName(item.nama);
    } else {
      setPararelName('');
    }
  }, [item, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pararelName.trim()) {
      toast.warning('Nama rombel pararel wajib diisi.');
      return;
    }
    await onSave(pararelName.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Rombel Pararel' : 'Tambah Rombel Pararel Baru'}
          </DialogTitle>
          <DialogDescription>
            Penomoran rombel kelas pararel (contoh: 1, 2, 3, A, B)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Pararel
            </label>
            <Input
              type="text"
              required
              value={pararelName}
              onChange={(e) => setPararelName(e.target.value)}
              placeholder="Contoh: 1 atau 2 atau A"
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
