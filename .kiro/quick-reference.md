# Quick Reference Guide

## 🚀 Current Status
**✅ DEPLOYED & LIVE:** https://pedro-bolt-app.web.app  
**Status:** Production ready, Firebase Functions operational  
**Last Updated:** December 30, 2024

## 🔧 Essential Commands
```bash
# Development
npm run dev                    # Local development server

# Production Build
npm run build                  # Build Next.js application
npm run build:functions        # Build Firebase Functions

# Firebase Deployment
npm run deploy                 # Full deployment (hosting + functions)
npm run deploy:hosting         # Deploy hosting only
npm run deploy:functions       # Deploy functions only

# Local Testing
firebase serve --only hosting,functions  # Test Firebase locally
npm run dev                              # Local Next.js development

# Git
git add . && git commit -m "message" && git push origin feature/web-auth-migration
```

## 📁 Key Files
- `next.config.js` - Dynamic Next.js config for Firebase Functions
- `firebase.json` - Firebase hosting + functions configuration  
- `functions/tsconfig.json` - TypeScript config for Firebase Functions
- `functions/src/index.ts` - Main Firebase Function (nextjsFunc)
- `.firebaserc` - Firebase project settings (pedro-bolt-app)
- `/.next/` - Build output for Next.js (referenced by functions)
- `/public/assets/` - Static assets (43 files organized)

## 🔥 Firebase Functions
- **Runtime:** Node.js 18
- **Main Function:** `nextjsFunc` (handles all requests)
- **API Routes:** Stripe integration (/api/stripe/*)
- **Status:** ✅ Operational (TypeScript errors resolved)

## 🎯 Recent Fixes (Dec 30, 2024)
- ✅ **Firebase Functions TypeScript errors resolved**
- ✅ **Dependencies installed in functions folder**
- ✅ **Proper tsconfig.json configuration applied**
- ✅ **Git configuration updated to exclude build artifacts**
- ✅ **Contact form implemented with email functionality**
- ✅ **Nodemailer integration with GoDaddy SMTP ready**

## 🔧 Contact Form Configuration
**SMTP Setup Completed:**
```bash
✅ SMTP_USER=kontakt@pedro.app
✅ SMTP_PASS=configured
✅ SMTP_TO=kontakt@pedro.app
```

**Contact Form Status:** 🟢 ACTIVE
- Form validation: ✅ Working
- Email sending: ✅ Configured
- Error handling: ✅ Implemented
- Success feedback: ✅ Implemented

## 🎯 Immediate Tasks
1. **Store Links:** Replace `href="#"` with real URLs in Hero.tsx, Download.tsx
2. **Content:** Finalize placeholder text throughout components
3. **Contact:** Add real email/social links in Contact.tsx, Footer.tsx
4. **FAQ:** Replace placeholder questions with real content

## 🔗 Important Links
- **Live Site:** https://pedro-bolt-app.web.app
- **Firebase Console:** https://console.firebase.google.com/project/pedro-bolt-app
- **GitHub:** https://github.com/szfenda/pedro-landing

## 🛠 Tech Stack
- Next.js 15.1.2 (App Router, Dynamic with SSR)
- TypeScript 5.7.2
- Tailwind CSS 3.4.17 (Neo-brutalism design)
- Firebase Hosting + Functions (Node.js 18)
- Firebase Auth + Firestore (shared with mobile app)
- Stripe Integration (Pay-per-Use model)
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
<SocialProof />            // Future testimonials + dream partners (UPDATED)
<FAQ />                    // Accordion
<Download />               // Store badges
<Contact />                // Form with brutal inputs
<Footer />                 // Dark with Pedro Peeking
```

## Firebase Deployment
```bash
# Full deployment workflow
npm run build              # Build Next.js application
npm run build:functions    # Compile Firebase Functions
npm run deploy            # Deploy both hosting and functions

# Individual deployments
npm run deploy:hosting     # Deploy hosting only
npm run deploy:functions   # Deploy functions only

# Local testing
firebase serve --only hosting,functions  # Test complete setup locally
```

## Firebase Functions Architecture
- **Single Function:** `nextjsFunc` handles all requests
- **API Routes:** Stripe integration served through function
- **Authentication:** Firebase Auth with server-side verification
- **Database:** Firestore (shared with mobile app)
- **Shared Collections:** USER (mobile + web), PARTNER (web only)

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