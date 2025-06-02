'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface TopbarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export default function Topbar({ isMobileMenuOpen, toggleMobileMenu }: TopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white px-4 py-2 flex items-center justify-between fixed w-full top-0 z-50 lg:static">
      {/* Hamburger menu only on mobile */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle Sidebar"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">Dashboard</h1>

      {/* Profile */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{localStorage.getItem('username')?.[0]?.toUpperCase()}</span>
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-800">
              {localStorage.getItem('username')?.[0]?.toUpperCase()}
              {localStorage.getItem('username')?.slice(1)}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}