'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import BrutalCard from '@/components/ui/BrutalCard'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'
import { useTranslation } from '@/lib/i18n-context'

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
  const { t } = useTranslation()
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
      setError(t('billingPage.checkoutError'))
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
      setError(t('billingPage.portalError'))
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
            {t('billingPage.accountStatus')}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span
              className={`px-4 py-2 rounded-button font-bold text-sm ${
                isPPUActive
                  ? 'bg-pedro-lime text-pedro-dark'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {isPPUActive ? t('billingPage.ppuActive') : t('billingPage.betaFree')}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-bold text-pedro-dark mb-2">
              {isPPUActive ? t('billingPage.payPerUse') : t('billingPage.betaFree')}
            </h3>
            <p className="text-gray-600 text-sm">
              {isPPUActive
                ? t('billingPage.ppuDescription')
                : t('billingPage.betaDescription')
              }
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-pedro-lime text-lg">✓</span>
              <span>{t('billingPage.addPromo')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-pedro-lime text-lg">✓</span>
              <span>{t('billingPage.manageCoupons')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className={isPPUActive ? 'text-pedro-lime' : 'text-gray-400'}>
                {isPPUActive ? '✓' : '○'}
              </span>
              <span className={isPPUActive ? '' : 'text-gray-400'}>
                {t('billingPage.payForEffect')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className={isPPUActive ? 'text-pedro-lime' : 'text-gray-400'}>
                {isPPUActive ? '✓' : '○'}
              </span>
              <span className={isPPUActive ? '' : 'text-gray-400'}>
                {t('billingPage.detailedStats')}
              </span>
            </div>
          </div>
        </div>
      </BrutalCard>

      {/* Usage Statistics (if PPU active) */}
      {isPPUActive && partner.monthlyUsage && (
        <BrutalCard size="lg">
          <h3 className="font-headline text-xl font-bold text-pedro-dark mb-4">
            {t('billingPage.monthlyStats')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pedro-purple mb-2">
                {partner.monthlyUsage.redeemedCoupons}
              </div>
              <p className="text-gray-600 text-sm">{t('billingPage.redeemedCoupons')}</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-pedro-purple mb-2">
                {(partner.monthlyUsage.totalAmount / 100).toFixed(2)} zł
              </div>
              <p className="text-gray-600 text-sm">{t('billingPage.totalAmount')}</p>
            </div>
          </div>
        </BrutalCard>
      )}

      {/* Actions */}
      <BrutalCard size="lg">
        <h3 className="font-headline text-xl font-bold text-pedro-dark mb-4">
          {t('billingPage.managePlan')}
        </h3>

        <div className="space-y-4">
          {!isPPUActive ? (
            <>
              <p className="text-gray-600 text-sm mb-4">
                {t('billingPage.activatePPUDescription')}
              </p>
              <BrutalButton
                variant="primary"
                size="lg"
                loading={loading}
                onClick={handleUpgrade}
                className="w-full"
              >
                {t('billingPage.activatePPU')}
              </BrutalButton>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-sm mb-4">
                {t('billingPage.managePaymentDescription')}
              </p>
              <BrutalButton
                variant="secondary"
                size="lg"
                loading={loading}
                onClick={handleManageBilling}
                className="w-full"
              >
                {t('billingPage.managePayment')}
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
            {t('billingPage.downloadInvoice')}
          </BrutalButton>
        </div>
      </BrutalCard>

      {/* Information */}
      <BrutalCard size="md" className="bg-pedro-light/50">
        <div className="text-center">
          <h4 className="font-bold text-pedro-dark mb-2">
            {t('billingPage.webPanelInfo')}
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            {t('billingPage.mobileAppInfo')}
          </p>
          <BrutalButton
            variant="lime"
            size="sm"
            onClick={() => {
              alert(t('common.appComingSoon'))
            }}
          >
            {t('billingPage.goToApp')}
          </BrutalButton>
        </div>
      </BrutalCard>
    </div>
  )
}