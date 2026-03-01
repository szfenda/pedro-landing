# Quick Reference Guide

## 🚀 Current Status
**✅ DEPLOYED & LIVE:** https://pedro.app  
**Platform:** Vercel (migrated from Firebase Hosting)  
**Status:** Production ready, all features operational  
**Last Updated:** March 2025

**🌐 Live Features:**
- ✅ Landing page with brutal design
- ✅ Authentication system (Firebase Auth)
- ✅ Business registration flow
- ✅ Stripe billing integration
- ✅ Business dashboard
- ✅ Contact form with email sending (SMTP working)
- ✅ Health monitoring endpoint
- ✅ Structured logging system
- ✅ i18n PL/EN language switching (Mar 2025)

## 🔧 Essential Commands
```bash
# Development
npm run dev                    # Local development server

# Production Build & Deploy
npm run build                  # Build Next.js application
vercel --prod                  # Deploy to Vercel production

# Local Testing
vercel dev                     # Test Vercel functions locally
npm run dev                    # Local Next.js development

# Git
git add . && git commit -m "message" && git push origin main
```

## 📁 Key Files
- `vercel.json` - Vercel deployment configuration
- `next.config.js` - Vercel-optimized Next.js config
- `middleware.ts` - Auth middleware with Vercel cookie handling
- `lib/auth-context.tsx` - Updated auth context for Vercel
- `lib/i18n-config.ts` - Locale types, defaultLocale, localeNames
- `lib/i18n-context.tsx` - I18nProvider + useTranslation() hook (lazy EN loading)
- `messages/pl.json` - Polish translations (~300 keys)
- `messages/en.json` - English translations (lazy-loaded)
- `components/layout/LanguageSwitcher.tsx` - PL/EN dropdown in Navigation
- `app/api/health/route.ts` - Health monitoring endpoint
- `lib/logger.ts` - Structured logging system
- `app/api/contact/route.ts` - Contact form API with SMTP
- `lib/contact.ts` - Email sending logic with GoDaddy SMTP

## 🔥 Vercel Deployment
- **Platform:** Vercel Edge Network
- **Framework:** Next.js 15.1.2 with App Router
- **Functions:** Serverless functions for API routes
- **Status:** ✅ Fully operational

## 🎯 Recent Migration (Dec 31, 2024)
- ✅ **Migrated from Firebase Hosting to Vercel**
- ✅ **Updated auth middleware for Vercel cookie handling**
- ✅ **Fixed auth context token management**
- ✅ **Added health monitoring endpoint (/api/health)**
- ✅ **Implemented structured logging with JSON format**
- ✅ **SMTP configuration working with GoDaddy credentials**
- ✅ **All environment variables configured in Vercel**

## 🔧 SMTP Configuration (Working)
**GoDaddy Titan Email Setup:**
```bash
✅ SMTP_USER=[YOUR_EMAIL]
✅ SMTP_PASS=[CONFIGURED_IN_VERCEL]
✅ SMTP_TO=[DESTINATION_EMAIL]
```

**Contact Form Status:** 🟢 FULLY OPERATIONAL
- Form validation: ✅ Working
- Email sending: ✅ Working (tested successfully)
- Error handling: ✅ Implemented with timeouts
- Success feedback: ✅ Polish language responses
- **Test URL:** https://pedro.app/#kontakt

## 🎯 Immediate Tasks
1. **Store Links:** Replace `href="#"` with real URLs in Hero.tsx, Download.tsx
2. **Content:** Finalize placeholder text throughout components
3. **Contact:** Add real email/social links in Contact.tsx, Footer.tsx
4. **FAQ:** Replace placeholder questions with real content

## 🔗 Important Links
- **Live Site:** https://pedro.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Firebase Console:** https://console.firebase.google.com/project/[YOUR_PROJECT_ID]
- **GitHub:** https://github.com/szfenda/pedro-landing

## 🛠 Tech Stack
- Next.js 15.1.2 (App Router, Vercel deployment)
- TypeScript 5.7.2
- Tailwind CSS 3.4.17 (Neo-brutalism design)
- Vercel (hosting and serverless functions)
- Firebase Auth + Firestore (shared with mobile app)
- Stripe Integration (Pay-per-Use model)
- Nodemailer + GoDaddy SMTP (email sending)
- 43 optimized assets in /public/assets/

## Critical Design Values
```css
/* Colors */
--pedro-purple: #6C5CE7    /* Primary brand */
--pedro-lime: #CCFF00      /* CTA accent */
--pedro-pink: #FF7675      /* Emotion */
--pedro-light: #F7F9FC     /* Background */
--pedro-dark: #2D3436      /* Text/borders */

/* Neo-Brutalism */
border: 3px solid #2D3436;
box-shadow: 10px 10px 0 #6C5CE7;  /* Default */
box-shadow: 10px 10px 0 #CCFF00;  /* Hover */
border-radius: 16px;               /* Cards */
border-radius: 12px;               /* Buttons */
```

## Component Structure
```tsx
// Main sections (in order)
<Hero />                   // 100vh split, backgrounds, mascot
<About />                  // 2-col with Pedro Thumbs Up
<Features />               // 3 cards with scan animation
<B2B />                    // Lime bg with orbiting icons
<SocialProof />            // Future testimonials + dream partners
<FAQ />                    // Accordion
<Download />               // Store badges
<Contact />                // Form with brutal inputs (WORKING)
<Footer />                 // Dark with Pedro Peeking
```

## Vercel Configuration
```json
// vercel.json
{
  "framework": "nextjs",
  "functions": {
    "app/api/contact/route.ts": {
      "maxDuration": 10
    }
  }
}
```

## Environment Variables (Vercel)
- Firebase client config (public)
- Firebase Admin SDK (server-side)
- SMTP credentials (GoDaddy)
- Stripe keys (test mode)

## Asset Organization
```
public/assets/
├── images/
│   ├── mascots/          # Pedro character variants
│   ├── logos/            # PEDRO logo variants
│   └── backgrounds/      # Hero section backgrounds
└── icons/
    ├── features/         # Main 3 feature icons
    ├── categories/       # Category icons
    ├── business/         # B2B section icons
    └── social/           # Footer social icons
```