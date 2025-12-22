# PEDRO WEB - KOMPLEKSOWY PLAN IMPLEMENTACJI
## Auth + Onboarding + Business Dashboard

Na podstawie analizy plików `PEDRO_AUTH_FLOW.md` i `PEDRO.app_WEB_AUTH_+_ONBOARDING.md` oraz aktualnej architektury projektu.

---

## 🎯 EXECUTIVE SUMMARY

**PROBLEM:** Aplikacja jest obecnie statyczną one-page landing page (`output: 'export'`), a wymagany flow potrzebuje:
- Dynamicznego routingu
- Firebase Auth integration
- Firestore database operations
- Server-side rendering
- Stripe integration

**ROZWIĄZANIE:** Przekształcenie z static export na pełną Next.js aplikację z SSR/SSG.

**SCOPE:** 7 głównych widoków + komponenty wspólne + integracje zewnętrzne.

---

## 📋 ANALIZA RÓŻNIC MIĘDZY SPECYFIKACJAMI

### PEDRO_AUTH_FLOW.md (Klasyczny Auth)
- ✅ Osobne strony: `/login`, `/register`, `/forgot-password`, `/reset-password`
- ✅ Split layout 50/50 na każdej stronie
- ✅ Proste formularze auth
- ❌ Brak onboardingu biznesowego
- ❌ Brak integracji z Firestore/Stripe

### PEDRO.app_WEB_AUTH_+_ONBOARDING.md (Business Flow)
- ✅ Jeden widok AuthCard z tabami
- ✅ Kompleksowy business onboarding
- ✅ Firestore integration (USER/PARTNER collections)
- ✅ Stripe billing integration
- ✅ Business dashboard MVP
- ❌ Brak osobnych stron auth

### WYBRANA STRATEGIA: HYBRID APPROACH
Implementujemy **PEDRO.app_WEB_AUTH_+_ONBOARDING.md** jako główny flow, ale z elementami UI z **PEDRO_AUTH_FLOW.md** dla lepszego UX.

---

## 🏗️ ARCHITEKTURA DOCELOWA

### Struktura Folderów
```
app/
├── (public)/                 # Public routes (niezalogowani)
│   ├── page.tsx              # Landing page (istniejący)
│   └── auth/
│       └── page.tsx          # AuthCard (tabs: login/register/reset)
├── (protected)/              # Protected routes (zalogowani)
│   ├── resolver/
│   │   └── page.tsx          # AuthResolver (logika przekierowań)
│   ├── no-business/
│   │   └── page.tsx          # NoBusinessView
│   ├── register-business/
│   │   └── page.tsx          # RegisterBusinessView
│   ├── billing/
│   │   └── page.tsx          # BillingView
│   └── dashboard/
│       └── page.tsx          # BusinessDashboard
├── api/                      # API routes
│   ├── auth/
│   ├── business/
│   └── stripe/
├── layout.tsx                # Root layout
└── globals.css               # Existing styles
```

### Komponenty
```
components/
├── auth/
│   ├── AuthShell.tsx         # Wspólna rama dla auth
│   ├── AuthCard.tsx          # Główna karta z tabami
│   ├── LoginTab.tsx          # Tab logowania
│   ├── RegisterTab.tsx       # Tab rejestracji
│   └── ResetPasswordTab.tsx  # Tab reset hasła
├── business/
│   ├── BusinessForm.tsx      # Formularz rejestracji biznesu
│   ├── BillingCard.tsx       # Karta billing/Stripe
│   └── DashboardCard.tsx     # Karty dashboardu
├── layout/
│   ├── Navigation.tsx        # Existing (do modyfikacji)
│   ├── AuthNavigation.tsx    # Nawigacja dla auth views
│   └── AppNavigation.tsx     # Nawigacja dla zalogowanych
└── ui/
    ├── BrutalCard.tsx        # Brutal design system
    ├── BrutalButton.tsx      # Brutal buttons
    ├── BrutalInput.tsx       # Brutal form inputs
    └── BrutalTabs.tsx        # Brutal tabs component
```

---

## 🚀 PLAN IMPLEMENTACJI - 9 FAZY

### FAZA 1: PRZYGOTOWANIE ARCHITEKTURY (2-3 dni)
**Cel:** Przekształcenie z static export na dynamic Next.js

#### 1.1 Modyfikacja konfiguracji
- [ ] **Usunąć** `output: 'export'` z `next.config.js`
- [ ] **Dodać** konfigurację dla Firebase/Firestore
- [ ] **Skonfigurować** environment variables
- [ ] **Zaktualizować** `package.json` dependencies

