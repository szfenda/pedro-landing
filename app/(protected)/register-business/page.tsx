'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import AuthNavigation from '@/components/layout/AuthNavigation'
import BusinessForm from '@/components/business/BusinessForm'
import { mascots } from '@/lib/assets'

export default function RegisterBusinessPage() {
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

  const handleCancel = () => {
    router.push('/no-business')
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
              Dodaj swój biznes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Wypełnij formularz, aby zarejestrować swoją firmę w PEDRO. 
              Zajmie to tylko kilka minut.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-pedro-purple/10 border-2 border-pedro-purple/20 rounded-card p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold text-pedro-dark mb-2">
                  Jak to działa?
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Wypełnij formularz rejestracji biznesu</li>
                  <li>• Wybierz pakiet płatności (Pay-per-Use)</li>
                  <li>• Zarządzaj ofertami w aplikacji mobilnej</li>
                  <li>• Płać tylko za wykorzystane kupony</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Business Form */}
          <div className="bg-white rounded-card brutal-border shadow-brutal-purple p-8">
            <BusinessForm onCancel={handleCancel} />
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