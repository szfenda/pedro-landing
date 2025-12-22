'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import { businessFormSchema, type BusinessFormData } from '@/lib/validations'
import { cn } from '@/lib/utils'
import BrutalInput from '@/components/ui/BrutalInput'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'
import ProgressIndicator from '@/components/ui/ProgressIndicator'
import BusinessFormSection from './BusinessFormSection'

interface BusinessFormProps {
  onSubmit?: (data: BusinessFormData) => void
  onCancel?: () => void
  initialData?: Partial<BusinessFormData>
}

export default function BusinessForm({ 
  onSubmit: onSubmitProp, 
  onCancel, 
  initialData 
}: BusinessFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(1)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: initialData || {
      businessType: 'restaurant',
      address: {
        country: 'Polska',
      },
    },
  })

  // Watch all fields to determine section validity
  const watchedFields = watch()

  // Determine which sections are valid
  const isSectionValid = (section: number): boolean => {
    switch (section) {
      case 1: // Dane firmy
        return !!(
          watchedFields.companyName &&
          watchedFields.nip &&
          watchedFields.businessType
        )
      case 2: // Adres
        return !!(
          watchedFields.address?.line1 &&
          watchedFields.address?.city &&
          watchedFields.address?.postalCode &&
          watchedFields.address?.country
        )
      case 3: // Kontakt
        return !!(
          watchedFields.email &&
          watchedFields.phone &&
          watchedFields.contactPersonName
        )
      case 4: // Opis
        return !!watchedFields.description
      default:
        return false
    }
  }

  const completedSteps = [1, 2, 3, 4].filter(isSectionValid)

  const onSubmit = async (data: BusinessFormData) => {
    if (!user) {
      setError('Musisz być zalogowany aby dodać biznes.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create PARTNER document
      const partnerId = `partner_${user.uid}_${Date.now()}`
      
      await setDoc(doc(db, 'PARTNER', partnerId), {
        id: partnerId,
        createdBy: user.uid,
        userId: user.uid,
        companyName: data.companyName,
        nip: data.nip,
        businessType: data.businessType,
        address: data.address,
        email: data.email,
        phone: data.phone,
        contactPersonName: data.contactPersonName,
        website: data.website || null,
        description: data.description,
        businessModel: {
          currentPhase: 'beta_free',
          ppuEnabled: false,
        },
        billing: {
          stripeCustomerId: null,
        },
        isActive: true,
        createdAt: new Date(),
      })

      // Call custom onSubmit if provided
      if (onSubmitProp) {
        onSubmitProp(data)
      }

      // Redirect to billing
      router.push('/billing')
    } catch (error: any) {
      console.error('Error creating business:', error)
      setError('Wystąpił błąd podczas tworzenia biznesu. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  const handleSectionClick = async (section: number) => {
    // Validate current section before moving
    const fieldsToValidate = getSectionFields(activeSection)
    const isValid = await trigger(fieldsToValidate as any)
    
    if (isValid || section < activeSection) {
      setActiveSection(section)
    }
  }

  const getSectionFields = (section: number): string[] => {
    switch (section) {
      case 1:
        return ['companyName', 'nip', 'businessType']
      case 2:
        return ['address.line1', 'address.city', 'address.postalCode', 'address.country']
      case 3:
        return ['email', 'phone', 'contactPersonName']
      case 4:
        return ['description']
      default:
        return []
    }
  }

  const steps = [
    'Dane firmy',
    'Adres',
    'Kontakt',
    'Opis',
  ]

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <ProgressIndicator
        steps={steps}
        currentStep={activeSection}
        completedSteps={completedSteps}
        onStepClick={handleSectionClick}
      />

      {error && (
        <BrutalAlert
          type="error"
          message={error}
          dismissible
          onDismiss={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Dane firmy */}
        <BusinessFormSection
          title="1. Dane firmy"
          description="Podstawowe informacje o Twojej firmie"
          isValid={isSectionValid(1)}
          isActive={activeSection === 1}
          onActivate={() => setActiveSection(1)}
        >
          <BrutalInput
            label="Nazwa firmy"
            type="text"
            placeholder="np. Pizzeria Da Vinci"
            error={errors.companyName?.message}
            required
            {...register('companyName')}
          />

          <BrutalInput
            label="NIP"
            type="text"
            placeholder="1234567890"
            helper="10 cyfr bez kresek"
            error={errors.nip?.message}
            required
            {...register('nip')}
          />

          <div className="space-y-2">
            <label className="block text-sm font-bold text-pedro-dark">
              Typ biznesu
              <span className="text-pedro-pink ml-1">*</span>
            </label>
            <select
              {...register('businessType')}
              className={cn(
                'w-full brutal-border rounded-button px-4 py-3',
                'bg-white text-pedro-dark',
                'transition-all duration-300',
                'focus:outline-none focus:ring-4 focus:ring-pedro-lime focus:ring-opacity-50',
                'focus:-translate-y-1 focus:shadow-brutal-lime',
                errors.businessType && 'border-pedro-pink shadow-brutal-pink'
              )}
            >
              <option value="restaurant">Restauracja</option>
              <option value="retail">Sklep</option>
              <option value="service">Usługa</option>
              <option value="other">Inne</option>
            </select>
            {errors.businessType && (
              <p className="text-sm text-pedro-pink font-medium">
                {errors.businessType.message}
              </p>
            )}
          </div>
        </BusinessFormSection>

        {/* Section 2: Adres */}
        <BusinessFormSection
          title="2. Adres"
          description="Lokalizacja Twojego biznesu"
          isValid={isSectionValid(2)}
          isActive={activeSection === 2}
          onActivate={() => setActiveSection(2)}
        >
          <BrutalInput
            label="Ulica i numer"
            type="text"
            placeholder="np. ul. Długa 123"
            error={errors.address?.line1?.message}
            required
            {...register('address.line1')}
          />

          <BrutalInput
            label="Dodatkowe informacje (opcjonalnie)"
            type="text"
            placeholder="np. lokal 4, piętro 2"
            error={errors.address?.line2?.message}
            {...register('address.line2')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BrutalInput
              label="Miasto"
              type="text"
              placeholder="np. Gdańsk"
              error={errors.address?.city?.message}
              required
              {...register('address.city')}
            />

            <BrutalInput
              label="Kod pocztowy"
              type="text"
              placeholder="80-123"
              helper="Format: XX-XXX"
              error={errors.address?.postalCode?.message}
              required
              {...register('address.postalCode')}
            />
          </div>

          <BrutalInput
            label="Kraj"
            type="text"
            placeholder="Polska"
            error={errors.address?.country?.message}
            required
            {...register('address.country')}
          />
        </BusinessFormSection>

        {/* Section 3: Kontakt */}
        <BusinessFormSection
          title="3. Kontakt"
          description="Dane kontaktowe do Twojego biznesu"
          isValid={isSectionValid(3)}
          isActive={activeSection === 3}
          onActivate={() => setActiveSection(3)}
        >
          <BrutalInput
            label="Email"
            type="email"
            placeholder="kontakt@twojafirma.pl"
            error={errors.email?.message}
            required
            {...register('email')}
          />

          <BrutalInput
            label="Telefon"
            type="tel"
            placeholder="+48 123 456 789"
            helper="Format: +48 XXX XXX XXX"
            error={errors.phone?.message}
            required
            {...register('phone')}
          />

          <BrutalInput
            label="Osoba kontaktowa"
            type="text"
            placeholder="Jan Kowalski"
            error={errors.contactPersonName?.message}
            required
            {...register('contactPersonName')}
          />

          <BrutalInput
            label="Strona internetowa (opcjonalnie)"
            type="url"
            placeholder="https://twojafirma.pl"
            error={errors.website?.message}
            {...register('website')}
          />
        </BusinessFormSection>

        {/* Section 4: Opis */}
        <BusinessFormSection
          title="4. Opis"
          description="Opowiedz o swoim biznesie"
          isValid={isSectionValid(4)}
          isActive={activeSection === 4}
          onActivate={() => setActiveSection(4)}
        >
          <div className="space-y-2">
            <label className="block text-sm font-bold text-pedro-dark">
              Opis biznesu
              <span className="text-pedro-pink ml-1">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={6}
              placeholder="Opisz swoją firmę, co oferujesz, co Cię wyróżnia..."
              className={cn(
                'w-full brutal-border rounded-button px-4 py-3',
                'bg-white text-pedro-dark placeholder-gray-500',
                'transition-all duration-300',
                'focus:outline-none focus:ring-4 focus:ring-pedro-lime focus:ring-opacity-50',
                'focus:-translate-y-1 focus:shadow-brutal-lime',
                'resize-none',
                errors.description && 'border-pedro-pink shadow-brutal-pink'
              )}
            />
            {errors.description && (
              <p className="text-sm text-pedro-pink font-medium">
                {errors.description.message}
              </p>
            )}
            <p className="text-sm text-gray-600">
              Minimum 10 znaków
            </p>
          </div>
        </BusinessFormSection>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 pt-6">
          {onCancel && (
            <BrutalButton
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
              className="md:w-auto"
            >
              Anuluj
            </BrutalButton>
          )}

          <BrutalButton
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="flex-1"
          >
            Zapisz i przejdź do płatności →
          </BrutalButton>
        </div>
      </form>
    </div>
  )
}