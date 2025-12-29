'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore'
import AuthNavigation from '@/components/layout/AuthNavigation'
import BillingCard from '@/components/business/BillingCard'
import BrutalAlert from '@/components/ui/BrutalAlert'
import { mascots } from '@/lib/assets'

function BillingContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [partner, setPartner] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Check for success/cancel from Stripe
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const sessionId = urlParams.get('session_id')
      const canceled = urlParams.get('canceled')

      if (sessionId) {
        setSuccessMessage('Płatność została pomyślnie skonfigurowana! Twój plan PPU jest teraz aktywny.')
      } else if (canceled) {
        setError('Płatność została anulowana. Możesz spróbować ponownie.')
      }
    }
  }, [])

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/auth')
      return
    }

    const fetchPartner = async () => {
      try {
        // Find partner for this user
        const partnersQuery = query(
          collection(db, 'partners'),
          where('userId', '==', user.uid)
        )
        const partnersSnapshot = await getDocs(partnersQuery)

        if (partnersSnapshot.empty) {
          // No partner found - redirect to no-business
          router.push('/no-business')
          return
        }

        const partnerDoc = partnersSnapshot.docs[0]
        const partnerData = {
          id: partnerDoc.id,
          ...partnerDoc.data(),
        }

        setPartner(partnerData)
      } catch (error) {
        console.error('Error fetching partner:', error)
        setError('Wystąpił błąd podczas ładowania danych. Spróbuj odświeżyć stronę.')
      } finally {
        setLoading(false)
      }
    }

    fetchPartner()
  }, [user, authLoading, router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleUpgrade = () => {
    // This will be handled by BillingCard component
  }

  const handleManageBilling = () => {
    // This will be handled by BillingCard component
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-pedro-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pedro-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="font-headline text-xl font-bold text-pedro-dark mb-2">
            Ładowanie danych...
          </h2>
          <p className="text-gray-600">
            Pobieramy informacje o Twoim koncie
          </p>
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-pedro-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-headline text-xl font-bold text-pedro-dark mb-2">
            Nie znaleziono biznesu
          </h2>
          <p className="text-gray-600 mb-4">
            Nie masz jeszcze zarejestrowanego biznesu.
          </p>
          <button
            onClick={() => router.push('/no-business')}
            className="text-pedro-purple underline"
          >
            Wróć do panelu głównego
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pedro-light">
      <AuthNavigation 
        showBackToLanding={false}
        userEmail={user?.email || undefined}
        onLogout={handleLogout}
      />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <img
                src={mascots.smartphone}
                alt="Pedro with smartphone"
                width={120}
                height={120}
                className="mx-auto animate-float"
              />
            </div>
            
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-pedro-dark mb-4">
              Rozliczenia i płatności
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Zarządzaj swoim planem płatności i śledź wykorzystanie kuponów.
            </p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-8">
              <BrutalAlert
                type="success"
                message={successMessage}
                dismissible
                onDismiss={() => setSuccessMessage(null)}
              />
            </div>
          )}

          {error && (
            <div className="mb-8">
              <BrutalAlert
                type="error"
                message={error}
                dismissible
                onDismiss={() => setError(null)}
              />
            </div>
          )}

          {/* Company Info */}
          <div className="bg-white rounded-card brutal-border shadow-brutal-purple p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pedro-purple rounded-full flex items-center justify-center text-white font-bold text-xl">
                {partner.companyName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-headline text-xl font-bold text-pedro-dark">
                  {partner.companyName}
                </h2>
                <p className="text-gray-600 text-sm">
                  {partner.email} • {partner.businessType}
                </p>
              </div>
            </div>
          </div>

          {/* Billing Card */}
          <BillingCard
            partner={partner}
            onUpgrade={handleUpgrade}
            onManageBilling={handleManageBilling}
          />

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Masz pytania dotyczące rozliczeń? Skontaktuj się z nami:{' '}
              <a href="mailto:billing@pedro.app" className="text-pedro-purple underline">
                billing@pedro.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-pedro-light flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pedro-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <BillingContent />
    </Suspense>
  )
}