'use client';

// Application layout provider managing navigation and native Supabase Auth session state
import React, { useEffect, useState } from 'react'
import { Sidebar, Topbar } from '@/components/layouts'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthChecked, setIsAuthChecked] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const isLoginPage = pathname === '/login'

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!mounted) return

      if (!session && !isLoginPage) {
        router.push('/login')
      } else if (session && isLoginPage) {
        router.push('/')
      } else {
        setIsAuthChecked(true)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (!session && !isLoginPage) {
        router.push('/login')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [pathname, isLoginPage, router])

  if (!isAuthChecked) return null

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {!isLoginPage ? (
        <>
          <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <Topbar isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
          </div>
        </>
      ) : (
        <div className="flex-1 h-screen w-full overflow-y-auto">{children}</div>
      )}
    </div>
  );
}