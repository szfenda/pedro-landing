# Implementation Plan: PEDRO Landing Page

## Goal Description

Create a modern, interactive one-page landing page for the PEDRO mobile app featuring Neo-Brutalism meets Digital Pop Art design aesthetic. The page must be visually stunning, highly interactive, fast-loading, and fully responsive.

**Key Requirements:**
- **Hero and Features sections must match provided screens 1:1** (exact layout, proportions, spacing)
- All remaining sections follow the same visual language and brand guidelines
- Use all 43 assets from `/assets/` folder (icons with backgrounds removed)
- Next.js 14+ with TypeScript and Tailwind CSS
- Premium UI/UX with rich animations and microinteractions
- Performance-optimized and accessible

---

## User Review Required

> [!IMPORTANT]
> **Asset Background Removal Required**
> All icon files (43 icons total) currently have backgrounds that need to be removed before implementation. This is critical for the proper neo-brutalism design aesthetic. The icons must have 100% transparent backgrounds.
> 
> **Approach:** Using Node.js script with image processing library to automatically remove backgrounds from all icons.

> [!WARNING]
> **Store Links are Placeholders**
> The App Store and Google Play download buttons will use `href="#"` placeholders since actual store URLs are not yet available. These will need to be updated before launch.

---

## Proposed Changes

All work will be organized into the following components and files:

### Project Setup & Infrastructure

#### [NEW] [package.json](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/package.json)
- Initialize Next.js 14+ project with TypeScript
- Install dependencies: `framer-motion`, `clsx`, `tailwind-merge`
- Configure scripts: `dev`, `build`, `start`, `lint`

#### [NEW] [next.config.js](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/next.config.js)
- Configure image optimization for assets
- Set up proper image domains and formats

#### [NEW] [tailwind.config.ts](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/tailwind.config.ts)
- Custom brand colors (purple, lime, pink, light, dark)
- Custom font families (headline/body)
- Custom shadows (brutal hard shadows)
- Custom animations (float, scan, wave, bounce)
- Breakpoints and spacing utilities

#### [NEW] [tsconfig.json](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/tsconfig.json)
- TypeScript configuration with path aliases
- Strict mode enabled for type safety

---

### Asset Organization

#### [NEW] `/public/assets/` folder structure
- Reorganize all 43 assets from `/assets/` into structured folders:
  - `images/backgrounds/` - Hero backgrounds (2 files)
  - `images/mascots/` - Pedro mascot variants (5 files)
  - `images/logos/` - Logo variants (4 files)
  - `images/patterns/` - Pattern textures (1 file)
  - `icons/features/` - Main feature icons (3 files)
  - `icons/categories/` - Category icons (5 files)
  - `icons/functional/` - UI element icons (6 files)
  - `icons/business/` - B2B section icons (4 files)
  - `icons/social/` - Social media icons (3 files)
  - `elements/` - Decorative elements (4 files)

#### [NEW] [src/lib/assets.ts](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/lib/assets.ts)
- TypeScript constants for all asset paths
- Type-safe asset references throughout codebase

---

### Core Styling & Design System

#### [NEW] [src/app/fonts.ts](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/app/fonts.ts)
- Load Google Fonts: Dela Gothic One, Archivo Black, Inter, Outfit
- Configure font variables for CSS

#### [NEW] [src/app/globals.css](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/app/globals.css)
- CSS custom properties (design tokens)
- Neo-brutalism utilities (hard shadows, brutal borders)
- Typography base styles
- Animation keyframes (float, scan, wave, bounce, orbit)
- Button and card base styles
- Input styles with brutal borders
- Scroll reveal animations
- Text effects (poster shadows, glow)
- Performance optimizations (`will-change`)
- Reduced motion media query

#### [NEW] [src/styles/animations.css](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/styles/animations.css)
- Advanced component-specific animations
- Parallax layers
- 3D tilt effects
- Ripple click effects
- Count-up animations
- Stagger children animations
- Orbit animations for floating icons

---

### Components - Layout

#### [NEW] [src/components/layout/Navigation.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/layout/Navigation.tsx)
- Fixed top navigation (72px desktop / 64px mobile)
- Logo (white) with hover effect
- Black pill navigation with smooth scroll links
- Login button with lime shadow hover
- Mobile burger menu (responsive)

