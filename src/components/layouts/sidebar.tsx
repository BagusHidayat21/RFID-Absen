'use client';

// Navigation sidebar organizing all primary operational routes with clean active state styling
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  CalendarCheck,
  Users,
  GraduationCap,
  School,
  X,
  PanelLeftClose,
  ChevronDown,
  ChevronRight,
  Tv,
} from 'lucide-react';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

export function Sidebar({ isMobileMenuOpen, closeMobileMenu }: SidebarProps) {
  const pathname = usePathname();
  const [isMasterDataOpen, setIsMasterDataOpen] = useState<boolean>(true);
  const { ConfirmDialog } = useConfirmDialog();

  return (
    <>
      <ConfirmDialog />
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-slate-100 z-40 flex flex-col flex-shrink-0 transition-transform duration-200 ease-in-out select-none',
          isMobileMenuOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-50 flex-shrink-0">
          <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-3 group">
            <div className="w-9 h-9 relative flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="Logo SMKN 1 Jenangan"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                J-TAG
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight mt-1">
                SMKN 1 Jenangan
              </span>
            </div>
          </Link>

          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Tutup navigasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {/* Presensi & Monitoring */}
          <div>
            <p className="px-3.5 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Presensi &amp; Monitoring
            </p>
            <nav className="space-y-1">
              {/* Dashboard */}
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={cn(
                  'relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group',
                  pathname === '/'
                    ? 'bg-blue-50/80 text-blue-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                )}
              >
                {pathname === '/' && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
                )}
                <div className="flex items-center space-x-3">
                  <LayoutGrid
                    className={cn(
                      'w-4 h-4 transition-colors',
                      pathname === '/' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  <span>Dashboard</span>
                </div>
              </Link>

              {/* Presensi Siswa */}
              <Link
                href="/absen"
                onClick={closeMobileMenu}
                className={cn(
                  'relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group',
                  pathname.startsWith('/absen')
                    ? 'bg-blue-50/80 text-blue-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                )}
              >
                {pathname.startsWith('/absen') && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
                )}
                <div className="flex items-center space-x-3">
                  <CalendarCheck
                    className={cn(
                      'w-4 h-4 transition-colors',
                      pathname.startsWith('/absen') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  <span>Presensi Siswa</span>
                </div>
              </Link>
            </nav>
          </div>

          {/* Master Data */}
          <div>
            <button
              onClick={() => setIsMasterDataOpen(!isMasterDataOpen)}
              className="w-full px-3.5 mb-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
            >
              <span>Master Data</span>
              {isMasterDataOpen ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
            </button>

            {isMasterDataOpen && (
              <nav className="space-y-1">
                {/* Data Siswa */}
                <Link
                  href="/datasiswa"
                  onClick={closeMobileMenu}
                  className={cn(
                    'relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group',
                    pathname === '/datasiswa'
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  )}
                >
                  {pathname === '/datasiswa' && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
                  )}
                  <div className="flex items-center space-x-3">
                    <Users
                      className={cn(
                        'w-4 h-4 transition-colors',
                        pathname === '/datasiswa' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>Data Siswa</span>
                  </div>
                </Link>

                {/* Data Jurusan */}
                <Link
                  href="/master/jurusan"
                  onClick={closeMobileMenu}
                  className={cn(
                    'relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group',
                    pathname.startsWith('/master/jurusan')
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  )}
                >
                  {pathname.startsWith('/master/jurusan') && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
                  )}
                  <div className="flex items-center space-x-3">
                    <GraduationCap
                      className={cn(
                        'w-4 h-4 transition-colors',
                        pathname.startsWith('/master/jurusan') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>Data Jurusan</span>
                  </div>
                </Link>

                {/* Data Kelas & Rombel */}
                <Link
                  href="/master/kelas"
                  onClick={closeMobileMenu}
                  className={cn(
                    'relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group',
                    pathname.startsWith('/master/kelas')
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  )}
                >
                  {pathname.startsWith('/master/kelas') && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
                  )}
                  <div className="flex items-center space-x-3">
                    <School
                      className={cn(
                        'w-4 h-4 transition-colors',
                        pathname.startsWith('/master/kelas') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>Data Kelas &amp; Rombel</span>
                  </div>
                </Link>
              </nav>
            )}
          </div>

          {/* Perangkat & Display */}
          <div>
            <p className="px-3.5 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Perangkat &amp; Display
            </p>
            <nav className="space-y-1">
              <Link
                href="/settings/displays"
                onClick={closeMobileMenu}
                className={cn(
                  'relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group',
                  pathname.startsWith('/settings/displays')
                    ? 'bg-blue-50/80 text-blue-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                )}
              >
                {pathname.startsWith('/settings/displays') && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
                )}
                <div className="flex items-center space-x-3">
                  <Tv
                    className={cn(
                      'w-4 h-4 transition-colors',
                      pathname.startsWith('/settings/displays') ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  <span>Display TV</span>
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
