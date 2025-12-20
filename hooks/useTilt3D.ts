'use client'

import { useRef, useEffect } from 'react'

interface TiltOptions {
    maxTilt?: number
    perspective?: number
    scale?: number
    speed?: number
}

export function useTilt3D(options: TiltOptions = {}) {
    const {
        maxTilt = 10,
        perspective = 1000,
        scale = 1.05,
        speed = 300
    } = options

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const centerX = rect.width / 2
            const centerY = rect.height / 2
            
            const rotateX = ((y - centerY) / centerY) * -maxTilt
            const rotateY = ((x - centerX) / centerX) * maxTilt

            element.style.transform = `
                perspective(${perspective}px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(${scale})
            `
        }

        const handleMouseLeave = () => {
            element.style.transform = `
                perspective(${perspective}px)
                rotateX(0deg)
                rotateY(0deg)
                scale(1)
            `
        }

        const handleMouseEnter = () => {
            element.style.transition = 'none'
        }

        const handleTransitionEnd = () => {
            element.style.transition = `transform ${speed}ms cubic-bezier(0.4, 0, 0.2, 1)`
        }

        element.addEventListener('mousemove', handleMouseMove)
        element.addEventListener('mouseleave', handleMouseLeave)
        element.addEventListener('mouseenter', handleMouseEnter)
        element.addEventListener('transitionend', handleTransitionEnd)

        // Set initial transition
        element.style.transition = `transform ${speed}ms cubic-bezier(0.4, 0, 0.2, 1)`

        return () => {
            element.removeEventListener('mousemove', handleMouseMove)
            element.removeEventListener('mouseleave', handleMouseLeave)
            element.removeEventListener('mouseenter', handleMouseEnter)
            element.removeEventListener('transitionend', handleTransitionEnd)
        }
    }, [maxTilt, perspective, scale, speed])

    return ref
}