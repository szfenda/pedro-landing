# PEDRO Landing Page - Project Overview

## Project Identity
**Name:** PEDRO Landing Page  
**Type:** One-page marketing website for mobile app  
**Framework:** Next.js 15+ with TypeScript  
**Styling:** Tailwind CSS + Custom Neo-Brutalism CSS  
**Hosting:** Firebase Hosting (https://pedro-bolt-app.web.app)  
**Status:** ✅ **DEPLOYED & LIVE** - Ready for content updates

## Deployment Status
**✅ PRODUCTION READY:**
- Firebase Hosting configured and deployed
- Static export optimized for Firebase
- All assets loading correctly
- Performance optimized (112 kB First Load JS)
- GitHub repository updated with deployment configs

## Core Concept
Modern, interactive landing page promoting PEDRO mobile app (local deals/coupons finder) in **Neo-Brutalism meets Digital Pop Art** aesthetic. Key requirement: Hero and Features sections must match provided designs 1:1.

## Design System
**Colors:**
- Primary Purple: `#6C5CE7`
- Accent Lime: `#CCFF00` 
- Emotion Pink: `#FF7675`
- Background Light: `#F7F9FC`
- Text Dark: `#2D3436`

**Typography:**
- Headlines: Dela Gothic One / Archivo Black
- Body: Inter / Outfit
- Sizes: Hero ~64-80px, H2 ~44-52px, H3 ~28-36px, Body 18px

**Neo-Brutalism Elements:**
- Borders: 3px solid #2D3436
- Hard Shadows: 10px 10px 0 #6C5CE7 (default) / #CCFF00 (hover)
- Border Radius: Cards 16px, Buttons 12px
- Transitions: 0.25-0.35s cubic-bezier(0.4, 0, 0.2, 1)

## Page Structure (One-Page with Anchors)
1. **Hero** `#top` - 100vh split layout, backgrounds, floating mascot
2. **About** `#o-nas` - 2-column intro with Pedro Thumbs Up
3. **Features** `#funkcje` - 3 cards with icons (CRITICAL: 1:1 design match)
4. **B2B** `#dla-biznesu` - Lime background, diagonal purple accent
5. **Social Proof** `#opinie` - Future testimonials and dream partners (UPDATED Dec 2024)
6. **FAQ** `#faq` - Accordion with brutal styling
7. **Download** `#pobierz` - Store badges repeat
8. **Contact** `#kontakt` - Form with brutal inputs
9. **Footer** - Dark with Pedro Peeking animation

## Key Assets (43 total)
**Critical Assets:**
- Hero: `pedro_raccoon_phone.png`, `back_left_under_text.png`, `back_right_under_phone.png`
- Features: `icon_search.png`, `icon_wallet.png`, `icon_qr.png`
- About: `Pedro_Thumbs_Up.png`
- Footer: `Pedro_Peeking.png`
- Logo: `LOGO_white.png`

## Current Implementation Status
✅ **Complete:**
- Project setup (Next.js, Tailwind, TypeScript)
- All components created and functional
- Design system implemented
- Animations (floating, scan line, wave, scroll reveals)
- Responsive layout
- Navigation with smooth scroll
- Asset organization system
- **MAJOR BREAKTHROUGH:** Asset transparency issues resolved
- Pedro mascot graphics with perfect transparent backgrounds
- Asset paths corrected from `/assets/` to `/public/assets/`

🔄 **Pending:**
- Remaining icon background removal (feature icons, category icons, social icons)
- Store links (currently placeholders)
- Content finalization (some placeholder text)
- Final testing and optimization

## Technical Architecture
- **Components:** Organized in `components/layout/` and `components/sections/`
- **Styling:** `app/globals.css` + `styles/animations.css`
- **Assets:** Type-safe imports via `lib/assets.ts`
- **Utilities:** `lib/utils.ts` for common functions
- **Fonts:** Google Fonts loaded via `app/fonts.ts`