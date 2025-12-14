# PEDRO Landing Page - Complete Project Structure

## Directory Structure

```
PEDRO_landing/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── backgrounds/
│   │   │   │   ├── back_left_under_text.png
│   │   │   │   └── back_right_under_phone.png
│   │   │   ├── mascots/
│   │   │   │   ├── pedro_raccoon_phone.png
│   │   │   │   ├── Pedro_Thumbs_Up.png
│   │   │   │   ├── Pedro_with_smartphone_in_one_hand.png
│   │   │   │   └── Pedro_Peeking.png
│   │   │   ├── logos/
│   │   │   │   ├── LOGO_white.png
│   │   │   │   ├── logo_main.png
│   │   │   │   └── logo_icon.png
│   │   │   └── patterns/
│   │   │       └── seamless_pattern.jpg
│   │   ├── icons/
│   │   │   ├── features/
│   │   │   │   ├── icon_search.png
│   │   │   │   ├── icon_wallet.png
│   │   │   │   └── icon_qr.png
│   │   │   ├── categories/
│   │   │   │   ├── icon_pizza.png
│   │   │   │   ├── icon_burger.png
│   │   │   │   ├── icon_drink.png
│   │   │   │   ├── icon_scissors.png
│   │   │   │   └── icon_ticket.png
│   │   │   ├── functional/
│   │   │   │   ├── icon_checkmark.png
│   │   │   │   ├── icon_arrow_right.png
│   │   │   │   ├── icon_arrow_down.png
│   │   │   │   ├── icon_location.png
│   │   │   │   ├── icon_heart.png
│   │   │   │   └── icon_bell.png
│   │   │   ├── business/
│   │   │   │   ├── icon_money.png
│   │   │   │   ├── icon_analytics.png
│   │   │   │   ├── icon_target.png
│   │   │   │   └── icon_store.png
│   │   │   └── social/
│   │   │       ├── icon_instagram.png
│   │   │       ├── icon_tiktok.png
│   │   │       └── icon_facebook.png
│   │   └── elements/
│   │       ├── speech_bubble.png
│   │       ├── badge_pill.png
│   │       └── particles.png
│   └── fonts/
│       ├── DelaGothicOne-Regular.ttf
│       ├── ArchivoBlack-Regular.ttf
│       └── Inter-VariableFont.ttf
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── fonts.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── B2B.tsx
│   │   │   ├── SocialProof.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── Download.tsx
│   │   │   └── Contact.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Accordion.tsx
│   │   │   └── Badge.tsx
│   │   └── animations/
│   │       ├── FloatingElement.tsx
│   │       ├── ScrollReveal.tsx
│   │       ├── ScanLine.tsx
│   │       └── ParallaxElement.tsx
│   ├── styles/
│   │   ├── neo-brutalism.css
│   │   ├── animations.css
│   │   └── utilities.css
│   ├── lib/
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── technical/
│   ├── 01_project_structure.md
│   ├── 02_asset_preparation.md
│   ├── 03_styling_setup.md
│   ├── 04_component_development.md
│   └── 05_animations_interactions.md
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Technology Stack

### Framework & Core
- **Next.js 14+** (App Router) - For SEO and performance
- **React 18+** - Component architecture
- **TypeScript** - Type safety

### Styling
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Custom CSS** - For neo-brutalism effects (hard shadows, scan lines)

### Animations
- **Framer Motion** - For complex animations
- **CSS Animations** - For performance-critical effects
- **IntersectionObserver API** - For scroll-triggered animations

### Fonts
- **Dela Gothic One** or **Archivo Black** - Headlines
- **Inter** or **Outfit** - Body text
- Loaded via `next/font` for optimization

### Performance
- Next.js Image component for automatic optimization
- Lazy loading for off-screen components
- CSS `will-change` for animation performance
- SVG sprites for icons

## File Naming Conventions

### Source Files
- Components: PascalCase.tsx (e.g., `Hero.tsx`, `FeatureCard.tsx`)
- Utilities: kebab-case.ts (e.g., `smooth-scroll.ts`)
- Styles: kebab-case.css (e.g., `neo-brutalism.css`)

### Assets
- Images: snake_case.png (e.g., `pedro_raccoon_phone.png`)
- Icons: icon_name.png (e.g., `icon_search.png`, `icon_wallet.png`)
- Logos: LOGO_variant.png (e.g., `LOGO_white.png`)

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
```

## Environment Variables

```env
# None required for landing page
# Future: Analytics, forms, etc.
```

## Build & Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Browser Support

- Chrome/Edge (latest, -2 versions)
- Firefox (latest, -2 versions)
- Safari (latest, -2 versions)
- Mobile Safari (iOS 14+)
- Mobile Chrome (Android 10+)
