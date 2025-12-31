# PEDRO - SZCZEGÓŁOWY PLAN MIGRACJI Z FIREBASE HOSTING NA VERCEL

## 🎯 EXECUTIVE SUMMARY

**PROBLEM:** Aplikacja działa poprawnie na localhost, ale po zalogowaniu na Firebase Hosting (produkcja) nie ma przekierowania na odpowiednie strony. Główne przyczyny:
- Brak zmiennych środowiskowych w Firebase Functions
- Skomplikowana konfiguracja Firebase Functions z Next.js
- Problemy z ciasteczkami autoryzacyjnymi między domenami
- Trudności w debugowaniu Firebase Functions

**ROZWIĄZANIE:** Migracja na Vercel - natywną platformę dla Next.js z automatyczną obsługą zmiennych środowiskowych i API routes.

---

## 📊 ANALIZA OBECNEJ APLIKACJI

### Funkcjonalności do zachowania:
✅ **Formularz kontaktowy** - `app/api/contact/route.ts` z nodemailer + GoDaddy SMTP  
✅ **System autoryzacji** - Firebase Auth z pełnym flow login/register/reset  
✅ **Stripe integration** - 3 API routes: checkout, portal, webhook  
✅ **Firestore operations** - USER/PARTNER collections z real-time listeners  
✅ **Protected routes** - middleware z cookie authentication  
✅ **Business onboarding** - 4-sekcyjny formularz rejestracji biznesu  
✅ **Billing dashboard** - Stripe Customer Portal integration  

### Obecne problemy na Firebase Hosting:
❌ Brak zmiennych środowiskowych w Firebase Functions  
❌ Problemy z ciasteczkami `firebase-auth-token` vs `__session`  
❌ Skomplikowana konfiguracja TypeScript w Functions  
❌ Trudne debugowanie błędów w produkcji  
❌ Brak logów w konsoli przeglądarki  

---

## 🏗️ PLAN MIGRACJI - SZCZEGÓŁOWE KROKI

### KROK 1: PRZYGOTOWANIE ŚRODOWISKA VERCEL (30 minut)

#### 1.1 Instalacja Vercel CLI
```bash
# Zainstaluj Vercel CLI globalnie
npm install -g vercel

# Zaloguj się do Vercel
vercel login
```

#### 1.2 Stworzenie konfiguracji Vercel
**Plik: `vercel.json`** (NOWY PLIK)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 10
    }
  },
  "regions": ["fra1"],
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### KROK 2: CZYSZCZENIE Z FIREBASE FUNCTIONS (15 minut)

#### 2.1 Pliki do usunięcia:
```bash
# Usuń cały folder functions
rm -rf functions/

# Usuń pliki Firebase Functions
rm -f .firebase/hosting.b3V0.cache
rm -f .firebase/hosting.Lm5leHRcc3RhdGlj.cache
```

#### 2.2 Aktualizacja firebase.json
**Plik: `firebase.json`** (EDYTUJ)
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

#### 2.3 Aktualizacja package.json
**Plik: `package.json`** (EDYTUJ - usuń skrypty Firebase Functions)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "vercel:deploy": "vercel --prod",
    "vercel:preview": "vercel"
  }
}
```

### KROK 3: AKTUALIZACJA NEXT.JS CONFIG (10 minut)

#### 3.1 Uproszczenie next.config.js
**Plik: `next.config.js`** (EDYTUJ)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: {
        domains: ['firebasestorage.googleapis.com'],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Usuń env section - Vercel zarządza tym automatycznie
}

module.exports = nextConfig
```

### KROK 4: POPRAWKA AUTORYZACJI (20 minut)

