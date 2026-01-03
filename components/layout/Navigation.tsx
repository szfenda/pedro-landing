'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { logos, functionalIcons, businessIcons } from '@/lib/assets'
import { smoothScrollTo } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const userMenuRef = useRef<HTMLDivElement>(null)

    // Check if we're on a legal page
    const isLegalPage = pathname?.startsWith('/legal')

    const navLinks = [
        { label: 'O nas', href: 'o-nas' },
        { label: 'Funkcje', href: 'funkcje' },
        { label: 'Pobierz', href: 'pobierz' },
        { label: 'Kontakt', href: 'kontakt' },
    ]

    const handleNavClick = (href: string) => {
        if (isLegalPage) {
            // If on legal page, navigate to home with fragment
            router.push(`/#${href}`)
        } else {
            // If on home page, smooth scroll to section
            smoothScrollTo(href)
        }
    }

    const handleLogoClick = () => {
        if (isLegalPage) {
            // If on legal page, navigate to home
            router.push('/')
        } else {
            // If on home page, scroll to top
            smoothScrollTo('top')
        }
    }

    const handleLoginClick = () => {
        if (user) {
            router.push('/resolver')
        } else {
            router.push('/auth')
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            setIsUserMenuOpen(false)
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    const handleDashboardClick = () => {
        router.push('/resolver')
        setIsUserMenuOpen(false)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false)
            }
        }

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isUserMenuOpen])

    // Close dropdown on Escape key
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsUserMenuOpen(false)
            }
        }

        if (isUserMenuOpen) {
            document.addEventListener('keydown', handleEscapeKey)
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey)
        }
    }, [isUserMenuOpen])

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-gradient-to-b from-black/20 via-black/10 to-transparent backdrop-blur-md border-b border-white/20">
            <div className="h-full flex items-center justify-between px-6 md:px-12">
                {/* Logo */}
                <div className="flex items-center">
                    <button
                        onClick={handleLogoClick}
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
                            onClick={() => handleNavClick(link.href)}
                            className="text-white text-sm font-medium transition-all duration-300 hover:text-pedro-lime relative group"
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pedro-lime transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    ))}
                </div>

                {/* Desktop User Menu */}
                <div className="hidden md:block relative" ref={userMenuRef}>
                    {user ? (
                        <>
                            <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="btn-brutal btn-brutal-purple px-6 py-3 text-sm hover:-translate-y-1 hover:shadow-brutal-lime transition-all duration-300 flex items-center gap-2"
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="true"
                            >
                                Moje konto
                                <img
                                    src={functionalIcons.arrowDown}
                                    alt=""
                                    width={16}
                                    height={16}
                                    className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border-3 border-pedro-dark shadow-brutal-purple rounded-card p-2 z-50">
                                    <button
                                        onClick={handleDashboardClick}
                                        className="w-full text-left px-4 py-3 hover:bg-pedro-light rounded-button transition-colors flex items-center gap-3 font-medium text-pedro-dark"
                                    >
                                        <img
                                            src={businessIcons.analytics}
                                            alt=""
                                            width={20}
                                            height={20}
                                        />
                                        Dashboard
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            router.push('/settings')
                                            setIsUserMenuOpen(false)
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-pedro-light rounded-button transition-colors flex items-center gap-3 font-medium text-pedro-dark"
                                    >
                                        <span className="text-lg">⚙️</span>
                                        Ustawienia
                                    </button>
                                    
                                    <hr className="my-2 border-pedro-dark/20" />
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 rounded-button transition-colors flex items-center gap-3 font-medium"
                                    >
                                        <span className="text-lg">🚪</span>
                                        Wyloguj
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <button 
                            onClick={() => router.push('/auth')}
                            className="btn-brutal btn-brutal-purple px-6 py-3 text-sm hover:-translate-y-1 hover:shadow-brutal-lime transition-all duration-300"
                        >
                            Log in
                        </button>
                    )}
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
                                    handleNavClick(link.href)
                                    setIsMobileMenuOpen(false)
                                }}
                                className="text-white text-lg font-medium py-2 text-left transition-colors hover:text-pedro-lime"
                            >
                                {link.label}
                            </button>
                        ))}
                        
                        {user ? (
                            <>
                                <button 
                                    onClick={() => {
                                        handleLoginClick()
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="btn-brutal btn-brutal-purple w-full mt-4"
                                >
                                    Moje konto
                                </button>
                                <button 
                                    onClick={() => {
                                        handleLogout()
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="btn-brutal btn-brutal-outline-white w-full mt-2 text-red-600 border-red-600 hover:bg-red-50"
                                >
                                    🚪 Wyloguj
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => {
                                    router.push('/auth')
                                    setIsMobileMenuOpen(false)
                                }}
                                className="btn-brutal btn-brutal-purple w-full mt-4"
                            >
                                Log in
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
