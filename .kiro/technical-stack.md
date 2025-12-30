# Technical Stack & Configuration

## Core Technologies
- **Next.js:** 15.1.2 (App Router with SSR/SSG)
- **React:** 19.0.0
- **TypeScript:** 5.7.2
- **Tailwind CSS:** 3.4.17
- **Framer Motion:** 11.15.0

## Authentication & Database
- **Firebase:** 10.14.1 (Auth + Firestore)
- **Firebase Admin:** 12.7.0 (Server-side operations)

## Forms & Validation
- **React Hook Form:** 7.53.2 (Form state management)
- **Zod:** 3.24.1 (Schema validation)
- **@hookform/resolvers:** 3.10.0 (RHF + Zod integration)

## Payments
- **Stripe:** 17.3.0 (Server-side)
- **@stripe/stripe-js:** 4.8.0 (Client-side)

## Key Dependencies
```json
{
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "sharp": "^0.34.5",
  "lucide-react": "^0.468.0"
}
```

## Project Structure
```
├── app/
│   ├── (public)/           # Public routes (landing + auth)
│   │   ├── page.tsx       # Landing page
│   │   └── auth/page.tsx  # Authentication page
│   ├── (protected)/       # Protected routes (requires auth)
│   │   ├── resolver/page.tsx      # Auth state resolver
│   │   ├── no-business/page.tsx   # No business registered
│   │   ├── register-business/page.tsx # Business registration
│   │   ├── billing/page.tsx       # Stripe billing management
│   │   └── dashboard/page.tsx     # Business dashboard
│   ├── api/               # API routes
│   │   └── stripe/        # Stripe integration endpoints
│   │       ├── create-checkout-session/route.ts
│   │       ├── webhook/route.ts
│   │       └── create-portal-session/route.ts
│   ├── layout.tsx         # Root layout with fonts & auth provider
│   ├── page.tsx          # Root redirect to (public)
│   ├── globals.css       # Neo-brutalism design system
│   └── fonts.ts          # Google Fonts configuration
├── components/
│   ├── auth/             # Authentication components
│   │   ├── AuthShell.tsx
│   │   ├── AuthCard.tsx
│   │   ├── LoginTab.tsx
│   │   ├── RegisterTab.tsx
│   │   └── ResetPasswordTab.tsx
│   ├── business/         # Business management components
│   │   ├── BusinessForm.tsx
│   │   ├── BusinessFormSection.tsx
│   │   └── BillingCard.tsx
│   ├── ui/              # Brutal design system
│   │   ├── BrutalButton.tsx
│   │   ├── BrutalInput.tsx
│   │   ├── BrutalTabs.tsx
│   │   ├── BrutalAlert.tsx
│   │   ├── BrutalCard.tsx
│   │   └── ProgressIndicator.tsx
│   ├── layout/
│   │   ├── Navigation.tsx     # Main nav with auth state
│   │   ├── AuthNavigation.tsx # Auth-specific nav
│   │   └── Footer.tsx         # Dark footer with Pedro Peeking
│   └── sections/         # Landing page sections
│       ├── Hero.tsx      # 100vh split with backgrounds
│       ├── About.tsx     # 2-column with Pedro Thumbs Up
│       ├── Features.tsx  # 3 cards with scan line animation
│       ├── B2B.tsx       # Lime background with orbiting icons
│       ├── SocialProof.tsx # Future testimonials + dream partners
│       ├── FAQ.tsx       # Brutal accordion
│       ├── Download.tsx  # Store badges repeat
│       └── Contact.tsx   # Form with brutal inputs
├── lib/
│   ├── firebase.ts       # Firebase client configuration
│   ├── firebase-admin.ts # Firebase admin (server-side)
│   ├── stripe.ts         # Stripe client configuration
│   ├── auth-context.tsx  # React auth context provider
│   ├── validations.ts    # Zod schemas for forms
│   ├── assets.ts         # Type-safe asset paths
│   └── utils.ts          # Utilities (cn, smoothScrollTo)
├── middleware.ts         # Route protection middleware
├── styles/
│   └── animations.css    # Advanced component animations
└── public/assets/        # Organized asset structure
```

