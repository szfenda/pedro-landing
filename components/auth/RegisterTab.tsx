'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { registerSchema, type RegisterFormData } from '@/lib/validations'
import BrutalInput from '@/components/ui/BrutalInput'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'
import { useTranslation } from '@/lib/i18n-context'

interface RegisterTabProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export default function RegisterTab({ 
  onSuccess, 
  onSwitchToLogin 
}: RegisterTabProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    setError(null)

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      )
      
      const user = userCredential.user

      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`,
      })

      // Create users document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: 'customer',
        emailVerified: user.emailVerified,
        createdAt: new Date(),
      })

      setSuccess(true)
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        onSuccess()
      }, 1500)

    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Handle Firebase Auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError(t('auth.errors.emailInUse'))
          break
        case 'auth/weak-password':
          setError(t('auth.errors.weakPassword'))
          break
        case 'auth/invalid-email':
          setError(t('auth.errors.invalidEmail'))
          break
        case 'auth/operation-not-allowed':
          setError(t('auth.errors.registrationDisabled'))
          break
        default:
          setError(t('auth.errors.genericRegister'))
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-2">
          {t('auth.register.successTitle')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('auth.register.successMessage')}
        </p>
        <div className="w-8 h-8 border-4 border-pedro-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-2">
          {t('auth.register.title')}
        </h2>
        <p className="text-gray-600">
          {t('auth.register.subtitle')}
        </p>
      </div>

      {error && (
        <BrutalAlert
          type="error"
          message={error}
          dismissible
          onDismiss={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BrutalInput
            label={t('auth.register.firstName')}
            type="text"
            placeholder={t('auth.register.firstNamePlaceholder')}
            error={errors.firstName?.message}
            {...register('firstName')}
          />

          <BrutalInput
            label={t('auth.register.lastName')}
            type="text"
            placeholder={t('auth.register.lastNamePlaceholder')}
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <BrutalInput
          label="Email"
          type="email"
          placeholder={t('auth.register.emailPlaceholder')}
          error={errors.email?.message}
          {...register('email')}
        />

        <BrutalInput
          label={t('securitySettings.password')}
          type="password"
          placeholder={t('auth.register.passwordPlaceholder')}
          showPasswordToggle
          error={errors.password?.message}
          helper={t('auth.register.passwordHelper')}
          {...register('password')}
        />

        <div className="bg-pedro-light p-4 rounded-card border-2 border-pedro-purple/20">
          <p className="text-sm text-gray-700">
            <strong>{t('auth.register.infoLabel')}</strong> {t('auth.register.infoNotice')}
          </p>
        </div>

        <BrutalButton
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {t('auth.register.submit')}
        </BrutalButton>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          {t('auth.register.hasAccount')}{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-pedro-purple hover:text-pedro-dark transition-colors font-bold underline"
          >
            {t('auth.register.loginLink')}
          </button>
        </p>
      </div>

      <div className="text-xs text-gray-500 text-center">
        {t('auth.register.termsNotice')}{' '}
        <Link href="/legal/regulamin" className="underline hover:text-pedro-purple">
          {t('auth.login.termsLink')}
        </Link>{' '}
        {t('auth.login.and')}{' '}
        <Link href="/legal/polityka-prywatnosci" className="underline hover:text-pedro-purple">
          {t('auth.login.privacyLink')}
        </Link>
        .
      </div>
    </div>
  )
}