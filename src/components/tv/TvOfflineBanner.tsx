'use client';

// Banner shown when Supabase Realtime connection is lost — auto-hides when reconnected
import { Wifi, WifiOff } from 'lucide-react';

interface TvOfflineBannerProps {
  isOnline: boolean;
}

export function TvOfflineBanner({ isOnline }: TvOfflineBannerProps) {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-3 bg-red-600/95 backdrop-blur-sm py-3 px-6 animate-in slide-in-from-top duration-300">
      <WifiOff className="w-5 h-5 text-white flex-shrink-0" />
      <span className="text-white font-semibold text-lg">
        Koneksi terputus — Menunggu sambungan ulang...
      </span>
      <Wifi className="w-5 h-5 text-white/40 flex-shrink-0" />
    </div>
  );
}