## Tailwind Configuration
**Custom Colors:**
```js
'pedro-purple': '#6C5CE7',
'pedro-lime': '#CCFF00',
'pedro-pink': '#FF7675',
'pedro-light': '#F7F9FC',
'pedro-dark': '#2D3436'
```

**Custom Shadows:**
```js
'brutal-purple': '10px 10px 0 #6C5CE7',
'brutal-lime': '10px 10px 0 #CCFF00',
'brutal-dark': '10px 10px 0 #2D3436'
```

**Custom Animations:**
- `animate-float`: 3s floating for mascot
- `animate-scan`: 3s scan line for QR card
- `animate-wave`: 5s wave for Pedro Peeking
- `animate-bounce-slow`: 1.2s bounce for scroll indicator

## CSS Architecture
**Global Styles (`app/globals.css`):**
- CSS custom properties for design tokens
- Neo-brutalism utility classes (.hard-shadow-*, .brutal-border)
- Button styles (.btn-brutal, .btn-brutal-purple, .btn-brutal-lime)
- Card styles (.card-brutal)
- Input styles (.input-brutal)
- Animation keyframes
- Scroll reveal system
- Performance optimizations

**Component Animations (`styles/animations.css`):**
- Parallax layers
- 3D tilt effects
- Ripple click effects
- Count-up animations
- Stagger children animations
- Orbit animations

## Performance Optimizations
- Next.js Image component with WebP/AVIF formats
- Lazy loading for off-screen components
- `will-change` properties for animated elements
- Reduced motion media queries
- Optimized font loading with `display: swap`

## Build Configuration
**next.config.js:**
- Dynamic Next.js: Full SSR/SSG capabilities enabled
- Image optimization: Enabled for better performance
- Trailing slash: `true` (SPA routing compatibility)
- ESLint ignore during builds

**Firebase Functions Configuration:**
- Runtime: Node.js 18
- TypeScript: Configured with esModuleInterop for Next.js compatibility
- Build output: `functions/lib/` (excluded from Git)
- Dependencies: firebase-admin, firebase-functions, next

**functions/tsconfig.json:**
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "types": ["node"]
  }
}
```
- Image optimization: Enabled for better performance
- Trailing slash: `true` (SPA routing compatibility)
- ESLint ignore during builds

**Firebase Configuration:**
- Hosting: Configured for Firebase Functions integration
- Functions: Node.js 18 runtime with Next.js server
- Rewrites: All routes (including API) served through `nextjsFunc`
- Single Function: `nextjsFunc` handles entire Next.js application

**Firebase Functions:**
```typescript
// functions/src/index.ts
export const nextjsFunc = onRequest(async (req, res) => {
  await nextjsServer.prepare()
  return nextjsHandle(req, res)
})
```

**Environment Variables:**
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

**Firebase Deployment:**
- Functions: Next.js server running on Firebase Functions
- Hosting: Static assets and routing through Functions
- Project: pedro-bolt-app

**API Routes:**
API routes are fully functional with Firebase Functions deployment, providing server-side authentication and Stripe integration:
- `/api/stripe/create-checkout-session` - Stripe subscription setup
- `/api/stripe/create-portal-session` - Billing management portal  
- `/api/stripe/webhook` - Payment event processing

All API routes run server-side through the `nextjsFunc` Firebase Function.

## Development Commands
```bash
npm run dev    # Development server
npm run build  # Production build for Firebase Functions
npm run start  # Production server
npm run lint   # ESLint check

# Firebase commands
npm run build:functions        # Build Firebase Functions
npm run deploy                 # Full deployment (hosting + functions)
npm run deploy:hosting         # Deploy hosting only
npm run deploy:functions       # Deploy functions only
firebase serve --only hosting,functions  # Local Firebase server
```