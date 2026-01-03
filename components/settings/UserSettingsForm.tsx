'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'firebase/auth'
import { updateEmailSchema, type UpdateEmailFormData } from '@/lib/validations'
import BrutalInput from '@/components/ui/BrutalInput'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'

interface UserSettingsFormProps {
  user: User
  onEmailUpdate: (newEmail: string) => Promise<any>
}

export default function UserSettingsForm({ user, onEmailUpdate }: UserSettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateEmailFormData>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      newEmail: '',
      password: '',
    },
  })

  const onSubmit = async (data: UpdateEmailFormData) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await onEmailUpdate(data.newEmail)
      setSuccess('Email został zaktualizowany. Sprawdź swoją skrzynkę pocztową i potwierdź nowy adres.')
      reset()
      setShowEmailForm(false)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowEmailForm(false)
    setError(null)
    setSuccess(null)
    reset()
  }

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

      {/* Current Email Display */}
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-button border-2 border-gray-200">
          <div>
            <label className="block text-sm font-bold text-pedro-dark mb-1">
              Aktualny email
            </label>
            <span className="text-pedro-dark">{user.email}</span>
            {!user.emailVerified && (
              <div className="mt-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                  Niezweryfikowany
                </span>
              </div>
            )}
          </div>
          
          {!showEmailForm && (
            <BrutalButton
              variant="outline"
              size="sm"
              onClick={() => setShowEmailForm(true)}
            >
              Zmień email
            </BrutalButton>
          )}
        </div>

        {/* Email Change Form */}
        {showEmailForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-blue-50 rounded-button border-2 border-blue-200">
            <h3 className="font-bold text-pedro-dark mb-4">Zmiana adresu email</h3>
            
            <BrutalInput
              label="Nowy adres email"
              type="email"
              placeholder="nowy@email.com"
              error={errors.newEmail?.message}
              required
              {...register('newEmail')}
            />

            <BrutalInput
              label="Obecne hasło"
              type="password"
              placeholder="Wpisz obecne hasło"
              helper="Wymagane do potwierdzenia tożsamości"
              error={errors.password?.message}
              required
              {...register('password')}
            />

            <div className="flex gap-3">
              <BrutalButton
                type="submit"
                variant="primary"
                size="sm"
                loading={loading}
                className="flex-1"
              >
                Zaktualizuj email
              </BrutalButton>
              
              <BrutalButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                Anuluj
              </BrutalButton>
            </div>

            <div className="text-xs text-gray-600 bg-white p-3 rounded border">
              <strong>Uwaga:</strong> Po zmianie emaila otrzymasz wiadomość weryfikacyjną na nowy adres. 
              Musisz potwierdzić nowy email, aby móc się zalogować.
            </div>
          </form>
        )}
      </div>

      {/* Account Info */}
      <div className="p-4 bg-gray-50 rounded-button border-2 border-gray-200">
        <h3 className="font-bold text-pedro-dark mb-3">Informacje o koncie</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Data utworzenia:</span>
            <span className="text-pedro-dark">
              {user.metadata.creationTime ? 
                new Date(user.metadata.creationTime).toLocaleDateString('pl-PL') : 
                'Nieznana'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ostatnie logowanie:</span>
            <span className="text-pedro-dark">
              {user.metadata.lastSignInTime ? 
                new Date(user.metadata.lastSignInTime).toLocaleDateString('pl-PL') : 
                'Nieznane'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status weryfikacji:</span>
            <span className={`font-medium ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              {user.emailVerified ? 'Zweryfikowany' : 'Niezweryfikowany'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}