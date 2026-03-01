'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, ContactFormData } from '@/lib/validations'
import { socialIcons } from '@/lib/assets'
import BrutalAlert from '@/components/ui/BrutalAlert'
import BrutalInput from '@/components/ui/BrutalInput'
import { useTranslation } from '@/lib/i18n-context'

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Błąd podczas wysyłania')
      }
      
      setSuccess(true)
      reset()
      
      // Scroll to success message
      setTimeout(() => {
        const successElement = document.querySelector('[data-success-message]')
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      
    } catch (err: any) {
      console.error('Contact form error:', err)
      setError(err.message || t('contact.error'))
    } finally {
      setLoading(false)
    }
  }

    return (
        <section id="kontakt" className="bg-white py-section">
            <div className="container-pedro max-w-2xl">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-h2 text-pedro-dark mb-4">
                        {t('contact.title')}
                    </h2>
                    <p className="text-body text-gray-600">
                        {t('contact.subtitle')}
                    </p>
                </div>

                {/* Contact Info */}
                <div className="text-center mb-12 space-y-4">
                    <p className="text-lg text-pedro-dark">
                        📧 <a href="mailto:kontakt@pedro.app" className="font-bold hover:text-pedro-purple transition-colors">kontakt@pedro.app</a>
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-6 justify-center mt-8">
                        <a href="#" aria-label="Instagram" className="transition-transform hover:scale-110 hover:rotate-6">
                            <img
                                src={socialIcons.instagram}
                                alt="Instagram"
                                width={40}
                                height={40}
                                className="opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </a>
                        <a href="#" aria-label="TikTok" className="transition-transform hover:scale-110 hover:rotate-6">
                            <img
                                src={socialIcons.tiktok}
                                alt="TikTok"
                                width={40}
                                height={40}
                                className="opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </a>
                        <a href="#" aria-label="Facebook" className="transition-transform hover:scale-110 hover:rotate-6">
                            <img
                                src={socialIcons.facebook}
                                alt="Facebook"
                                width={40}
                                height={40}
                                className="opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </a>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div data-success-message className="mb-8">
                        <BrutalAlert 
                            type="success"
                            title={t('contact.success.title')}
                            message={t('contact.success.message')}
                        />
                    </div>
                )}
                
                {/* Error Message */}
                {error && (
                    <div className="mb-8">
                        <BrutalAlert 
                            type="error"
                            message={error}
                        />
                    </div>
                )}

                {/* Contact Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <BrutalInput
                        label={t('contact.form.name')}
                        type="text"
                        placeholder={t('contact.form.namePlaceholder')}
                        error={errors.name?.message}
                        disabled={loading}
                        required
                        {...register('name')}
                    />

                    <BrutalInput
                        label={t('contact.form.email')}
                        type="email"
                        placeholder={t('contact.form.emailPlaceholder')}
                        error={errors.email?.message}
                        disabled={loading}
                        required
                        {...register('email')}
                    />

                    <div>
                        <label htmlFor="message" className="block text-sm font-bold text-pedro-dark mb-2">
                            {t('contact.form.message')}
                            <span className="text-pedro-pink ml-1">*</span>
                        </label>
                        <textarea
                            id="message"
                            rows={5}
                            className={`w-full brutal-border rounded-button px-4 py-3 bg-white text-pedro-dark placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pedro-lime focus:ring-opacity-50 focus:-translate-y-1 focus:shadow-brutal-lime resize-none ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            } ${
                                errors.message ? 'border-pedro-pink shadow-brutal-pink' : ''
                            }`}
                            placeholder={t('contact.form.messagePlaceholder')}
                            disabled={loading}
                            {...register('message')}
                        />
                        {errors.message && (
                            <p className="text-pedro-pink text-sm mt-2 font-medium">
                                {errors.message.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className={`btn-brutal btn-brutal-lime w-full text-lg transition-all duration-200 ${
                            loading || success ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:-translate-y-1'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-pedro-dark border-t-transparent rounded-full animate-spin"></div>
                                {t('contact.form.sending')}
                            </span>
                        ) : success ? (
                            t('contact.form.sent')
                        ) : (
                            t('contact.form.submit')
                        )}
                    </button>
                </form>
            </div>
        </section>
    )
}
