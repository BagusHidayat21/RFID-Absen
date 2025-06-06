// Custom hook managing state and operations for Master Kelas and Rombel Pararel
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { KelasItem, PararelItem } from '@/lib/api';
import { getStudents } from '@/types';
import {
  KelasRowData,
  PararelRowData,
  KelasModalType,
  PararelModalType,
} from '../types/master-kelas';
import {
  fetchMasterKelasDataset,
  saveKelas,
  removeKelas,
  savePararel,
  removePararel,
} from '../services/master-kelas-service';

export function useMasterKelas() {
  const [kelasList, setKelasList] = useState<KelasItem[]>([]);
  const [pararelList, setPararelList] = useState<PararelItem[]>([]);
  const [students, setStudents] = useState<getStudents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [kelasModal, setKelasModal] = useState<KelasModalType>(null);
  const [pararelModal, setPararelModal] = useState<PararelModalType>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { confirm, ConfirmDialog } = useConfirmDialog();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMasterKelasDataset();
      setKelasList(data.kelas);
      setPararelList(data.pararel);
      setStudents(data.students);
    } catch (err: any) {
      console.error('Error loading master kelas/pararel:', err);
      setError(err?.message || 'Gagal memuat data master kelas dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const kelasTableData = useMemo<KelasRowData[]>(() => {
    return kelasList.map((k) => ({
      ...k,
      studentCount: students.filter(
        (s) => s.kelas.toLowerCase() === k.nama.toLowerCase()
      ).length,
    }));
  }, [kelasList, students]);

  const pararelTableData = useMemo<PararelRowData[]>(() => {
    return pararelList.map((p) => ({
      ...p,
      studentCount: students.filter(
        (s) => s.pararel.toLowerCase() === p.nama.toLowerCase()
      ).length,
    }));
  }, [pararelList, students]);

  // Kelas modal actions
  const openAddKelas = useCallback(() => {
    setKelasModal({ type: 'create' });
  }, []);

  const openEditKelas = useCallback((item: KelasItem) => {
    setKelasModal({ type: 'edit', item });
  }, []);

  const openDetailKelas = useCallback((item: KelasRowData) => {
    setKelasModal({ type: 'detail', item });
  }, []);

  const closeKelasModal = useCallback(() => {
    setKelasModal(null);
  }, []);

  const handleSaveKelas = useCallback(
    async (name: string) => {
      if (!name.trim()) return;
      try {
        setIsSaving(true);
        if (kelasModal?.type === 'edit') {
          await saveKelas(kelasModal.item.id, name.trim());
          toast.success('Tingkat kelas berhasil diperbarui.');
        } else {
          await saveKelas(null, name.trim());
          toast.success('Tingkat kelas baru berhasil ditambahkan.');
        }
        await loadData();
        closeKelasModal();
      } catch (err: any) {
        console.error('Error saving kelas:', err);
        toast.error(err?.message || 'Terjadi kesalahan saat menyimpan tingkat kelas.');
      } finally {
        setIsSaving(false);
      }
    },
    [kelasModal, loadData, closeKelasModal]
  );

  const handleDeleteKelas = useCallback(
    async (item: KelasRowData) => {
      if (item.studentCount > 0) {
        toast.warning(
          `Tingkat kelas "${item.nama}" masih memiliki ${item.studentCount} siswa terdaftar. Hapus atau pindahkan data siswa terlebih dahulu.`
        );
        return;
      }

      const confirmed = await confirm({
        title: 'Hapus Tingkat Kelas?',
        description: `Apakah Anda yakin ingin menghapus kelas "${item.nama}"?`,
        confirmText: 'Ya, Hapus!',
        cancelText: 'Batal',
        variant: 'destructive',
      });

      if (confirmed) {
        try {
          await removeKelas(item.id);
          toast.success('Tingkat kelas berhasil dihapus.');
          await loadData();
        } catch (err: any) {
          console.error('Error deleting kelas:', err);
          toast.error(err?.message || 'Terjadi kesalahan saat menghapus tingkat kelas.');
        }
      }
    },
    [confirm, loadData]
  );

  // Pararel modal actions
  const openAddPararel = useCallback(() => {
    setPararelModal({ type: 'create' });
  }, []);

  const openEditPararel = useCallback((item: PararelItem) => {
    setPararelModal({ type: 'edit', item });
  }, []);

  const openDetailPararel = useCallback((item: PararelRowData) => {
    setPararelModal({ type: 'detail', item });
  }, []);

  const closePararelModal = useCallback(() => {
    setPararelModal(null);
  }, []);

  const handleSavePararel = useCallback(
    async (name: string) => {
      if (!name.trim()) return;
      try {
        setIsSaving(true);
        if (pararelModal?.type === 'edit') {
          await savePararel(pararelModal.item.id, name.trim());
          toast.success('Rombel pararel berhasil diperbarui.');
        } else {
          await savePararel(null, name.trim());
          toast.success('Rombel pararel baru berhasil ditambahkan.');
        }
        await loadData();
        closePararelModal();
      } catch (err: any) {
        console.error('Error saving pararel:', err);
        toast.error(err?.message || 'Terjadi kesalahan saat menyimpan rombel pararel.');
      } finally {
        setIsSaving(false);
      }
    },
    [pararelModal, loadData, closePararelModal]
  );

  const handleDeletePararel = useCallback(
    async (item: PararelRowData) => {
      if (item.studentCount > 0) {
        toast.warning(
          `Rombel pararel "${item.nama}" masih memiliki ${item.studentCount} siswa terdaftar. Hapus atau pindahkan data siswa terlebih dahulu.`
        );
        return;
      }

      const confirmed = await confirm({
        title: 'Hapus Rombel Pararel?',
        description: `Apakah Anda yakin ingin menghapus rombel "${item.nama}"?`,
        confirmText: 'Ya, Hapus!',
        cancelText: 'Batal',
        variant: 'destructive',
      });

      if (confirmed) {
        try {
          await removePararel(item.id);
          toast.success('Rombel pararel berhasil dihapus.');
          await loadData();
        } catch (err: any) {
          console.error('Error deleting pararel:', err);
          toast.error(err?.message || 'Terjadi kesalahan saat menghapus rombel pararel.');
        }
      }
    },
    [confirm, loadData]
  );

  return {
    kelasTableData,
    pararelTableData,
    loading,
    error,
    isSaving,
    kelasModal,
    pararelModal,
    openAddKelas,
    openEditKelas,
    openDetailKelas,
    closeKelasModal,
    handleSaveKelas,
    handleDeleteKelas,
    openAddPararel,
    openEditPararel,
    openDetailPararel,
    closePararelModal,
    handleSavePararel,
    handleDeletePararel,
    refreshData: loadData,
    ConfirmDialog,
  };
}
