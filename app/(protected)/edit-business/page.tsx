'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, query, where, collection, getDocs } from 'firebase/firestore'
import AuthNavigation from '@/components/layout/AuthNavigation'
import BusinessForm from '@/components/business/BusinessForm'
import BrutalAlert from '@/components/ui/BrutalAlert'
import { mascots } from '@/lib/assets'
import { BusinessFormData } from '@/lib/validations'

export default function EditBusinessPage() {
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
      } catch (error) {
        console.error('Error fetching partner:', error)
        setError('Wystąpił błąd podczas ładowania danych biznesu.')
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

  const handleCancel = () => {
    router.push('/dashboard')
  }

  const handleSubmit = async (data: BusinessFormData) => {
    if (!partner) return

    try {
      const response = await fetch('/api/business/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerId: partner.id,
          ...data,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Wystąpił błąd podczas aktualizacji danych')
      }

      // Redirect to dashboard with success message
      router.push('/dashboard?updated=true')
    } catch (error: any) {
      setError(error.message || 'Wystąpił błąd podczas aktualizacji danych')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-pedro-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pedro-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="font-headline text-xl font-bold text-pedro-dark mb-2">
            Ładowanie danych biznesu...
          </h2>
          <p className="text-gray-600">
            Pobieramy aktualne informacje
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

  // Prepare initial data for the form
  const initialData: Partial<BusinessFormData> = {
    companyName: partner.companyName,
    nip: partner.nip,
    businessType: partner.businessType,
    address: partner.address,
    email: partner.email,
    phone: partner.phone,
    contactPersonName: partner.contactPersonName,
    website: partner.website || '',
    description: partner.description,
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
              Edytuj dane biznesu
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Zaktualizuj informacje o swoim biznesie. Wszystkie zmiany zostaną 
              natychmiast zapisane.
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

          {/* Info Card */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-card p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h3 className="font-bold text-pedro-dark mb-2">
                  Informacje o edycji
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Możesz edytować wszystkie dane biznesu</li>
                  <li>• Zmiany w danych mogą wymagać ponownej weryfikacji</li>
                  <li>• Aktualizacja NIP może wpłynąć na rozliczenia</li>
                  <li>• Wszystkie zmiany są zapisywane natychmiast</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Business Form */}
          <div className="bg-white rounded-card brutal-border shadow-brutal-purple p-8">
            <BusinessForm 
              mode="edit"
              partnerId={partner.id}
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
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