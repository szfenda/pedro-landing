'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n-context'
import { locales, localeNames, type Locale } from '@/lib/i18n-config'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2',
          'border-3 border-pedro-dark rounded-button bg-white',
          'hover:shadow-brutal-sm-lime hover:-translate-y-0.5',
          'transition-all duration-300 text-sm font-bold'
        )}
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <span>{mounted ? locale.toUpperCase() : ''}</span>
        <svg
          className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute top-full right-0 mt-2 border-3 border-pedro-dark rounded-button bg-white shadow-brutal-purple min-w-[140px] py-1 z-50"
        >
          {locales.map((loc) => (
            <button
              key={loc}
              role="option"
              aria-selected={locale === loc}
              onClick={() => { setLocale(loc); setIsOpen(false) }}
              className={cn(
                'w-full px-4 py-2 text-left flex items-center gap-3 text-sm font-medium',
                'hover:bg-pedro-lime/20 transition-colors',
                locale === loc && 'bg-pedro-lime/30 font-bold'
              )}
            >
              <span>{localeNames[loc]}</span>
              {locale === loc && <span className="ml-auto text-pedro-purple">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
