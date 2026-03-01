'use client'

import Image from 'next/image'
import { mascots, functionalIcons } from '@/lib/assets'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/lib/i18n-context'

export default function About() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)
    const { t } = useTranslation()

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const benefits = [
        { text: t('about.benefit1'), delay: '0.1s' },
        { text: t('about.benefit2'), delay: '0.2s' },
        { text: t('about.benefit3'), delay: '0.3s' },
    ]

    return (
        <section
            ref={sectionRef}
            id="o-nas"
            className="bg-pedro-light py-section relative z-10"
        >
            <div className="container-pedro">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Text Content */}
                    <div className={`space-y-8 ${isVisible ? 'scroll-reveal revealed' : 'scroll-reveal'}`}>
                        <h2 className="font-headline text-h2 text-pedro-dark">
                            {t('about.title')}
                        </h2>

                        <div className="space-y-4">
                            <p className="text-body text-gray-700 leading-relaxed">
                                {t('about.description1')}
                            </p>
                            <p className="text-body text-gray-700 leading-relaxed">
                                {t('about.description2')}
                            </p>
                        </div>

                        {/* Benefits List */}
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-4 ${isVisible ? 'scroll-reveal revealed' : 'scroll-reveal'}`}
                                    style={{ animationDelay: benefit.delay }}
                                >
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                        <img
                                            src={functionalIcons.checkmark}
                                            alt="Check"
                                            width={32}
                                            height={32}
                                        />
                                    </div>
                                    <p className="text-lg font-medium text-pedro-dark">
                                        {benefit.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Illustration */}
                    <div className={`flex items-center justify-center ${isVisible ? 'scroll-reveal revealed' : 'scroll-reveal'}`} style={{ animationDelay: '0.4s' }}>
                        <div className="relative group">
                            <img
                                src={mascots.thumbsUp}
                                alt="Pedro giving thumbs up"
                                width={400}
                                height={500}
                                className="w-full max-w-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
                            />
                            {/* Decorative glow */}
                            <div className="absolute inset-0 bg-pedro-purple opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-300" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
