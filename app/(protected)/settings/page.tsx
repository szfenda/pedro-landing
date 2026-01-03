'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, query, where, collection, getDocs } from 'firebase/firestore'
import AuthNavigation from '@/components/layout/AuthNavigation'
import UserSettingsForm from '@/components/settings/UserSettingsForm'
import SecuritySettings from '@/components/settings/SecuritySettings'
import BusinessSettingsCard from '@/components/settings/BusinessSettingsCard'
import DangerZone from '@/components/settings/DangerZone'
import BrutalAlert from '@/components/ui/BrutalAlert'
import { mascots } from '@/lib/assets'

export default function SettingsPage() {
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

        if (!partnersSnapshot.empty) {
          const partnerDoc = partnersSnapshot.docs[0]
          setPartner({
            id: partnerDoc.id,
            ...partnerDoc.data(),
          })
        }
      } catch (error) {
        console.error('Error fetching partner:', error)
        setError('Wystąpił błąd podczas ładowania danych.')
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

  const handleEmailUpdate = async (newEmail: string) => {
    try {
      const response = await fetch('/api/user/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmail }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Wystąpił błąd podczas aktualizacji emaila')
      }

      return result
    } catch (error: any) {
      throw new Error(error.message || 'Wystąpił błąd podczas aktualizacji emaila')
    }
  }

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Wystąpił błąd podczas zmiany hasła')
      }

      return result
    } catch (error: any) {
      throw new Error(error.message || 'Wystąpił błąd podczas zmiany hasła')
    }
  }

  const handleDeleteBusiness = async () => {
    if (!partner) return

    try {
      const response = await fetch('/api/business/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          partnerId: partner.id,
          confirmation: 'USUŃ BIZNES'
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Wystąpił błąd podczas usuwania biznesu')
      }

      // Refresh partner data
      setPartner(null)
      
      return result
    } catch (error: any) {
      throw new Error(error.message || 'Wystąpił błąd podczas usuwania biznesu')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          confirmation: 'USUŃ'
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Wystąpił błąd podczas usuwania konta')
      }

      // User will be automatically logged out
      router.push('/')
      
      return result
    } catch (error: any) {
      throw new Error(error.message || 'Wystąpił błąd podczas usuwania konta')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-pedro-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pedro-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="font-headline text-xl font-bold text-pedro-dark mb-2">
            Ładowanie ustawień...
          </h2>
          <p className="text-gray-600">
            Pobieramy dane Twojego konta
          </p>
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
                src={mascots.thumbsUp}
                alt="Pedro thumbs up"
                width={120}
                height={120}
                className="mx-auto animate-float"
              />
            </div>
            
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-pedro-dark mb-4">
              Ustawienia konta
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Zarządzaj swoimi danymi osobowymi, bezpieczeństwem i ustawieniami biznesu
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

          {/* Settings Sections */}
          <div className="space-y-8">
            {/* User Settings */}
            <div className="bg-white rounded-card brutal-border shadow-brutal-purple p-8">
              <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-6">
                Dane osobowe
              </h2>
              <UserSettingsForm 
                user={user!}
                onEmailUpdate={handleEmailUpdate}
              />
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-card brutal-border shadow-brutal-purple p-8">
              <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-6">
                Bezpieczeństwo
              </h2>
              <SecuritySettings 
                onPasswordChange={handlePasswordChange}
              />
            </div>

            {/* Business Settings (if user has business) */}
            {partner && (
              <div className="bg-white rounded-card brutal-border shadow-brutal-purple p-8">
                <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-6">
                  Dane biznesu
                </h2>
                <BusinessSettingsCard 
                  partner={partner}
                  loading={false}
                />
              </div>
            )}

            {/* Danger Zone */}
            <div className="bg-red-50 border-3 border-red-200 rounded-card p-8">
              <h2 className="font-headline text-2xl font-bold text-red-700 mb-6">
                Strefa niebezpieczna
              </h2>
              <DangerZone 
                hasPartner={!!partner}
                onDeleteBusiness={handleDeleteBusiness}
                onDeleteAccount={handleDeleteAccount}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              Masz pytania? Skontaktuj się z nami:{' '}
              <a href="mailto:kontakt@pedro.app" className="text-pedro-purple underline">
                kontakt@pedro.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}