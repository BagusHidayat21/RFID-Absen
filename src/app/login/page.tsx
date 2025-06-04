'use client';

// Modern minimalist authentication portal with ambient spotlight design and Supabase Auth integration
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ShieldCheck,
  Radio,
  ArrowRight,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: 'admin',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const rawInput = formData.username.trim();
      const email = rawInput.includes('@')
        ? rawInput
        : rawInput.toLowerCase() === 'admin'
        ? 'admin@jtag.id'
        : `${rawInput}@jtag.id`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      const displayName = data.user?.user_metadata?.username || rawInput || 'admin';
      localStorage.setItem('username', displayName);
      localStorage.setItem('id', data.user?.id || '');

      setIsLoading(false);
      window.location.href = '/';
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message || 'Username atau password tidak sesuai.');
    }
  };

  const fillDefaultCredentials = () => {
    setFormData({
      username: 'admin',
      password: 'JtagAdmin2026!',
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 relative overflow-hidden">
      {/* Subtle Ambient Background Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-100/60 to-slate-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-[400px]">
        {/* Brand Crest */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 relative flex items-center justify-center mb-3">
            <Image
              src="/logo.png"
              alt="Logo SMKN 1 Jenangan"
              width={56}
              height={56}
              className="w-14 h-14 object-contain"
              priority
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white border border-slate-200 text-slate-600 shadow-2xs mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SMK Negeri 1 Jenangan</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Masuk ke J-TAG
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Panel Operasional Presensi Siswa Berbasis RFID
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium leading-relaxed">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-semibold text-slate-700">
                Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="admin atau admin@jtag.id"
                  required
                  autoComplete="username"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan password akun"
                  required
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white rounded-lg text-sm font-semibold shadow-xs transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk Panel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick-fill Hint */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Akun demo/default?</span>
            <button
              type="button"
              onClick={fillDefaultCredentials}
              className="text-sky-700 hover:text-sky-900 font-semibold underline underline-offset-2 transition-colors"
            >
              Isi otomatis (admin)
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-5">
          Sistem Presensi Siswa SMKN 1 Jenangan &bull; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
