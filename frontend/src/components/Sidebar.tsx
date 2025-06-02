'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import axios from 'axios'

import {
  LayoutDashboard,
  BarChart3,
  Calendar,
  LogOut,
  FileText,
  X,
} from 'lucide-react'

interface SidebarProps {
  isMobileMenuOpen: boolean
  closeMobileMenu: () => void
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export default function Sidebar({ isMobileMenuOpen, closeMobileMenu }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'data-siswa', label: 'Data Siswa', icon: BarChart3, href: '/datasiswa' },
    { id: 'absensi-siswa', label: 'Absensi Siswa', icon: Calendar, href: '/absen' },
  ]

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      try {
        await axios.post(`${baseURL}/logout`, { refreshToken })
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Logout error:', error.response?.data || error.message)
        } else {
          console.error(error)
        }
      }
    } else {
      // Jika tidak ada refresh token, langsung redirect ke login
      window.location.href = '/login'
    }
  }

  return (
    <>
      {/* Overlay abu-abu transparan */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-400 bg-opacity-30 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 bottom-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header Logo + Close Button (untuk mobile) */}
          <div className="px-4 py-3 flex items-center justify-between space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
                <FileText size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 py-2">RFID</h1>
            </Link>
            {/* Tombol Close untuk mobile */}
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 space-y-2 flex-1">
            {menuItems.map(({ id, label, icon: Icon, href }) => (
              <Link
                key={id}
                href={href}
                onClick={closeMobileMenu}
                className={`block w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive(href)
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom Buttons */}
          <div className="p-3 border-t border-gray-100 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}