"use client";

import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import Topbar from "@/components/Header";
import { AttendanceItem, PieChartDatum, CenterTextProps, DataType } from "@/types";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

// Icons
const Icons = {
  present: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  leave: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  sick: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
    </svg>
  ),
  absent: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

// Modified pieData format to match Nivo's expected format
const pieData = [
  { id: 'Hadir', label: 'Hadir', value: 40, color: '#64B5F6' },
  { id: 'Izin', label: 'Izin', value: 25, color: '#81C784' },
  { id: 'Sakit', label: 'Sakit', value: 20, color: '#F48FB1' },
  { id: 'Tanpa Keterangan', label: 'Tanpa Keterangan', value: 15, color: '#FFB74D' },
];

// Calculate total for center text
const totalAttendance = pieData.reduce((sum, item) => sum + item.value, 0);

// Custom layer component for center text
const CenterText = ({ centerX, centerY }: CenterTextProps) => {
  return (
    <g>
      <text
        x={centerX}
        y={centerY - 10}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        Keterangan
      </text>
      <text
        x={centerX}
        y={centerY + 15}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '18px' }}
      >
        {totalAttendance}
      </text>
    </g>
  );
};

// Bar chart data
const barData = [
  { month: 'Januari', 'Siswa Hadir': 1400, 'Siswa Absen': 1200 },
  { month: 'Februari', 'Siswa Hadir': 1700, 'Siswa Absen': 1100 },
  { month: 'Maret', 'Siswa Hadir': 500, 'Siswa Absen': 2200 },
  { month: 'April', 'Siswa Hadir': 1600, 'Siswa Absen': 600 },
  { month: 'May', 'Siswa Hadir': 1200, 'Siswa Absen': 1100 },
  { month: 'Juni', 'Siswa Hadir': 1600, 'Siswa Absen': 1300 },
  { month: 'Juli', 'Siswa Hadir': 2100, 'Siswa Absen': 1100 },
  { month: 'Agustus', 'Siswa Hadir': 2100, 'Siswa Absen': 1100 },
  { month: 'September', 'Siswa Hadir': 2000, 'Siswa Absen': 1100 },
  { month: 'November', 'Siswa Hadir': 2100, 'Siswa Absen': 1100 },
  { month: 'Desember', 'Siswa Hadir': 2100, 'Siswa Absen': 1100 },
];

// Bar chart component
const MyResponsiveBar = () => (
  <ResponsiveBar
    data={barData}
    keys={['Siswa Hadir', 'Siswa Absen']}
    indexBy="month"
    // Margin minimal untuk memberi ruang maksimum pada chart
    margin={{ top: 20, right: 5, bottom: 100, left: 60 }}
    padding={0.3}
    layout="vertical" // Memastikan tata letak vertikal
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={['#64B5F6', '#4ade80']}
    borderRadius={3}
    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 8,
      tickRotation: 0,
      legend: '',
      legendPosition: 'middle',
      legendOffset: 42,
      truncateTickAt: 0,
      // Alternatif: gunakan formatter untuk memendekkan label jika perlu
      format: value => value.substring(0, 3)
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: '',
      legendPosition: 'middle',
      legendOffset: -45,
      format: v => `${v/1000}k`,
      truncateTickAt: 0
    }}
    enableGridY={true}
    enableGridX={false}
    gridYValues={5}
    enableLabel={false}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    // Membuat legenda lebih responsif
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'bottom',
        direction: 'row',
        justify: false,
        translateX: 0,
        translateY: 80,
        itemsSpacing: 30,
        itemWidth: 90,
        itemHeight: 20,
        itemDirection: 'left-to-right',
        itemOpacity: 0.85,
        symbolSize: 10,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemOpacity: 1
            }
          }
        ]
      }
    ]}
    animate={true}
    motionConfig="gentle"
    theme={{
      axis: {
        ticks: {
          text: {
            fontSize: 10
          }
        }
      },
      grid: {
        line: {
          stroke: '#f0f0f0',
          strokeWidth: 1
        }
      }
    }}
  />
);

// Pie chart component
const MyResponsivePie = ({ data }: { data: PieChartDatum[] }) => (
  <ResponsivePie
    data={data}
    // Mengubah margin untuk mengoptimalkan ruang
    margin={{ top: 10, right: 80, bottom: 40, left: 5 }}
    innerRadius={0.6}
    padAngle={0}
    cornerRadius={0}
    colors={{ datum: 'data.color' }}
    activeOuterRadiusOffset={8}
    borderWidth={0}
    enableArcLinkLabels={false}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor="#fff"
    layers={['arcs', 'arcLabels', 'legends', CenterText]}
    // Mengubah posisi legenda untuk mengoptimalkan tampilan
    legends={[
      {
        anchor: 'right',
        direction: 'column',
        justify: false,
        translateX: 70,
        translateY: 0,
        itemsSpacing: 12,
        itemWidth: 80,
        itemHeight: 18,
        itemTextColor: '#333',
        itemDirection: 'left-to-right',
        itemOpacity: 1,
        symbolSize: 12,
        symbolShape: 'circle',
        symbolSpacing: 6,
        effects: [
          {
            on: 'hover',
            style: {
              itemTextColor: '#000'
            }
          }
        ]
      }
    ]}
    theme={{
      legends: {
        text: {
          fontSize: 12
        }
      },
      labels: {
        text: {
          fontSize: 11,
          fontWeight: 'bold'
        }
      }
    }}
  />
);

export default function AttendancePage() {
  const attendanceData: AttendanceItem[] = [
    { id: 1, type: "present", title: "Masuk", count: "31 Siswa", icon: Icons.present },
    { id: 2, type: "leave", title: "Izin", count: "1 Siswa", icon: Icons.leave },
    { id: 3, type: "sick", title: "Sakit", count: "1 Siswa", icon: Icons.sick },
    { id: 4, type: "absent", title: "Tanpa Keterangan", count: "1 Siswa", icon: Icons.absent },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar user={{ name: "Musfiq", role: "Guru" }} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className=" mx-auto my-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-gray-900">Absensi Kehadiran</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                Bulan & Tahun
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {attendanceData.map((item) => (
                <Card
                  key={item.id}
                  type={item.type}
                  title={item.title}
                  count={item.count}
                  icon={item.icon}
                />
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-8">

              {/* Bar Chart */}
              <div className="w-full md:w-[55%] h-[500px] bg-white rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Total Kehadiran</h3>
                <div className="h-[300px] w-full">
                  <MyResponsiveBar />
                </div>
              </div>

              {/* Pie Chart */}
              <div className="w-full md:w-[45%] h-[500px] bg-white rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Distribusi Kehadiran</h3>
                <div className="h-[250px] w-full">
                  <MyResponsivePie data={pieData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}