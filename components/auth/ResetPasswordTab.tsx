'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations'
import BrutalInput from '@/components/ui/BrutalInput'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'

interface ResetPasswordTabProps {
  onBackToLogin: () => void
}

export default function ResetPasswordTab({ onBackToLogin }: ResetPasswordTabProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true)
    setError(null)

    try {
      await sendPasswordResetEmail(auth, data.email)
      setSuccess(true)
      
      // Start cooldown
      setCooldown(30)
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch (error: any) {
      console.error('Password reset error:', error)
      
      // Handle Firebase Auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          // Don't reveal if user exists for security
          setSuccess(true)
          break
        case 'auth/invalid-email':
          setError('Nieprawidłowy format email.')
          break
        case 'auth/too-many-requests':
          setError('Zbyt wiele prób. Spróbuj ponownie później.')
          break
        default:
          setError('Wystąpił błąd. Spróbuj ponownie.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = () => {
    const email = getValues('email')
    if (email) {
      onSubmit({ email })
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-2">
            Sprawdź pocztę
          </h2>
          <p className="text-gray-600 mb-6">
            Jeśli konto istnieje, wysłaliśmy link do resetu hasła na:{' '}
            <strong>{getValues('email')}</strong>
          </p>
        </div>

        <BrutalAlert
          type="info"
          message="Sprawdź również folder spam. Link jest ważny przez 1 godzinę."
        />

        <div className="space-y-4">
          <BrutalButton
            onClick={handleResend}
            variant="secondary"
            size="lg"
            disabled={cooldown > 0}
            className="w-full"
          >
            {cooldown > 0 ? `Wyślij ponownie (${cooldown}s)` : 'Wyślij ponownie'}
          </BrutalButton>

          <BrutalButton
            onClick={onBackToLogin}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Wróć do logowania →
          </BrutalButton>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-2">
          Reset hasła
        </h2>
        <p className="text-gray-600">
          Podaj email, wyślemy Ci link do ustawienia nowego hasła.
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
        <BrutalInput
          label="Email"
          type="email"
          placeholder="np. ola@pedro.app"
          error={errors.email?.message}
          {...register('email')}
        />

        <BrutalButton
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Wyślij link resetujący
        </BrutalButton>
      </form>

      <div className="text-center">
        <button
          onClick={onBackToLogin}
          className="text-pedro-purple hover:text-pedro-dark transition-colors font-bold underline"
        >
          Wróć do logowania →
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Jeśli konto istnieje, wyślemy wiadomość na podany adres.
      </div>
    </div>
  )
}