// Domain models for operational dashboard metrics, visualization points, and customizable widgets
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

export const AVAILABLE_WIDGETS: DashboardWidget[] = [
  {
    id: 'w1',
    title: 'Distribusi Presensi per Jurusan',
    desc: 'Pantau proporsi kehadiran antar 9 konsentrasi keahlian secara visual.',
    tag: '#Jurusan',
    enabled: true,
  },
  {
    id: 'w2',
    title: 'Ringkasan Eksekutif Kehadiran',
    desc: 'Lihat metrik kunci dan performa ketepatan waktu dalam satu panel ringkas.',
    tag: '#Performa',
    enabled: true,
  },
  {
    id: 'w3',
    title: 'Performa Scanner RFID Real-Time',
    desc: 'Monitor throughput pemindaian kartu dan tingkat respons gateway reader.',
    tag: '#Operasional',
    enabled: true,
  },
  {
    id: 'w4',
    title: 'Analisis Tren Keterlambatan',
    desc: 'Kelompokkan siswa berdasarkan histori keterlambatan untuk tindak lanjut.',
    tag: '#Kesiswaan',
    enabled: false,
  },
  {
    id: 'w5',
    title: 'Segmentasi Kelas & Pararel',
    desc: 'Bandingkan persentase kehadiran tingkat X, XI, dan XII tiap pararel.',
    tag: '#Segmentasi',
    enabled: false,
  },
];
