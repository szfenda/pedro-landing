'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ResolverPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth')
      return
    }

    const checkUserBusiness = async () => {
      try {
        // Check if USER document exists
        const userDoc = await getDoc(doc(db, 'USER', user.uid))
        
        if (!userDoc.exists()) {
          console.error('USER document not found for uid:', user.uid)
          // Could create USER document here or redirect to error page
          router.push('/auth')
          return
        }

        // Check if PARTNER exists for this user
        const partnersQuery = query(
          collection(db, 'PARTNER'),
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
        // In case of error, redirect to no-business as safe fallback
        router.push('/no-business')
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