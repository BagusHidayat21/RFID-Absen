// Dialog for editing an existing TV display configuration
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AttendanceDisplay } from '@/types';

interface EditDisplayDialogProps {
  display: AttendanceDisplay | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (
    id: number,
    patch: Partial<Pick<AttendanceDisplay, 'display_name' | 'location' | 'is_enabled'>>
  ) => Promise<boolean>;
}

export function EditDisplayDialog({
  display,
  open,
  onOpenChange,
  onEdit,
}: EditDisplayDialogProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (display) {
      setName(display.display_name);
      setLocation(display.location ?? '');
      setIsEnabled(display.is_enabled);
    }
  }, [display]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!display || !name.trim()) return;

    setLoading(true);
    const success = await onEdit(display.id, {
      display_name: name.trim(),
      location: location.trim() || null,
      is_enabled: isEnabled,
    });
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Display</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-display-code" className="text-xs font-semibold text-slate-700">
              Kode Display
            </label>
            <Input
              id="edit-display-code"
              value={display?.display_code ?? ''}
              disabled
              className="bg-slate-50 font-mono text-slate-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-display-name" className="text-xs font-semibold text-slate-700">
              Nama Display <span className="text-red-500">*</span>
            </label>
            <Input
              id="edit-display-name"
              placeholder="cth. Gerbang Utama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-display-location" className="text-xs font-semibold text-slate-700">
              Lokasi (opsional)
            </label>
            <Input
              id="edit-display-location"
              placeholder="cth. Pintu Masuk Utama"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="edit-display-enabled"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="edit-display-enabled" className="text-xs text-slate-700 font-medium cursor-pointer">
              Display aktif
            </label>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
