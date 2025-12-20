# Quick Reference Guide

## Project Commands
```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check

# Asset processing (BREAKTHROUGH ACHIEVED!)
node remove-gray-background.js      # Pedro raccoon phone (DONE ✅)
node remove-thumbs-up-background.js # Pedro thumbs up (DONE ✅)
node remove-smartphone-background.js # Pedro smartphone (DONE ✅)
# Same method can be applied to remaining 21 icon files
```

## Key File Locations
```
📁 Core Configuration
├── next.config.js           # Next.js config
├── tailwind.config.ts       # Tailwind + custom theme
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies

📁 Application Code
├── app/
│   ├── layout.tsx          # Root layout + fonts
│   ├── page.tsx           # Main page assembly
│   ├── globals.css        # Design system CSS
│   └── fonts.ts           # Google Fonts config
├── components/            # All React components
├── lib/
│   ├── assets.ts         # Asset path constants
│   └── utils.ts          # Utility functions
└── styles/
    └── animations.css    # Advanced animations

📁 Assets (TRANSPARENCY BREAKTHROUGH!)
├── assets/               # 🔄 Source files with RGB(175,175,175) backgrounds
└── public/assets/        # ✅ Organized structure with processed files
    ├── images/mascots/   # ✅ 3 mascots with PERFECT transparency
    └── icons/           # 🔄 21 files awaiting same processing
```

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

/* Typography */
font-family: 'Dela Gothic One';    /* Headlines */
font-family: 'Inter';              /* Body */
```

## Component Quick Access
```tsx
// Navigation
<Navigation />              // Fixed top nav with smooth scroll + ripple login

// UI Components (NEW - Priority 1 ✅)
<ScrollProgress />          // Top progress bar (lime)
<MobileStickyCTA />         // Bottom-fixed mobile CTA
<Button variant="purple" /> // Reusable with ripple effect
<Card hover={true} />       // Brutal styling with 3D tilt

// Sections (in order)
<Hero />                   // 100vh split, backgrounds, mascot + parallax
<About />                  // 2-col with Pedro Thumbs Up + scroll reveal
<Features />               // 3 cards with 3D tilt + scan animation
<B2B />                    // Lime bg with orbiting icons + count-up
<SocialProof />            // Testimonials
<FAQ />                    // Accordion
<Download />               // Store badges with ripple effects
<Contact />                // Form with brutal inputs
<Footer />                 // Dark with Pedro Peeking + wave animation
```

## Asset Quick Reference
```tsx
import { 
  backgrounds,    // Hero backgrounds
  mascots,        // Pedro character variants
  featureIcons,   // Main 3 feature icons
  logos,          // PEDRO logo variants
  socialIcons     // Footer social media
} from '@/lib/assets'

// Usage
<Image src={mascots.raccoonPhone} />
<img src={featureIcons.search} />
```

## Animation Classes
```css
.animate-float         /* 3s floating (Hero mascot) */
.animate-scan          /* 3s scan line (QR card) */
.animate-wave          /* 5s wave (Pedro Peeking) */
.animate-bounce-slow   /* 1.2s bounce (scroll indicator) */

.btn-brutal           /* Button base style + ripple effect */
.card-brutal          /* Card base style + 3D tilt hover */
.scroll-reveal        /* Scroll-triggered fade-in */
.glow-lime           /* Lime glow effect */
.focus-brutal        /* Accessibility focus states */
```

## New Hooks & Components (Priority 1 ✅)
```css
/* Touch-friendly interactions */
@media (max-width: 768px) {
  .btn-brutal { min-height: 48px; }  /* Larger tap targets */
  nav button { min-height: 44px; }   /* Navigation touch targets */
  
  /* Remove hover on touch devices */
  @media (hover: none) {
    .card-brutal:hover { transform: none; }
  }
  
  /* Active states for touch feedback */
  .btn-brutal:active { transform: scale(0.95); }
}

/* Mobile Hero Layout */
.hero-mobile {
  flex-direction: column;  /* Stack vertically on mobile */
  text-align: center;      /* Center text on mobile */
}
```

## Mobile Components
```tsx
// Mobile-specific components
<MobileStickyCTA />         // Bottom-fixed, appears after Hero scroll
<Navigation />              // Responsive with mobile menu
<Hero />                    // Mobile: vertical stack, smaller mascot

