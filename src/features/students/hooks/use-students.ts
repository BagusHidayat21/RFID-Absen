// Custom hook managing student data directory with server-side pagination, search, filtering, and modal CRUD
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { JurusanItem, KelasItem, PararelItem } from '@/lib/api';
import { Student, StudentModalType } from '../types/student';
import {
  fetchStudentsPaginated,
  fetchStudentFilterOptions,
  removeStudent,
} from '../services/student-service';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [jurusanList, setJurusanList] = useState<JurusanItem[]>([]);
  const [kelasList, setKelasList] = useState<KelasItem[]>([]);
  const [pararelList, setPararelList] = useState<PararelItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterJurusan, setFilterJurusan] = useState<string>('');
  const [filterKelas, setFilterKelas] = useState<string>('');
  const [filterPararel, setFilterPararel] = useState<string>('');

  // Debounced search term for server querying
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Load filter options (departments, classes, parallels) once
  useEffect(() => {
    async function loadOptions() {
      try {
        const options = await fetchStudentFilterOptions();
        setJurusanList(options.jurusan);
        setKelasList(options.kelas);
        setPararelList(options.pararel);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    }
    loadOptions();
  }, []);

  // Fetch paginated students from database
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchStudentsPaginated({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        jurusan: filterJurusan,
        kelas: filterKelas,
        pararel: filterPararel,
      });

      setStudents(result.data);
      setTotalRows(result.total);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err?.message || 'Gagal memuat data siswa dari server.');
    } finally {
      setLoading(false);
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    filterJurusan,
    filterKelas,
    filterPararel,
  ]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Reset page to 0 on filter or search changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleJurusanChange = (val: string) => {
    setFilterJurusan(val);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleKelasChange = (val: string) => {
    setFilterKelas(val);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handlePararelChange = (val: string) => {
    setFilterPararel(val);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterJurusan('');
    setFilterKelas('');
    setFilterPararel('');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Modal State
  const [modalState, setModalState] = useState<StudentModalType>(null);
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const openCreateModal = useCallback(() => {
    setModalState({ type: 'create' });
  }, []);

  const openEditModal = useCallback((student: Student) => {
    setModalState({ type: 'edit', student });
  }, []);

  const openDetailModal = useCallback((student: Student) => {
    setModalState({ type: 'detail', student });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  const handleDelete = useCallback(
    async (student: Student) => {
      const confirmed = await confirm({
        title: 'Hapus Siswa?',
        description: `Apakah Anda yakin ingin menghapus data "${student.nama}"? Aksi ini tidak dapat dibatalkan.`,
        confirmText: 'Ya, Hapus!',
        cancelText: 'Batal',
        variant: 'destructive',
      });

      if (confirmed) {
        try {
          if (student.id) {
            await removeStudent(student.id);
          }
          toast.success('Data siswa berhasil dihapus.');
          await loadStudents();
        } catch (err: any) {
          console.error('Error deleting student:', err);
          toast.error(err?.message || 'Terjadi kesalahan saat menghapus data siswa.');
        }
      }
    },
    [confirm, loadStudents]
  );

  const isFilterActive =
    searchQuery.trim() !== '' ||
    filterJurusan !== '' ||
    filterKelas !== '' ||
    filterPararel !== '';

  return {
    students,
    totalRows,
    totalPages,
    pagination,
    setPagination,
    jurusanList,
    kelasList,
    pararelList,
    loading,
    error,
    searchQuery,
    setSearchQuery: handleSearchChange,
    filterJurusan,
    setFilterJurusan: handleJurusanChange,
    filterKelas,
    setFilterKelas: handleKelasChange,
    filterPararel,
    setFilterPararel: handlePararelChange,
    isFilterActive,
    resetFilters,
    modalState,
    openCreateModal,
    openEditModal,
    openDetailModal,
    closeModal,
    handleDelete,
    refreshData: loadStudents,
    ConfirmDialog,
  };
}