#### 4.1 Aktualizacja auth-context.tsx
**Plik: `lib/auth-context.tsx`** (EDYTUJ)
```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)
      
      // Set auth cookie for middleware - poprawiona wersja dla Vercel
      if (user) {
        try {
          const token = await user.getIdToken()
          // Określ domenę na podstawie środowiska
          const isProduction = window.location.hostname !== 'localhost'
          const domain = isProduction ? `; domain=${window.location.hostname}` : ''
          
          document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; secure; samesite=strict${domain}`
          
          console.log('Auth cookie set successfully', { 
            hostname: window.location.hostname, 
            isProduction,
            userEmail: user.email 
          })
        } catch (error) {
          console.error('Error setting auth cookie:', error)
        }
      } else {
        // Clear auth cookie when user logs out
        document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        console.log('Auth cookie cleared')
      }
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

#### 4.2 Aktualizacja middleware.ts
**Plik: `middleware.ts`** (EDYTUJ)
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protected routes that require authentication
  const protectedPaths = [
    '/resolver',
    '/no-business', 
    '/register-business',
    '/billing',
    '/dashboard'
  ]
  
  // Check if current path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPath) {
    // Check for auth token in cookies - uproszczona wersja dla Vercel
    const authToken = request.cookies.get('firebase-auth-token')?.value
    
    console.log('Middleware check:', {
      pathname,
      hasAuthToken: !!authToken,
      cookieNames: Array.from(request.cookies.keys())
    })
    
    // If no auth token found, redirect to auth page
    if (!authToken) {
      const authUrl = new URL('/auth', request.url)
      authUrl.searchParams.set('redirect', pathname)
      console.log('Redirecting to auth:', authUrl.toString())
      return NextResponse.redirect(authUrl)
    }
  }
  
  // Allow public routes and authenticated protected routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Protected routes
    '/resolver/:path*',
    '/no-business/:path*', 
    '/register-business/:path*',
    '/billing/:path*',
    '/dashboard/:path*',
    // API routes (optional protection)
    '/api/stripe/:path*'
  ]
}
```

#### 4.3 Dodanie debugowania w resolver
**Plik: `app/(protected)/resolver/page.tsx`** (EDYTUJ - dodaj na początku useEffect)
```typescript
useEffect(() => {
  console.log('Resolver - Environment check:', {
    isDev: process.env.NODE_ENV === 'development',
    hasFirebaseConfig: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    userUid: user?.uid,
    userEmail: user?.email,
    loading,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
  })
}, [user, loading])
```

### KROK 5: KONFIGURACJA ZMIENNYCH ŚRODOWISKOWYCH (15 minut)

#### 5.1 Przygotowanie listy zmiennych
Skopiuj wszystkie zmienne z `.env.local`:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBQwpbtbcbXXbcZKtaQ_dNiaxng2wVrksc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pedro-bolt-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pedro-bolt-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pedro-bolt-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=467575898751
NEXT_PUBLIC_FIREBASE_APP_ID=1:467575898751:web:14ae1e19b0a8cff12e754a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6PDQ84SYH1

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=pedro-bolt-app
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@pedro-bolt-app.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[TWÓJ_KLUCZ]\n-----END PRIVATE KEY-----\n"

# SMTP Configuration (GoDaddy Titan Email)
SMTP_USER=kontakt@pedro.app
SMTP_PASS=P3dro@2025
SMTP_TO=kontakt@pedro.app

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### 5.2 Dodanie zmiennych w Vercel (przez CLI)
```bash
# Firebase
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

# Firebase Admin
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY

# SMTP
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add SMTP_TO

# Stripe
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
```

### KROK 6: PIERWSZY DEPLOYMENT (10 minut)

#### 6.1 Inicjalizacja projektu Vercel
```bash
# W głównym folderze projektu
vercel

# Odpowiedz na pytania:
# ? Set up and deploy "pedro-landing"? [Y/n] y
# ? Which scope do you want to deploy to? [wybierz swój account]
# ? Link to existing project? [N/y] n
# ? What's your project's name? pedro-app
# ? In which directory is your code located? ./
```

#### 6.2 Deploy na produkcję
```bash
vercel --prod
```

### KROK 7: AKTUALIZACJA STRIPE WEBHOOK (5 minut)

#### 7.1 Zmiana URL w Stripe Dashboard
- Zaloguj się do Stripe Dashboard
- Przejdź do Webhooks
- Znajdź webhook dla aplikacji
- Zmień URL z:
  - `https://pedro-bolt-app.web.app/api/stripe/webhook`
