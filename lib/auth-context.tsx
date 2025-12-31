'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)
      
      // Set auth cookie for middleware - poprawiona wersja dla Vercel
      if (user) {
        try {
          const token = await user.getIdToken()
          // Określ domenę na podstawie środowiska
          const isProduction = window.location.hostname !== 'localhost'
          const domain = isProduction ? `; domain=${window.location.hostname}` : ''
          
          document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; secure; samesite=strict${domain}`
          
          console.log('Auth cookie set successfully', { 
            hostname: window.location.hostname, 
            isProduction,
            userEmail: user.email 
          })
        } catch (error) {
          console.error('Error setting auth cookie:', error)
        }
      } else {
        // Clear auth cookie when user logs out
        document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        console.log('Auth cookie cleared')
      }
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)