'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { Locale } from './i18n-config'
import { defaultLocale, locales } from './i18n-config'
import pl from '@/messages/pl.json'

type Messages = Record<string, any>

const messagesCache: Record<Locale, Messages> = {
  pl,
  en: pl, // fallback until loaded
}

let enLoaded = false

async function loadEN(): Promise<Messages> {
  if (enLoaded) return messagesCache.en
  const mod = await import('@/messages/en.json')
  messagesCache.en = mod.default
  enLoaded = true
  return mod.default
}

function getNestedValue(obj: any, path: string): string {
  const result = path.split('.').reduce((acc, key) => acc?.[key], obj)
  return typeof result === 'string' ? result : path
}

interface I18nContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (k) => k,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  const [, setReady] = useState(0)

  // Hydrate locale from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pedro-locale')
      if (saved && locales.includes(saved as Locale)) {
        setLocaleState(saved as Locale)
        document.documentElement.lang = saved
        if (saved === 'en' && !enLoaded) {
          loadEN().then(() => setReady((r) => r + 1))
        }
      }
    } catch {}
  }, [])

  // Sync document lang attribute on locale change (after initial mount)
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  // Preload EN messages when locale is EN
  useEffect(() => {
    if (locale === 'en' && !enLoaded) {
      loadEN().then(() => setReady((r) => r + 1))
    }
  }, [locale])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('pedro-locale', l)
    document.documentElement.lang = l
    if (l === 'en' && !enLoaded) {
      loadEN().then(() => setReady((r) => r + 1))
    }
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let value = getNestedValue(messagesCache[locale], key)
      if (value === key) {
        value = getNestedValue(messagesCache.pl, key)
      }
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v))
        })
      }
      return value
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useTranslation = () => useContext(I18nContext)
