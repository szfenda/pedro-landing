# Styling Setup Guide - Neo-Brutalism Design System

## Overview
This guide details how to set up the complete styling system for the PEDRO landing page, including Tailwind configuration, custom CSS for neo-brutalism effects, typography, and design tokens.

---

## STEP 1: Tailwind Configuration

**File:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors (from spec)
        'pedro-purple': '#6C5CE7',
        'pedro-lime': '#CCFF00',
        'pedro-pink': '#FF7675',
        'pedro-light': '#F7F9FC',
        'pedro-dark': '#2D3436',
      },
      fontFamily: {
        headline: ['var(--font-dela-gothic)', 'var(--font-archivo-black)', 'sans-serif'],
        body: ['var(--font-inter)', 'var(--font-outfit)', 'sans-serif'],
      },
      fontSize: {
        // Hero and section sizing
        'hero': ['clamp(3rem, 8vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'h2': ['clamp(2.5rem, 5vw, 3.25rem)', { lineHeight: '1.1' }],
        'h3': ['clamp(1.75rem, 3vw, 2.25rem)', { lineHeight: '1.2' }],
        'body': ['1.125rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
      boxShadow: {
        // Hard shadows (neo-brutalism)
        'brutal-purple': '10px 10px 0 #6C5CE7',
        'brutal-lime': '10px 10px 0 #CCFF00',
        'brutal-dark': '10px 10px 0 #2D3436',
        'brutal-sm-purple': '6px 6px 0 #6C5CE7',
        'brutal-sm-lime': '6px 6px 0 #CCFF00',
        'brutal-lg-purple': '12px 12px 0 #6C5CE7',
        'brutal-lg-lime': '12px 12px 0 #CCFF00',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 1.2s infinite',
        'scan': 'scan 3s ease-in-out infinite',
        'wave': 'wave 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
      },
      transitionTimingFunction: {
        'pedro': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      maxWidth: {
        'container': '1200px',
      },
      spacing: {
        'section': 'clamp(4rem, 8vw, 7.5rem)',
      },
    },
  },
  plugins: [],
}
export default config
```

---

## STEP 2: Font Setup

**File:** `src/app/fonts.ts`

```typescript
import { Dela_Gothic_One, Archivo_Black, Inter, Outfit } from 'next/font/google'

// Headline fonts
export const delaGothicOne = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dela-gothic',
  display: 'swap',
})

export const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
  display: 'swap',
})

// Body fonts
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})
```

**Apply fonts in layout:**

**File:** `src/app/layout.tsx`

```typescript
import { delaGothicOne, inter } from './fonts'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={`${delaGothicOne.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

## STEP 3: Global CSS (Neo-Brutalism Base)

**File:** `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===========================
   CSS CUSTOM PROPERTIES
   =========================== */

:root {
  /* Brand Colors */
  --color-purple: #6C5CE7;
  --color-lime: #CCFF00;
  --color-pink: #FF7675;
  --color-light: #F7F9FC;
  --color-dark: #2D3436;
  
  /* Spacing */
  --container-max-width: 1200px;
  --padding-desktop: 24px;
  --padding-mobile: 16px;
  
  /* Borders */
  --border-width: 3px;
  --border-color: var(--color-dark);
  
  /* Transitions */
  --transition-speed: 0.25s;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===========================
   BASE STYLES
   =========================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  font-family: var(--font-inter), sans-serif;
  color: var(--color-dark);
  background-color: var(--color-light);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===========================
   TYPOGRAPHY
   =========================== */

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-dela-gothic), sans-serif;
  font-weight: 400;
}

/* ===========================
   NEO-BRUTALISM UTILITIES
   =========================== */

/* Hard Shadow Mixin (use as class) */
.hard-shadow-purple {
  box-shadow: 10px 10px 0 var(--color-purple);
}

.hard-shadow-lime {
  box-shadow: 10px 10px 0 var(--color-lime);
}

.hard-shadow-dark {
  box-shadow: 10px 10px 0 var(--color-dark);
}

.hard-shadow-sm-purple {
  box-shadow: 6px 6px 0 var(--color-purple);
}

.hard-shadow-sm-lime {
  box-shadow: 6px 6px 0 var(--color-lime);
}

/* Brutal Border */
.brutal-border {
  border: var(--border-width) solid var(--border-color);
}

/* ===========================
   CUSTOM ANIMATIONS
   =========================== */

/* Floating Animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Scan Line Animation (for QR card) */
@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(-100%);
  }
}

.animate-scan {
  animation: scan 3s ease-in-out infinite;
}

/* Wave Animation (for Pedro peeking) */
@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
}

.animate-wave {
  animation: wave 5s ease-in-out infinite;
}

/* Bounce Indicator */
@keyframes bounce-indicator {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-indicator 1.2s ease-in-out infinite;
}

/* ===========================
   SCROLL ANIMATIONS
   =========================== */

.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s var(--transition-timing), 
              transform 0.6s var(--transition-timing);
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ===========================
   BUTTON STYLES
   =========================== */

