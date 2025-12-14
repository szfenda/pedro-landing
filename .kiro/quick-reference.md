# Quick Reference Guide

## Project Commands
```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check

# Asset processing (when needed)
node organize-assets.js        # Organize asset structure
node remove-backgrounds.js     # Remove icon backgrounds
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

📁 Assets (Current Issue)
├── assets/               # ❌ Current location (wrong)
└── public/assets/        # ✅ Target location (correct)
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
<Navigation />              // Fixed top nav with smooth scroll

// Sections (in order)
<Hero />                   // 100vh split, backgrounds, mascot
<About />                  // 2-col with Pedro Thumbs Up
<Features />               // 3 cards with scan animation
<B2B />                    // Lime bg with orbiting icons
<SocialProof />            // Testimonials
<FAQ />                    // Accordion
<Download />               // Store badges repeat
<Contact />                // Form with brutal inputs
<Footer />                 // Dark with Pedro Peeking
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

.btn-brutal           /* Button base style */
.card-brutal          /* Card base style */
.scroll-reveal        /* Scroll-triggered fade-in */
.glow-lime           /* Lime glow effect */
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
- [ ] All assets in `/public/assets/` with transparent backgrounds
- [ ] Store links updated from placeholders
- [ ] Content finalized (no placeholder text)
- [ ] Cross-browser testing completed
- [ ] Mobile testing on real devices
- [ ] Performance audit passed (Lighthouse >90)
- [ ] Accessibility compliance verified