'use client'

import { useEffect, useRef } from 'react'

interface ParallaxElementProps {
    children: React.ReactNode
    speed?: number
    className?: string
}

export default function ParallaxElement({ children, speed = 0.5, className = '' }: ParallaxElementProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const handleScroll = () => {
            const scrolled = window.scrollY
            const rate = scrolled * -speed
            element.style.transform = `translateY(${rate}px)`
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [speed])

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    )
}