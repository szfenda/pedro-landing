'use client'

import Image from 'next/image'
import { mascots } from '@/lib/assets'

export default function Download() {
    const benefits = [
        '100% za darmo',
        'Bez reklam',
        'Zawsze aktualne'
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
                        Pobierz PEDRO<br />i poluj na promki
                    </h2>

                    <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                        Dołącz do tysięcy użytkowników, którzy już oszczędzają z Pedrem
                    </p>

                    {/* Store Badges */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        {/* App Store Badge */}
                        <a
                            href="#"
                            aria-label="Download on the App Store"
                            className="btn-brutal bg-black text-white border-3 border-white rounded-button px-8 py-4 flex items-center justify-center gap-3 min-h-[52px] shadow-brutal-lime hover:shadow-brutal-lime hover:-translate-y-2 active:scale-95 transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            <div className="text-left">
                                <div className="text-xs">Download on the</div>
                                <div className="text-lg font-bold">App Store</div>
                            </div>
                        </a>

                        {/* Google Play Badge */}
                        <a
                            href="#"
                            aria-label="Get it on Google Play"
                            className="btn-brutal bg-black text-white border-3 border-white rounded-button px-8 py-4 flex items-center justify-center gap-3 min-h-[52px] shadow-brutal-lime hover:shadow-brutal-lime hover:-translate-y-2 active:scale-95 transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                            </svg>
                            <div className="text-left">
                                <div className="text-xs">GET IT ON</div>
                                <div className="text-lg font-bold">Google Play</div>
                            </div>
                        </a>
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
                            <Image
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
