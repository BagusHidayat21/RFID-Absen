// Operational RFID Attendance Dashboard page orchestrating useDashboard hook and widgets
'use client';

import React from 'react';
import { useDashboard } from '../hooks/use-dashboard';
import { DashboardHeader } from './dashboard-header';
import { DashboardKPICards } from './dashboard-kpi-cards';
import { AttendanceRateChart } from './attendance-rate-chart';
import { WeeklyActiveBarChart } from './weekly-active-bar-chart';
import { AttendanceTargetGauge } from './attendance-target-gauge';
import { RecentScansTable } from './recent-scans-table';
import { WidgetModal } from './widget-modal';

export function DashboardPage() {
  const {
    loading,
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
  } = useDashboard();

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-10">
      {/* 1. Header Toolbar */}
      <DashboardHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        onOpenWidgetModal={() => setIsWidgetModalOpen(true)}
      />

      {/* 2. Top Row of 4 Metric Cards */}
      <DashboardKPICards metrics={metrics} loading={loading} />

      {/* 3. Analytics & Visualization Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AttendanceRateChart
          metrics={metrics}
          chartPoints={chartPoints}
          hoveredPoint={hoveredPoint}
          onHoverPoint={setHoveredPoint}
        />

        <WeeklyActiveBarChart weeklyDays={weeklyDays} />

        <AttendanceTargetGauge />
      </div>

      {/* 4. Full-Width Attendance Scans Table Card */}
      <RecentScansTable scans={localScans} />

      {/* 5. Add Widget Modal */}
      <WidgetModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
        widgets={widgets}
        onToggleWidget={toggleWidget}
      />
    </div>
  );
}