#### 1.2 Firebase Setup
- [ ] **Zainstalować** Firebase SDK (`firebase`, `firebase-admin`)
- [ ] **Skonfigurować** Firebase config (`lib/firebase.ts`)
- [ ] **Przygotować** Firestore rules
- [ ] **Skonfigurować** Firebase Auth

#### 1.3 Routing Structure
- [ ] **Utworzyć** folder structure z route groups
- [ ] **Przygotować** middleware dla protected routes
- [ ] **Skonfigurować** redirects w `next.config.js`

```typescript
// lib/firebase.ts (przykład)
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  // config
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

### FAZA 2: BRUTAL DESIGN SYSTEM (2 dni)
**Cel:** Rozszerzenie istniejącego design system o komponenty auth/business

#### 2.1 Brutal UI Components
- [ ] **BrutalCard.tsx** - bazowa karta z border + shadow
- [ ] **BrutalButton.tsx** - przyciski z hover effects
- [ ] **BrutalInput.tsx** - inputy z focus states
- [ ] **BrutalTabs.tsx** - system tabów
- [ ] **BrutalAlert.tsx** - error/success messages

#### 2.2 Rozszerzenie globals.css
- [ ] **Dodać** style dla formularzy
- [ ] **Dodać** animacje dla tabów
- [ ] **Dodać** focus states dla accessibility
- [ ] **Dodać** loading states

```css
/* Przykład brutal input styles */
.brutal-input {
  @apply border-3 border-pedro-dark rounded-button px-4 py-3;
  @apply focus:ring-4 focus:ring-pedro-lime focus:ring-opacity-50;
  @apply transition-all duration-300;
}