- Na:
  - `https://pedro-app.vercel.app/api/stripe/webhook` (lub Twoja custom domena)

### KROK 8: IMPLEMENTACJA HEALTH CHECKS I STRUCTURED LOGGING (20 minut)

#### 8.1 Health Check Endpoint
**Plik: `app/api/health/route.ts`** (NOWY PLIK)
```typescript
import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  const timestamp = new Date().toISOString()
  
  try {
    // Test Firebase connection
    let firebaseStatus = 'disconnected'
    try {
      if (adminDb) {
        await adminDb.collection('_health').doc('test').get()
        firebaseStatus = 'connected'
      }
    } catch (error) {
      console.error('Firebase health check failed:', error)
    }

    // Test SMTP configuration
    const smtpStatus = process.env.SMTP_USER && process.env.SMTP_PASS ? 'configured' : 'missing'

    // Test Stripe configuration
    const stripeStatus = process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing'

    const healthData = {
      status: 'ok',
      timestamp,
      environment: process.env.NODE_ENV || 'unknown',
      services: {
        firebase: firebaseStatus,
        smtp: smtpStatus,
        stripe: stripeStatus
      }
    }

    // Structured logging
    console.log(JSON.stringify({
      level: 'info',
      message: 'Health check performed',
      timestamp,
      data: healthData
    }))

    return NextResponse.json(healthData)
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Health check failed',
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error'
    }))

    return NextResponse.json(
      { status: 'error', timestamp, error: 'Health check failed' },
      { status: 500 }
    )
  }
}
```

#### 8.2 Structured Logging dla API Routes
**Plik: `lib/logger.ts`** (NOWY PLIK)
```typescript
interface LogData {
  level: 'info' | 'warn' | 'error'
  message: string
  timestamp?: string
  userId?: string
  endpoint?: string
  duration?: number
  error?: string
  [key: string]: any
}

export const logger = {
  info: (message: string, data?: Record<string, any>) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...data
    }))
  },

  warn: (message: string, data?: Record<string, any>) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...data
    }))
  },

  error: (message: string, error?: Error | string, data?: Record<string, any>) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      ...data
    }))
  }
}
```

