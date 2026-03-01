# 🌍 Plan i18n LITE — Zmiana języka PL/EN (bez legal)

**Data:** 1 marca 2026  
**Status:** 📋 Do implementacji  
**Podejście:** React Context + JSON (zero nowych zależności npm)  
**Zakres:** Cała aplikacja OPRÓCZ dokumentów prawnych (legal zostaje tylko PL)

---

## Założenia

- Polski to język główny, angielski to bonus
- Dokumenty prawne (regulamin, polityka prywatności) — bez zmian, zostają PL
- Brak zmian w routingu (URL-e bez `/en/` prefiksu)
- Brak zmian w middleware
- Brak nowych zależności npm
- Język zapisywany w localStorage, domyślnie PL
- Strona ma pozostać lekka i szybka
- Brak flashu języka (inline script w `<head>` + lazy init w useState)
- Przełącznik języka: prosty tekst "PL / EN" (bez emoji flag — nie renderują się poprawnie na Windows)

---

## Nowe pliki do utworzenia (5 plików)

```
messages/
├── pl.json                      # Wszystkie polskie teksty wyciągnięte z komponentów
└── en.json                      # Angielskie tłumaczenia (identyczna struktura)

lib/
├── i18n-config.ts               # Konfiguracja: locales, nazwy
└── i18n-context.tsx             # React Context + Provider + hook useTranslation()

components/layout/
└── LanguageSwitcher.tsx          # Przycisk zmiany języka (prosty tekst PL/EN)
```

---

## Pliki do edycji (~30 plików)

Każda edycja to ten sam wzorzec:
1. `import { useTranslation } from '@/lib/i18n-context'`
2. `const { t } = useTranslation()` na początku komponentu
3. Zamiana hardcoded tekstu na `{t('klucz')}`

### Layout (2 pliki)
- `app/layout.tsx` — dodanie `<I18nProvider>` wrappera + inline script anti-flash
- `app/(public)/page.tsx` — sprawdzić czy ma teksty

### Nawigacja i footer (3 pliki)
- `components/layout/Navigation.tsx` — dodanie LanguageSwitcher + tłumaczenia linków
- `components/layout/Footer.tsx` — tłumaczenia tekstów
- `components/layout/AuthNavigation.tsx` — tłumaczenia

### Sekcje landing page (8 plików)
- `components/sections/Hero.tsx`
- `components/sections/About.tsx`
- `components/sections/Features.tsx`
- `components/sections/B2B.tsx`
- `components/sections/SocialProof.tsx`
- `components/sections/FAQ.tsx`
- `components/sections/Download.tsx`
- `components/sections/Contact.tsx`

### Auth (4 pliki)
- `components/auth/AuthCard.tsx`
- `components/auth/LoginTab.tsx`
- `components/auth/RegisterTab.tsx`
- `components/auth/ResetPasswordTab.tsx`

### Business / Dashboard (4 pliki)
- `components/business/BusinessForm.tsx`
- `components/business/BillingCard.tsx`
- `components/business/DashboardCard.tsx`
- `components/business/BusinessFormSection.tsx`

### Settings (4 pliki)
- `components/settings/BusinessSettingsCard.tsx`
- `components/settings/DangerZone.tsx`
- `components/settings/SecuritySettings.tsx`
- `components/settings/UserSettingsForm.tsx`

### Strony protected (7 plików)
- `app/(protected)/dashboard/page.tsx`
- `app/(protected)/billing/page.tsx`
- `app/(protected)/register-business/page.tsx`
- `app/(protected)/edit-business/page.tsx`
- `app/(protected)/settings/page.tsx`
- `app/(protected)/no-business/page.tsx`
- `app/(protected)/resolver/page.tsx`

### Pomijamy (bez zmian)
- `components/legal/*` — zostaje PL
- `app/(public)/legal/*` — zostaje PL
- `lib/legal/*` — zostaje PL
- `app/api/*` — backend, bez tekstów UI
- `middleware.ts` — bez zmian

---

## Umiejscowienie przełącznika języka

### Desktop
```
[PEDRO logo]  [O nas] [Funkcje] [Pobierz] [Kontakt]   [PL ▾]  [Log in]
```
Przycisk z kodem języka (tekst), po kliknięciu dropdown z dwoma opcjami.
Znajduje się między nawigacją a przyciskiem logowania.

### Mobile
```
[PEDRO logo]                                      [PL]  [☰]
```
Mały przycisk z kodem języka (bez tekstu nazwy), obok burgera.

