// Service layer for dashboard attendance dataset queries
import { getAbsenList } from '@/lib/api';
import { Absensi } from '@/types';

export async function fetchDashboardAttendance(): Promise<Absensi[]> {
  try {
    return await getAbsenList();
  } catch (error) {
    console.error('Failed to fetch dashboard attendance:', error);
    return [];
  }
}