#### 8.3 Aktualizacja Contact API z Structured Logging
**Plik: `app/api/contact/route.ts`** (EDYTUJ)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/contact'
import { contactSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs18.x'
export const maxDuration = 10

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const userAgent = request.headers.get('user-agent') || ''
  const forwarded = request.headers.get('x-forwarded-for') || ''
  
  try {
    const body = await request.json()
    
    // Walidacja z użyciem istniejącego systemu Zod
    const validatedData = contactSchema.parse(body)
    
    logger.info('Contact form submission started', {
      endpoint: '/api/contact',
      name: validatedData.name,
      email: validatedData.email,
      userAgent,
      forwarded
    })
    
    await sendContactEmail(validatedData)
    
    const duration = Date.now() - startTime
    
    logger.info('Contact form submission successful', {
      endpoint: '/api/contact',
      duration,
      email: validatedData.email
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Wiadomość została wysłana pomyślnie' 
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    
    if (error.name === 'ZodError') {
      logger.warn('Contact form validation error', {
        endpoint: '/api/contact',
        duration,
        validationErrors: error.errors
      })
      
      return NextResponse.json(
        { error: 'Nieprawidłowe dane formularza', details: error.errors },
        { status: 400 }
      )
    }
    
    logger.error('Contact form submission failed', error, {
      endpoint: '/api/contact',
      duration,
      userAgent,
      forwarded
    })
    
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.' },
      { status: 500 }
    )
  }
}
```

### KROK 9: ROZSZERZONE TESTOWANIE SMTP (25 minut)

#### 9.1 SMTP Test Endpoint
**Plik: `app/api/test-smtp/route.ts`** (NOWY PLIK - TYLKO DO TESTÓW)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/contact'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs18.x'
export const maxDuration = 15

export async function POST(request: NextRequest) {
  // UWAGA: Ten endpoint powinien być usunięty po testach lub zabezpieczony
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Test endpoint disabled in production' }, { status: 403 })
  }

  try {
    const testData = {
      name: 'Test PEDRO Migration',
      email: 'test@example.com',
      message: 'Test wiadomość z Vercel - migracja SMTP'
    }

    logger.info('SMTP test started', { endpoint: '/api/test-smtp' })

    await sendContactEmail(testData)

    logger.info('SMTP test successful', { endpoint: '/api/test-smtp' })

    return NextResponse.json({ 
      success: true, 
      message: 'Test SMTP zakończony pomyślnie',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('SMTP test failed', error, { endpoint: '/api/test-smtp' })
    
    return NextResponse.json(
      { 
        error: 'Test SMTP nieudany', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

#### 9.2 Aktualizacja lib/contact.ts z lepszym error handling
**Plik: `lib/contact.ts`** (EDYTUJ)
```typescript
import nodemailer from 'nodemailer'
import { logger } from './logger'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export const sendContactEmail = async (data: ContactFormData) => {
  try {
    // Konfiguracja SMTP dla GoDaddy z timeouts
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false, // STARTTLS
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,    // 5 seconds
      socketTimeout: 10000,     // 10 seconds
      auth: {
        user: process.env.SMTP_USER || 'kontakt@pedro.app',
        pass: process.env.SMTP_PASS,
      },
    })

    // Verify SMTP connection
    await transporter.verify()
    logger.info('SMTP connection verified successfully')

    const mailOptions = {
      from: 'kontakt@pedro.app',
      to: process.env.SMTP_TO || 'kontakt@pedro.app',
      subject: `Nowa wiadomość z PEDRO.app od ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #6C5CE7; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">PEDRO.app</h1>
            <p style="margin: 5px 0 0 0;">Nowa wiadomość kontaktowa</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #2D3436; margin-top: 0;">Dane kontaktowe:</h2>
            <p><strong>Imię:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            
            <h2 style="color: #2D3436;">Wiadomość:</h2>
            <div style="background: white; padding: 20px; border-left: 4px solid #6C5CE7; margin: 20px 0;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Wiadomość wysłana automatycznie z formularza kontaktowego PEDRO.app<br>
              Timestamp: ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    
    logger.info('Email sent successfully', {
      messageId: result.messageId,
      recipient: data.email,
      accepted: result.accepted,
      rejected: result.rejected
    })

    return result
  } catch (error) {
    logger.error('Failed to send email', error, {
      recipient: data.email,
      smtpUser: process.env.SMTP_USER
    })
    throw error
  }
}
```

### KROK 10: TESTOWANIE FUNKCJONALNOŚCI (35 minut)

#### 10.1 Podstawowy Checklist:
- [ ] **Strona główna** - ładuje się poprawnie
- [ ] **Health check** - `/api/health` zwraca status OK
- [ ] **Logowanie** - działa i przekierowuje
- [ ] **Rejestracja** - tworzy konto i przekierowuje
- [ ] **Resolver** - poprawnie kieruje na no-business lub dashboard
- [ ] **Business registration** - zapisuje dane do Firestore
- [ ] **Stripe checkout** - otwiera się poprawnie
- [ ] **Stripe webhook** - aktualizuje dane w Firestore
- [ ] **Dashboard** - wyświetla dane biznesu
- [ ] **Protected routes** - blokują dostęp niezalogowanym

#### 10.2 Rozszerzony Test SMTP:
```bash
# 1. Test health check
curl https://your-vercel-app.vercel.app/api/health

# 2. Test SMTP (tylko development)
curl -X POST https://your-vercel-app.vercel.app/api/test-smtp \
  -H "Content-Type: application/json"

# 3. Test prawdziwego formularza kontaktowego
# Wypełnij formularz na stronie i sprawdź:
# - Czy email dotarł na kontakt@pedro.app
# - Czy logi w Vercel pokazują structured logging
# - Czy nie ma błędów timeout
```

#### 10.3 Monitoring i Debugowanie:
```bash
# Sprawdź logi Vercel z structured logging
vercel logs --follow

# Sprawdź konkretny deployment
vercel logs [deployment-url]

# Sprawdź funkcje
vercel inspect [deployment-url]
```

#### 10.4 Test Performance (podstawowy):
```bash
# Sprawdź czas odpowiedzi API
curl -w "@curl-format.txt" -o /dev/null -s https://your-app.vercel.app/api/health

# curl-format.txt:
#      time_namelookup:  %{time_namelookup}\n
#         time_connect:  %{time_connect}\n
#      time_appconnect:  %{time_appconnect}\n
#     time_pretransfer:  %{time_pretransfer}\n
#        time_redirect:  %{time_redirect}\n
#   time_starttransfer:  %{time_starttransfer}\n
#                      ----------\n
#           time_total:  %{time_total}\n
```

### KROK 11: KONFIGURACJA DOMENY (opcjonalnie)

#### 9.1 Dodanie custom domeny
```bash
# Jeśli masz domenę
vercel domains add pedro.app
vercel domains add www.pedro.app
```

#### 9.2 Aktualizacja Firebase Auth
- W Firebase Console → Authentication → Settings
- Dodaj nową domenę do "Authorized domains"

### KROK 12: CZYSZCZENIE I FINALIZACJA (10 minut)

#### 10.1 Aktualizacja .gitignore
**Plik: `.gitignore`** (EDYTUJ - usuń Firebase Functions)
```gitignore
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

#### 10.2 Aktualizacja README.md
**Plik: `README.md`** (EDYTUJ - dodaj sekcję Vercel)
```markdown
## Deployment

### Vercel (Current)
```bash
# Development
npm run dev

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables
Set in Vercel Dashboard or via CLI:
- Firebase configuration
- SMTP credentials
- Stripe keys
```

---

## 🔧 ROZWIĄZANIA POTENCJALNYCH PROBLEMÓW

### Problem 1: Stripe webhook timeout
**Objaw:** Webhook nie aktualizuje danych w Firestore  
**Rozwiązanie:** Dodaj timeout handling
```typescript
// W app/api/stripe/webhook/route.ts
export const maxDuration = 10; // seconds

export async function POST(request: NextRequest) {
  // Dodaj na początku
  console.log('Webhook received:', request.headers.get('stripe-signature'))
  
  // ... reszta kodu
}
```

### Problem 2: SMTP timeout w formularz kontaktowym
**Objaw:** Formularz kontaktowy nie wysyła emaili  
**Rozwiązanie:** Dodaj timeout do nodemailer
```typescript
// W lib/contact.ts
const transporter = nodemailer.createTransporter({
  // ... existing config
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
})
```

### Problem 3: Firebase Admin credentials
**Objaw:** API routes nie mogą połączyć się z Firestore  
**Rozwiązanie:** Sprawdź format FIREBASE_PRIVATE_KEY
```bash
# W Vercel env, upewnij się że klucz ma prawidłowe \n
# Przykład poprawnego formatu:
"-----BEGIN PRIVATE KEY-----\nMIIEvAI...\n-----END PRIVATE KEY-----\n"
```

### Problem 4: Ciasteczka autoryzacyjne
**Objaw:** Middleware nie rozpoznaje zalogowanego użytkownika  
**Rozwiązanie:** Sprawdź ustawienia domeny w auth-context.tsx (już poprawione w kroku 4.1)

---

## 📊 PORÓWNANIE: FIREBASE HOSTING vs VERCEL

| Aspekt | Firebase Hosting | Vercel |
|--------|------------------|---------|
| **Setup Next.js** | Skomplikowany (Functions) | Natywny |
| **Zmienne środowiskowe** | functions:config | Dashboard/CLI |
| **API Routes** | Przez Functions | Natywne |
| **Debugging** | Trudne | Łatwe (logi w czasie rzeczywistym) |
| **Performance** | Wolne cold start | Szybkie edge functions |
| **Koszt** | Pay-per-use | Darmowy tier |
| **Maintenance** | Wysokie | Niskie |
| **TypeScript** | Problemy z kompilacją | Natywne wsparcie |

---

## ⏱️ TIMELINE MIGRACJI

### Szybka migracja (3-4 godziny):
1. **30 min** - Przygotowanie Vercel + czyszczenie Firebase Functions
2. **30 min** - Poprawki autoryzacji i middleware  
3. **30 min** - Konfiguracja zmiennych środowiskowych
4. **15 min** - Pierwszy deployment
5. **20 min** - Implementacja health checks i structured logging
6. **25 min** - Rozszerzone testowanie SMTP
7. **35 min** - Testowanie wszystkich funkcjonalności
8. **15 min** - Aktualizacja Stripe webhook
9. **30 min** - Finalne testy i dokumentacja

### Pełna migracja z optymalizacją (1 dzień):
- Wszystko powyżej +
- Custom domena
- Advanced monitoring z structured logging
- Performance optimization
- Backup strategy

---

## 🎯 KORZYŚCI MIGRACJI

### Natychmiastowe korzyści:
✅ **Rozwiązanie problemu z przekierowaniem** po zalogowaniu  
✅ **Lepsze debugowanie** - logi w czasie rzeczywistym  
✅ **Prostsze zarządzanie** zmiennymi środowiskowymi  
✅ **Szybsze deployment** - bez kompilacji Functions  
✅ **Lepsze performance** - edge functions zamiast cold start  

### Długoterminowe korzyści:
✅ **Łatwiejsze utrzymanie** - mniej konfiguracji  
✅ **Lepsze developer experience** - natywne wsparcie Next.js  
✅ **Automatyczne optymalizacje** - Vercel optymalizuje automatycznie  
✅ **Lepsze monitoring** - wbudowane analytics  
✅ **Skalowalność** - automatyczne skalowanie  

---

## 🚨 WAŻNE UWAGI

### Co zostaje bez zmian:
✅ **Firebase Auth** - identyczna konfiguracja  
✅ **Firestore** - te same kolekcje i reguły  
✅ **Stripe** - tylko zmiana webhook URL  
✅ **Cały kod aplikacji** - bez zmian w logice biznesowej  
✅ **Design i UI** - wszystko identyczne  

### Co się zmienia:
🔄 **Hosting platform** - z Firebase na Vercel  
🔄 **API Routes** - z Firebase Functions na Vercel Functions  
🔄 **Environment variables** - z functions:config na Vercel env  
🔄 **Deployment process** - z firebase deploy na vercel --prod  

### Backup plan:
- Firebase Hosting pozostaje aktywny podczas migracji
- Możliwość szybkiego powrotu w razie problemów
- Wszystkie dane w Firebase pozostają nietknięte

---

## ✅ CHECKLIST PRZED MIGRACJĄ

### Przygotowanie:
- [ ] Backup obecnej konfiguracji Firebase
- [ ] Lista wszystkich zmiennych środowiskowych
- [ ] Dostęp do Stripe Dashboard (webhook update)
- [ ] Zainstalowany Vercel CLI
- [ ] Konto Vercel

### Po migracji:
- [ ] Wszystkie testy przechodzą
- [ ] Stripe webhook zaktualizowany
- [ ] Logi Vercel działają
- [ ] Performance jest OK
- [ ] Dokumentacja zaktualizowana

**Ten plan migracji rozwiąże problem z przekierowaniem po zalogowaniu i znacznie uprości zarządzanie aplikacją.**