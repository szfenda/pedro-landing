'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import BrutalCard from '@/components/ui/BrutalCard'
import BrutalButton from '@/components/ui/BrutalButton'
import AuthNavigation from '@/components/layout/AuthNavigation'
import { mascots } from '@/lib/assets'
import { useTranslation } from '@/lib/i18n-context'

export default function NoBusinessPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleAddBusiness = () => {
    router.push('/register-business')
  }

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
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-pedro-dark mb-4">
              {t('noBusiness.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('noBusiness.subtitle')}
            </p>
          </div>

          {/* User info badge */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-pedro-purple text-white px-4 py-2 rounded-button font-bold">
              <span>{t('noBusiness.loggedAs')}</span>
              <span>{user?.email}</span>
            </div>
          </div>

          {/* Two main cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1: User App */}
            <BrutalCard size="lg" hover className="text-center">
              <div className="mb-6">
                <img
                  src={mascots.smartphone}
                  alt="Pedro with smartphone"
                  width={120}
                  height={120}
                  className="mx-auto animate-float"
                />
              </div>
              
              <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-4">
                {t('noBusiness.userCard.title')}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {t('noBusiness.userCard.description')}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-pedro-lime text-lg">✓</span>
                  <span>{t('noBusiness.userCard.benefit1')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-pedro-lime text-lg">✓</span>
                  <span>{t('noBusiness.userCard.benefit2')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-pedro-lime text-lg">✓</span>
                  <span>{t('noBusiness.userCard.benefit3')}</span>
                </div>
              </div>

              <BrutalButton
                variant="lime"
                size="lg"
                className="w-full"
                onClick={() => {
                  alert(t('common.appComingSoon'))
                }}
              >
                {t('noBusiness.userCard.cta')}
              </BrutalButton>
            </BrutalCard>

            {/* Card 2: Business */}
            <BrutalCard size="lg" hover className="text-center">
              <div className="mb-6">
                <img
                  src={mascots.thumbsUp}
                  alt="Pedro thumbs up"
                  width={120}
                  height={120}
                  className="mx-auto animate-float"
                  style={{ animationDelay: '0.5s' }}
                />
              </div>
              
              <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-4">
                {t('noBusiness.businessCard.title')}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {t('noBusiness.businessCard.description')}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-pedro-purple text-lg">🏪</span>
                  <span>{t('noBusiness.businessCard.benefit1')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-pedro-purple text-lg">📊</span>
                  <span>{t('noBusiness.businessCard.benefit2')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-pedro-purple text-lg">💰</span>
                  <span>{t('noBusiness.businessCard.benefit3')}</span>
                </div>
              </div>

              <BrutalButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleAddBusiness}
              >
                {t('noBusiness.businessCard.cta')}
              </BrutalButton>
            </BrutalCard>
          </div>

          {/* Info section */}
          <div className="mt-12 text-center">
            <div className="bg-pedro-light border-2 border-pedro-purple/20 rounded-card p-6 max-w-2xl mx-auto">
              <h3 className="font-bold text-pedro-dark mb-2">
                {t('noBusiness.platformInfo.title')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('noBusiness.platformInfo.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}