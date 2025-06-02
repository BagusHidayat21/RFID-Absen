'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'

// Fungsi sederhana decode token dan cek expiry (expects JWT format)
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp
    if (!exp) return true
    return Date.now() >= exp * 1000
  } catch {
    return true // jika error parsing, anggap expired
  }
}

// Fungsi cek apakah refresh token sudah expired
function isRefreshTokenExpired(refreshToken: string): boolean {
  // Biasanya refresh token juga JWT, jadi sama fungsi ceknya
  return isTokenExpired(refreshToken)
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthChecked, setIsAuthChecked] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const isLoginPage = pathname === '/login'

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  const refreshTokens = async (refreshToken: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/token-refresh`, {
        refreshToken,
      })
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      return true
    } catch (err) {
      return false
    }
  }

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthChecked(true)
      return
    }

    const validateAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      // Kalau gak ada token sama sekali
      if (!accessToken && !refreshToken) {
        logout()
        return
      }

      // Cek refresh token expired, kalau expired logout langsung tanpa coba refresh
      if (refreshToken && isRefreshTokenExpired(refreshToken)) {
        logout()
        return
      }

      // Jika accessToken expired, langsung coba refresh
      if (accessToken && isTokenExpired(accessToken)) {
        if (refreshToken) {
          const refreshed = await refreshTokens(refreshToken)
          if (!refreshed) {
            logout()
          }
        } else {
          logout()
        }
        return
      }

      // Kalau akses token valid (belum expired), tapi kita tetap refresh untuk perpanjang masa berlaku
      if (accessToken && refreshToken) {
        const refreshed = await refreshTokens(refreshToken)
        if (!refreshed) {
          logout()
        }
      }

      // Jika gak ada access token tapi ada refresh token, coba refresh juga
      if (!accessToken && refreshToken) {
        const refreshed = await refreshTokens(refreshToken)
        if (!refreshed) {
          logout()
        }
      }
    }

    // Jalankan validasi sekali saat mount
    validateAuth().then(() => setIsAuthChecked(true))

    // Set interval validasi setiap 10 menit (600000 ms)
    const interval = setInterval(() => {
      validateAuth()
    }, 600000) // 10 menit

    return () => clearInterval(interval)
  }, [pathname, isLoginPage, router])

  if (!isAuthChecked) return null

  return (
    <div className="flex min-h-screen">
      {!isLoginPage ? (
        <>
          <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />
          <div className="flex-1 flex flex-col w-full">
            <Topbar isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
            <main className="pt-16 lg:pt-0 flex-1 p-1 bg-gray-50">{children}</main>
          </div>
        </>
      ) : (
        <main className="flex-1 p-1 bg-gray-50">{children}</main>
      )}
    </div>
  )
}