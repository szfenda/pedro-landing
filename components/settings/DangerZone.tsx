'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deleteAccountSchema, deleteBusinessSchema, type DeleteAccountFormData, type DeleteBusinessFormData } from '@/lib/validations'
import BrutalInput from '@/components/ui/BrutalInput'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'
import { useTranslation } from '@/lib/i18n-context'

interface DangerZoneProps {
  hasPartner: boolean
  onDeleteBusiness: () => Promise<any>
  onDeleteAccount: () => Promise<any>
}

export default function DangerZone({ hasPartner, onDeleteBusiness, onDeleteAccount }: DangerZoneProps) {
  const { t } = useTranslation()
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
              <h3 className="font-bold text-red-700 mb-2">{t('dangerZone.deleteBusiness')}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('dangerZone.deleteBusinessDescription')}
              </p>
            </div>
            
            {!showDeleteBusiness && (
              <BrutalButton
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteBusiness(true)}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                {t('dangerZone.deleteBusiness')}
              </BrutalButton>
            )}
          </div>

          {showDeleteBusiness && (
            <form onSubmit={handleSubmitBusiness(handleDeleteBusiness)} className="space-y-4 p-4 bg-red-50 border-2 border-red-200 rounded-button">
              <div className="space-y-3">
                <h4 className="font-bold text-red-700">{t('dangerZone.deleteBusinessConfirmTitle')}</h4>
                
                <div className="bg-white p-3 rounded border text-sm">
                  <p className="font-medium text-red-700 mb-2">{t('dangerZone.deleteBusinessWarning')}</p>
                  <ul className="text-gray-700 space-y-1">
                    <li>• {t('dangerZone.deleteBusinessItem1')}</li>
                    <li>• {t('dangerZone.deleteBusinessItem2')}</li>
                    <li>• {t('dangerZone.deleteBusinessItem3')}</li>
                    <li>• {t('dangerZone.deleteBusinessItem4')}</li>
                  </ul>
                  <p className="font-medium text-green-700 mt-2">
                    {t('dangerZone.deleteBusinessSafe')}
                  </p>
                </div>

                <BrutalInput
                  label={t('dangerZone.deleteBusinessInput')}
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
                  {t('dangerZone.deleteBusinessSubmit')}
                </BrutalButton>
                
                <BrutalButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelBusiness}
                  disabled={loading}
                >
                  {t('dangerZone.cancel')}
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
            <h3 className="font-bold text-red-700 mb-2">{t('dangerZone.deleteAccount')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('dangerZone.deleteAccountDescription')}
            </p>
          </div>
          
          {!showDeleteAccount && (
            <BrutalButton
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteAccount(true)}
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              {t('dangerZone.deleteAccount')}
            </BrutalButton>
          )}
        </div>

        {showDeleteAccount && (
          <form onSubmit={handleSubmitAccount(handleDeleteAccount)} className="space-y-4 p-4 bg-red-50 border-2 border-red-200 rounded-button">
            <div className="space-y-3">
              <h4 className="font-bold text-red-700">{t('dangerZone.deleteAccountConfirmTitle')}</h4>
              
              <div className="bg-white p-3 rounded border text-sm">
                <p className="font-medium text-red-700 mb-2">{t('dangerZone.deleteAccountWarning')}</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• {t('dangerZone.deleteAccountItem1')}</li>
                  <li>• {t('dangerZone.deleteAccountItem2')}</li>
                  {hasPartner && <li>• {t('dangerZone.deleteAccountItem3')}</li>}
                  {hasPartner && <li>• {t('dangerZone.deleteAccountItem4')}</li>}
                  <li>• {t('dangerZone.deleteAccountItem5')}</li>
                  <li>• {t('dangerZone.deleteAccountItem6')}</li>
                </ul>
              </div>

              <BrutalInput
                label={t('dangerZone.deleteAccountPasswordLabel')}
                type="password"
                placeholder={t('dangerZone.deleteAccountPasswordPlaceholder')}
                helper={t('dangerZone.deleteAccountPasswordHelper')}
                error={accountErrors.password?.message}
                required
                {...registerAccount('password')}
              />

              <BrutalInput
                label={t('dangerZone.deleteAccountInput')}
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
                {t('dangerZone.deleteAccountSubmit')}
              </BrutalButton>
              
              <BrutalButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelAccount}
                disabled={loading}
              >
                {t('dangerZone.cancel')}
              </BrutalButton>
            </div>
          </form>
        )}
      </div>

      {/* Safety Notice */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-button p-4">
        <h4 className="font-bold text-yellow-800 mb-2">{t('dangerZone.safetyTitle')}</h4>
        <p className="text-sm text-yellow-700">
          {t('dangerZone.safetyDescription')}
        </p>
      </div>
    </div>
  )
}