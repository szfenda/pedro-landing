'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n-context'

const COOKIE_CONSENT_KEY = 'pedro-cookie-consent'

interface CookieConsentState {
  necessary: boolean
  analytics: boolean
  timestamp: string
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // Check if consent was already given
    try {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (!saved) {
        // Small delay for smooth page load
        const timer = setTimeout(() => setIsVisible(true), 1000)
        return () => clearTimeout(timer)
      }
    } catch {
      // If localStorage is unavailable, show banner
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    const consent: CookieConsentState = {
      necessary: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent))
    setIsVisible(false)
    // Here you would initialize Google Analytics
    // window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
  }

  const handleReject = () => {
    const consent: CookieConsentState = {
      necessary: true,
      analytics: false,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent))
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-auto animate-in slide-in-from-bottom-4 duration-500"
      role="dialog"
      aria-label={t('cookies.title')}
    >
      <div className="bg-white brutal-border rounded-card p-5 shadow-brutal-purple">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🍪</span>
          <h3 className="font-bold text-pedro-dark text-sm">
            {t('cookies.title')}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          {t('cookies.description')}{' '}
          <Link
            href="/legal/polityka-prywatnosci"
            className="text-pedro-purple font-bold hover:underline"
          >
            {t('cookies.privacyLink')}
          </Link>
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            className="flex-1 px-4 py-2 text-xs font-bold text-pedro-dark bg-white brutal-border rounded-button transition-all duration-300 hover:-translate-y-0.5 hover:shadow-brutal-sm-purple active:scale-95"
          >
            {t('cookies.reject')}
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 text-xs font-bold text-white bg-pedro-purple brutal-border rounded-button transition-all duration-300 hover:-translate-y-0.5 hover:shadow-brutal-sm-lime active:scale-95"
          >
            {t('cookies.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
