import { useState, useEffect, useMemo } from 'react';
import { RombelClassItem, PresensiKPIStats } from '@/types/presensi.types';
import { fetchPresensiDirectoryDataset } from '@/services/presensi.service';
import { generateAllClassRombels, calculatePresensiKPIStats } from '@/lib/presensi.utils';

// Custom hook managing attendance directory data loading, rombel generation, and KPI stats
export function usePresensiDirectory() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<RombelClassItem[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dataset = await fetchPresensiDirectoryDataset();
      const generated = generateAllClassRombels(dataset);
      setClasses(generated);
    } catch (err: any) {
      console.error('Failed to load presensi directory:', err);
      setError(err?.message || 'Gagal memuat data presensi kelas dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const kpiStats = useMemo<PresensiKPIStats>(() => {
    return calculatePresensiKPIStats(classes);
  }, [classes]);

  return {
    loading,
    error,
    classes,
    kpiStats,
    refreshData: loadData,
  };
}
