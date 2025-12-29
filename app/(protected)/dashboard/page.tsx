'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, query, where, collection, getDocs, onSnapshot } from 'firebase/firestore'
import AuthNavigation from '@/components/layout/AuthNavigation'
import DashboardCard from '@/components/business/DashboardCard'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'
import { mascots } from '@/lib/assets'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [partner, setPartner] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

        // Set up real-time listener for partner updates
        const unsubscribe = onSnapshot(doc(db, 'partners', partnerDoc.id), (doc) => {
          if (doc.exists()) {
            setPartner({
              id: doc.id,
              ...doc.data(),
            })
          }
        })

        // Cleanup listener on unmount
        return () => unsubscribe()
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

  const handleManageBilling = () => {
    router.push('/billing')
  }

  const handleGoToApp = () => {
    // Placeholder - will be real app store links
    alert('Link do aplikacji mobilnej będzie dostępny wkrótce!')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-pedro-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pedro-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="font-headline text-xl font-bold text-pedro-dark mb-2">
            Ładowanie dashboardu...
          </h2>
          <p className="text-gray-600">
            Pobieramy dane Twojego biznesu
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

  const isPPUActive = partner.businessModel?.ppuEnabled || false
  const currentPhase = partner.businessModel?.currentPhase || 'beta_free'
  const monthlyUsage = partner.monthlyUsage || { redeemedCoupons: 0, totalAmount: 0 }

  return (
    <div className="min-h-screen bg-pedro-light">
      <AuthNavigation 
        showBackToLanding={false}
        userEmail={user?.email || undefined}
        onLogout={handleLogout}
      />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <img
                src={mascots.thumbsUp}
                alt="Pedro thumbs up"
                width={120}
                height={120}
                className="mx-auto animate-float"
              />
            </div>
            
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-pedro-dark mb-4">
              Dashboard biznesu
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Przegląd Twojego biznesu w PEDRO
            </p>
          </div>

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

          {/* Company Header */}
          <div className="bg-white rounded-card brutal-border shadow-brutal-purple p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-pedro-purple rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {partner.companyName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-headline text-2xl font-bold text-pedro-dark">
                    {partner.companyName}
                  </h2>
                  <p className="text-gray-600">
                    {partner.email} • {partner.businessType}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-3 py-1 rounded-button font-bold text-xs ${
                        partner.isActive
                          ? 'bg-pedro-lime text-pedro-dark'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {partner.isActive ? 'Aktywne' : 'Nieaktywne'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-button font-bold text-xs ${
                        isPPUActive
                          ? 'bg-pedro-purple text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {isPPUActive ? 'PPU' : 'Beta Free'}
                    </span>
                  </div>
                </div>
              </div>
              
              <BrutalButton
                variant="secondary"
                size="md"
                onClick={handleManageBilling}
              >
                Rozliczenia
              </BrutalButton>
            </div>
          </div>

          {/* Dashboard Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Status Biznesu Card */}
            <DashboardCard title="Status biznesu">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nazwa firmy:</span>
                  <span className="font-bold text-pedro-dark">{partner.companyName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">NIP:</span>
                  <span className="font-bold text-pedro-dark">{partner.nip}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Typ biznesu:</span>
                  <span className="font-bold text-pedro-dark capitalize">{partner.businessType}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status weryfikacji:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                    W toku
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status konta:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      partner.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {partner.isActive ? 'Aktywne' : 'Nieaktywne'}
                  </span>
                </div>
              </div>
            </DashboardCard>

            {/* Rozliczenia Card */}
            <DashboardCard 
              title="Rozliczenia"
              actions={
                <BrutalButton
                  variant="outline"
                  size="sm"
                  onClick={handleManageBilling}
                >
                  Zarządzaj
                </BrutalButton>
              }
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aktualny plan:</span>
                  <span className="font-bold text-pedro-dark">
                    {isPPUActive ? 'Pay-per-Use' : 'Beta Free'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status PPU:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      isPPUActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {isPPUActive ? 'Aktywne' : 'Nieaktywne'}
                  </span>
                </div>

                {isPPUActive && (
                  <>
                    <div className="border-t pt-4">
                      <h4 className="font-bold text-pedro-dark mb-3">Ten miesiąc:</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Wykorzystane kupony:</span>
                          <span className="font-bold text-pedro-purple">
                            {monthlyUsage.redeemedCoupons}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Łączna kwota:</span>
                          <span className="font-bold text-pedro-purple">
                            {(monthlyUsage.totalAmount / 100).toFixed(2)} zł
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <BrutalButton
                    variant="outline"
                    size="sm"
                    disabled
                    className="w-full"
                    title="Funkcja będzie dostępna wkrótce"
                  >
                    Pobierz fakturę
                  </BrutalButton>
                </div>
              </div>
            </DashboardCard>

            {/* Zarządzanie Ofertami Card */}
            <DashboardCard 
              title="Zarządzanie ofertami"
              actions={
                <BrutalButton
                  variant="lime"
                  size="sm"
                  onClick={handleGoToApp}
                >
                  Otwórz app
                </BrutalButton>
              }
            >
              <div className="text-center py-4">
                <div className="text-4xl mb-4">📱</div>
                <h4 className="font-bold text-pedro-dark mb-2">
                  Oferty i kupony dodasz w aplikacji mobilnej PEDRO
                </h4>
                <p className="text-gray-600 text-sm mb-6">
                  Panel webowy służy tylko do onboardingu i rozliczeń. 
                  Wszystkie funkcje produktowe są w aplikacji.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-pedro-lime text-lg">📝</span>
                    <span>Tworzenie promocji</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-pedro-lime text-lg">🎫</span>
                    <span>Zarządzanie kuponami</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-pedro-lime text-lg">📊</span>
                    <span>Statystyki sprzedaży</span>
                  </div>
                </div>

                <div className="mt-6">
                  <BrutalButton
                    variant="primary"
                    size="md"
                    onClick={handleGoToApp}
                    className="w-full"
                  >
                    Przejdź do aplikacji →
                  </BrutalButton>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Info Banner */}
          <div className="mt-12 bg-pedro-purple/10 border-2 border-pedro-purple/20 rounded-card p-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold text-pedro-dark mb-2">
                  Jak korzystać z PEDRO?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div>
                    <strong>1. Web (tutaj):</strong><br />
                    Rejestracja biznesu, płatności, faktury
                  </div>
                  <div>
                    <strong>2. Aplikacja mobilna:</strong><br />
                    Tworzenie ofert, zarządzanie kuponami
                  </div>
                  <div>
                    <strong>3. Klienci:</strong><br />
                    Znajdują Twoje promocje w aplikacji
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Masz pytania? Skontaktuj się z nami:{' '}
              <a href="mailto:biznes@pedro.app" className="text-pedro-purple underline">
                biznes@pedro.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}