'use client'

import { useEffect, useRef } from 'react'

interface ScrollRevealOptions {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -50px 0px',
        triggerOnce = true
    } = options

    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed')
                        if (triggerOnce) {
                            observer.unobserve(entry.target)
                        }
                    } else if (!triggerOnce) {
                        entry.target.classList.remove('revealed')
                    }
                })
            },
            { threshold, rootMargin }
        )

        // Add scroll-reveal class initially
        element.classList.add('scroll-reveal')
        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [threshold, rootMargin, triggerOnce])

    return ref
}