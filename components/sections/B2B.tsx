'use client'

import Image from 'next/image'
import { businessIcons, functionalIcons } from '@/lib/assets'
import { useEffect, useRef, useState } from 'react'

export default function B2B() {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                    // Count-up animation
                    let current = 0
                    const target = 1234
                    const duration = 2000
                    const increment = target / (duration / 16)

                    const timer = setInterval(() => {
                        current += increment
                        if (current >= target) {
                            setCount(target)
                            clearInterval(timer)
                        } else {
                            setCount(Math.floor(current))
                        }
                    }, 16)

                    return () => clearInterval(timer)
                }
            },
            { threshold: 0.3 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [hasAnimated])

    const benefits = [
        'Płacisz tylko za efekt, nie za klik',
        'Docierasz do klientów w Twojej okolicy',
        'Prosty panel – dodajesz promkę w 2 minuty',
        'Widzisz na żywo, kto skanuje Twoje kody',
    ]

    return (
        <section ref={sectionRef} id="dla-biznesu" className="relative bg-pedro-lime py-section overflow-hidden">
            {/* Purple Diagonal Clip */}
            <div
                className="absolute top-0 right-0 w-1/3 h-1/3 bg-pedro-purple"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
            />

            <div className="container-pedro relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                    {/* Left Column - Text + CTA (60%) */}
                    <div className="lg:col-span-3 space-y-8">
                        <h2 className="font-headline text-h2 text-pedro-dark">
                            Masz lokalny biznes?<br />
                            Zatrudnij Pedra.
                        </h2>

                        <p className="text-body text-pedro-dark">
                            Pedro znajduje dla Ciebie klientów, którzy są tuż obok. Żadnych banerów, żadnej nachodliwej reklamy – tylko ludzie szukający właśnie Twojej oferty.
                        </p>

                        {/* Benefits List with Stagger */}
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 scroll-reveal revealed"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mt-1">
                                        <img
                                            src={functionalIcons.checkmark}
                                            alt="Check"
                                            width={32}
                                            height={32}
                                        />
                                    </div>
                                    <p className="text-lg font-medium text-pedro-dark">
                                        {benefit}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button className="btn-brutal bg-pedro-purple text-white border-3 border-pedro-dark px-8 py-4 text-lg group">
                            <span className="flex items-center gap-3">
                                Dodaj swoją firmę
                                <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
                            </span>
                        </button>

                        {/* Count-up Stats */}
                        <div className="bg-white/80 backdrop-blur-sm brutal-border rounded-card p-6 inline-block">
                            <p className="text-sm text-gray-600 mb-2">Dzisiaj w PEDRO:</p>
                            <p className="text-3xl font-bold text-pedro-purple">
                                {count.toLocaleString('pl-PL')} transakcji
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Dashboard Mockup + Orbiting Icons (40%) */}
                    <div className="lg:col-span-2 relative">
                        {/* Dashboard Placeholder */}
                        <div className="bg-white brutal-border rounded-card p-6 shadow-brutal-dark">
                            <div className="space-y-4">
                                <div className="h-8 bg-gradient-to-r from-pedro-purple to-pedro-pink rounded w-2/3" />
                                <div className="h-32 bg-gradient-to-br from-pedro-lime/20 to-pedro-purple/20 rounded flex items-center justify-center">
                                    <span className="text-4xl">📊</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                                </div>
                            </div>
                        </div>

                        {/* Orbiting Icons */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative w-64 h-64">
                                <img
                                    src={businessIcons.money}
                                    alt=""
                                    width={48}
                                    height={48}
                                    className="absolute orbit-icon"
                                    style={{ animationDelay: '0s' }}
                                />
                                <img
                                    src={businessIcons.analytics}
                                    alt=""
                                    width={48}
                                    height={48}
                                    className="absolute orbit-icon"
                                    style={{ animationDelay: '2.67s' }}
                                />
                                <img
                                    src={businessIcons.target}
                                    alt=""
                                    width={48}
                                    height={48}
                                    className="absolute orbit-icon"
                                    style={{ animationDelay: '5.33s' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
