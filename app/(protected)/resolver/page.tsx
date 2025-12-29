'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { doc, getDoc, query, where, collection, getDocs, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ResolverPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth')
      return
    }

    const checkUserBusiness = async () => {
      try {
        // Check if users document exists
        let userDoc = await getDoc(doc(db, 'users', user.uid))
        
        // If user document doesn't exist, create it automatically
        if (!userDoc.exists()) {
          console.log('Creating users document for uid:', user.uid)
          try {
            await setDoc(doc(db, 'users', user.uid), {
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              userType: 'customer',
              emailVerified: user.emailVerified || false,
              createdAt: new Date(),
            })
            console.log('Users document created successfully')
          } catch (createError) {
            console.error('Error creating users document:', createError)
            router.push('/auth')
            return
          }
        }

        // Check if partners exists for this user
        const partnersQuery = query(
          collection(db, 'partners'),
          where('userId', '==', user.uid)
        )
        const partnersSnapshot = await getDocs(partnersQuery)

        if (partnersSnapshot.empty) {
          // No business - redirect to no-business view
          router.push('/no-business')
        } else {
          // Has business - redirect to dashboard
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking user business:', error)
        setError('Wystąpił błąd podczas sprawdzania konta. Spróbuj ponownie.')
        // In case of error, redirect to no-business as safe fallback after delay
        setTimeout(() => {
          router.push('/no-business')
        }, 3000)
      } finally {
        setChecking(false)
      }
    }

    checkUserBusiness()
  }, [user, loading, router])

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-pedro-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pedro-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="font-headline text-xl font-bold text-pedro-dark mb-2">
            Sprawdzamy Twoje konto...
          </h2>
          <p className="text-gray-600">
            Przekierowujemy Cię do odpowiedniego panelu
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-card max-w-md mx-auto">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pedro-light flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-headline text-xl font-bold text-pedro-dark mb-2">
          Przekierowywanie...
        </h2>
        <p className="text-gray-600">
          Jeśli nie zostałeś przekierowany, <a href="/auth" className="text-pedro-purple underline">kliknij tutaj</a>
        </p>
      </div>
    </div>
  )
}