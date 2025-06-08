'use client';

// Admin hook managing the full CRUD lifecycle for attendance display devices
import { useState, useEffect, useCallback } from 'react';
import { AttendanceDisplay } from '@/types';
import { toast } from 'sonner';

export function useDisplays() {
  const [displays, setDisplays] = useState<AttendanceDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisplays = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/displays');
      if (!res.ok) throw new Error('Gagal memuat data display');
      const data = await res.json();
      setDisplays(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDisplays(); }, [fetchDisplays]);

  const addDisplay = useCallback(async (
    display_name: string,
    location: string | null
  ): Promise<AttendanceDisplay | null> => {
    try {
      const res = await fetch('/api/displays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name, location }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Gagal membuat display');
      }
      const created: AttendanceDisplay = await res.json();
      setDisplays(prev => [...prev, created]);
      toast.success(`Display "${created.display_name}" berhasil dibuat`);
      return created;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, []);

  const editDisplay = useCallback(async (
    id: number,
    patch: Partial<Pick<AttendanceDisplay, 'display_name' | 'location' | 'is_enabled'>>
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/displays/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Gagal memperbarui display');
      }
      const updated: AttendanceDisplay = await res.json();
      setDisplays(prev => prev.map(d => (d.id === id ? updated : d)));
      toast.success('Display berhasil diperbarui');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  const removeDisplay = useCallback(async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/displays/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Gagal menghapus display');
      }
      setDisplays(prev => prev.filter(d => d.id !== id));
      toast.success('Display berhasil dihapus');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  return { displays, loading, error, fetchDisplays, addDisplay, editDisplay, removeDisplay };
}
