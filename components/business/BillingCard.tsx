'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import BrutalCard from '@/components/ui/BrutalCard'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'

interface PartnerData {
  id: string
  companyName: string
  businessModel: {
    currentPhase: string
    ppuEnabled: boolean
    ppuActivatedAt?: Date
  }
  billing: {
    stripeCustomerId?: string
    subscriptionId?: string
    subscriptionStatus?: string
  }
  monthlyUsage?: {
    redeemedCoupons: number
    totalAmount: number
  }
}

interface BillingCardProps {
  partner: PartnerData
  onUpgrade: () => void
  onManageBilling: () => void
}

export default function BillingCard({ 
  partner, 
  onUpgrade, 
  onManageBilling 
}: BillingCardProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const token = await user.getIdToken()
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          partnerId: partner.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error)
      setError('Wystąpił błąd podczas tworzenia sesji płatności. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const token = await user.getIdToken()
      
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          partnerId: partner.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error('Error creating portal session:', error)
      setError('Wystąpił błąd podczas otwierania panelu płatności. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  const isPPUActive = partner.businessModel.ppuEnabled
  const currentPhase = partner.businessModel.currentPhase

  return (
    <div className="space-y-6">
      {error && (
        <BrutalAlert
          type="error"
          message={error}
          dismissible
          onDismiss={() => setError(null)}
        />
      )}

      {/* Current Plan Status */}
      <BrutalCard size="lg">
        <div className="text-center mb-6">
          <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-2">
            Status konta
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span
              className={`px-4 py-2 rounded-button font-bold text-sm ${
                isPPUActive
                  ? 'bg-pedro-lime text-pedro-dark'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {isPPUActive ? 'PPU Aktywne' : 'Beta Free'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-bold text-pedro-dark mb-2">
              {isPPUActive ? 'Pay-per-Use' : 'Beta Free'}
            </h3>
            <p className="text-gray-600 text-sm">
              {isPPUActive
                ? 'Płacisz tylko za wykorzystane kupony'
                : 'Bezpłatny dostęp w fazie beta'
              }
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-pedro-lime text-lg">✓</span>
              <span>Dodawanie promocji</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-pedro-lime text-lg">✓</span>
              <span>Zarządzanie kuponami</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className={isPPUActive ? 'text-pedro-lime' : 'text-gray-400'}>
                {isPPUActive ? '✓' : '○'}
              </span>
              <span className={isPPUActive ? '' : 'text-gray-400'}>
                Płatność za efekt
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className={isPPUActive ? 'text-pedro-lime' : 'text-gray-400'}>
                {isPPUActive ? '✓' : '○'}
              </span>
              <span className={isPPUActive ? '' : 'text-gray-400'}>
                Szczegółowe statystyki
              </span>
            </div>
          </div>
        </div>
      </BrutalCard>

      {/* Usage Statistics (if PPU active) */}
      {isPPUActive && partner.monthlyUsage && (
        <BrutalCard size="lg">
          <h3 className="font-headline text-xl font-bold text-pedro-dark mb-4">
            Statystyki tego miesiąca
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pedro-purple mb-2">
                {partner.monthlyUsage.redeemedCoupons}
              </div>
              <p className="text-gray-600 text-sm">Wykorzystane kupony</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-pedro-purple mb-2">
                {(partner.monthlyUsage.totalAmount / 100).toFixed(2)} zł
              </div>
              <p className="text-gray-600 text-sm">Łączna kwota</p>
            </div>
          </div>
        </BrutalCard>
      )}

      {/* Actions */}
      <BrutalCard size="lg">
        <h3 className="font-headline text-xl font-bold text-pedro-dark mb-4">
          Zarządzanie planem
        </h3>

        <div className="space-y-4">
          {!isPPUActive ? (
            <>
              <p className="text-gray-600 text-sm mb-4">
                Aktywuj Pay-per-Use, aby płacić tylko za wykorzystane kupony.
              </p>
              <BrutalButton
                variant="primary"
                size="lg"
                loading={loading}
                onClick={handleUpgrade}
                className="w-full"
              >
                Aktywuj PPU →
              </BrutalButton>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-4">
                Zarządzaj swoim planem, metodami płatności i fakturami.
              </p>
              <BrutalButton
                variant="secondary"
                size="lg"
                loading={loading}
                onClick={handleManageBilling}
                className="w-full"
              >
                Zarządzaj płatnością
              </BrutalButton>
            </>
          )}

          <BrutalButton
            variant="outline"
            size="md"
            disabled
            className="w-full"
            title="Funkcja będzie dostępna wkrótce"
          >
            Pobierz fakturę
          </BrutalButton>
        </div>
      </BrutalCard>

      {/* Information */}
      <BrutalCard size="md" className="bg-pedro-light/50">
        <div className="text-center">
          <h4 className="font-bold text-pedro-dark mb-2">
            Panel webowy = onboarding + billing
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Oferty i kupony dodasz w aplikacji mobilnej PEDRO.
          </p>
          <BrutalButton
            variant="lime"
            size="sm"
            onClick={() => {
              // Placeholder - will be real app store links
              alert('Link do aplikacji mobilnej będzie dostępny wkrótce!')
            }}
          >
            Przejdź do aplikacji
          </BrutalButton>
        </div>
      </BrutalCard>
    </div>
  )
}