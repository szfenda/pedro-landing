'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollTop = window.scrollY
            const documentHeight = document.documentElement.scrollHeight
            const windowHeight = window.innerHeight
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100
            setScrollProgress(Math.min(progress, 100))
        }

        window.addEventListener('scroll', updateScrollProgress)
        updateScrollProgress() // Initial call

        return () => window.removeEventListener('scroll', updateScrollProgress)
    }, [])

    return (
        <div 
            className="fixed top-0 left-0 h-1 bg-pedro-lime z-[9999] transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
        />
    )
}