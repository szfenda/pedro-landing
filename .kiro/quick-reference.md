# Quick Reference Guide

## 🚀 Current Status
**✅ DEPLOYED & LIVE:** https://pedro-bolt-app.web.app  
**Status:** Production ready, content updates needed  
**Last Updated:** December 2024

## 🔧 Essential Commands
```bash
# Development
npm run dev                    # Local development server

# Production
npm run build                  # Build + static export to /out
firebase deploy --only hosting # Deploy to Firebase
firebase serve --only hosting  # Test Firebase locally

# Git
git add . && git commit -m "message" && git push origin main
```

## 📁 Key Files
- `next.config.js` - Static export config for Firebase
- `firebase.json` - Firebase hosting configuration  
- `.firebaserc` - Firebase project settings
- `/out/` - Build output (auto-generated, ignored in git)
- `/public/assets/` - Static assets (43 files organized)

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
- Next.js 15.1.2 (App Router, Static Export)
- TypeScript 5.7.2
- Tailwind CSS 3.4.17 (Neo-brutalism design)
- Firebase Hosting
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
# Quick deploy workflow
npm run build              # Generates /out folder
firebase deploy --only hosting

# Local testing
firebase serve --only hosting  # http://localhost:5000
```

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