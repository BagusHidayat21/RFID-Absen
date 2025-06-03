'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import { usePathname, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
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

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthChecked, setIsAuthChecked] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const isLoginPage = pathname === '/login'

  const logout = async () => {
    try {
      const admin_id = localStorage.getItem('admin_id')
      if (admin_id) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, { admin_id })
      }
    } catch (error) {
      console.error('Gagal logout:', error)
    } finally {
      localStorage.clear()
      router.push('/login')
    }
  }


  const refreshTokens = async () => {
    try {
      const id = localStorage.getItem('id')
      if (!id) return false
  
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/token-refresh`, { admin_id: id })
  
      if (response.status === 200 && response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token)
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error('Refresh token gagal:', err)
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
      const adminId = localStorage.getItem('id')

      if (!adminId) {
        await logout()
        return
      }

      if (!accessToken || isTokenExpired(accessToken)) {
        const refreshed = await refreshTokens()
        if (!refreshed) {
          await logout()
          return
        }
      }
    }

    validateAuth().then(() => setIsAuthChecked(true))

    const interval = setInterval(() => {
      validateAuth()
    }, 600000) // tiap 10 menit

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