### Dropdown (po kliknięciu)
```
┌─────────────────┐
│ Polski        ✓ │
│ English         │
└─────────────────┘
```
Brutal design: border-3, rounded-button, shadow-brutal-purple.

---

## Szczegóły implementacji kluczowych plików

### KROK 1. `lib/i18n-config.ts`
```ts
export const locales = ['pl', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'pl'

export const localeNames: Record<Locale, string> = {
  pl: 'Polski',
  en: 'English',
}
```

### KROK 2. `lib/i18n-context.tsx`
```tsx
'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Locale } from './i18n-config'
import { defaultLocale, locales } from './i18n-config'
import pl from '@/messages/pl.json'
import en from '@/messages/en.json'

const messages: Record<Locale, Record<string, any>> = { pl, en }

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
  // Lazy init — odczytaj localStorage synchronicznie przy pierwszym renderze
  // Eliminuje flash języka (strona nie miga z PL na EN)
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pedro-locale')
      if (saved && locales.includes(saved as Locale)) return saved as Locale
    }
    return defaultLocale
  })

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('pedro-locale', l)
    document.documentElement.lang = l
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let value = getNestedValue(messages[locale], key)
      if (value === key) {
        // Fallback do polskiego jeśli brak tłumaczenia
        value = getNestedValue(messages.pl, key)
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
```

### KROK 3. `messages/pl.json` — wyciągnij teksty z komponentów

Pełna struktura kluczy (patrz sekcja "Struktura pliku messages/pl.json" poniżej).
Plik będzie miał ~250-300 kluczy.

### KROK 4. `messages/en.json` — przetłumacz

Identyczna struktura jak `pl.json`, wszystkie wartości po angielsku.

### KROK 5. `components/layout/LanguageSwitcher.tsx`
```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n-context'
import { locales, localeNames, type Locale } from '@/lib/i18n-config'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
        <span>{locale.toUpperCase()}</span>
        <svg
          className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 border-3 border-pedro-dark rounded-button bg-white shadow-brutal-purple min-w-[140px] py-1 z-50">
          {locales.map((loc) => (
            <button
              key={loc}
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
```

### KROK 6. Zmiana w `app/layout.tsx`

```tsx
// DODAJ import:
import { I18nProvider } from '@/lib/i18n-context'

// DODAJ inline script w <head> — zapobiega flashowi języka:
<head>
  <script dangerouslySetInnerHTML={{ __html: `
    try{var l=localStorage.getItem('pedro-locale');if(l==='en')document.documentElement.lang='en'}catch(e){}
  `}} />
  {/* ...reszta head bez zmian... */}
</head>

// ZMIEŃ body — I18nProvider NAD AuthProvider:
<body className={inter.className}>
  <I18nProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </I18nProvider>
</body>
```

Dlaczego inline script + lazy init razem:
- Inline script ustawia `lang` na `<html>` ZANIM React się załaduje (zero flashu atrybutu lang)
- Lazy init w `useState` ustawia poprawny locale ZANIM React wyrenderuje treść (zero flashu tekstu)
- Razem = użytkownik z EN w localStorage nigdy nie widzi polskiego tekstu

### KROK 7. Zmiana w `components/layout/Navigation.tsx`
```tsx
// DODAJ importy:
import { useTranslation } from '@/lib/i18n-context'
import LanguageSwitcher from './LanguageSwitcher'

// W komponencie:
const { t } = useTranslation()

const navLinks = [
  { label: t('nav.about'), href: 'o-nas' },
  { label: t('nav.features'), href: 'funkcje' },
  { label: t('nav.download'), href: 'pobierz' },
  { label: t('nav.contact'), href: 'kontakt' },
]

// Desktop: dodaj <LanguageSwitcher /> przed przyciskiem logowania
// Mobile: dodaj <LanguageSwitcher /> obok burgera
```

### KROK 8. Edytuj `Footer.tsx` — tłumaczenia

### KROK 9. Edytuj 8 sekcji landing page — tłumaczenia

### KROK 10. Edytuj 4 komponenty auth — tłumaczenia

### KROK 11. Edytuj komponenty business/dashboard — tłumaczenia

### KROK 12. Edytuj komponenty settings — tłumaczenia

### KROK 13. Edytuj strony protected (pages) — tłumaczenia

### KROK 14. Testy manualne PL + EN

---

## Struktura pliku `messages/pl.json` (klucze)

