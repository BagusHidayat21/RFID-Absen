// Custom hook managing dashboard state, real database queries, metric calculations, and active widget configurations
'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { Absensi } from '@/types';
import { AttendanceMetrics, DashboardWidget, AVAILABLE_WIDGETS } from '../types/dashboard';
import { fetchDashboardAttendance } from '../services/dashboard-service';
import {
  computeAttendanceMetrics,
  computeWeeklyDistributionFromData,
  computeChartPointsFromData,
} from '@/lib/dashboard.utils';

export function useDashboard() {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState<boolean>(true);
  const [rawData, setRawData] = useState<Absensi[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30_days');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(2);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(AVAILABLE_WIDGETS);
  const [localScans, setLocalScans] = useState<Absensi[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchDashboardAttendance();
        if (isMounted) {
          setRawData(data);
          setLocalScans(data.slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching attendance list from database:', err);
        if (isMounted) {
          setRawData([]);
          setLocalScans([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const metrics: AttendanceMetrics = useMemo(() => {
    return computeAttendanceMetrics(rawData, selectedPeriod);
  }, [rawData, selectedPeriod]);

  const chartPoints = useMemo(() => {
    return computeChartPointsFromData(rawData);
  }, [rawData]);

  const weeklyDays = useMemo(() => {
    return computeWeeklyDistributionFromData(rawData);
  }, [rawData]);

  const handlePeriodChange = (newPeriod: string) => {
    startTransition(() => {
      setSelectedPeriod(newPeriod);
      setHoveredPoint(2);
    });
  };

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  return {
    loading,
    isPending,
    selectedPeriod,
    handlePeriodChange,
    metrics,
    chartPoints,
    hoveredPoint,
    setHoveredPoint,
    weeklyDays,
    localScans,
    widgets,
    toggleWidget,
    isWidgetModalOpen,
    setIsWidgetModalOpen,
  };
}
