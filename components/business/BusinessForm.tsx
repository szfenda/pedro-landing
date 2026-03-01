'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import { useSystemConfig } from '@/hooks/useSystemConfig'
import { businessFormSchema, type BusinessFormData } from '@/lib/validations'
import { cn } from '@/lib/utils'
import BrutalInput from '@/components/ui/BrutalInput'
import BrutalButton from '@/components/ui/BrutalButton'
import BrutalAlert from '@/components/ui/BrutalAlert'
import ProgressIndicator from '@/components/ui/ProgressIndicator'
import BusinessFormSection from './BusinessFormSection'
import { useTranslation } from '@/lib/i18n-context'

interface BusinessFormProps {
  mode?: 'create' | 'edit'
  partnerId?: string
  onSubmit?: (data: BusinessFormData) => void
  onCancel?: () => void
  initialData?: Partial<BusinessFormData>
}

export default function BusinessForm({ 
  mode = 'create',
  partnerId,
  onSubmit: onSubmitProp, 
  onCancel, 
  initialData 
}: BusinessFormProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const { config, loading: configLoading, error: configError, getBusinessTypes, getCityNames } = useSystemConfig()
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
    if (!user && mode === 'create') {
      setError(t('business.form.loginRequired'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (mode === 'edit') {
        // Call custom onSubmit for edit mode
        if (onSubmitProp) {
          await onSubmitProp(data)
        }
        return
      }

      // Create mode logic (existing)
      const partnerId = `partner_${user!.uid}_${Date.now()}`
      
      await setDoc(doc(db, 'partners', partnerId), {
        id: partnerId,
        createdBy: user!.uid,
        userId: user!.uid,
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
      console.error('Error saving business:', error)
      setError(t('business.form.saveError'))
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
    t('business.form.steps.s1'),
    t('business.form.steps.s2'),
    t('business.form.steps.s3'),
    t('business.form.steps.s4'),
  ]

  return (
    <div className="space-y-8">
      {/* Loading state for system config */}
      {configLoading && (
        <BrutalAlert
          type="info"
          message={t('business.form.configLoading')}
        />
      )}

      {/* Config error */}
      {configError && (
        <BrutalAlert
          type="warning"
          message={`${configError}`}
        />
      )}

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
          title={t('business.form.section1.title')}
          description={t('business.form.section1.description')}
          isValid={isSectionValid(1)}
          isActive={activeSection === 1}
          onActivate={() => setActiveSection(1)}
        >
          <BrutalInput
            label={t('business.form.section1.companyName')}
            type="text"
            placeholder={t('business.form.section1.companyNamePlaceholder')}
            error={errors.companyName?.message}
            required
            {...register('companyName')}
          />

          <BrutalInput
            label={t('business.form.section1.nip')}
            type="text"
            placeholder={t('business.form.section1.nipPlaceholder')}
            helper={t('business.form.section1.nipHelper')}
            error={errors.nip?.message}
            required
            {...register('nip')}
          />

          <div className="space-y-2">
            <label className="block text-sm font-bold text-pedro-dark">
              {t('business.form.section1.businessType')}
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
              disabled={configLoading}
            >
              <option value="">
                {configLoading ? t('business.form.section1.businessTypeLoading') : t('business.form.section1.businessTypePlaceholder')}
              </option>
              {getBusinessTypes().map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.businessType && (
              <p className="text-sm text-pedro-pink font-medium">
                {errors.businessType.message}
              </p>
            )}
            {configError && (
              <p className="text-sm text-pedro-pink font-medium">
                {configError}
              </p>
            )}
          </div>
        </BusinessFormSection>

        {/* Section 2: Adres */}
        <BusinessFormSection
          title={t('business.form.section2.title')}
          description={t('business.form.section2.description')}
          isValid={isSectionValid(2)}
          isActive={activeSection === 2}
          onActivate={() => setActiveSection(2)}
        >
          <BrutalInput
            label={t('business.form.section2.street')}
            type="text"
            placeholder={t('business.form.section2.streetPlaceholder')}
            error={errors.address?.line1?.message}
            required
            {...register('address.line1')}
          />

          <BrutalInput
            label={t('business.form.section2.line2')}
            type="text"
            placeholder={t('business.form.section2.line2Placeholder')}
            error={errors.address?.line2?.message}
            {...register('address.line2')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-pedro-dark">
                {t('business.form.section2.city')}
                <span className="text-pedro-pink ml-1">*</span>
              </label>
              <select
                {...register('address.city')}
                className={cn(
                  'w-full brutal-border rounded-button px-4 py-3',
                  'bg-white text-pedro-dark',
                  'transition-all duration-300',
                  'focus:outline-none focus:ring-4 focus:ring-pedro-lime focus:ring-opacity-50',
                  'focus:-translate-y-1 focus:shadow-brutal-lime',
                  errors.address?.city && 'border-pedro-pink shadow-brutal-pink'
                )}
                disabled={configLoading}
              >
                <option value="">
                  {configLoading ? t('business.form.section2.cityLoading') : t('business.form.section2.cityPlaceholder')}
                </option>
                {getCityNames().map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.address?.city && (
                <p className="text-sm text-pedro-pink font-medium">
                  {errors.address.city.message}
                </p>
              )}
            </div>

            <BrutalInput
              label={t('business.form.section2.postalCode')}
              type="text"
              placeholder={t('business.form.section2.postalCodePlaceholder')}
              helper={t('business.form.section2.postalCodeHelper')}
              error={errors.address?.postalCode?.message}
              required
              {...register('address.postalCode')}
            />
          </div>

          <BrutalInput
            label={t('business.form.section2.country')}
            type="text"
            placeholder={t('business.form.section2.countryPlaceholder')}
            error={errors.address?.country?.message}
            required
            {...register('address.country')}
          />
        </BusinessFormSection>

        {/* Section 3: Kontakt */}
        <BusinessFormSection
          title={t('business.form.section3.title')}
          description={t('business.form.section3.description')}
          isValid={isSectionValid(3)}
          isActive={activeSection === 3}
          onActivate={() => setActiveSection(3)}
        >
          <BrutalInput
            label={t('business.form.section3.email')}
            type="email"
            placeholder={t('business.form.section3.emailPlaceholder')}
            error={errors.email?.message}
            required
            {...register('email')}
          />

          <BrutalInput
            label={t('business.form.section3.phone')}
            type="tel"
            placeholder={t('business.form.section3.phonePlaceholder')}
            helper={t('business.form.section3.phoneHelper')}
            error={errors.phone?.message}
            required
            {...register('phone')}
          />

          <BrutalInput
            label={t('business.form.section3.contactPerson')}
            type="text"
            placeholder={t('business.form.section3.contactPersonPlaceholder')}
            error={errors.contactPersonName?.message}
            required
            {...register('contactPersonName')}
          />

          <BrutalInput
            label={t('business.form.section3.website')}
            type="url"
            placeholder={t('business.form.section3.websitePlaceholder')}
            error={errors.website?.message}
            {...register('website')}
          />
        </BusinessFormSection>

        {/* Section 4: Opis */}
        <BusinessFormSection
          title={t('business.form.section4.title')}
          description={t('business.form.section4.description')}
          isValid={isSectionValid(4)}
          isActive={activeSection === 4}
          onActivate={() => setActiveSection(4)}
        >
          <div className="space-y-2">
            <label className="block text-sm font-bold text-pedro-dark">
              {t('business.form.section4.descriptionLabel')}
              <span className="text-pedro-pink ml-1">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={6}
              placeholder={t('business.form.section4.descriptionPlaceholder')}
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
              {t('business.form.section4.descriptionHelper')}
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
              {t('business.form.cancel')}
            </BrutalButton>
          )}

          <BrutalButton
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="flex-1"
          >
            {mode === 'edit' ? t('business.form.submitEdit') : t('business.form.submitCreate')} →
          </BrutalButton>
        </div>
      </form>
    </div>
  )
}