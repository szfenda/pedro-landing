'use client'

import { useAuth } from '@/lib/auth-context'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

interface AuthNavigationProps {
  showBackToLanding?: boolean
  userEmail?: string
  onLogout?: () => void
}

export default function AuthNavigation({ 
  showBackToLanding = true,
  userEmail,
  onLogout 
}: AuthNavigationProps) {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      onLogout?.()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-gradient-to-b from-black/20 via-black/10 to-transparent backdrop-blur-md border-b border-white/20">
      <div className="h-full flex items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="/"
            className="text-white font-headline text-2xl md:text-3xl font-bold transition-all duration-300 hover:rotate-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pedro-lime focus:ring-offset-2 focus:ring-offset-transparent rounded-lg p-1"
          >
            PEDRO
          </a>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* User info */}
              {(userEmail || user.email) && (
                <span className="hidden md:block text-white text-sm bg-black/20 px-3 py-1 rounded-button">
                  {userEmail || user.email}
                </span>
              )}
              
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="btn-brutal btn-brutal-purple px-4 py-2 text-sm hover:-translate-y-1 hover:shadow-brutal-lime transition-all duration-300"
              >
                Wyloguj
              </button>
            </>
          ) : (
            showBackToLanding && (
              <a
                href="/"
                className="btn-brutal btn-brutal-purple px-4 py-2 text-sm hover:-translate-y-1 hover:shadow-brutal-lime transition-all duration-300"
              >
                Wróć na stronę główną
              </a>
            )
          )}
        </div>
      </div>
    </nav>
  )
}