.btn-brutal {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  font-weight: 700;
  border: var(--border-width) solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: transform var(--transition-speed) var(--transition-timing),
              box-shadow var(--transition-speed) var(--transition-timing);
  will-change: transform, box-shadow;
}

.btn-brutal:hover {
  transform: translateY(-6px);
}

.btn-brutal:active {
  transform: translateY(-2px) scale(0.98);
}

.btn-brutal-purple {
  background-color: var(--color-purple);
  color: white;
  box-shadow: 10px 10px 0 var(--color-dark);
}

.btn-brutal-purple:hover {
  box-shadow: 10px 10px 0 var(--color-lime);
}

.btn-brutal-lime {
  background-color: var(--color-lime);
  color: var(--color-dark);
  box-shadow: 10px 10px 0 var(--color-purple);
}

/* ===========================
   CARD STYLES
   =========================== */

.card-brutal {
  background: white;
  border: var(--border-width) solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 10px 10px 0 var(--color-purple);
  transition: transform var(--transition-speed) var(--transition-timing),
              box-shadow var(--transition-speed) var(--transition-timing);
  will-change: transform, box-shadow;
}

.card-brutal:hover {
  transform: translateY(-8px);
  box-shadow: 10px 10px 0 var(--color-lime);
}

/* ===========================
   INPUT STYLES
   =========================== */

.input-brutal {
  width: 100%;
  padding: 14px 18px;
  font-size: 16px;
  border: var(--border-width) solid var(--border-color);
  border-radius: 8px;
  background: white;
  transition: box-shadow 0.2s var(--transition-timing);
}

.input-brutal:focus {
  outline: none;
  box-shadow: 6px 6px 0 var(--color-lime);
}

/* ===========================
   GLOW EFFECTS
   =========================== */

.glow-lime {
  box-shadow: 0 0 40px rgba(204, 255, 0, 0.4);
}

.glow-purple {
  box-shadow: 0 0 40px rgba(108, 92, 231, 0.4);
}

/* ===========================
   TEXT EFFECTS
   =========================== */

.text-poster-shadow {
  text-shadow: 
    4px 4px 0 rgba(0, 0, 0, 0.35),
    2px 2px 0 rgba(0, 0, 0, 0.2);
}

/* ===========================
   CONTAINER
   =========================== */

.container-pedro {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding-left: var(--padding-desktop);
  padding-right: var(--padding-desktop);
}

@media (max-width: 768px) {
  .container-pedro {
    padding-left: var(--padding-mobile);
    padding-right: var(--padding-mobile);
  }
}

/* ===========================
   SCROLL PROGRESS BAR
   =========================== */

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 4px;
  background: var(--color-lime);
  z-index: 9999;
  transition: width 0.1s ease-out;
}

/* ===========================
   PERFORMANCE OPTIMIZATIONS
   =========================== */

.will-animate {
  will-change: transform, opacity;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## STEP 4: Component-Specific Styles

**File:** `src/styles/animations.css`

```css
/* Advanced animations for specific components */

/* Parallax layers */
.parallax-layer {
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 3D Tilt Effect (for feature cards) */
.tilt-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ripple effect on click */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(204, 255, 0, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple:active::after {
  width: 200px;
  height: 200px;
}

/* Count-up animation */
@keyframes count-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-count-up {
  animation: count-up 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Stagger children */
.stagger-children > * {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.4s; }

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Orb floating (for B2B section) */
.orbit-icon {
  animation: orbit 8s linear infinite;
}

@keyframes orbit {
  from {
    transform: rotate(0deg) translateX(80px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(80px) rotate(-360deg);
  }
}
```

---

## STEP 5: Verification

After setting up styles:

1. **Test Tailwind classes:**
   - Create a test component using brands colors
   - Verify custom shadows work
   - Test responsive breakpoints

2. **Test fonts loading:**
   - Check headline font (Dela Gothic One)
   - Check body font (Inter)
   - Verify font variables in DevTools

3. **Test animations:**
   - Float animation on test element
   - Scan animation on test element
   - Hover effects on buttons/cards

4. **Build test:**
   ```bash
   npm run build
   ```
   - Ensure no Tailwind/CSS errors
   - Check compiled CSS size

---

## Design Tokens Summary

### Colors
- Primary Purple: `#6C5CE7`
- Accent Lime: `#CCFF00`
- Emotion Pink: `#FF7675`
- Background Light: `#F7F9FC`
- Text Dark: `#2D3436`

### Typography Scale
- Hero: ~64-80px (desktop)
- H2: ~44-52px
- H3: ~28-36px
- Body: 18px
- Small: 14px

### Spacing
- Container max-width: 1200px
- Desktop padding: 24px
- Mobile padding: 16px
- Section spacing: 96-120px

### Borders & Shadows
- Border width: 3px solid #2D3436
- Hard shadow default: 10px 10px 0 #6C5CE7
- Hard shadow hover: 10px 10px 0 #CCFF00
- Border radius (cards): 16px
- Border radius (buttons): 12px

### Transitions
- Duration: 0.25-0.35s
- Timing: cubic-bezier(0.4, 0, 0.2, 1)

---

## Next Steps

✅ Styling setup complete → Proceed to Component Development (04_component_development.md)
