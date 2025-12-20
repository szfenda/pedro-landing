'use client'

import { useEffect, useState } from 'react'
import { useRipple } from '@/hooks/useRipple'
import { smoothScrollTo } from '@/lib/utils'

export default function MobileStickyCTA() {
    const [isVisible, setIsVisible] = useState(false)
    const createRipple = useRipple()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        createRipple(e)
        smoothScrollTo('pobierz')
    }

    useEffect(() => {
        const handleScroll = () => {
            // Show CTA after scrolling past Hero (100vh)
            const heroHeight = window.innerHeight
            const scrollTop = window.scrollY
            setIsVisible(scrollTop > heroHeight * 0.8)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Initial call

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="bg-white border-t-3 border-pedro-dark p-4">
                <a
                    href="#"
                    onClick={handleClick}
                    className="btn-brutal btn-brutal-lime w-full text-center py-4 text-lg font-bold relative overflow-hidden"
                    aria-label="Download PEDRO app"
                >
                    Pobierz PEDRO
                </a>
            </div>
        </div>
    )
}