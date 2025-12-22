'use client'

import { useState } from 'react'
import { logos } from '@/lib/assets'
import { smoothScrollTo } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user } = useAuth()
    const router = useRouter()

    const navLinks = [
        { label: 'O nas', href: 'o-nas' },
        { label: 'Funkcje', href: 'funkcje' },
        { label: 'Pobierz', href: 'pobierz' },
        { label: 'Kontakt', href: 'kontakt' },
    ]

    const handleLoginClick = () => {
        if (user) {
            router.push('/resolver')
        } else {
            router.push('/auth')
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-gradient-to-b from-black/20 via-black/10 to-transparent backdrop-blur-md border-b border-white/20">
            <div className="h-full flex items-center justify-between px-6 md:px-12">
                {/* Logo */}
                <div className="flex items-center">
                    <button
                        onClick={() => smoothScrollTo('top')}
                        className="transition-all duration-300 hover:rotate-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pedro-lime focus:ring-offset-2 focus:ring-offset-transparent rounded-lg p-1"
                    >
                        <img
                            src={logos.main}
                            alt="PEDRO Logo"
                            width={120}
                            height={40}
                            className="h-8 md:h-10 w-auto logo-hover-effect"
                        />
                    </button>
                </div>

                {/* Desktop Navigation - Black Pill */}
                <div className="hidden md:flex items-center bg-pedro-dark rounded-full px-8 py-3 gap-6">
                    {navLinks.map((link) => (
                        <button
                            key={link.href}
                            onClick={() => smoothScrollTo(link.href)}
                            className="text-white text-sm font-medium transition-all duration-300 hover:text-pedro-lime relative group"
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pedro-lime transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    ))}
                </div>

                {/* Login Button */}
                <div className="hidden md:block">
                    <button 
                        onClick={handleLoginClick}
                        className="btn-brutal btn-brutal-purple px-6 py-3 text-sm hover:-translate-y-1 hover:shadow-brutal-lime transition-all duration-300"
                    >
                        {user ? 'Panel' : 'Log in'}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-pedro-dark text-3xl font-bold bg-white/90 backdrop-blur-sm rounded-lg p-2 border-2 border-pedro-dark shadow-sm hover:bg-white transition-all duration-300"
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-pedro-dark/95 backdrop-blur-md border-t-3 border-pedro-lime shadow-2xl">
                    <div className="flex flex-col p-6 gap-4">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => {
                                    smoothScrollTo(link.href)
                                    setIsMobileMenuOpen(false)
                                }}
                                className="text-white text-lg font-medium py-2 text-left transition-colors hover:text-pedro-lime"
                            >
                                {link.label}
                            </button>
                        ))}
                        <button 
                            onClick={handleLoginClick}
                            className="btn-brutal btn-brutal-purple w-full mt-4"
                        >
                            {user ? 'Panel' : 'Log in'}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}
