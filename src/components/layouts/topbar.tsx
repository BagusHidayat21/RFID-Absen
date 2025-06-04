'use client';

// Application top navigation bar providing global search, user profile menu, and responsive mobile trigger
import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Bell, LogOut, User, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopbarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export function Topbar({ isMobileMenuOpen, toggleMobileMenu }: TopbarProps) {
  const [adminName, setAdminName] = useState<string>('Admin TU');

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const name = session.user.user_metadata?.username || session.user.user_metadata?.name;
          if (name) setAdminName(name);
        } else {
          const stored = localStorage.getItem('username');
          if (stored) setAdminName(stored);
        }
      } catch (err) {
        console.error('Error loading session:', err);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* 1. Left Section: Mobile Trigger & Search Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-md">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari data siswa, presensi, kartu RFID..."
            className="w-full pl-10 pr-12 py-2 text-xs bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-slate-200/80 text-[10px] text-slate-400 font-mono">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* 2. Right Section: Notifications and User Dropdown */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        <button
          className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
          aria-label="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2.5 pl-1.5 focus:outline-none cursor-pointer rounded-full group">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all">
                  {adminName.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-800 capitalize leading-tight">{adminName}</p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">Admin Tata Usaha</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl border-slate-200 shadow-lg p-1.5">
            <DropdownMenuLabel className="font-normal p-2">
              <p className="text-xs font-semibold text-slate-900 capitalize">{adminName}</p>
              <p className="text-[10px] text-slate-400">admin@smkn1jenangan.sch.id</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-slate-100" />
            <DropdownMenuItem className="text-xs font-medium text-slate-700 rounded-lg cursor-pointer py-2">
              <User className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <span>Profil Pengguna</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs font-medium text-slate-700 rounded-lg cursor-pointer py-2">
              <Settings className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <span>Pengaturan Akun</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-slate-100" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-xs font-medium text-rose-600 rounded-lg cursor-pointer py-2 focus:bg-rose-50 focus:text-rose-700"
            >
              <LogOut className="w-3.5 h-3.5 mr-2 text-rose-500" />
              <span>Keluar (Sign Out)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Topbar;
