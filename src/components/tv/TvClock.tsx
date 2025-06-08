'use client';

// Live clock component showing current time in WIB (Asia/Jakarta) timezone
import { useState, useEffect } from 'react';

interface TvClockProps {
  className?: string;
}

const WIB_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Jakarta',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const DATE_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Jakarta',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function TvClock({ className }: TvClockProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(WIB_FORMATTER.format(now));
      setDate(DATE_FORMATTER.format(now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={className}>
      <div className="text-5xl font-bold tabular-nums tracking-tight leading-none">
        {time || '--:--:--'} <span className="text-2xl font-semibold opacity-70">WIB</span>
      </div>
      <div className="text-base opacity-60 mt-1 capitalize">{date}</div>
    </div>
  );
}
