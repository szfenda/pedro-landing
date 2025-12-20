# Technical Stack & Configuration

## Core Technologies
- **Next.js:** 15.1.2 (App Router)
- **React:** 19.0.0
- **TypeScript:** 5.7.2
- **Tailwind CSS:** 3.4.17
- **Framer Motion:** 11.15.0

## Key Dependencies
```json
{
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "sharp": "^0.34.5"
}
```

## Project Structure
```
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx           # Main page assembling all sections
│   ├── globals.css        # Neo-brutalism design system
│   └── fonts.ts           # Google Fonts configuration
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx  # Fixed nav with smooth scroll
│   │   └── Footer.tsx     # Dark footer with Pedro Peeking
│   └── sections/
│       ├── Hero.tsx       # 100vh split with backgrounds
│       ├── About.tsx      # 2-column with Pedro Thumbs Up
│       ├── Features.tsx   # 3 cards with scan line animation
│       ├── B2B.tsx        # Lime background with orbiting icons
│       ├── SocialProof.tsx # Testimonials
│       ├── FAQ.tsx        # Brutal accordion
│       ├── Download.tsx   # Store badges repeat
│       └── Contact.tsx    # Form with brutal inputs
├── lib/
│   ├── assets.ts          # Type-safe asset paths
│   └── utils.ts           # Utilities (cn, smoothScrollTo)
├── styles/
│   └── animations.css     # Advanced component animations
└── public/assets/         # Organized asset structure
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
- Static export: `output: 'export'`
- Image optimization: `unoptimized: true` (Firebase compatible)
- Trailing slash: `true` (SPA routing)
- ESLint ignore during builds

**Firebase Hosting:**
- Public directory: `out`
- Cache headers for static assets
- SPA rewrites configuration

## Development Commands
```bash
npm run dev    # Development server
npm run build  # Production build + static export
npm run start  # Production server
npm run lint   # ESLint check

# Firebase commands
firebase serve --only hosting  # Local Firebase server
firebase deploy --only hosting # Deploy to production
```