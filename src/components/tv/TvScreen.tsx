'use client';

// Main TV display screen — full-screen attendance display optimized for 16:9 TVs
import { useCallback } from 'react';
import Image from 'next/image';
import { Maximize2, Minimize2, LogOut, Wifi } from 'lucide-react';
import { TvDisplayConfig, TvDisplayState, TodaySummary } from '@/types';
import { TvClock } from './TvClock';
import { TvOfflineBanner } from './TvOfflineBanner';
import { TvEventCard } from './TvEventCard';
import { cn } from '@/lib/utils';

interface TvScreenProps {
  config: TvDisplayConfig;
  displayState: TvDisplayState;
  summary: TodaySummary;
  isOnline: boolean;
  onClearConfig: () => void;
}

export function TvScreen({ config, displayState, summary, isOnline, onClearConfig }: TvScreenProps) {
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => null);
    } else {
      document.exitFullscreen().catch(() => null);
    }
  }, []);

  return (
    <div className="relative flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden select-none">
      {/* Realtime offline banner */}
      <TvOfflineBanner isOnline={isOnline} />

      {/* Top controls (minimal, fade on hover) */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
          isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        )}>
          <Wifi className="w-3 h-3" />
          {isOnline ? 'Terhubung' : 'Terputus'}
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title="Layar Penuh"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClearConfig}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title="Keluar dari Display"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-10 pt-8 pb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 relative flex-shrink-0">
            <Image src="/logo.png" alt="Logo SMKN 1 Jenangan" fill className="object-contain" priority />
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight leading-tight">SMKN 1 Jenangan Ponorogo</div>
            <div className="text-base text-white/60 font-medium">Sistem Presensi RFID — J-TAG</div>
          </div>
        </div>

        <TvClock className="text-right" />
      </header>

      {/* Divider */}
      <div className="mx-10 h-px bg-white/10 flex-shrink-0" />

      {/* Location badge */}
      {config.location && (
        <div className="flex justify-center mt-3 flex-shrink-0">
          <div className="px-5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold tracking-wider uppercase">
            {config.location}
          </div>
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        {displayState.kind === 'idle' && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
            {/* Waiting state - subtle pulse ring */}
            <div className="relative flex items-center justify-center">
              <div className="w-36 h-36 rounded-full bg-white/5 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/60 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white/80">Menunggu Kartu RFID</div>
              <div className="text-lg text-white/40 mt-2">Tempelkan kartu pada pembaca RFID</div>
            </div>
          </div>
        )}

        {(displayState.kind === 'success' || displayState.kind === 'already_recorded') && (
          <TvEventCard
            key={displayState.event.absensi_id}
            event={displayState.event}
            variant={displayState.kind === 'already_recorded' ? 'already_recorded' : 'success'}
          />
        )}

        {displayState.kind === 'unregistered' && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-28 h-28 rounded-full bg-amber-500/20 border-4 border-amber-500/40 flex items-center justify-center">
              <span className="text-5xl">⚠</span>
            </div>
            <div className="text-4xl font-bold text-amber-400">Kartu Tidak Terdaftar</div>
            <div className="text-xl text-white/60 text-center">
              Kartu RFID ini belum terdaftar.<br />Hubungi administrator.
            </div>
          </div>
        )}

        {displayState.kind === 'error' && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-28 h-28 rounded-full bg-red-500/20 border-4 border-red-500/40 flex items-center justify-center">
              <span className="text-5xl">✕</span>
            </div>
            <div className="text-4xl font-bold text-red-400">Presensi Gagal</div>
            <div className="text-xl text-white/60">Coba ulangi atau hubungi administrator</div>
          </div>
        )}
      </main>

      {/* Footer — daily summary */}
      <footer className="flex-shrink-0 px-10 pb-8 pt-4">
        <div className="mx-auto h-px bg-white/10 mb-4" />
        <div className="flex items-center justify-between">
          <div className="text-white/40 text-sm">
            Display: <span className="text-white/60 font-semibold">{config.display_name}</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold tabular-nums text-emerald-400">{summary.hadir}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-0.5">Hadir</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold tabular-nums text-slate-400">{summary.belum}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-0.5">Belum</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold tabular-nums text-white">{summary.total}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-0.5">Total</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
