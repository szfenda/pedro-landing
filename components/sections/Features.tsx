'use client'

import Image from 'next/image'
import { featureIcons, categoryIcons } from '@/lib/assets'
import { useState } from 'react'
import { useTilt3D } from '@/hooks/useTilt3D'

export default function Features() {
    return (
        <section id="funkcje" className="relative bg-pedro-light py-section overflow-hidden">
            {/* Background Doodles */}
            <div className="absolute inset-0 pointer-events-none opacity-20 hidden md:block">
                <img
                    src={categoryIcons.pizza}
                    alt=""
                    width={80}
                    height={80}
                    className="absolute top-20 left-10 rotate-12"
                />
                <img
                    src={categoryIcons.burger}
                    alt=""
                    width={80}
                    height={80}
                    className="absolute top-40 right-20 -rotate-6"
                />
                <img
                    src={categoryIcons.scissors}
                    alt=""
                    width={70}
                    height={70}
                    className="absolute bottom-32 left-1/4 rotate-45"
                />
                <img
                    src={categoryIcons.drink}
                    alt=""
                    width={70}
                    height={70}
                    className="absolute bottom-20 right-1/3 -rotate-12"
                />
            </div>

            <div className="container-pedro relative z-10">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2 className="font-headline text-h2 text-pedro-dark mb-4">
                        Trzy proste kroki do oszczędności
                    </h2>
                </div>

                {/* 3-Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 - Lokalny Radar */}
                    <FeatureCard
                        icon={featureIcons.search}
                        title={
                            <>
                                Lokalny<br />
                                Radar
                            </>
                        }
                        badge="Twoja dzielnica"
                        badgeColor="lime"
                    >
                        <p className="text-gray-600 text-center">
                            Tylko promocje w Twoim otoczeniu. Zero spamu, zero przejażdżek na drugi koniec miasta.
                        </p>
                    </FeatureCard>

                    {/* Card 2 - Portfel bez śmieci */}
                    <FeatureCard
                        icon={featureIcons.wallet}
                        title={
                            <>
                                Portfel<br />
                                bez śmieci
                            </>
                        }
                    >
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-3">
                                Kupony ważne tu i teraz:
                            </p>
                            <p className="text-2xl font-bold text-pedro-dark">
                                <span className="text-4xl text-pedro-purple">0</span> przeterminowanych kuponów
                            </p>
                        </div>
                    </FeatureCard>

                    {/* Card 3 - Skanujesz i masz */}
                    <FeatureCard
                        icon={featureIcons.qr}
                        title={
                            <>
                                Skanujesz<br />
                                i masz
                            </>
                        }
                        showScanLine
                    >
                        <p className="text-gray-600 text-center">
                            Jeden QR kod przy kasie. Bez szperania w portfelu, bez kombinowania.
                        </p>
                    </FeatureCard>
                </div>
            </div>
        </section>
    )
}

// Feature Card Component
interface FeatureCardProps {
    icon: string
    title: React.ReactNode
    children: React.ReactNode
    badge?: string
    badgeColor?: 'lime' | 'purple' | 'pink'
    showScanLine?: boolean
}

function FeatureCard({ icon, title, children, badge, badgeColor = 'lime', showScanLine = false }: FeatureCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const tiltRef = useTilt3D({ maxTilt: 8, scale: 1.02 })

    const badgeColors = {
        lime: 'bg-pedro-lime text-pedro-dark',
        purple: 'bg-pedro-purple text-white',
        pink: 'bg-pedro-pink text-white',
    }

    return (
        <div
            ref={tiltRef}
            className="card-brutal min-h-[420px] flex flex-col items-center justify-start relative group will-animate"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Icon Container with Scan Line */}
            <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                <img
                    src={icon}
                    alt=""
                    width={120}
                    height={120}
                    className="relative z-10"
                />

                {/* Scan Line Animation (Card 3 only) */}
                {showScanLine && (
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute left-0 right-0 h-[3px] bg-pedro-purple animate-scan" />
                    </div>
                )}
            </div>

            {/* Title */}
            <h3 className="font-headline text-h3 text-pedro-dark text-center mb-4 leading-tight">
                {title}
            </h3>

            {/* Badge (Card 1) */}
            {badge && (
                <div className={`${badgeColors[badgeColor]} px-4 py-2 rounded-full text-sm font-bold mb-4`}>
                    {badge}
                </div>
            )}

            {/* Content */}
            <div className="mt-auto">
                {children}
            </div>
        </div>
    )
}