.brutal-input:focus {
  @apply shadow-brutal-lime transform -translate-y-1;
}
```

### FAZA 3: AUTH SHELL & NAVIGATION (2 dni)
**Cel:** Wspólne komponenty layoutu dla wszystkich widoków

#### 3.1 AuthShell Component
- [ ] **Split layout 50/50** z separatorem
- [ ] **Background integration** (`back_left_under_text.png`, `back_right_under_phone.png`)
- [ ] **Responsive behavior** (mobile: kolumna)
- [ ] **Floating decorations** (subtelne, nie przeszkadzające)

#### 3.2 Navigation Components
- [ ] **AuthNavigation.tsx** - dla niezalogowanych (logo + "Wróć na landing")
- [ ] **AppNavigation.tsx** - dla zalogowanych (logo + "Wyloguj" + "Panel")
- [ ] **Modyfikacja Navigation.tsx** - dodanie linku "Log in" → `/auth`

#### 3.3 Layout Updates
- [ ] **Conditional navigation** w `layout.tsx`
- [ ] **Auth state management** (Context/hooks)
- [ ] **Loading states** dla auth checks

### FAZA 4: AUTHCARD - GŁÓWNY WIDOK AUTH (3 dni)
**Cel:** Implementacja `/auth` z tabami login/register/reset

#### 4.1 AuthCard Structure
- [ ] **Centralna karta** z brutal styling
- [ ] **Tab system** (Login | Register | Reset Password)
- [ ] **Smooth transitions** między tabami
- [ ] **Form validation** inline

#### 4.2 LoginTab Implementation
```typescript
// Pola: email, password
// CTA: "Zaloguj się"
// Links: "Nie masz konta?" → switch to Register tab
//        "Nie pamiętasz hasła?" → switch to Reset tab
// Logic: signInWithEmailAndPassword → redirect to /resolver
```

#### 4.3 RegisterTab Implementation
```typescript
// Pola: firstName, lastName, email, password
// CTA: "Utwórz konto"
// Link: "Masz konto?" → switch to Login tab
// Logic: 
//   1. createUserWithEmailAndPassword
//   2. Create USER document in Firestore
//   3. Redirect to /resolver
```

#### 4.4 ResetPasswordTab Implementation
```typescript
// Pole: email
// CTA: "Wyślij link resetujący"
// Link: "Wróć do logowania" → switch to Login tab
// Logic: sendPasswordResetEmail → show success message
```

#### 4.5 Error Handling & UX
- [ ] **Brutal error alerts** z pink accent
- [ ] **Loading states** na wszystkich CTA
- [ ] **Form validation** z inline errors
- [ ] **Success messages** dla reset password

### FAZA 5: AUTH RESOLVER & PROTECTED ROUTES (2 dni)
**Cel:** Logika przekierowań po zalogowaniu

#### 5.1 AuthResolver Logic
```typescript
// /resolver/page.tsx
// 1. Check if user is authenticated
// 2. Check if USER document exists
// 3. Query PARTNER where userId === auth.uid
// 4. Redirect based on results:
//    - No PARTNER → /no-business
//    - Has PARTNER → /dashboard
```

#### 5.2 Middleware dla Protected Routes
- [ ] **Auth check** dla wszystkich protected routes
- [ ] **Redirect** niezalogowanych do `/auth`
- [ ] **Loading states** podczas auth checks

#### 5.3 NoBusinessView
- [ ] **2 karty**: "Korzystasz jako użytkownik" + "Dodaj swój biznes"
- [ ] **CTA**: "Pobierz aplikację" (placeholder) + "Dodaj biznes" → `/register-business`
- [ ] **User info badge** z emailem + wyloguj

### FAZA 6: BUSINESS REGISTRATION (3-4 dni)
**Cel:** Kompleksowy formularz rejestracji biznesu

#### 6.1 BusinessForm Structure
```typescript
// Sekcje:
// 1. Dane firmy: companyName, nip, businessType
// 2. Adres: address.line1, line2, city, postalCode, country
// 3. Kontakt: email, phone, contactPersonName, website
// 4. Opis: description (textarea)
```

#### 6.2 Form Implementation
- [ ] **Brutal fieldsets** dla każdej sekcji
- [ ] **Progressive validation** (sekcja po sekcji)
- [ ] **Auto-save draft** (opcjonalnie)
- [ ] **Rich validation** (NIP format, email, phone)

#### 6.3 Form Logic
```typescript
// Po submit:
// 1. Validate all fields
// 2. Create PARTNER document in Firestore
// 3. Set initial businessModel.currentPhase = "beta_free"
// 4. Redirect to /billing
```

#### 6.4 UX Enhancements
- [ ] **Progress indicator** (4 sekcje)
- [ ] **Field helpers** (format examples)
- [ ] **Error aggregation** (summary na górze)
- [ ] **Mobile optimization** (responsive fieldsets)

### FAZA 7: STRIPE INTEGRATION & BILLING (4-5 dni)
**Cel:** Integracja z Stripe dla PPU model

#### 7.1 Stripe Setup
- [ ] **Zainstalować** Stripe SDK (`stripe`, `@stripe/stripe-js`)
- [ ] **Skonfigurować** Stripe keys (env variables)
- [ ] **Utworzyć** API routes dla Stripe webhooks

#### 7.2 BillingView Implementation
- [ ] **Status konta card** (currentPhase, ppuEnabled)
- [ ] **Wybór modelu card** (Beta free vs PPU)
- [ ] **CTA**: "Aktywuj PPU" → Stripe Checkout
- [ ] **Info message**: "Panel webowy służy wyłącznie do rozliczeń"

#### 7.3 Stripe Checkout Integration
```typescript
// api/stripe/create-checkout-session.ts
// 1. Create Stripe customer (if not exists)
// 2. Create checkout session for PPU subscription
// 3. Return session URL
```

#### 7.4 Webhook Handling
```typescript
// api/stripe/webhook.ts
// Handle events:
// - customer.subscription.created
// - customer.subscription.updated
// - invoice.payment_succeeded
// Update PARTNER document accordingly
```

#### 7.5 Customer Portal
- [ ] **"Zarządzaj płatnością"** button → Stripe Customer Portal
- [ ] **Billing history** (jeśli dostępne w Stripe)

### FAZA 8: BUSINESS DASHBOARD MVP (2-3 dni)
**Cel:** Podstawowy dashboard dla biznesów

#### 8.1 Dashboard Cards
- [ ] **Status biznesu**: companyName, verificationStatus, isActive
- [ ] **Rozliczenia**: currentPhase, ppuEnabled, monthlyUsage
- [ ] **Zarządzanie ofertami**: info + link do aplikacji

#### 8.2 Data Integration
- [ ] **Real-time Firestore** listeners dla PARTNER data
- [ ] **Usage statistics** z monthlyUsage
- [ ] **Billing integration** z Stripe data

#### 8.3 Actions
- [ ] **"Pobierz fakturę"** (placeholder lub Stripe integration)
- [ ] **"Zarządzaj płatnością"** → Stripe Portal
- [ ] **"Przejdź do aplikacji"** (placeholder link)

### FAZA 9: TESTING & DEPLOYMENT (3-4 dni)
**Cel:** Testy, optymalizacja i wdrożenie

#### 9.1 Testing
- [ ] **Unit tests** dla kluczowych komponentów
- [ ] **Integration tests** dla auth flow
- [ ] **E2E tests** dla complete user journey
- [ ] **Accessibility testing** (A11y)

#### 9.2 Performance Optimization
- [ ] **Code splitting** dla różnych route groups
- [ ] **Image optimization** (existing assets)
- [ ] **Bundle analysis** i optymalizacja
- [ ] **Loading states** optimization

#### 9.3 Security
- [ ] **Firestore security rules** review
- [ ] **API routes** authentication
- [ ] **Environment variables** security
- [ ] **CSRF protection** dla Stripe webhooks

#### 9.4 Deployment
- [ ] **Firebase Hosting** reconfiguration (SSR support)
- [ ] **Environment setup** (staging + production)
- [ ] **Domain configuration** (jeśli potrzebne)
- [ ] **Monitoring setup** (errors, performance)

---

## 🔧 KLUCZOWE KOMPONENTY DO IMPLEMENTACJI

### AuthCard.tsx (Główny komponent)
```typescript
interface AuthCardProps {
  defaultTab?: 'login' | 'register' | 'reset'
}

