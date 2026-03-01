'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validations'
import BrutalInput from '@/components/ui/BrutalInput'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'
import { useTranslation } from '@/lib/i18n-context'

interface SecuritySettingsProps {
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<any>
}

export default function SecuritySettings({ onPasswordChange }: SecuritySettingsProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const newPassword = watch('newPassword')

  const onSubmit = async (data: ChangePasswordFormData) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await onPasswordChange(data.currentPassword, data.newPassword)
      setSuccess(t('securitySettings.passwordSuccess'))
      reset()
      setShowPasswordForm(false)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowPasswordForm(false)
    setError(null)
    setSuccess(null)
    reset()
  }

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const labels = [
      t('securitySettings.strengthVeryWeak'),
      t('securitySettings.strengthWeak'),
      t('securitySettings.strengthMedium'),
      t('securitySettings.strengthGood'),
      t('securitySettings.strengthVeryGood'),
    ]
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-300'
    }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  return (
    <div className="space-y-6">
      {success && (
        <BrutalAlert
          type="success"
          message={success}
          dismissible
          onDismiss={() => setSuccess(null)}
        />
      )}

      {error && (
        <BrutalAlert
          type="error"
          message={error}
          dismissible
          onDismiss={() => setError(null)}
        />
      )}

      {/* Password Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-button border-2 border-gray-200">
          <div>
            <label className="block text-sm font-bold text-pedro-dark mb-1">
              {t('securitySettings.password')}
            </label>
            <span className="text-gray-600">••••••••••••</span>
            <p className="text-xs text-gray-500 mt-1">
              {t('securitySettings.lastChanged')}
            </p>
          </div>
          
          {!showPasswordForm && (
            <BrutalButton
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordForm(true)}
            >
              {t('securitySettings.changePassword')}
            </BrutalButton>
          )}
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-blue-50 rounded-button border-2 border-blue-200">
            <h3 className="font-bold text-pedro-dark mb-4">{t('securitySettings.changePasswordTitle')}</h3>
            
            <BrutalInput
              label={t('securitySettings.currentPassword')}
              type="password"
              placeholder={t('securitySettings.currentPasswordPlaceholder')}
              error={errors.currentPassword?.message}
              required
              {...register('currentPassword')}
            />

            <BrutalInput
              label={t('securitySettings.newPassword')}
              type="password"
              placeholder={t('securitySettings.newPasswordPlaceholder')}
              helper={t('securitySettings.newPasswordHelper')}
              error={errors.newPassword?.message}
              required
              {...register('newPassword')}
            />

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('securitySettings.strengthLabel')}</span>
                  <span className={`font-medium ${
                    passwordStrength.strength >= 4 ? 'text-green-600' :
                    passwordStrength.strength >= 3 ? 'text-blue-600' :
                    passwordStrength.strength >= 2 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">
                  {t('securitySettings.strengthTip')}
                </div>
              </div>
            )}

            <BrutalInput
              label={t('securitySettings.confirmPassword')}
              type="password"
              placeholder={t('securitySettings.confirmPasswordPlaceholder')}
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword')}
            />

            <div className="flex gap-3">
              <BrutalButton
                type="submit"
                variant="primary"
                size="sm"
                loading={loading}
                className="flex-1"
              >
                {t('securitySettings.submit')}
              </BrutalButton>
              
              <BrutalButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                {t('securitySettings.cancel')}
              </BrutalButton>
            </div>

            <div className="text-xs text-gray-600 bg-white p-3 rounded border">
              <strong>Uwaga:</strong> {t('securitySettings.passwordNotice')}
            </div>
          </form>
        )}
      </div>

      {/* Security Tips */}
      <div className="p-4 bg-blue-50 rounded-button border-2 border-blue-200">
        <h3 className="font-bold text-pedro-dark mb-3">{t('securitySettings.tipsTitle')}</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• {t('securitySettings.tip1')}</li>
          <li>• {t('securitySettings.tip2')}</li>
          <li>• {t('securitySettings.tip3')}</li>
          <li>• {t('securitySettings.tip4')}</li>
          <li>• {t('securitySettings.tip5')}</li>
        </ul>
      </div>
    </div>
  )
}