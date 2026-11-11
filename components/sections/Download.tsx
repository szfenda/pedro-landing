'use client'

import Image from 'next/image'
import { mascots } from '@/lib/assets'
import { useRipple } from '@/hooks/useRipple'
import { useTranslation } from '@/lib/i18n-context'
import { webAppLink } from '@/lib/appLink'

export default function Download() {
    const createRipple = useRipple()
    const { t } = useTranslation()

    const benefits = [
        t('download.benefit1'),
        t('download.benefit2'),
        t('download.benefit3'),
    ]

    return (
        <section id="pobierz" className="relative bg-gradient-to-br from-pedro-purple via-pedro-pink to-pedro-purple py-section overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 bg-pedro-lime rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-pedro-pink rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
            </div>

            <div className="container-pedro relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Heading */}
                    <h2 className="font-headline text-h2 text-white mb-6">
                        {t('download.title1')}<br />{t('download.title2')}
                    </h2>

                    <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                        {t('download.subtitle')}
                    </p>

                    {/* CTA: web-app (T-004). Sklepy — wkrótce (D-001) */}
                    <div className="flex flex-col gap-4 items-center mb-12">
                        <a
                            href={webAppLink('download')}
                            onClick={createRipple}
                            className="btn-brutal btn-brutal-lime border-3 border-pedro-dark rounded-button px-8 py-4 min-h-[52px] text-lg font-bold relative overflow-hidden"
                        >
                            {t('hero.openWebApp')} →
                        </a>
                        <p className="text-white/90 text-sm font-bold">
                            {t('hero.storesSoon')}
                        </p>
                    </div>

                    {/* Benefits Chips */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-pedro-lime text-pedro-dark px-6 py-3 rounded-full font-bold text-sm brutal-border"
                            >
                                {benefit}
                            </div>
                        ))}
                    </div>

                    {/* Optional Pedro Smartphone Illustration */}
                    <div className="mt-12 hidden md:block">
                        <div className="relative inline-block">
                            <img
                                src={mascots.smartphone}
                                alt="Pedro with smartphone"
                                width={200}
                                height={250}
                                className="animate-float opacity-80"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
