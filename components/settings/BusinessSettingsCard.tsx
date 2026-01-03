'use client'

import { useRouter } from 'next/navigation'
import BrutalButton from '@/components/ui/BrutalButton'

interface BusinessSettingsCardProps {
  partner: any
  loading: boolean
}

export default function BusinessSettingsCard({ partner, loading }: BusinessSettingsCardProps) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🏢</div>
        <h3 className="font-bold text-pedro-dark mb-2">
          Nie masz zarejestrowanego biznesu
        </h3>
        <p className="text-gray-600 mb-6">
          Zarejestruj swój biznes, aby uzyskać dostęp do dashboardu i funkcji płatności.
        </p>
        <BrutalButton
          variant="primary"
          size="md"
          onClick={() => router.push('/register-business')}
        >
          Dodaj biznes
        </BrutalButton>
      </div>
    )
  }

  const isPPUActive = partner.businessModel?.ppuEnabled || false
  const currentPhase = partner.businessModel?.currentPhase || 'beta_free'

  return (
    <div className="space-y-6">
      {/* Business Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-pedro-dark mb-1">
              Nazwa firmy
            </label>
            <p className="text-pedro-dark">{partner.companyName}</p>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-pedro-dark mb-1">
              NIP
            </label>
            <p className="text-pedro-dark">{partner.nip}</p>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-pedro-dark mb-1">
              Typ biznesu
            </label>
            <p className="text-pedro-dark capitalize">{partner.businessType}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-pedro-dark mb-1">
              Email biznesu
            </label>
            <p className="text-pedro-dark">{partner.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-pedro-dark mb-1">
              Telefon
            </label>
            <p className="text-pedro-dark">{partner.phone}</p>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-pedro-dark mb-1">
              Miasto
            </label>
            <p className="text-pedro-dark">{partner.address?.city}</p>
          </div>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-3">
        <span
          className={`px-3 py-1 rounded-button font-bold text-sm ${
            partner.isActive
              ? 'bg-pedro-lime text-pedro-dark'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {partner.isActive ? 'Aktywne' : 'Nieaktywne'}
        </span>
        
        <span
          className={`px-3 py-1 rounded-button font-bold text-sm ${
            isPPUActive
              ? 'bg-pedro-purple text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isPPUActive ? 'PPU Aktywne' : 'Beta Free'}
        </span>
        
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-button font-bold text-sm">
          Weryfikacja w toku
        </span>
      </div>

      {/* Business Description */}
      {partner.description && (
        <div>
          <label className="block text-sm font-bold text-pedro-dark mb-2">
            Opis biznesu
          </label>
          <p className="text-gray-700 bg-gray-50 p-3 rounded-button border">
            {partner.description}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
        <BrutalButton
          variant="primary"
          size="md"
          onClick={() => router.push('/edit-business')}
          className="flex-1"
        >
          ✏️ Edytuj dane biznesu
        </BrutalButton>
        
        <BrutalButton
          variant="outline"
          size="md"
          onClick={() => router.push('/dashboard')}
        >
          📊 Przejdź do dashboardu
        </BrutalButton>
      </div>

      {/* Business Info */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-button p-4">
        <h4 className="font-bold text-pedro-dark mb-2">ℹ️ Informacje</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Dane biznesu można edytować w dowolnym momencie</li>
          <li>• Zmiany w danych mogą wymagać ponownej weryfikacji</li>
          <li>• Zarządzanie ofertami odbywa się w aplikacji mobilnej</li>
          <li>• Rozliczenia i faktury dostępne w sekcji "Billing"</li>
        </ul>
      </div>
    </div>
  )
}