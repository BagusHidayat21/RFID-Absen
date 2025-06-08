// Table component displaying registered TV attendance display terminals and their status
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AttendanceDisplay } from '@/types';
import { Copy, Check, ExternalLink, Pencil, Trash2, Tv, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface DisplaysTableProps {
  displays: AttendanceDisplay[];
  loading: boolean;
  onEdit: (display: AttendanceDisplay) => void;
  onDelete: (id: number) => Promise<boolean>;
}

export function DisplaysTable({
  displays,
  loading,
  onEdit,
  onDelete,
}: DisplaysTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      toast.success(`Kode ${code} disalin!`);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await onDelete(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const isOnline = (display: AttendanceDisplay) => {
    if (!display.is_enabled || !display.last_seen_at) return false;
    const diffMs = Date.now() - new Date(display.last_seen_at).getTime();
    return diffMs < 120000; // 2 minutes threshold
  };

  const formatLastSeen = (dateStr: string | null) => {
    if (!dateStr) return 'Belum pernah aktif';
    const date = new Date(dateStr);
    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'Baru saja';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} mnt lalu`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} jam lalu`;

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading && displays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-500">Memuat data display...</p>
      </div>
    );
  }

  if (displays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <Tv className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Belum Ada Display TV</h3>
        <p className="text-xs text-slate-500 max-w-sm mb-4">
          Tambahkan display baru untuk menampilkan absensi langsung pada layar TV atau monitor sekolah.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="font-semibold text-slate-700">Display</TableHead>
              <TableHead className="font-semibold text-slate-700">Kode Aktivasi</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700">Terakhir Aktif</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displays.map((display) => {
              const online = isOnline(display);
              return (
                <TableRow key={display.id} className="hover:bg-slate-50/60 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{display.display_name}</span>
                      {display.location && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {display.location}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <code className="px-2 py-1 rounded bg-slate-100 font-mono text-xs font-semibold text-slate-800 tracking-wider">
                        {display.display_code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-slate-600"
                        onClick={() => handleCopy(display.display_code)}
                        title="Salin kode"
                      >
                        {copiedCode === display.display_code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>
                    {!display.is_enabled ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Nonaktif
                      </Badge>
                    ) : online ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Offline
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {formatLastSeen(display.last_seen_at)}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-blue-600"
                        title="Buka Halaman TV"
                        asChild
                      >
                        <a href="/attendance/display" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-slate-900"
                        onClick={() => onEdit(display)}
                        title="Edit Display"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                        onClick={() => setDeleteId(display.id)}
                        title="Hapus Display"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Display?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus display dari sistem. TV yang menggunakan display ini harus diaktivasi ulang dengan kode baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
