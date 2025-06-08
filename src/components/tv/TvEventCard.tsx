'use client';

// Animated attendance event card showing student details after RFID scan
import { CheckCircle2, Clock, User } from 'lucide-react';
import { TvAttendanceEvent } from '@/types';
import { cn } from '@/lib/utils';

interface TvEventCardProps {
  event: TvAttendanceEvent;
  variant?: 'success' | 'already_recorded';
}

const TIME_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Jakarta',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export function TvEventCard({ event, variant = 'success' }: TvEventCardProps) {
  const isSuccess = variant === 'success';

  // Format time — jam is a postgres time string like "07:12:34"
  const displayTime = event.jam ? event.jam.slice(0, 8) : '--:--:--';

  return (
    <div
      className={cn(
        'relative w-full max-w-3xl mx-auto rounded-3xl overflow-hidden',
        'animate-in fade-in zoom-in-95 duration-500',
        isSuccess
          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30'
          : 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-2xl shadow-amber-500/30'
      )}
    >
      {/* Decorative background circle */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 px-12 py-10 flex flex-col items-center gap-6 text-white">
        {/* Status header */}
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-10 h-10 text-white drop-shadow" />
          <span className="text-2xl font-bold tracking-wide uppercase">
            {isSuccess ? 'Presensi Berhasil' : 'Sudah Presensi'}
          </span>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-white/30" />

        {/* Student info */}
        <div className="flex flex-col items-center gap-2">
          {/* Avatar circle */}
          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center mb-2">
            <User className="w-12 h-12 text-white/90" />
          </div>

          <div className="text-5xl font-extrabold text-center leading-tight tracking-tight drop-shadow-lg">
            {event.nama}
          </div>
          <div className="text-2xl font-semibold text-white/85 text-center">
            {event.kelas} {event.jurusan}
            {event.pararel ? ` ${event.pararel}` : ''}
          </div>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-white/30" />

        {/* Time & keterangan */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-3xl font-bold tabular-nums">
            <Clock className="w-7 h-7 text-white/70" />
            {displayTime} WIB
          </div>
          {event.keterangan && (
            <div
              className={cn(
                'mt-2 px-5 py-1.5 rounded-full text-base font-semibold',
                event.keterangan === 'Terlambat'
                  ? 'bg-red-500/30 text-white'
                  : 'bg-white/20 text-white'
              )}
            >
              {event.keterangan}
            </div>
          )}
          {!isSuccess && (
            <div className="mt-2 text-white/80 text-lg text-center">
              Absensi hari ini sudah tercatat sebelumnya
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
