'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deleteAccountSchema, deleteBusinessSchema, type DeleteAccountFormData, type DeleteBusinessFormData } from '@/lib/validations'
import BrutalInput from '@/components/ui/BrutalInput'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'

interface DangerZoneProps {
  hasPartner: boolean
  onDeleteBusiness: () => Promise<any>
  onDeleteAccount: () => Promise<any>
}

export default function DangerZone({ hasPartner, onDeleteBusiness, onDeleteAccount }: DangerZoneProps) {
  const [showDeleteBusiness, setShowDeleteBusiness] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Delete Business Form
  const {
    register: registerBusiness,
    handleSubmit: handleSubmitBusiness,
    formState: { errors: businessErrors },
    reset: resetBusiness,
  } = useForm<DeleteBusinessFormData>({
    resolver: zodResolver(deleteBusinessSchema),
  })

  // Delete Account Form
  const {
    register: registerAccount,
    handleSubmit: handleSubmitAccount,
    formState: { errors: accountErrors },
    reset: resetAccount,
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  })

  const handleDeleteBusiness = async (data: DeleteBusinessFormData) => {
    setLoading(true)
    setError(null)

    try {
      await onDeleteBusiness()
      setShowDeleteBusiness(false)
      resetBusiness()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async (data: DeleteAccountFormData) => {
    setLoading(true)
    setError(null)

    try {
      await onDeleteAccount()
      // User will be redirected automatically
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleCancelBusiness = () => {
    setShowDeleteBusiness(false)
    setError(null)
    resetBusiness()
  }

  const handleCancelAccount = () => {
    setShowDeleteAccount(false)
    setError(null)
    resetAccount()
  }

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

      {/* Delete Business Section */}
      {hasPartner && (
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-red-700 mb-2">Usuń biznes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Usuwa dane biznesu, anuluje subskrypcję, ale zachowuje konto użytkownika.
              </p>
            </div>
            
            {!showDeleteBusiness && (
              <BrutalButton
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteBusiness(true)}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                Usuń biznes
              </BrutalButton>
            )}
          </div>

          {showDeleteBusiness && (
            <form onSubmit={handleSubmitBusiness(handleDeleteBusiness)} className="space-y-4 p-4 bg-red-50 border-2 border-red-200 rounded-button">
              <div className="space-y-3">
                <h4 className="font-bold text-red-700">⚠️ Potwierdzenie usunięcia biznesu</h4>
                
                <div className="bg-white p-3 rounded border text-sm">
                  <p className="font-medium text-red-700 mb-2">Ta operacja spowoduje:</p>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Usunięcie wszystkich danych biznesu</li>
                    <li>• Anulowanie aktywnej subskrypcji Stripe</li>
                    <li>• Utratę dostępu do dashboardu biznesu</li>
                    <li>• Usunięcie wszystkich ofert i kuponów</li>
                  </ul>
                  <p className="font-medium text-green-700 mt-2">
                    ✅ Twoje konto użytkownika zostanie zachowane
                  </p>
                </div>

                <BrutalInput
                  label="Wpisz 'USUŃ BIZNES' aby potwierdzić"
                  type="text"
                  placeholder="USUŃ BIZNES"
                  error={businessErrors.confirmation?.message}
                  required
                  {...registerBusiness('confirmation')}
                />
              </div>

              <div className="flex gap-3">
                <BrutalButton
                  type="submit"
                  size="sm"
                  loading={loading}
                  className="flex-1 bg-red-600 text-white border-red-600 hover:bg-red-700 hover:shadow-brutal-red"
                >
                  🗑️ Usuń biznes
                </BrutalButton>
                
                <BrutalButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelBusiness}
                  disabled={loading}
                >
                  Anuluj
                </BrutalButton>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Delete Account Section */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-red-700 mb-2">Usuń konto</h3>
            <p className="text-sm text-gray-600 mb-4">
              Trwale usuwa konto i wszystkie powiązane dane. Ta operacja jest nieodwracalna.
            </p>
          </div>
          
          {!showDeleteAccount && (
            <BrutalButton
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteAccount(true)}
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              Usuń konto
            </BrutalButton>
          )}
        </div>

        {showDeleteAccount && (
          <form onSubmit={handleSubmitAccount(handleDeleteAccount)} className="space-y-4 p-4 bg-red-50 border-2 border-red-200 rounded-button">
            <div className="space-y-3">
              <h4 className="font-bold text-red-700">⚠️ UWAGA: Ta operacja jest nieodwracalna!</h4>
              
              <div className="bg-white p-3 rounded border text-sm">
                <p className="font-medium text-red-700 mb-2">Usunięcie konta spowoduje:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Trwałe usunięcie konta użytkownika</li>
                  <li>• Usunięcie wszystkich danych osobowych</li>
                  {hasPartner && <li>• Usunięcie danych biznesu</li>}
                  {hasPartner && <li>• Anulowanie aktywnej subskrypcji</li>}
                  <li>• Utratę dostępu do aplikacji</li>
                  <li>• Niemożność odzyskania danych</li>
                </ul>
              </div>

              <BrutalInput
                label="Obecne hasło"
                type="password"
                placeholder="Wpisz swoje hasło"
                helper="Wymagane do potwierdzenia tożsamości"
                error={accountErrors.password?.message}
                required
                {...registerAccount('password')}
              />

              <BrutalInput
                label="Wpisz 'USUŃ' aby potwierdzić"
                type="text"
                placeholder="USUŃ"
                error={accountErrors.confirmation?.message}
                required
                {...registerAccount('confirmation')}
              />
            </div>

            <div className="flex gap-3">
              <BrutalButton
                type="submit"
                size="sm"
                loading={loading}
                className="flex-1 bg-red-600 text-white border-red-600 hover:bg-red-700 hover:shadow-brutal-red"
              >
                🗑️ Usuń konto na zawsze
              </BrutalButton>
              
              <BrutalButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelAccount}
                disabled={loading}
              >
                Anuluj
              </BrutalButton>
            </div>
          </form>
        )}
      </div>

      {/* Safety Notice */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-button p-4">
        <h4 className="font-bold text-yellow-800 mb-2">🛡️ Bezpieczeństwo danych</h4>
        <p className="text-sm text-yellow-700">
          Wszystkie operacje usuwania są nieodwracalne i wykonywane natychmiast. 
          Upewnij się, że masz kopie zapasowe ważnych danych przed kontynuowaniem.
        </p>
      </div>
    </div>
  )
}