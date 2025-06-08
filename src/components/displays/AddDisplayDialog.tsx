'use client';

// Dialog for creating a new TV display and showing its generated activation code
import { useState } from 'react';
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
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AddDisplayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (display_name: string, location: string | null) => Promise<AttendanceDisplay | null>;
}

export function AddDisplayDialog({ open, onOpenChange, onAdd }: AddDisplayDialogProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const result = await onAdd(name.trim(), location.trim() || null);
    setLoading(false);
    if (result) {
      setCreatedCode(result.display_code);
    }
  };

  const handleCopy = () => {
    if (!createdCode) return;
    navigator.clipboard.writeText(createdCode).then(() => {
      setCopied(true);
      toast.success('Kode disalin!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClose = () => {
    setName('');
    setLocation('');
    setCreatedCode(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{createdCode ? 'Display Berhasil Dibuat' : 'Tambah Display Baru'}</DialogTitle>
        </DialogHeader>

        {!createdCode ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="display-name" className="text-xs font-semibold text-slate-700">
                Nama Display <span className="text-red-500">*</span>
              </label>
              <Input
                id="display-name"
                placeholder="cth. Gerbang Utama"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="display-location" className="text-xs font-semibold text-slate-700">
                Lokasi (opsional)
              </label>
              <Input
                id="display-location"
                placeholder="cth. Pintu Masuk Utama"
                value={location}
                onChange={e => setLocation(e.target.value)}
                disabled={loading}
              />
            </div>
            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading || !name.trim()}>
                {loading ? 'Membuat...' : 'Buat Display'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col gap-4 py-2">
            <p className="text-sm text-slate-600">
              Salin kode aktivasi berikut dan masukkan di halaman TV display:
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-2xl font-bold tracking-widest text-center text-slate-900">
                {createdCode}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className={cn(copied && 'border-emerald-500 text-emerald-600')}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-slate-400 text-center">
              Buka <strong>/attendance/display</strong> di browser TV dan masukkan kode ini.
            </p>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full">Selesai</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
