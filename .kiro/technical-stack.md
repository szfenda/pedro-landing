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

## Payments & Email
- **Stripe:** 17.3.0 (Server-side)
- **@stripe/stripe-js:** 4.8.0 (Client-side)
- **Nodemailer:** 7.0.12 (Email sending) ✅ **CONFIGURED**

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
│   ├── api/               # API routes ✅ WORKING ON VERCEL
│   │   ├── health/route.ts        # Health monitoring ✅
│   │   ├── contact/route.ts       # Contact form ✅
│   │   └── stripe/        # Stripe integration endpoints
│   │       ├── create-checkout-session/route.ts
│   │       ├── webhook/route.ts
│   │       └── create-portal-session/route.ts
│   │   └── legal/        # Legal documents API ✅ NEW (Jan 2025)
│   │       ├── regulamin/route.ts
│   │       └── polityka-prywatnosci/route.ts
│   ├── layout.tsx         # Root layout with fonts & auth provider
│   ├── page.tsx          # Root redirect to (public)
│   ├── globals.css       # Neo-brutalism design system
│   └── fonts.ts          # Google Fonts configuration
├── components/
│   ├── auth/             # Authentication components
│   ├── business/         # Business management components
│   ├── legal/            # Legal documents components ✅ NEW
│   ├── ui/              # Brutal design system
│   ├── layout/          # Navigation components
│   └── sections/        # Landing page sections
├── lib/
│   ├── firebase.ts       # Firebase client configuration
│   ├── firebase-admin.ts # Firebase admin (server-side)
│   ├── stripe.ts         # Stripe client configuration
│   ├── auth-context.tsx  # React auth context provider
│   ├── validations.ts    # Zod schemas for forms
│   ├── contact.ts        # Email sending service ✅
│   ├── logger.ts         # Structured logging ✅
│   ├── assets.ts         # Type-safe asset paths
│   ├── utils.ts          # Utilities (cn, smoothScrollTo)
│   └── legal/            # Legal documents system ✅ NEW
│       ├── types.ts      # TypeScript interfaces
│       ├── legal-utils.ts # Utility functions
│       ├── regulamin.ts  # Terms content
│       └── politykaPrywatnosci.ts # Privacy policy content
├── middleware.ts         # Route protection middleware ✅ VERCEL
├── public/assets/        # Organized asset structure
└── public/legal/         # Legal documents PDFs ✅ NEW
```

## Deployment Configuration ✅ VERCEL

### Vercel Configuration
**File: `vercel.json`**
```json
{
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": { "maxDuration": 10 },
    "app/api/contact/route.ts": { "maxDuration": 15 }
  },
  "regions": ["fra1"]
}
```

### Environment Variables ✅ CONFIGURED
```bash
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=configured
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=configured
NEXT_PUBLIC_FIREBASE_PROJECT_ID=configured
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=configured
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=configured
NEXT_PUBLIC_FIREBASE_APP_ID=configured
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=configured

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=configured
FIREBASE_CLIENT_EMAIL=configured
FIREBASE_PRIVATE_KEY=configured

# SMTP Configuration (GoDaddy Titan Email) ✅ WORKING
SMTP_USER=[YOUR_EMAIL]
SMTP_PASS=configured
SMTP_TO=[DESTINATION_EMAIL]

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=configured
STRIPE_SECRET_KEY=configured
STRIPE_WEBHOOK_SECRET=configured
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

## Performance Optimizations ✅
- Next.js Image component with WebP/AVIF formats
- Lazy loading for off-screen components
- `will-change` properties for animated elements
- Reduced motion media queries
- Optimized font loading with `display: swap`
- Vercel edge functions for fast response times

## Build Configuration ✅
**next.config.js:**
- Dynamic Next.js: Full SSR/SSG capabilities enabled
- Image optimization: Enabled for better performance
- Trailing slash: `true` (SPA routing compatibility)
- ESLint ignore during builds
- Removed env section (Vercel manages automatically)

## API Routes Configuration ✅
All API routes run on Vercel serverless functions:

### Health Monitoring
- **`/api/health`** - Service status monitoring ✅ ACTIVE
- Returns: Firebase, SMTP, Stripe connection status
- Structured logging with JSON format

### Contact Form
- **`/api/contact`** - Email sending endpoint ✅ WORKING
- SMTP: GoDaddy Titan Email ([YOUR_EMAIL])
- Validation: Zod schema with Polish regex support
- Error handling: Comprehensive with structured logging
- Timeouts: 10s connection, 5s greeting, 10s socket

### Stripe Integration
- **`/api/stripe/create-checkout-session`** - Subscription setup
- **`/api/stripe/create-portal-session`** - Billing management
- **`/api/stripe/webhook`** - Payment event processing

## Monitoring & Logging ✅
**Structured Logging (`lib/logger.ts`):**
```typescript
logger.info('message', { context })
logger.warn('message', { context })
logger.error('message', error, { context })
```

**Health Checks:**
- Service status monitoring
- Environment validation
- Connection testing
- Real-time status reporting

## Development Commands ✅
```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Production server
npm run lint   # ESLint check

# Vercel commands
vercel         # Preview deployment
vercel --prod  # Production deployment
vercel logs    # View deployment logs
```

## Migration Summary (Dec 31, 2024) ✅
**Successfully migrated from Firebase Hosting to Vercel:**
- ✅ Removed Firebase Functions dependency
- ✅ Updated Next.js config for Vercel
- ✅ Fixed auth middleware for Vercel cookies
- ✅ Configured all environment variables
- ✅ Added health monitoring and structured logging
- ✅ Verified SMTP functionality
- ✅ Live deployment: https://pedro.app

**Benefits achieved:**
- Native Next.js support
- Better performance with edge functions
- Simplified configuration and deployment
- Real-time logging and monitoring
- Resolved auth redirect issues