# Component Architecture & Implementation

## Component Organization
```
components/
├── layout/
│   ├── Navigation.tsx     # Fixed top nav with smooth scroll
│   └── Footer.tsx         # Dark footer with Pedro Peeking
└── sections/
    ├── Hero.tsx           # 100vh split layout (CRITICAL: 1:1 design)
    ├── About.tsx          # 2-column with Pedro Thumbs Up
    ├── Features.tsx       # 3 cards with animations (CRITICAL: 1:1 design)
    ├── B2B.tsx            # Lime background with orbiting icons
    ├── SocialProof.tsx    # Testimonials and partner logos
    ├── FAQ.tsx            # Accordion with brutal styling
    ├── Download.tsx       # Store badges repeat
    └── Contact.tsx        # Form with brutal inputs
```

## Critical Components (Must Match Design 1:1)

### Hero.tsx
**Layout:** 100vh height, 50/50 split
- Left: Text + store badges over `back_left_under_text.png`
- Right: `pedro_raccoon_phone.png` with floating animation over `back_right_under_phone.png`
- Divider: 2px solid #2D3436 between halves
- Navigation: Fixed top with logo, black pill nav, login button
- Scroll indicator: Bottom center with bounce animation

**Key Elements:**
```tsx
// H1 text (exact 4 lines)
PEDRO NIE
PRZEPŁACA.
PEDRO POLUJE
NA PROMKI

// Store badges (placeholders)
<a href="#" aria-label="Download on the App Store">
<a href="#" aria-label="Get it on Google Play">
```

**Animations:**
- Floating mascot: `animate-float` (3s loop)
- Lime glow: `glow-lime` class
- Floating particles: Small colored circles with staggered delays

### Features.tsx  
**Layout:** 3-card grid with equal heights (380-420px)
- Background doodles: Pizza, burger, scissors with opacity 0.6-0.8
- Cards: White bg, 3px border, 16px radius, purple hard shadow

**Card Content:**
1. **Search Card:** `icon_search.png` + "Lokalny Radar" + lime badge
2. **Wallet Card:** `icon_wallet.png` + "Portfel bez śmieci" + "0 przeterminowanych kuponów"
3. **QR Card:** `icon_qr.png` + "Skanujesz i masz" + scan line animation

**Scan Line Animation:**
```css
@keyframes scan {
  0% { transform: translateY(-100%); }
  50% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
}
```

## Standard Components

### Navigation.tsx
**Features:**
- Fixed position, 72px height (desktop) / 64px (mobile)
- Logo: "PEDRO" text or `LOGO_white.png`
- Black pill navigation with smooth scroll links
- Mobile: Burger menu with slide-down
- Hover effects: Underline animation, button lift

### About.tsx
**Layout:** 2-column (desktop) / 1-column (mobile)
- H2: "Co to jest PEDRO?"
- 3 bullet points with checkmark icons
- Illustration: `Pedro_Thumbs_Up.png`
- Scroll reveal animations with stagger

### B2B.tsx
**Features:**
- Full lime background with purple diagonal (clip-path)
- 60/40 split: text / dashboard mockup
- Orbiting business icons: money, analytics, target
- Count-up animation: "1,234 transakcji dzisiaj"
- CTA button with arrow animation

### FAQ.tsx
**Implementation:**
```tsx
<details className="brutal-border rounded-card bg-white mb-4">
  <summary className="cursor-pointer p-6 font-bold flex justify-between">
    <span>Question text?</span>
    <span className="text-pedro-lime">+</span>
  </summary>
  <div className="px-6 pb-6">Answer text</div>
</details>
```

### Footer.tsx
**Elements:**
- Dark background with lime top border
- Logo with rotate hover effect
- Footer links with hover states
- Social icons with scale/rotate/glow effects
- Pedro Peeking corner with wave animation + hover speech bubble

## Animation Components

### Floating Elements
```tsx
// Usage in Hero
<div className="animate-float glow-lime will-animate">
  <Image src={mascots.raccoonPhone} />
</div>
```

### Scroll Reveals
```tsx
// Intersection Observer hook
const ref = useScrollReveal()
return <section ref={ref} className="scroll-reveal">
```

### 3D Tilt (Feature Cards)
```tsx
const { ref, handleMouseMove, handleMouseLeave } = useTilt3D()
return (
  <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
```

## State Management
**Local State Only:**
- Navigation: Mobile menu toggle
- Forms: Input values and validation
- Animations: Hover states and triggers

**No Global State:** All components are self-contained with props/children pattern

## Asset Integration
**Type-Safe Imports:**
```tsx
import { mascots, featureIcons, backgrounds } from '@/lib/assets'

// Usage
<Image src={mascots.raccoonPhone} />
<img src={featureIcons.search} />
```

**Asset Categories:**
- `backgrounds.*` - Hero section backgrounds
- `mascots.*` - Pedro character variants
- `featureIcons.*` - Main feature card icons
- `categoryIcons.*` - Background doodles
- `functionalIcons.*` - UI elements (arrows, checkmarks)
- `businessIcons.*` - B2B section icons
- `socialIcons.*` - Footer social media

## Performance Considerations
**Image Optimization:**
- Next.js Image component for mascots and large images
- Regular img tags for icons (smaller, numerous)
- Lazy loading for off-screen content

**Animation Performance:**
- `will-change` on animated elements
- CSS transforms over position changes
- Intersection Observer for scroll triggers
- Debounced scroll events

## Responsive Strategy
**Mobile-First Approach:**
- Base styles for mobile
- `md:` prefix for tablet/desktop
- Flexible layouts with CSS Grid/Flexbox
- Clamp() for fluid typography

**Key Breakpoints:**
- Hero: Stack on mobile, split on desktop
- Features: 1 column mobile, 3 columns desktop
- Navigation: Burger menu mobile, full nav desktop