// Features:
// - Tab switching z animacjami
// - Form validation
// - Error handling
// - Loading states
// - Brutal styling
```

### BusinessForm.tsx (Kompleksowy formularz)
```typescript
interface BusinessFormData {
  companyName: string
  nip: string
  businessType: string
  address: {
    line1: string
    line2?: string
    city: string
    postalCode: string
    country: string
  }
  email: string
  phone: string
  contactPersonName: string
  website?: string
  description: string
}

// Features:
// - Multi-section form
// - Progressive validation
// - Auto-save (optional)
// - Mobile responsive
```

### BillingCard.tsx (Stripe integration)
```typescript
// Features:
// - Current plan display
// - Upgrade/downgrade options
// - Stripe Checkout integration
// - Customer Portal links
// - Usage statistics
```

---

## 📊 TIMELINE & RESOURCES

### Szacowany czas: 20-25 dni roboczych
- **Faza 1-3**: 6-7 dni (architektura + design system)
- **Faza 4-5**: 5 dni (auth implementation)
- **Faza 6-7**: 7-9 dni (business + billing)
- **Faza 8-9**: 5-6 dni (dashboard + deployment)

### Wymagane umiejętności:
- Next.js 13+ (App Router)
- Firebase (Auth + Firestore)
- Stripe integration
- TypeScript
- Tailwind CSS
- React Hook Form (zalecane)

### Zewnętrzne zależności:
- Firebase project setup
- Stripe account + API keys
- Domain configuration (opcjonalnie)

---

## ⚠️ RYZYKA I MITYGACJE

### Wysokie ryzyko:
1. **Stripe webhook reliability** → Implement retry logic + monitoring
2. **Firebase security rules** → Thorough testing + review
3. **Mobile responsiveness** → Progressive enhancement approach

### Średnie ryzyko:
1. **Performance z SSR** → Implement proper caching strategies
2. **Form UX complexity** → Use proven libraries (React Hook Form)
3. **Auth state management** → Use Next.js built-in patterns

### Niskie ryzyko:
1. **Design system consistency** → Existing brutal components as base
2. **Asset integration** → Already working in current app

---

## 🎯 SUCCESS CRITERIA

### Must Have:
- [ ] Pełny auth flow (login/register/reset)
- [ ] Business registration z wszystkimi polami
- [ ] Stripe integration (PPU activation)
- [ ] Basic dashboard z billing info
- [ ] Mobile responsive
- [ ] Accessibility compliant

### Should Have:
- [ ] Auto-save w business form
- [ ] Real-time updates w dashboard
- [ ] Advanced error handling
- [ ] Performance optimization

### Could Have:
- [ ] Advanced analytics w dashboard
- [ ] Email notifications
- [ ] Advanced Stripe features (invoices, etc.)
- [ ] Multi-language support

---

## 📝 NEXT STEPS

1. **Review tego planu** z zespołem
2. **Potwierdzenie** Firebase/Stripe setup requirements
3. **Przygotowanie** development environment
4. **Start z Fazą 1** - architektura

**Czy ten plan pokrywa wszystkie wymagania z obu specyfikacji?**