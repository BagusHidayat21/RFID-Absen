"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/Card";
import { AttendanceItem, PieChartDatum, MyResponsiveBarProps, CenterTextProps } from "@/types";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

// Icons for attendance status
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

// Custom layer component for center text in pie chart
const CenterText = ({ centerX, centerY, labelTop, labelBottom }: CenterTextProps) => {
  return (
    <g>
      <text
        x={centerX}
        y={centerY - 10}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {labelTop}
      </text>
      <text
        x={centerX}
        y={centerY + 15}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '18px' }}
      >
        {labelBottom}
      </text>
    </g>
  );
};

// Define the type for bar chart data
type BarChartData = {
  month: string;
  'Hadir': number;
  'Izin': number;
  'Sakit': number;
  'Alpha': number;
};

// Pie chart component
const MyResponsivePie = ({
  data,
  totalAttendance
}: { data: PieChartDatum[], totalAttendance: number }) => (
  <ResponsivePie
    data={data}
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
    layers={[
      'arcs',
      'arcLabels',
      'legends',
      (props) => (
        <CenterText
          {...props}
          labelTop="Total"
          labelBottom={totalAttendance}
        />
      )
    ]}
    legends={[
      {
        anchor: 'right',
        direction: 'column',
        translateX: 85,
        itemsSpacing: 12,
        itemWidth: 80,
        itemHeight: 18,
        itemTextColor: '#333',
        symbolSize: 12,
        symbolShape: 'circle',
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

// Bar chart component
const MyResponsiveBar = ({ data }: MyResponsiveBarProps) => (
  <ResponsiveBar
    data={data}
    keys={['Hadir', 'Izin', 'Sakit', 'Alpha']}
    indexBy="month"
    margin={{ top: 20, right: 5, bottom: 100, left: 60 }}
    padding={0.5}
    layout="vertical"
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={['#22c55e', '#3b82f6', '#eab308', '#ef4444']}
    borderRadius={3}
    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 8,
      tickRotation: 0,
      legend: 'Bulan',
      legendPosition: 'middle',
      legendOffset: 42,
      truncateTickAt: 0
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Jumlah Siswa',
      legendPosition: 'middle',
      legendOffset: -45,
      truncateTickAt: 0
    }}
    enableGridY={true}
    enableGridX={false}
    gridYValues={5}
    enableLabel={true}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
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

export default function AttendancePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [pieData, setPieData] = useState<PieChartDatum[]>([]);
  const [barData, setBarData] = useState<BarChartData[]>([]);
  const [totalAttendance, setTotalAttendance] = useState<number>(0);
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  
  // Add filter states
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [rawData, setRawData] = useState<any[]>([]);
  
  // Base URL
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Month names array
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Fetch attendance data from the database
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        
        // Menggunakan axios untuk mengambil data keseluruhan
        const response = await axios.get(`${baseURL}/absen`);      
        
        const data = response.data.data;
        
        // Store raw data for filtering later
        setRawData(data);
        
        // Process data initially (full year)
        processData(data, null, selectedYear);
    
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        // Set fallback data in case of error
        setAttendanceData([
          { id: 1, type: "present", title: "Masuk", count: "0 Siswa", icon: Icons.present },
          { id: 2, type: "leave", title: "Izin", count: "0 Siswa", icon: Icons.leave },
          { id: 3, type: "sick", title: "Sakit", count: "0 Siswa", icon: Icons.sick },
          { id: 4, type: "absent", title: "Alpha", count: "0 Siswa", icon: Icons.absent },
        ]);
        setPieData([
          { id: 'Hadir', label: 'Hadir', value: 0, color: '#22c55e' }, // Green
          { id: 'Izin', label: 'Izin', value: 0, color: '#3b82f6' },   // Blue
          { id: 'Sakit', label: 'Sakit', value: 0, color: '#eab308' }, // Yellow
          { id: 'Alpha', label: 'Alpha', value: 0, color: '#ef4444' }, // Red
        ]);
        
        // Set fallback bar data
        setBarData(monthNames.map(month => ({ 
          month: month, 
          'Hadir': 0, 
          'Izin': 0,
          'Sakit': 0,
          'Alpha': 0
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);
  
  // Effect to reprocess data when filters change
  useEffect(() => {
    if (rawData.length > 0) {
      processData(rawData, selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);
  
  // Function to process data based on filters
  const processData = (data: any[], month: number | null, year: number) => {
    // Filter data based on month and year
    const filteredData = data.filter((item: any) => {
      const itemDate = new Date(item.tanggal);
      const itemYear = itemDate.getFullYear();
      const itemMonth = itemDate.getMonth();
      
      if (month === null) {
        // Only filter by year
        return itemYear === year;
      } else {
        // Filter by both month and year
        return itemYear === year && itemMonth === month;
      }
    });
    
    // Process data for cards
    const presentCount = filteredData.filter((item: any) => item.status === "Hadir").length;
    const leaveCount = filteredData.filter((item: any) => item.status === "Izin").length;
    const sickCount = filteredData.filter((item: any) => item.status === "Sakit").length;
    const absentCount = filteredData.filter((item: any) => item.status === "Alpha").length;

    // Calculate total students
    const totalStudents = presentCount + leaveCount + sickCount + absentCount;

    const cardData: AttendanceItem[] = [
      { 
        id: 1, 
        type: "present", 
        title: "Masuk", 
        count: `${presentCount} Siswa`, 
        icon: Icons.present 
      },
      { 
        id: 2, 
        type: "leave", 
        title: "Izin", 
        count: `${leaveCount} Siswa`, 
        icon: Icons.leave 
      },
      { 
        id: 3, 
        type: "sick", 
        title: "Sakit", 
        count: `${sickCount} Siswa`, 
        icon: Icons.sick 
      },
      { 
        id: 4, 
        type: "absent", 
        title: "Alpha", 
        count: `${absentCount} Siswa`, 
        icon: Icons.absent 
      },
    ];

    // Process data for pie chart with updated colors
    const chartData: PieChartDatum[] = [
      { id: 'Hadir', label: 'Hadir', value: presentCount, color: '#22c55e' },
      { id: 'Izin', label: 'Izin', value: leaveCount, color: '#3b82f6' },
      { id: 'Sakit', label: 'Sakit', value: sickCount, color: '#eab308' },
      { id: 'Alpha', label: 'Alpha', value: absentCount, color: '#ef4444' },
    ];
    
    // Create data for bar chart
    let barChartData: BarChartData[] = [];
    
    if (month === null) {
      // Show all months for the selected year
      barChartData = monthNames.map((monthName, monthIndex) => {
        // Filter data for each month in the selected year
        const monthData = data.filter((item: any) => {
          const itemDate = new Date(item.tanggal);
          return itemDate.getFullYear() === year && itemDate.getMonth() === monthIndex;
        });
        
        const monthPresent = monthData.filter((item: any) => item.status === "Hadir").length;
        const monthLeave = monthData.filter((item: any) => item.status === "Izin").length;
        const monthSick = monthData.filter((item: any) => item.status === "Sakit").length;
        const monthAbsent = monthData.filter((item: any) => item.status === "Alpha").length;
        
        return {
          month: monthName,
          'Hadir': monthPresent,
          'Izin': monthLeave,
          'Sakit': monthSick,
          'Alpha': monthAbsent
        };
      });
    } else {
      // Show only the selected month
      const selectedMonthName = monthNames[month];
      
      barChartData = [{
        month: selectedMonthName,
        'Hadir': presentCount,
        'Izin': leaveCount,
        'Sakit': sickCount,
        'Alpha': absentCount
      }];
    }
    
    // Update state with processed data
    setAttendanceData(cardData);
    setPieData(chartData);
    setBarData(barChartData);
    setTotalAttendance(totalStudents);
  };
  
  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSelectedMonth(null);
    } else {
      setSelectedMonth(parseInt(value));
    }
  };
  
  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };
  
  // Generate array of years (current year and 3 years before)
  const years = Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i);
  
  return (
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mx-auto my-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Absensi Kehadiran Keseluruhan</h1>
              
              {/* Filter controls */}
              <div className="flex space-x-4">
                <div>
                  <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 mb-1 text-">Bulan</label>
                  <select
                    id="month-filter"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedMonth !== null ? selectedMonth : ""}
                    onChange={handleMonthChange}
                  >
                    <option value="">Semua Bulan</option>
                    {monthNames.map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                  <select
                    id="year-filter"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Memuat data...</p>
              </div>
            ) : (
              <>
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">
                      Total Kehadiran {selectedMonth !== null ? monthNames[selectedMonth] : 'Tahun'} {selectedYear}
                    </h3>
                    <div className="h-[300px] w-full">
                      {barData.length > 0 ? (
                        <MyResponsiveBar data={barData} />
                      ) : (
                        <div className="flex justify-center items-center h-full">
                          <p className="text-gray-500">Data grafik tidak tersedia</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Pie Chart */}
                  <div className="w-full md:w-[45%] h-[500px] bg-white rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">
                      Distribusi Kehadiran {selectedMonth !== null ? monthNames[selectedMonth] : 'Tahun'} {selectedYear}
                    </h3>
                    <div className="h-[250px] w-full">
                      <MyResponsivePie 
                        data={pieData} 
                        totalAttendance={totalAttendance}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
  );
}