#### [NEW] [src/components/layout/Footer.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/layout/Footer.tsx)
- Dark background with lime top border
- Logo with rotate hover effect
- Footer links (Regulamin, Polityka, Kontakt, Dla Biznesu)
- Social media icons with scale/rotate/glow effects
- "Made with 🍕 in Gdańsk" text
- Pedro Peeking corner element with wave animation + hover speech bubble

---

### Components - Sections

#### [NEW] [src/components/sections/Hero.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/sections/Hero.tsx)
**CRITICAL: Must match screen 1:1**
- 100vh height, 50/50 split layout
- Background images (left: text, right: phone)
- Vertical divider (2px solid dark)
- Left: 4-line heading with poster shadow + store badges (placeholder links)
- Right: Pedro mascot with floating animation + lime glow + parallax
- Floating decorative particles
- Scroll indicator with bounce animation

#### [NEW] [src/components/sections/About.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/sections/About.tsx)
- Section ID: `#o-nas`
- 2-column layout (text + illustration)
- Heading: "Co to jest PEDRO?"
- 3 benefit bullets with checkmark icons
- Pedro Thumbs Up illustration
- Scroll reveal animations

#### [NEW] [src/components/sections/Features.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/sections/Features.tsx)
**CRITICAL: Must match screen 1:1**
- Section ID: `#funkcje`
- 3-card grid with brutal styling
- Card 1: Search icon - "Lokalny Radar" + lime badge
- Card 2: Wallet icon - "Portfel bez śmieci" + "0 przeterminowanych kuponów"
- Card 3: QR icon - "Skanujesz i masz" + animated scan line
- Background doodles (pizza, burger, scissors)
- Hover effects: lift, shadow change, 3D tilt
- Equal card heights (380-420px)

#### [NEW] [src/components/sections/B2B.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/sections/B2B.tsx)
- Section ID: `#dla-biznesu`
- Full lime background with purple diagonal clip-path
- 60/40 split (text / dashboard mockup)
- Heading: "Masz lokalny biznes? Zatrudnij Pedra."
- Bullet list with stagger animation
- CTA button with arrow animation
- Orbiting business icons (money, analytics, target)
- Count-up animation: "1,234 transakcji dzisiaj"

#### [NEW] [src/components/sections/SocialProof.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/sections/SocialProof.tsx)
- Section ID: `#opinie`
- Partner logos grid (3 placeholders)
- Testimonial cards (2-3) with brutal styling
- Scroll reveal animations

#### [NEW] [src/components/sections/FAQ.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/sections/FAQ.tsx)
- Section ID: `#faq`
- 6-8 accordion items using `<details>/<summary>`
- Brutal border styling with hard shadows
- Plus/minus icon animation
- Keyboard navigation support
- Focus states with lime outline

#### [NEW] [src/components/sections/Download.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/sections/Download.tsx)
- Section ID: `#pobierz`
- Purple/pink gradient background
- Heading: "Pobierz PEDRO i poluj na promki"
- Store badges (same style as Hero, placeholder links)
- 3 benefit chips with lime background
- Optional Pedro smartphone illustration

#### [NEW] [src/components/sections/Contact.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/sections/Contact.tsx)
- Section ID: `#kontakt`
- Contact email placeholder
- Social media links
- Optional contact form (name, email, message)
- Brutal input styling with lime focus shadow
- Submit button with brand styling

---

### Components - UI Elements

#### [NEW] [src/components/ui/Button.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/ui/Button.tsx)
- Reusable button component with brutal styling
- Variants: purple, lime, dark
- Hover: lift + shadow change
- Active: scale down + ripple effect

#### [NEW] [src/components/ui/Card.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/ui/Card.tsx)
- Reusable card component
- White background, 3px dark border, hard shadow
- Hover effects: lift + shadow color change

#### [NEW] [src/components/ui/Input.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/ui/Input.tsx)
- Form input with brutal styling
- 3px border, lime shadow on focus

#### [NEW] [src/components/ui/Accordion.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/ui/Accordion.tsx)
- FAQ accordion component
- Animated expand/collapse
- Icon rotation

#### [NEW] [src/components/ui/Badge.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/ui/Badge.tsx)
- Pill-shaped badge component
- Variants: lime, purple, pink

