# Component Development Guide

This guide provides step-by-step implementation instructions for all components of the PEDRO landing page.

---

## Table of Contents
1. [Navigation Component](#1-navigation-component)
2. [Hero Section](#2-hero-section)
3. [About Section](#3-about-section)
4. [Features Section](#4-features-section)
5. [B2B Section](#5-b2b-section)
6. [Social Proof Section](#6-social-proof-section)
7. [FAQ Section](#7-faq-section)
8. [Download Section](#8-download-section)
9. [Contact Section](#9-contact-section)
10. [Footer Component](#10-footer-component)

---

## 1. Navigation Component

**File:** `src/components/layout/Navigation.tsx`

### Requirements
- Height: 72px (desktop) / 64px (mobile)
- Left: PEDRO logo (white) or logo image
- Center: Black pill navigation with links (O nas, Funkcje, Pobierz, Kontakt)
- Right: "Log in" button/pill
- Smooth scroll to anchor sections
- Hover effects on links and button

### Implementation Steps

1. **Create base structure:**
   ```tsx
   export default function Navigation() {
     return (
       <nav className="fixed top-0 left-0 right-0 z-50 h-18 md:h-20">
         {/* Logo */}
         {/* Navigation links */}
         {/* Login button */}
       </nav>
     )
   }
   ```

2. **Add logo:**
   - Use Next.js Image component
   - Load `logo_white.png` from assets
   - Fallback to text "PEDRO" if image not found

3. **Create navigation links:**
   - Links: "O nas" (#o-nas), "Funkcje" (#funkcje), "Pobierz" (#pobierz), "Kontakt" (#kontakt)
   - Implement smooth scroll behavior
   - Black pill background (`bg-pedro-dark rounded-full`)
   - White text with hover underline animation

4. **Add login button:**
   - Separate pill on right side
   - Hover: lift + lime shadow
   - Uses `.btn-brutal` class

5. **Make responsive:**
   - Mobile: burger menu or simplified layout
   - Tablet: compact version
   - Desktop: full layout

### Key Styles
- Background: Transparent or subtle blur
- Black pill: `bg-pedro-dark rounded-full px-8 py-3`
- Link spacing: `gap-6`
- Hover: `hover:text-pedro-lime transition-colors`

---

## 2. Hero Section

**File:** `src/components/sections/Hero.tsx`

### Requirements (CRITICAL - Must match screen 1:1)
- 100vh height
- 50/50 split (left: text, right: visual)
- Vertical divider: 2px solid #2D3436
- Left BG: `back_left_under_text.png`
- Right BG: `back_right_under_phone.png`
- H1 text in 4 lines (specific wording)
- Store badges (App Store, Google Play)
- Main visual: `pedro_raccoon_phone.png` with floating animation
- Scroll indicator at bottom

### Implementation Steps

1. **Create section structure:**
   ```tsx
   export default function Hero() {
     return (
       <section id="top" className="relative h-screen flex">
         {/* Left half */}
         {/* Divider */}
         {/* Right half */}
         {/* Scroll indicator */}
       </section>
     )
   }
   ```

2. **Left half (text + CTA):**
   - Background: `url('/assets/images/backgrounds/back_left_under_text.png')`
   - Container: center content vertically
   - H1 with exact text:
     ```
     PEDRO NIE
     PRZEPŁACA.
     PEDRO POLUJE
     NA PROMKI
     ```
   - Font: `font-headline text-hero text-white`
   - Text shadow: `.text-poster-shadow`
   - Line height: 0.95-1.0
   - Letter spacing: -0.02em

3. **Store badges (CTA):**
   - Two buttons: "App Store" and "Google Play"
   - Style: Black background, white text/icons
   - Border radius: 12px
   - Min-height: 52px
   - Gap between: 16px
   - Lime accent: hard shadow or outline in #CCFF00
   - Hover: `translateY(-6px)` + lime shadow
   - Active: `scale(0.98)`
   - **Important:** Use `href="#"` as placeholder (no real links yet)
   - Add `aria-label` for accessibility

4. **Right half (visual):**
   - Background: `url('/assets/images/backgrounds/back_right_under_phone.png')`
   - Center `pedro_raccoon_phone.png`
   - Add floating animation: `animate-float`
   - Add lime glow: `.glow-lime`
   - Add parallax effect on scroll
   - Add 3-4 small floating shapes (lime/pink/purple circles/squares) in background

5. **Divider:**
   - Vertical line: `w-0.5 bg-pedro-dark h-full`
   - Between two halves

6. **Scroll indicator:**
   - Position: absolute bottom center
   - Circular button: 44px diameter
   - Border: 3px dark
   - Hard shadow: purple or lime
   - Bounce animation: `animate-bounce-slow`
   - Click → scroll to `#funkcje`
   - Icon: Down arrow

### Key Animations
- Float: `animate-float` (3s ease-in-out infinite)
- Glow: `glow-lime` (0 0 40px rgba(204,255,0,0.4))
- Parallax: Move slower on scroll

---

## 3. About Section

**File:** `src/components/sections/About.tsx`

### Requirements
- Section ID: `#o-nas`
- Background: Light `#F7F9FC`
- 2-column layout (desktop), 1-column (mobile)
- Container: 1200px max-width
- Padding: 96-120px top/bottom
- H2: "Co to jest PEDRO?"
- 2-3 sentences placeholder text
- 3 mini-bullets with check icons
- Illustration: `pedro_thumbs_up.png`

### Implementation Steps

1. **Create section:**
   ```tsx
   export default function About() {
     return (
       <section id="o-nas" className="bg-pedro-light py-section">
         <div className="container-pedro">
           {/* Grid: 2 columns */}
         </div>
       </section>
     )
   }
   ```

2. **Left column (text):**
   - H2: "Co to jest PEDRO?"
   - Font: `font-headline text-h2`
   - Placeholder copy (2-3 sentences about PEDRO)
   - 3 benefits list with checkmarks:
     - "Lokalnie (Twoja dzielnica)"
     - "Bez spamu (tylko realne promki)"
     - "Szybko przy kasie (skanujesz i masz)"
   - Use `icon_checkmark.png` for bullets
   - Checkmark size: ~24px
   - Gap between items: 16px

3. **Right column (illustration):**
   - Image: `pedro_thumbs_up.png`
   - Centered in column
   - Max-width: 80% of column
   - Add subtle hover effect (micro-tilt or bounce)

4. **Scroll reveal animation:**
   - Add `.scroll-reveal` class
   - Trigger reveal when in viewport (IntersectionObserver)
   - Stagger bullets animation

### Key Styles
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-12`
- Benefits list: `flex flex-col gap-4`
- Checkmark: `w-6 h-6 mr-3`

---

## 4. Features Section

**File:** `src/components/sections/Features.tsx`

### Requirements (CRITICAL - Must match screen 1:1)
- Section ID: `#funkcje`
- Background: `#F7F9FC` or white with subtle gradient
- 3 cards in grid (desktop) / stacked (mobile)
- Each card:
  - White background
  - Border: 3px solid #2D3436
  - Border radius: 16px
  - Hard shadow: 10px 10px 0 purple
  - Min-height: 380-420px (equal height)
  - Padding: 32-40px
- Card icons:
  - Card 1: `icon_search.png` (Lokalny Radar)
  - Card 2: `icon_wallet.png` (Portfel bez śmieci)
  - Card 3: `icon_qr.png` (Skanujesz i masz)
- Icon size: ~96-120px
- Hover: translateY(-8px), shadow → lime, subtle 3D tilt

### Implementation Steps

1. **Create section:**
   ```tsx
   export default function Features() {
     return (
       <section id="funkcje" className="bg-pedro-light py-section relative">
         {/* Background doodles (pizza, burger, scissors) */}
         <div className="container-pedro">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Card 1 */}
             {/* Card 2 */}
             {/* Card 3 */}
           </div>
         </div>
       </section>
     )
   }
   ```

2. **Background doodles:**
   - Position: absolute
   - Opacity: 0.6-0.8
   - Use category icons (pizza, burger, scissors)
   - Scattered around section
   - z-index: 0 (behind cards)

3. **Card 1 - Lokalny Radar:**
   - Icon: `icon_search.png` at top, centered
   - Title (2 lines):
     ```
     Lokalny
     Radar
     ```
   - Badge: Lime (`bg-pedro-lime`) with placeholder text
   - Padding: 32-40px
   - Class: `.card-brutal`

4. **Card 2 - Portfel:**
   - Icon: `icon_wallet.png`
   - Title (2 lines):
     ```
     Portfel
     bez śmieci
     ```
   - Text line: "**0** przeterminowanych kuponów" (0 in bold)

5. **Card 3 - Skanujesz:**
   - Icon: `icon_qr.png`
   - Title (2 lines):
     ```
     Skanujesz
     i masz
     ```
   - **Scan line animation:**
     - Purple horizontal line
     - Animates top to bottom through QR icon
     - Animation: `animate-scan` (3s loop)
     - Position: absolute, width: 100%, height: 3px
     - Color: `bg-pedro-purple`

6. **Hover effects:**
   - Transform: `hover:-translate-y-2`
   - Shadow change: `hover:shadow-brutal-lime`
   - 3D tilt: Add subtle CSS 3D transform on mouse move
   - Focus ring: Lime for accessibility

### Key Styles
- Grid: `grid-cols-1 md:grid-cols-3 gap-8`
- Card: `.card-brutal` + custom min-height
- Icon container: `flex justify-center mb-6`
- Title: `font-headline text-h3 text-center`

---

## 5. B2B Section

**File:** `src/components/sections/B2B.tsx`

### Requirements
- Section ID: `#dla-biznesu`
- Background: Full lime `#CCFF00`
- Diagonal split: Purple triangle in corner (clip-path)
- 60/40 split: text / illustration
- H2: "Masz lokalny biznes? Zatrudnij Pedra."
- Bullet list with checkmarks (stagger animation)
- CTA button: "Dodaj swoją firmę →"
- Right side: Dashboard mockup (placeholder)
- Orbiting icons: 💰 📊 🎯 (using business icons)
- Count-up: "1,234 transakcji dzisiaj"
- Mini testimonial slider (optional)

### Implementation Steps

1. **Create section with clip-path:**
   ```tsx
   export default function B2B() {
     return (
       <section id="dla-biznesu" className="relative bg-pedro-lime py-section">
         {/* Purple diagonal */}
         <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-pedro-purple"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}>
         </div>
         
         {/* Content */}
       </section>
     )
   }
   ```

2. **Left column (text + CTA):**
   - H2: "Masz lokalny biznes? Zatrudnij Pedra."
   - Copy: Placeholder text about B2B benefits
   - Bullet list:
     - Use `icon_checkmark.png`
     - 3-4 benefits
     - Stagger animation on scroll reveal
   - CTA button:
     - Text: "Dodaj swoją firmę →"
     - Purple background, white text
     - Border: 3px dark
     - Hard shadow: dark
     - Hover: jump + arrow animation
     - Arrow: animate slide-right on hover

3. **Right column (dashboard):**
   - Placeholder dashboard image or mockup
   - Could use gradient rectangle with chart icons
   - Add floating/orbiting icons:
     - `icon_money.png`
     - `icon_analytics.png`
     - `icon_target.png`
   - Use `.orbit-icon` animation (8s loop)

4. **Count-up number:**
   - Position: above or below dashboard
   - Text: "1,234 transakcji dzisiaj"
   - Animate count from 0 to 1234 on scroll into view
   - Use `.animate-count-up`

5. **Optional testimonial slider:**
   - Mini card with quote
   - Auto-rotate every 5s
   - Simple fade transition

### Key Animations
- Stagger bullets: `.stagger-children`
- Orbit icons: `.orbit-icon`
- Count-up: JavaScript counter animation

---

## 6. Social Proof Section

**File:** `src/components/sections/SocialProof.tsx`

### Requirements
- Section ID: `#opinie`
- Light background
- 3 partner logos (placeholder)
- 2-3 testimonial cards
- Cards: brutal border + hard shadow
- Scroll animations

### Implementation Steps

1. **Create section:**
   ```tsx
   export default function SocialProof() {
     return (
       <section id="opinie" className="bg-white py-section">
         <div className="container-pedro">
           {/* Partner logos */}
           {/* Testimonials */}
         </div>
       </section>
     )
   }
   ```

2. **Partner logos:**
   - H3: "Zaufali nam" or similar
   - Grid: 3 columns
   - Placeholder logo images or text
   - Grayscale filter + hover color
   - Gap: 32px

3. **Testimonials:**
   - Grid: 1 column (mobile) / 2-3 columns (desktop)
   - Each card:
     - Quote text
     - Author name + photo (optional)
     - Rating stars (optional)
     - Class: `.card-brutal`
   - Scroll reveal animation
   - Stagger appearance

### Key Styles
- Logo grid: `grid grid-cols-3 gap-8`
- Testimonials: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

---

## 7. FAQ Section

**File:** `src/components/sections/FAQ.tsx`

### Requirements
- Section ID: `#faq`
- 6-8 questions (placeholder)
- Accordion: `<details>` / `<summary>`
- Brutal border + hard shadow
- Plus/minus icon animation
- Keyboard navigation support
- Focus states

### Implementation Steps

1. **Create section:**
   ```tsx
   export default function FAQ() {
     return (
       <section id="faq" className="bg-pedro-light py-section">
         <div className="container-pedro max-w-3xl">
           <h2>Często zadawane pytania</h2>
           {/* Accordion items */}
         </div>
       </section>
     )
   }
   ```

2. **Accordion item:**
   ```tsx
   <details className="brutal-border rounded-card bg-white mb-4">
     <summary className="cursor-pointer p-6 font-bold flex justify-between items-center">
       <span>Question text?</span>
       <span className="text-pedro-lime">+</span>
     </summary>
     <div className="px-6 pb-6">
       Answer text here.
     </div>
   </details>
   ```

3. **Plus/minus animation:**
   - Use CSS `details[open] summary span { content: '-'; }`
   - Or JS to toggle icon
   - Rotate animation on open/close

4. **Keyboard navigation:**
   - Native `<details>` supports keyboard
   - Ensure focus styles visible
   - Focus: lime outline

### Sample Questions (Placeholder)
1. Jak działa PEDRO?
2. Czy aplikacja jest darmowa?
3. Jak dodać kupon do portfela?
4. Czy mogę korzystać offline?
5. Jak mogę dodać swoją firmę?
6. Czy PEDRO jest dostępne poza Polską?

---

## 8. Download Section

**File:** `src/components/sections/Download.tsx`

### Requirements
- Section ID: `#pobierz`
- Background: Light or purple gradient
- H2: "Pobierz PEDRO i poluj na promki"
- Store badges (same as Hero)
- 3 benefit chips/badges in lime
- Optional: `pedro_smartphone.png` as accent

### Implementation Steps

1. **Create section:**
   ```tsx
   export default function Download() {
     return (
       <section id="pobierz" className="bg-gradient-to-br from-pedro-purple to-pedro-pink py-section">
         <div className="container-pedro text-center">
           {/* Heading */}
           {/* Store badges */}
           {/* Benefit chips */}
           {/* Optional Pedro illustration */}
         </div>
       </section>
     )
   }
   ```

2. **Heading:**
   - H2: "Pobierz PEDRO i poluj na promki"
   - Color: White
   - Center aligned

3. **Store badges:**
   - Repeat from Hero section
   - Same styling and placeholders
   - Center aligned

4. **Benefit chips:**
   - 3 badges with lime background
   - Text examples:
     - "100% za darmo"
     - "Bez reklam"
     - "Zawsze aktualne"
   - Horizontal layout
   - Gap: 12px
   - Class: Pill shape with border

5. **Optional illustration:**
   - If layout allows, add `pedro_smartphone.png` on side
   - Subtle animation

---

## 9. Contact Section

**File:** `src/components/sections/Contact.tsx`

### Requirements
- Section ID: `#kontakt`
- Simple layout
- Email (placeholder)
- Social links (placeholder)
- Optional mini form: name, email, message
- Inputs: brutal style (border 3px + hard shadow)
- Focus: lime shadow
- CTA button: "Wyślij"

### Implementation Steps

1. **Create section:**
   ```tsx
   export default function Contact() {
     return (
       <section id="kontakt" className="bg-white py-section">
         <div className="container-pedro max-w-2xl">
           <h2 className="text-center mb-12">Skontaktuj się</h2>
           {/* Contact info */}
           {/* Form */}
         </div>
       </section>
     )
   }
   ```

2. **Contact info:**
   - Email: `[YOUR_EMAIL]` (placeholder)
   - Social: Instagram, TikTok, Facebook icons
   - Links styled with hover effects

3. **Form (optional):**
   ```tsx
   <form className="space-y-6">
     <input type="text" placeholder="Imię" className="input-brutal" />
     <input type="email" placeholder="Email" className="input-brutal" />
     <textarea placeholder="Wiadomość" className="input-brutal" rows={5} />
     <button type="submit" className="btn-brutal btn-brutal-lime">
       Wyślij
     </button>
   </form>
   ```

4. **Input styling:**
   - Class: `.input-brutal`
   - Border: 3px dark
   - Focus: lime shadow (6px 6px 0)
   - Padding: 14px 18px

---

## 10. Footer Component

**File:** `src/components/layout/Footer.tsx`

### Requirements
- Background: `#2D3436` (dark)
- Border-top: 4px lime
- Logo: PEDRO (hover: lime + rotate 5°)
- Links: Regulamin | Polityka Prywatności | Kontakt | Dla Biznesu
- Social icons: lime, hover: scale + rotate + glow
- Text: "Made with 🍕 in Gdańsk"
- Corner: `pedro_peeking.png` with wave animation + hover dymek

### Implementation Steps

1. **Create footer:**
   ```tsx
   export default function Footer() {
     return (
       <footer className="bg-pedro-dark border-t-4 border-pedro-lime py-12 relative">
         <div className="container-pedro">
           {/* Logo */}
           {/* Links */}
           {/* Social */}
           {/* Copyright */}
         </div>
         {/* Pedro Peeking */}
       </footer>
     )
   }
   ```

2. **Logo:**
   - White logo
   - Hover: `text-pedro-lime rotate-[5deg]`
   - Transition: smooth

3. **Footer links:**
   - Horizontal list (desktop) / vertical (mobile)
   - Separator: `|` between links
   - Color: Gray, hover: lime

4. **Social icons:**
   - Use `icon_instagram.png`, `icon_tiktok.png`, `icon_facebook.png`
   - Size: 32px
   - Lime filter or color
   - Hover: `scale-110 rotate-[5deg] glow-lime`

5. **Pedro Peeking:**
   - Position: `absolute bottom-0 right-8`
   - Image: `pedro_peeking.png`
   - Animation: `animate-wave` (5s loop)
   - Hover: Show speech bubble with text ("Cześć!" or "Do zobaczenia!")
   - Speech bubble position: above Pedro
   - z-index: 10

6. **Copyright text:**
   - Center aligned
   - Small text
   - "Made with 🍕 in Gdańsk"
   - Color: gray

### Key Styles
- Links: `flex gap-4 items-center`
- Social: `flex gap-6 justify-center`

---

## Next Steps

After implementing all components:
1. Assemble them in main page (`src/app/page.tsx`)
2. Test each section individually
3. Verify all anchor links work
4. Test responsive behavior
5. Add global scroll animations
6. Performance optimization

---

## Component Import Example

**File:** `src/app/page.tsx`

```tsx
import Navigation from '@/components/layout/Navigation'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Features from '@/components/sections/Features'
import B2B from '@/components/sections/B2B'
import SocialProof from '@/components/sections/SocialProof'
import FAQ from '@/components/sections/FAQ'
import Download from '@/components/sections/Download'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Features />
        <B2B />
        <SocialProof />
        <FAQ />
        <Download />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```
