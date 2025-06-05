// Thin route entry page delegating to DashboardPage feature component
'use client';

import { DashboardPage } from '@/features/dashboard';

export default function HomeRoutePage() {
  return <DashboardPage />;
}