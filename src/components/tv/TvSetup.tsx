'use client';

// TV setup/activation screen — shown when no display config is stored in localStorage
import { useState } from 'react';
import Image from 'next/image';
import { TvDisplayConfig } from '@/types';
import { cn } from '@/lib/utils';

interface TvSetupProps {
  onActivated: (config: TvDisplayConfig) => void;
}

export function TvSetup({ onActivated }: TvSetupProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/displays/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_code: code.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Kode tidak valid');
        return;
      }

      onActivated({
        display_code: data.display_code,
        display_name: data.display_name,
        location: data.location,
        display_id: data.display_id,
      });
    } catch {
      setError('Gagal terhubung ke server. Periksa koneksi internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-8 text-white">
      {/* Logo + identity */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="w-20 h-20 relative">
          <Image src="/logo.png" alt="Logo SMKN 1 Jenangan" fill className="object-contain" priority />
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold tracking-tight">J-TAG Display</div>
          <div className="text-lg text-white/50 mt-1">SMKN 1 Jenangan Ponorogo</div>
        </div>
      </div>

      {/* Setup card */}
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">Aktivasi Display</h1>
        <p className="text-white/50 text-center text-sm mb-8">
          Masukkan kode aktivasi yang diberikan oleh administrator
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="display-code" className="text-sm font-medium text-white/70">
              Kode Aktivasi
            </label>
            <input
              id="display-code"
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Contoh: GATE-1234"
              className={cn(
                'w-full px-4 py-3 rounded-xl bg-white/10 border text-white text-lg font-mono tracking-widest text-center',
                'placeholder:text-white/30 outline-none transition-colors',
                'focus:border-blue-500 focus:bg-white/15',
                error ? 'border-red-500/60' : 'border-white/20'
              )}
              disabled={loading}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className={cn(
              'w-full py-3 rounded-xl font-bold text-lg transition-all',
              'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              loading && 'animate-pulse'
            )}
          >
            {loading ? 'Memverifikasi...' : 'Aktifkan Display'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-white/30 text-sm text-center">
        Hubungi administrator untuk mendapatkan kode aktivasi
      </p>
    </div>
  );
}