#### [NEW] [src/components/ui/ScrollProgress.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/ui/ScrollProgress.tsx)
- Fixed top progress bar
- Lime color, updates on scroll

#### [NEW] [src/components/ui/MobileStickyCTA.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/ui/MobileStickyCTA.tsx)
- Bottom-fixed CTA on mobile
- Appears after scrolling past Hero
- "Pobierz PEDRO" button

#### [NEW] [src/components/ui/PedroPeeking.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/ui/PedroPeeking.tsx)
- Footer corner element
- Wave animation
- Hover: show speech bubble

---

### Components - Animations

#### [NEW] [src/components/animations/FloatingElement.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/animations/FloatingElement.tsx)
- Wrapper for floating animation
- Used for Hero mascot and particles

#### [NEW] [src/components/animations/ScrollReveal.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/animations/ScrollReveal.tsx)
- Wrapper for scroll-triggered reveals
- Fade + slide-up animation

#### [NEW] [src/components/animations/ScanLine.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/animations/ScanLine.tsx)
- Animated scan line for QR card
- Purple line, 3s loop animation

#### [NEW] [src/components/animations/ParallaxElement.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/animations/ParallaxElement.tsx)
- Parallax scroll effect wrapper
- Configurable speed

#### [NEW] [src/components/animations/CountUp.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/components/animations/CountUp.tsx)
- Number counter animation
- Triggers on scroll into view

---

### Hooks & Utilities

#### [NEW] [src/hooks/useScrollReveal.ts](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/hooks/useScrollReveal.ts)
- IntersectionObserver hook for scroll animations
- Adds 'revealed' class when element in viewport

#### [NEW] [src/hooks/useTilt3D.ts](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/hooks/useTilt3D.ts)
- 3D tilt effect on mouse move
- Used for feature cards

#### [NEW] [src/lib/smooth-scroll.ts](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/lib/smooth-scroll.ts)
- Smooth scroll to anchor utility
- Used for navigation links

#### [NEW] [src/lib/utils.ts](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/lib/utils.ts)
- General utility functions (clsx, cn, etc.)

---

### Main Application Files

#### [NEW] [src/app/layout.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/app/layout.tsx)
- Root layout with font providers
- HTML lang="pl"
- Meta tags for SEO

#### [NEW] [src/app/page.tsx](file:///c:/APP/PEDRO%20react%20native/Pedro%20BOLT/PEDRO_landing/src/app/page.tsx)
- Main landing page
- Assembles all section components
- Includes Navigation, Footer, ScrollProgress, MobileStickyCTA

---

## Implementation Order

All implementation will follow this systematic approach:

### Stage 1: Foundation (Day 1)
1. ✅ Create technical documentation (COMPLETED)
2. Initialize Next.js project
3. Set up Tailwind with custom theme
4. Configure fonts
5. Create global CSS with neo-brutalism system

### Stage 2: Asset Preparation (Day 1-2)
1. Reorganize assets into folder structure
2. Remove backgrounds from all icons (43 files) using Node.js
3. Optimize images for web
4. Create asset constants file
5. Verify all assets load correctly

### Stage 3: Core Components (Day 2-3)
1. Build Navigation component
2. Build Footer component
3. Build reusable UI components (Button, Card, Input, Badge)
4. Build animation components

### Stage 4: Section Components (Day 3-5)
1. Build Hero section (CRITICAL: 1:1 match)
2. Build About section
3. Build Features section (CRITICAL: 1:1 match)
4. Build B2B section
5. Build Social Proof section
6. Build FAQ section
7. Build Download section
8. Build Contact section

### Stage 5: Global Features (Day 5)
1. Implement smooth scroll
2. Add scroll progress bar
3. Add mobile sticky CTA
4. Implement scroll reveal animations
5. Add parallax effects

### Stage 6: Polish & Optimization (Day 6)
1. Responsive design refinement
2. Animation performance tuning
3. Accessibility improvements
4. SEO optimization

### Stage 7: Testing (Day 6-7)
1. Visual verification
2. Interaction testing
3. Responsive testing
4. Performance testing
5. Cross-browser testing
6. Accessibility testing

### Stage 8: Final Review (Day 7)
1. User acceptance testing
2. Create walkthrough documentation
3. Final adjustments based on feedback