```json
{
  "nav": { "about", "features", "download", "contact", "login", "myAccount", "dashboard", "settings", "logout" },
  "hero": { "headline.line1-4", "scrollDown" },
  "about": { "title", "description", "features.feature1-3" },
  "features": { "title", "subtitle", "search.*", "wallet.*", "qr.*" },
  "b2b": { "title", "subtitle", "description", "stats.*", "cta" },
  "socialProof": { "title", "testimonials.*", "partners.*" },
  "faq": { "title", "subtitle", "questions.q1-q6.*" },
  "download": { "title", "subtitle" },
  "contact": { "title", "subtitle", "form.*", "success.*", "error" },
  "footer": { "description", "links", "terms", "privacy", "contact", "forBusiness", "followUs", "madeWith", "pedroBubble" },
  "auth": { "login.*", "register.*", "resetPassword.*", "errors.*" },
  "business": { "form.*", "progress.*", "actions.*", "errors.*" },
  "dashboard": { "title", "subtitle", "loading", "status.*", "billing.*", "offers.*", "settings.*", "info.*", "support.*" },
  "common": { "loading", "error", "success", "cancel", "save", "edit", "delete", "back", "next", "close", "retry" }
}
```

Pełny plik będzie miał ~250-300 kluczy. `en.json` ma identyczną strukturę.

---

## Wzorzec edycji komponentu

Przed (np. FAQ.tsx):
```tsx
export default function FAQ() {
  const faqs = [
    { question: 'Jak działa PEDRO?', answer: 'PEDRO automatycznie...' },
  ]
  return (
    <h2>Często zadawane pytania</h2>
  )
}
```

Po:
```tsx
import { useTranslation } from '@/lib/i18n-context'

export default function FAQ() {
  const { t } = useTranslation()
  const faqs = [
    { question: t('faq.questions.q1.question'), answer: t('faq.questions.q1.answer') },
  ]
  return (
    <h2>{t('faq.title')}</h2>
  )
}
```

---

## Kolejność implementacji

| Krok | Co | Czas |
|------|----|------|
| 1 | Utwórz `lib/i18n-config.ts` | 5 min |
| 2 | Utwórz `lib/i18n-context.tsx` | 15 min |
| 3 | Utwórz `messages/pl.json` (wyciągnij teksty z komponentów) | 60 min |
| 4 | Utwórz `messages/en.json` (przetłumacz) | 60 min |
| 5 | Utwórz `components/layout/LanguageSwitcher.tsx` | 15 min |
| 6 | Edytuj `app/layout.tsx` — dodaj I18nProvider + inline script anti-flash | 5 min |
| 7 | Edytuj `Navigation.tsx` — dodaj LanguageSwitcher + tłumaczenia | 15 min |
| 8 | Edytuj `Footer.tsx` — tłumaczenia | 10 min |
| 9 | Edytuj 8 sekcji landing page — tłumaczenia | 60 min |
| 10 | Edytuj 4 komponenty auth — tłumaczenia | 30 min |
| 11 | Edytuj komponenty business/dashboard — tłumaczenia | 40 min |
| 12 | Edytuj komponenty settings — tłumaczenia | 20 min |
| 13 | Edytuj strony protected (pages) — tłumaczenia | 30 min |
| 14 | Testy manualne PL + EN | 30 min |
| **Razem** | | **~6-7h** |

---

## Wpływ na wydajność

- Nowe zależności npm: **0**
- Dodatkowy JS: **~6KB** (dwa pliki JSON z tłumaczeniami, oba w bundlu)
- Zmiana routingu: **brak**
- Zmiana middleware: **brak**
- Zmiana URL-i: **brak**
- Flash języka: **brak** (inline script + lazy useState init)
- Ryzyko regresji: **niskie**
- Wpływ na ładowanie: **praktycznie zerowy**

---

## Ograniczenia tego podejścia

1. Brak `/en/` w URL — Google nie indeksuje osobno wersji EN (ale to OK bo PL to główny rynek)
2. Metadata (title, description) w `<head>` pozostaje po polsku (SSR generuje PL, zmiana języka jest client-side)
3. Oba pliki JSON (pl + en) są zawsze w bundlu (~6KB łącznie) — przy 300 kluczach to akceptowalne

Jeśli w przyszłości SEO wielojęzyczne stanie się priorytetem, pliki JSON z tłumaczeniami są gotowe do migracji na `next-intl` z `[locale]` w URL.

---

## Co NIE jest zmieniane

- `middleware.ts` — bez zmian
- `next.config.js` — bez zmian
- `app/api/*` — bez zmian
- `lib/legal/*` — bez zmian
- `components/legal/*` — bez zmian
- `app/(public)/legal/*` — bez zmian
- `lib/validations.ts` — komunikaty Zod zostają PL (błędy walidacji tłumaczymy w UI)
- Struktura folderów `app/` — bez zmian
