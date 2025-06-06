// Custom hook managing department master data and modal CRUD lifecycle
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { JurusanItem } from '@/lib/api';
import { JurusanRowData, JurusanModalType } from '../types/master-jurusan';
import {
  fetchJurusanDirectory,
  saveJurusanRecord,
  removeJurusanRecord,
} from '../services/master-jurusan-service';

// Custom hook managing department master data and modal CRUD lifecycle
export function useMasterJurusan() {
  const [jurusanList, setJurusanList] = useState<JurusanItem[]>([]);
  const [students, setStudents] = useState<{ id: number; jurusan: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [modalState, setModalState] = useState<JurusanModalType>(null);
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJurusanDirectory();
      setJurusanList(data.jurusan);
      setStudents(data.students);
    } catch (err: any) {
      console.error('Error loading jurusan data:', err);
      setError(err?.message || 'Gagal memuat data master jurusan dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tableData = useMemo<JurusanRowData[]>(() => {
    return jurusanList.map((j) => {
      const count = students.filter(
        (s) => s.jurusan.toLowerCase() === j.nama.toLowerCase()
      ).length;
      return {
        ...j,
        studentCount: count,
      };
    });
  }, [jurusanList, students]);

  const openCreateModal = useCallback(() => {
    setModalState({ type: 'create' });
  }, []);

  const openEditModal = useCallback((item: JurusanItem) => {
    setModalState({ type: 'edit', item });
  }, []);

  const openDetailModal = useCallback((item: JurusanRowData) => {
    setModalState({ type: 'detail', item });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  const handleDelete = useCallback(
    async (item: JurusanRowData) => {
      if (item.studentCount > 0) {
        toast.warning(
          `Jurusan "${item.nama}" masih memiliki ${item.studentCount} siswa terdaftar. Hapus atau pindahkan siswa terlebih dahulu.`
        );
        return;
      }

      const confirmed = await confirm({
        title: 'Hapus Jurusan?',
        description: `Apakah Anda yakin ingin menghapus "${item.nama}"?`,
        confirmText: 'Ya, Hapus!',
        cancelText: 'Batal',
        variant: 'destructive',
      });

      if (confirmed) {
        try {
          await removeJurusanRecord(item.id);
          toast.success('Jurusan berhasil dihapus.');
          await loadData();
        } catch (err: any) {
          console.error('Error deleting jurusan:', err);
          toast.error(err?.message || 'Terjadi kesalahan saat menghapus jurusan.');
        }
      }
    },
    [confirm, loadData]
  );

  return {
    tableData,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    modalState,
    openCreateModal,
    openEditModal,
    openDetailModal,
    closeModal,
    handleDelete,
    refreshData: loadData,
    ConfirmDialog,
  };
}
