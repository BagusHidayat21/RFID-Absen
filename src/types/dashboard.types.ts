// Type definitions for Dashboard KPI metrics, chart points, weekly distribution, and widgets
export interface AttendanceMetrics {
  total: number;
  onTime: number;
  late: number;
  excused: number;
  unexcused: number;
  onTimePct: number;
  latePct: number;
  comparisonOnTime: string;
  comparisonLate: string;
  comparisonExcused: string;
  comparisonUnexcused: string;
}

export interface ChartPoint {
  x: number;
  y: number;
  label: string;
  displayVal: string;
  prevVal: string;
}

export interface WeeklyDayItem {
  day: string;
  count: string;
  height: number;
  active: boolean;
}

export interface DashboardWidget {
  id: string;
  title: string;
  desc: string;
  tag: string;
  enabled: boolean;
}
