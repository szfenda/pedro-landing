# Design System & Visual Guidelines

## Brand Identity
**Style:** Neo-Brutalism meets Digital Pop Art  
**Vibe:** TikTok energy + streetwear + brutal, but UX-friendly  
**Key Elements:** Thick borders, hard shadows, bold typography, vibrant accents

## Color Palette (60-30-10 Rule)
```css
--color-purple: #6C5CE7    /* Primary brand */
--color-lime: #CCFF00      /* CTA accent */
--color-pink: #FF7675      /* Emotion accent */
--color-light: #F7F9FC     /* Background */
--color-dark: #2D3436      /* Text/borders */
```

## Typography Scale
**Fonts:**
- Headlines: Dela Gothic One (primary) / Archivo Black (fallback)
- Body: Inter (primary) / Outfit (fallback)

**Sizes:**
- Hero: `clamp(3rem, 8vw, 5rem)` (~64-80px desktop)
- H2: `clamp(2.5rem, 5vw, 3.25rem)` (~44-52px)
- H3: `clamp(1.75rem, 3vw, 2.25rem)` (~28-36px)
- Body: `1.125rem` (18px)
- Small: `0.875rem` (14px)

**Text Effects:**
- Poster shadow: `4px 4px 0 rgba(0,0,0,0.35), 2px 2px 0 rgba(0,0,0,0.2)`
- Line height: 0.95 (headlines), 1.6 (body)
- Letter spacing: -0.02em (large headlines)

## Neo-Brutalism UI Elements

### Borders & Shadows
```css
/* Standard border */
border: 3px solid #2D3436;

/* Hard shadows (no blur) */
box-shadow: 10px 10px 0 #6C5CE7;  /* Default */
box-shadow: 10px 10px 0 #CCFF00;  /* Hover/CTA */
box-shadow: 6px 6px 0 #6C5CE7;   /* Small variant */
```

### Border Radius
- Cards: 16px
- Buttons: 12px
- Inputs: 8px
- Navigation pills: 9999px (full rounded)

### Button System
**Base Style:**
```css
.btn-brutal {
  padding: 14px 32px;
  font-weight: 700;
  border: 3px solid #2D3436;
  border-radius: 12px;
  transition: transform 0.25s, box-shadow 0.25s;
}
```

**Variants:**
- Purple: `bg-#6C5CE7 text-white shadow-#2D3436 hover:shadow-#CCFF00`
- Lime: `bg-#CCFF00 text-#2D3436 shadow-#6C5CE7`

**Interactions:**
- Hover: `translateY(-6px)`
- Active: `translateY(-2px) scale(0.98)`

### Card System
```css
.card-brutal {
  background: white;
  border: 3px solid #2D3436;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 10px 10px 0 #6C5CE7;
  transition: transform 0.25s, box-shadow 0.25s;
}

.card-brutal:hover {
  transform: translateY(-8px);
  box-shadow: 10px 10px 0 #CCFF00;
}
```

## Layout System
**Container:**
- Max-width: 1200px
- Padding: 24px (desktop) / 16px (mobile)
- Margin: 0 auto

**Section Spacing:**
- Vertical: `clamp(4rem, 8vw, 7.5rem)` (~96-120px)

**Grid Systems:**
- Features: 3 columns (desktop) / 1 column (mobile)
- About: 2 columns (desktop) / 1 column (mobile)
- Equal height cards: min-height 380-420px

## Animation Principles
**Performance First:**
- Prefer `transform` and `opacity`
- Use `will-change` for animated elements
- Remove `will-change` after animation

**Timing:**
- Duration: 0.25-0.35s for interactions
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Loops: 3s (float), 5s (wave), 8s (orbit)

**Key Animations:**
- Float: Vertical movement for mascot
- Scan: Horizontal line through QR icon
- Wave: Rotation for Pedro Peeking
- Bounce: Scroll indicator
- Tilt: 3D effect on card hover

## Accessibility
**Focus States:**
- Lime outline: `box-shadow: 6px 6px 0 #CCFF00`
- Visible on all interactive elements

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

**Keyboard Navigation:**
- All interactive elements focusable
- Smooth scroll to sections
- Accordion keyboard support

## Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

**Mobile Adaptations:**
- Single column layouts
- Reduced padding/margins
- Simplified navigation (burger menu)
- Adjusted font sizes via clamp()
- Sticky bottom CTA

## Vercel Deployment Optimizations
- **Edge Network:** Global CDN for fast asset delivery
- **Image Optimization:** Automatic WebP/AVIF conversion
- **Bundle Optimization:** Automatic code splitting and tree shaking
- **Performance Monitoring:** Real-time Core Web Vitals tracking