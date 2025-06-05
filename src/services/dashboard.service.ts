import { getAbsenList } from '@/lib/api';
import { Absensi } from '@/types';

// Service layer handling data fetching for the operational dashboard
export async function fetchDashboardAttendance(): Promise<Absensi[]> {
  try {
    return await getAbsenList();
  } catch (error) {
    console.error('Failed to fetch dashboard attendance:', error);
    return [];
  }
}
