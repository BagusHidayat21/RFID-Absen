// Custom hook managing attendance directory data, single source of truth, filters, and modal-based detail inspection
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { RombelClassItem, PresensiKPIStats } from '../types/attendance';
import {
  fetchAttendanceDirectoryDataset,
  generateAllClassRombels,
  calculatePresensiKPIStats,
} from '../services/attendance-service';

// Custom hook managing attendance directory data, single source of truth, filters, and modal-based detail inspection
export function useAttendance() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<RombelClassItem[]>([]);

  // Filter States
  const [selectedJurusan, setSelectedJurusan] = useState<string>('ALL');
  const [selectedTingkat, setSelectedTingkat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State for In-Modal Class Roster Detail
  const [selectedClassDetail, setSelectedClassDetail] = useState<RombelClassItem | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dataset = await fetchAttendanceDirectoryDataset();
      const generated = generateAllClassRombels(dataset);
      setClasses(generated);
    } catch (err: any) {
      console.error('Failed to load attendance directory:', err);
      setError(err?.message || 'Gagal memuat data presensi kelas dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const kpiStats = useMemo<PresensiKPIStats>(() => {
    return calculatePresensiKPIStats(classes);
  }, [classes]);

  const openDetailModal = useCallback((item: RombelClassItem) => {
    setSelectedClassDetail(item);
  }, []);

  const closeDetailModal = useCallback(() => {
    setSelectedClassDetail(null);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedJurusan('ALL');
    setSelectedTingkat('ALL');
    setSearchQuery('');
  }, []);

  const isFilterActive =
    selectedJurusan !== 'ALL' ||
    selectedTingkat !== 'ALL' ||
    searchQuery.trim() !== '';

  return {
    loading,
    error,
    classes,
    kpiStats,
    searchQuery,
    setSearchQuery,
    selectedJurusan,
    setSelectedJurusan,
    selectedTingkat,
    setSelectedTingkat,
    resetFilters,
    isFilterActive,
    selectedClassDetail,
    openDetailModal,
    closeDetailModal,
    refreshData: loadData,
  };
}