// Mobile optimizations
- Responsive mascot sizing (280x350 on mobile vs 500x600 desktop)
- Touch-friendly tap targets (min 44px)
- Scroll padding for fixed navigation
- Background doodles hidden on mobile
- Orbiting icons smaller on mobile
```
```tsx
// Hooks
import { useTilt3D } from '@/hooks/useTilt3D'        // 3D mouse tilt
import { useRipple } from '@/hooks/useRipple'        // Click ripple effect
import { useScrollReveal } from '@/hooks/useScrollReveal' // Scroll animations

// Animation Components
import ParallaxElement from '@/components/animations/ParallaxElement'

// UI Components
import ScrollProgress from '@/components/ui/ScrollProgress'
import MobileStickyCTA from '@/components/ui/MobileStickyCTA'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
```

## Section Anchor IDs
```html
#top              <!-- Hero section -->
#o-nas            <!-- About section -->
#funkcje          <!-- Features section -->
#dla-biznesu      <!-- B2B section -->
#opinie           <!-- Social Proof section -->
#faq              <!-- FAQ section -->
#pobierz          <!-- Download section -->
#kontakt          <!-- Contact section -->
```

## Responsive Breakpoints
```css
/* Mobile-first approach */
.class              /* Mobile (default) */
.md:class          /* Tablet (768px+) */
.lg:class          /* Desktop (1024px+) */

/* Key responsive patterns */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3  /* Responsive grid */
text-2xl md:text-4xl lg:text-6xl           /* Responsive text */
px-4 md:px-8 lg:px-12                      /* Responsive padding */
```

## Common Issues & Solutions

### Asset Loading Issues
```bash
# Problem: Images not loading
# Solution: Check file paths in lib/assets.ts
# Ensure files are in /public/assets/ not /assets/
```

### Animation Performance
```css
/* Add to animated elements */
.will-animate {
  will-change: transform, opacity;
}

/* Remove after animation completes */
element.style.willChange = 'auto';
```

### Build Errors
```bash
# Common fixes
npm run lint --fix    # Fix ESLint issues
rm -rf .next         # Clear Next.js cache
npm install          # Reinstall dependencies
```

## Development Workflow
1. **Start dev server:** `npm run dev`
2. **Edit components** in `components/` folder
3. **Update styles** in `app/globals.css` or `styles/animations.css`
4. **Test responsive** using browser dev tools
5. **Check animations** on different screen sizes
6. **Build test:** `npm run build` before deployment

## Deployment Checklist
- [x] **MAJOR WIN:** Mascot transparency issues solved (3/3 main graphics)
- [x] All assets in `/public/assets/` with organized structure
- [x] Asset paths corrected in `lib/assets.ts`
- [x] **PRIORITY 1 COMPLETED:** All UI components and microinteractions implemented
- [x] ScrollProgress bar (lime, top of page)
- [x] MobileStickyCTA (bottom-fixed on mobile)
- [x] 3D Tilt effects on Feature cards
- [x] Ripple effects on all buttons/store badges
- [x] Parallax effect on Hero mascot
- [x] Focus states for accessibility
- [ ] Remaining 21 icon files background removal (same proven method)
- [ ] Store links updated from placeholders
- [ ] Content finalized (no placeholder text)
- [x] **PRIORITY 3 COMPLETED:** Mobile Hero implementation (both sides visible)
- [x] Mobile responsive testing on all sections  
- [x] Touch interactions and tap targets optimized
- [x] MobileStickyCTA scroll to Download section
- [x] Responsive sizing for all components
- [ ] Cross-browser testing completed
- [ ] Performance audit passed (Lighthouse >90)

## 🎉 BREAKTHROUGH ACHIEVED
**Problem:** Mascot graphics had visible backgrounds despite "transparent" PNGs
**Solution:** RGB(175,175,175) targeted removal + CSS background-image rendering
**Result:** Perfect transparency on all 3 main Pedro mascot graphics