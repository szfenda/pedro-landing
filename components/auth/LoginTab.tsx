'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import BrutalInput from '@/components/ui/BrutalInput'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'

interface LoginTabProps {
  onSuccess: () => void
  onSwitchToRegister: () => void
  onSwitchToReset: () => void
}

export default function LoginTab({ 
  onSuccess, 
  onSwitchToRegister, 
  onSwitchToReset 
}: LoginTabProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      onSuccess()
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle Firebase Auth errors
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Nieprawidłowy email lub hasło.')
          break
        case 'auth/too-many-requests':
          setError('Zbyt wiele prób logowania. Spróbuj ponownie później.')
          break
        case 'auth/user-disabled':
          setError('To konto zostało zablokowane.')
          break
        default:
          setError('Wystąpił błąd podczas logowania. Spróbuj ponownie.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-bold text-pedro-dark mb-2">
          Logowanie
        </h2>
        <p className="text-gray-600">
          Wróć do polowania na promki
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

        <BrutalInput
          label="Hasło"
          type="password"
          placeholder="Twoje hasło"
          showPasswordToggle
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={onSwitchToReset}
            className="text-pedro-purple hover:text-pedro-dark transition-colors underline"
          >
            Zapomniałeś hasła?
          </button>
        </div>

        <BrutalButton
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Zaloguj się
        </BrutalButton>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Nie masz konta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-pedro-purple hover:text-pedro-dark transition-colors font-bold underline"
          >
            Załóż konto →
          </button>
        </p>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Logując się, akceptujesz{' '}
        <a href="#" className="underline hover:text-pedro-purple">
          Regulamin
        </a>{' '}
        i{' '}
        <a href="#" className="underline hover:text-pedro-purple">
          Politykę Prywatności
        </a>
        .
      </div>
    </div>
  )
}