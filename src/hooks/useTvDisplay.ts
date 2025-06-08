'use client';

// TV hook orchestrating Supabase Realtime subscription, heartbeat, and display state machine
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { TvDisplayConfig, TvDisplayState, TvAttendanceEvent, TodaySummary } from '@/types';
import { getAbsensiEventById, getLatestAbsensiToday } from '@/services/tv.service';
import { getTodaySummary } from '@/services/display.service';

const STORAGE_KEY = 'jtag_tv_config';
const HEARTBEAT_INTERVAL_MS = 30_000;
const EVENT_DISPLAY_DURATION_MS = 8_000;

export function useTvDisplay() {
  const [config, setConfig] = useState<TvDisplayConfig | null>(null);
  const [displayState, setDisplayState] = useState<TvDisplayState>({ kind: 'idle' });
  const [summary, setSummary] = useState<TodaySummary>({ hadir: 0, total: 0, belum: 0 });
  const [isOnline, setIsOnline] = useState(true);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  const eventTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Load stored config from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TvDisplayConfig;
        setConfig(parsed);
      }
    } catch {
      // Ignore parse errors
    }
    setIsConfigLoaded(true);
  }, []);

  // Persist config to localStorage whenever it changes
  const saveConfig = useCallback((cfg: TvDisplayConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    setConfig(cfg);
  }, []);

  // Clear config (logout TV)
  const clearConfig = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConfig(null);
    setDisplayState({ kind: 'idle' });
  }, []);

  // Show an attendance event and auto-reset to idle after display duration
  const showEvent = useCallback((event: TvAttendanceEvent) => {
    if (eventTimerRef.current) clearTimeout(eventTimerRef.current);

    setDisplayState({ kind: 'success', event });

    // Refresh summary on each new event
    getTodaySummary().then(setSummary).catch(() => null);

    eventTimerRef.current = setTimeout(() => {
      setDisplayState({ kind: 'idle' });
    }, EVENT_DISPLAY_DURATION_MS);
  }, []);

  // Supabase Realtime subscription
  useEffect(() => {
    if (!config) return;

    // Load latest event on initial mount for context
    getLatestAbsensiToday(1).then(events => {
      if (events.length > 0 && displayState.kind === 'idle') {
        // Don't auto-show historical events — just initialize summary
      }
    });

    getTodaySummary().then(setSummary).catch(() => null);

    // Create channel
    const channel = supabase
      .channel(`tv-absensi-${config.display_code}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'jtag', table: 'absensi' },
        async (payload) => {
          const newRecord = payload.new as { id: number };
          if (!newRecord?.id) return;

          const event = await getAbsensiEventById(newRecord.id);
          if (event) showEvent(event);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setIsOnline(true);
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setIsOnline(false);
        if (status === 'CLOSED') setIsOnline(false);
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.display_code]);

  // Heartbeat interval
  useEffect(() => {
    if (!config) return;

    const sendHeartbeat = () => {
      fetch('/api/displays/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_code: config.display_code }),
      }).catch(() => null);
    };

    sendHeartbeat(); // immediately on mount
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [config]);

  // Cleanup event timer on unmount
  useEffect(() => {
    return () => {
      if (eventTimerRef.current) clearTimeout(eventTimerRef.current);
    };
  }, []);

  return {
    config,
    saveConfig,
    clearConfig,
    displayState,
    summary,
    isOnline,
    isConfigLoaded,
  };
}
