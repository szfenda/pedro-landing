'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zglosSchema, ZglosFormData, ZGLOS_NOTE_MAX } from '@/lib/validations'
import { mascots } from '@/lib/assets'
import { webAppLink, webAppLinkClick } from '@/lib/appLink'
import BrutalAlert from '@/components/ui/BrutalAlert'
import BrutalInput from '@/components/ui/BrutalInput'
import { useTranslation } from '@/lib/i18n-context'

// T-096: „Zgłoś biznes do PEDRO” — tylko link obowiązkowy, wysyłka mailem przez /api/zglos/
export default function ZglosForm() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { t } = useTranslation()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<ZglosFormData>({
        resolver: zodResolver(zglosSchema),
        defaultValues: { link: '', name: '', city: '', note: '', email: '', owner: false, website: '' },
    })

    // Komunikaty z Zod to klucze tłumaczeń (zglos.errors.*)
    const err = (key?: string) => (key ? t(key) : undefined)
    const noteLength = (watch('note') || '').length

    const onSubmit = async (data: ZglosFormData) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/zglos/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const result = await response.json().catch(() => ({}))
            if (!response.ok) {
                setError(response.status === 429 && result.error ? result.error : t('zglos.error'))
                return
            }
            setSuccess(true)
            reset()
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch {
            setError(t('zglos.error'))
        } finally {
            setLoading(false)
        }
    }

    const optional = <span className="font-normal text-gray-500 ml-1">{t('zglos.form.optional')}</span>

    const header = (
        <header className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
            <span className="inline-block bg-pedro-lime text-pedro-dark brutal-border rounded-full px-4 py-1 text-sm font-bold mb-4 -rotate-2">
                {t('zglos.badge')}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-h2 text-pedro-dark leading-tight mb-4">
                {t('zglos.title')}{' '}
                <span className="text-pedro-purple">{t('zglos.titleAccent')}</span>
            </h1>
            <p className="text-body text-gray-600">{t('zglos.subtitle')}</p>
        </header>
    )

    if (success) {
        return (
            <>
            {header}
            <div data-success-message className="max-w-xl mx-auto text-center bg-white brutal-border rounded-card p-6 md:p-10 shadow-brutal-lime">
                <img
                    src={mascots.thumbsUp}
                    alt=""
                    width={140}
                    height={140}
                    className="mx-auto mb-4 w-28 h-28 md:w-36 md:h-36 object-contain"
                />
                <h2 className="text-h3 text-pedro-dark mb-3">{t('zglos.success.title')}</h2>
                <p className="text-body text-gray-600 mb-8">{t('zglos.success.message')}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href={webAppLink('zglos')}
                        onClick={webAppLinkClick('zglos')}
                        className="btn-brutal btn-brutal-lime text-lg"
                    >
                        {t('zglos.success.open')}
                    </a>
                    <button
                        type="button"
                        onClick={() => setSuccess(false)}
                        className="btn-brutal btn-brutal-outline-white text-lg"
                    >
                        {t('zglos.success.another')}
                    </button>
                </div>
            </div>
            </>
        )
    }

    return (
        <>
        {header}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Formularz */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="lg:col-span-3 bg-white brutal-border rounded-card p-5 md:p-8 shadow-brutal-sm-dark space-y-6"
            >
                {error && <BrutalAlert type="error" message={error} />}

                <BrutalInput
                    label={t('zglos.form.link')}
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    placeholder={t('zglos.form.linkPlaceholder')}
                    helper={t('zglos.form.linkHelper')}
                    error={err(errors.link?.message)}
                    disabled={loading}
                    required
                    {...register('link')}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BrutalInput
                        label={t('zglos.form.name')}
                        type="text"
                        placeholder={t('zglos.form.namePlaceholder')}
                        error={err(errors.name?.message)}
                        disabled={loading}
                        {...register('name')}
                    />
                    <div>
                        <BrutalInput
                            label={t('zglos.form.city')}
                            type="text"
                            list="zglos-miasta"
                            placeholder={t('zglos.form.cityPlaceholder')}
                            error={err(errors.city?.message)}
                            disabled={loading}
                            {...register('city')}
                        />
                        <datalist id="zglos-miasta">
                            <option value="Gdańsk" />
                            <option value="Gdynia" />
                            <option value="Sopot" />
                            <option value={t('zglos.form.cityNearby')} />
                        </datalist>
                    </div>
                </div>

                <div>
                    <label htmlFor="zglos-note" className="block text-sm font-bold text-pedro-dark mb-2">
                        {t('zglos.form.note')}
                    </label>
                    <textarea
                        id="zglos-note"
                        rows={3}
                        maxLength={ZGLOS_NOTE_MAX}
                        className={`w-full brutal-border rounded-button px-4 py-3 bg-white text-pedro-dark placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pedro-lime focus:ring-opacity-50 focus:-translate-y-1 focus:shadow-brutal-lime resize-none ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        } ${errors.note ? 'border-pedro-pink shadow-brutal-pink' : ''}`}
                        placeholder={t('zglos.form.notePlaceholder')}
                        disabled={loading}
                        {...register('note')}
                    />
                    <div className="flex justify-between mt-1 text-sm">
                        <span className="text-pedro-pink font-medium">{err(errors.note?.message)}</span>
                        <span className="text-gray-500">{noteLength}/{ZGLOS_NOTE_MAX}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <BrutalInput
                        label={t('zglos.form.email')}
                        type="email"
                        autoComplete="email"
                        placeholder={t('zglos.form.emailPlaceholder')}
                        helper={t('zglos.form.emailHelper')}
                        error={err(errors.email?.message)}
                        disabled={loading}
                        {...register('email')}
                    />
                </div>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 accent-pedro-purple shrink-0"
                        disabled={loading}
                        {...register('owner')}
                    />
                    <span className="text-sm text-pedro-dark font-medium">
                        {t('zglos.form.owner')}
                        {optional}
                    </span>
                </label>

                {/* Pułapka na boty — niewidoczna dla ludzi i czytników ekranu */}
                <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
                    <label htmlFor="zglos-website">Website</label>
                    <input id="zglos-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`btn-brutal btn-brutal-lime w-full text-lg transition-all duration-200 ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:-translate-y-1'
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-pedro-dark border-t-transparent rounded-full animate-spin"></span>
                            {t('zglos.form.sending')}
                        </span>
                    ) : (
                        t('zglos.form.submit')
                    )}
                </button>

                <p className="text-xs text-gray-600 leading-relaxed">
                    {t('zglos.privacy')}{' '}
                    <Link href="/legal/polityka-prywatnosci/" className="underline hover:text-pedro-purple">
                        {t('zglos.privacyLink')}
                    </Link>
                    .
                </p>
            </form>

            {/* Co dalej */}
            <aside className="lg:col-span-2 bg-pedro-purple text-white brutal-border rounded-card p-5 md:p-8 shadow-brutal-sm-lime">
                <img
                    src={mascots.hunting}
                    alt=""
                    width={160}
                    height={160}
                    decoding="async"
                    className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4"
                />
                <h2 className="text-2xl mb-4">{t('zglos.nextTitle')}</h2>
                <ol className="space-y-3 text-sm md:text-base">
                    {['next1', 'next2', 'next3'].map((key, i) => (
                        <li key={key} className="flex gap-3">
                            <span className="shrink-0 w-7 h-7 rounded-full bg-pedro-lime text-pedro-dark font-bold flex items-center justify-center">
                                {i + 1}
                            </span>
                            <span>{t(`zglos.${key}`)}</span>
                        </li>
                    ))}
                </ol>
            </aside>
        </div>
        </>
    )
}
