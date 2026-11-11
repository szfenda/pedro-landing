'use client'

import Image from 'next/image'
import { backgrounds, mascots, functionalIcons } from '@/lib/assets'
import { smoothScrollTo } from '@/lib/utils'
import ParallaxElement from '@/components/animations/ParallaxElement'
import { useRipple } from '@/hooks/useRipple'
import { useTranslation } from '@/lib/i18n-context'
import { webAppLink } from '@/lib/appLink'

export default function Hero() {
    const createRipple = useRipple()
    const { t } = useTranslation()

    return (
        <section id="top" className="relative h-screen flex flex-col md:flex-row -mt-16 md:-mt-20 pt-16 md:pt-20">
            {/* Left Half - Text + CTA */}
            <div
                className="relative w-full md:w-1/2 flex items-center justify-center px-8 md:px-10 lg:px-16 py-4 md:py-0 min-h-[65vh] md:min-h-screen"
                style={{
                    backgroundImage: `url(${backgrounds.heroLeft})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="max-w-2xl text-center md:text-left pt-16 md:pt-0 pb-4 md:pb-0">
                    {/* Headline - 4 lines as specified */}
                    <h1 className="font-headline text-3xl sm:text-4xl md:text-hero-fit text-white leading-tight md:leading-none tracking-tight text-poster-shadow mb-4 md:mb-[min(3rem,5vh)]">
                        {t('hero.line1')}<br />
                        {t('hero.line2')}<br />
                        {t('hero.line3')}<br />
                        {t('hero.line4')}
                    </h1>

                    {/* CTA: web-app (T-004). Sklepy — wkrótce (D-001) */}
                    <div className="flex flex-col gap-3 items-center md:items-start mt-4 md:mt-0">
                        <a
                            href={webAppLink('hero')}
                            onClick={createRipple}
                            className="btn-brutal btn-brutal-lime border-3 border-pedro-dark rounded-button px-6 md:px-5 lg:px-8 py-3 md:py-4 min-h-[44px] md:min-h-[52px] text-sm md:text-base lg:text-lg font-bold whitespace-nowrap relative overflow-hidden"
                        >
                            {t('hero.openWebApp')} →
                        </a>
                        <p className="inline-block bg-pedro-dark/70 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full">
                            {t('hero.storesSoon')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-pedro-dark z-10" />

            {/* Right Half - Visual (Desktop) */}
            <div
                className="hidden md:flex relative w-1/2 items-center justify-center px-16 min-h-screen"
                style={{
                    backgroundImage: `url(${backgrounds.heroRight})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Main Mascot with Floating Animation - Positioned lower to avoid nav overlap */}
                <ParallaxElement speed={0.3} className="relative mt-16">
                    <div
                        className="pedro-mascot-bg animate-float will-animate glow-lime"
                        style={{
                            backgroundImage: `url(${mascots.raccoonPhone})`,
                            width: '500px',
                            height: '600px',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                        }}
                        role="img"
                        aria-label="Pedro mascot with phone"
                    />
                </ParallaxElement>

                {/* Floating Decorative Particles - Adjusted positions */}
                <div className="absolute top-32 left-20 w-16 h-16 bg-pedro-lime rounded-full opacity-60 animate-float" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-52 right-20 w-12 h-12 bg-pedro-pink rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-40 left-32 w-10 h-10 bg-pedro-purple rounded-full opacity-60 animate-float" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Mobile Visual - Bottom Half */}
            <div
                className="md:hidden relative flex-1 flex items-center justify-center px-8 py-4 min-h-[35vh] bg-gradient-to-b from-transparent to-pedro-light/50"
                style={{
                    backgroundImage: `url(${backgrounds.heroRight})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Mobile Mascot - Smaller and Centered */}
                <div className="relative">
                    <div
                        className="pedro-mascot-bg animate-float will-animate"
                        style={{
                            backgroundImage: `url(${mascots.raccoonPhone})`,
                            width: '280px',
                            height: '350px',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                        }}
                        role="img"
                        aria-label="Pedro mascot with phone"
                    />
                </div>

                {/* Mobile Floating Particles - Fewer and Smaller */}
                <div className="absolute top-10 left-10 w-8 h-8 bg-pedro-lime rounded-full opacity-60 animate-float" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-20 right-10 w-6 h-6 bg-pedro-pink rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-20 left-16 w-5 h-5 bg-pedro-purple rounded-full opacity-60 animate-float" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Mobile Section Separator */}
            <div className="md:hidden h-8 bg-gradient-to-b from-transparent via-pedro-light/80 to-pedro-light"></div>

            {/* Scroll Indicator */}
            <button
                onClick={() => smoothScrollTo('funkcje')}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full border-3 border-pedro-dark bg-white shadow-brutal-purple animate-bounce-slow hover:shadow-brutal-lime transition-all duration-300 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pedro-lime focus-visible:ring-offset-2"
                aria-label="Scroll to features section"
            >
                <img
                    src={functionalIcons.arrowDown}
                    alt="Scroll down"
                    width={20}
                    height={20}
                />
            </button>
        </section>
    )
}
