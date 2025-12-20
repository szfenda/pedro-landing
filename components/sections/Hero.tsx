'use client'

import Image from 'next/image'
import { backgrounds, mascots, functionalIcons } from '@/lib/assets'
import { smoothScrollTo } from '@/lib/utils'
import ParallaxElement from '@/components/animations/ParallaxElement'
import { useRipple } from '@/hooks/useRipple'

export default function Hero() {
    const createRipple = useRipple()

    const handleStoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        createRipple(e)
        // TODO: Add actual store URLs before launch
    }

    return (
        <section id="top" className="relative h-screen flex flex-col md:flex-row">
            {/* Left Half - Text + CTA */}
            <div
                className="relative w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 py-8 md:py-0"
                style={{
                    backgroundImage: `url(${backgrounds.heroLeft})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="max-w-2xl text-center md:text-left">
                    {/* Headline - 4 lines as specified */}
                    <h1 className="font-headline text-hero text-white leading-none tracking-tight text-poster-shadow mb-8 md:mb-12">
                        PEDRO NIE<br />
                        PRZEPŁACA.<br />
                        PEDRO POLUJE<br />
                        NA PROMKI
                    </h1>

                    {/* Store Badges */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        {/* App Store Badge */}
                        <a
                            href="#"
                            aria-label="Download on the App Store"
                            onClick={handleStoreClick}
                            className="btn-brutal bg-black text-white border-3 border-pedro-dark rounded-button px-8 py-4 flex items-center justify-center gap-3 min-h-[52px] shadow-brutal-lime hover:shadow-brutal-lime hover:-translate-y-2 active:scale-95 transition-all duration-300 relative overflow-hidden"
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
                            onClick={handleStoreClick}
                            className="btn-brutal bg-black text-white border-3 border-pedro-dark rounded-button px-8 py-4 flex items-center justify-center gap-3 min-h-[52px] shadow-brutal-lime hover:shadow-brutal-lime hover:-translate-y-2 active:scale-95 transition-all duration-300 relative overflow-hidden"
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
                </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-pedro-dark z-10" />

            {/* Right Half - Visual (Desktop) */}
            <div
                className="hidden md:flex relative w-1/2 items-center justify-center px-16"
                style={{
                    backgroundImage: `url(${backgrounds.heroRight})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Main Mascot with Floating Animation */}
                <ParallaxElement speed={0.3} className="relative">
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

                {/* Floating Decorative Particles */}
                <div className="absolute top-20 left-20 w-16 h-16 bg-pedro-lime rounded-full opacity-60 animate-float" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-40 right-20 w-12 h-12 bg-pedro-pink rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-40 left-32 w-10 h-10 bg-pedro-purple rounded-full opacity-60 animate-float" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Mobile Visual - Bottom Half */}
            <div
                className="md:hidden relative flex-1 flex items-center justify-center px-8 py-8"
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
