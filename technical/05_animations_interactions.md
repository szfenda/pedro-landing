# Animations & Interactions Guide

This guide covers all animations, interactions, and dynamic effects for the PEDRO landing page.

---

## Table of Contents
1. [Global Interactions](#1-global-interactions)
2. [Scroll Animations](#2-scroll-animations)
3. [Component-Specific Animations](#3-component-specific-animations)
4. [Performance Optimization](#4-performance-optimization)

---

## 1. Global Interactions

### 1.1 Smooth Scroll

**Implementation:** `src/lib/smooth-scroll.ts`

```typescript
export function smoothScrollTo(targetId: string) {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Alternative: Use CSS (in globals.css)
// html { scroll-behavior: smooth; }
```

**Usage:**
- Apply to all navigation links
- Scroll indicator in Hero
- All anchor links throughout page

### 1.2 Scroll Progress Bar

**File:** `src/components/ui/ScrollProgress.tsx`

```typescript
'use client'
import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-pedro-lime z-[9999] transition-all duration-150"
      style={{ width: `${scrollProgress}%` }}
    />
  )
}
```

**Features:**
- Fixed at top of viewport
- Lime green color (#CCFF00)
- Height: 4px
- z-index: 9999 (above everything)
- Smooth transition

### 1.3 Mobile Sticky CTA

**File:** `src/components/ui/MobileStickyCTA.tsx`

```typescript
'use client'
import { useEffect, useState } from 'react'

export default function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past Hero section
      const heroSection = document.getElementById('top')
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom
        setIsVisible(heroBottom < 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-pedro-purple border-t-3 border-pedro-dark md:hidden z-50">
      <button className="btn-brutal btn-brutal-lime w-full">
        Pobierz PEDRO
      </button>
    </div>
  )
}
```

**Features:**
- Mobile only (hidden on desktop: `md:hidden`)
- Appears after scrolling past Hero
- Bottom-fixed position
- Full-width button
- Lime CTA style

---

## 2. Scroll Animations

### 2.1 Intersection Observer Setup

**File:** `src/hooks/useScrollReveal.ts`

```typescript
'use client'
import { useEffect, useRef } from 'react'

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return ref
}
```

**Usage:**
```tsx
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function About() {
  const ref = useScrollReveal()
  
  return (
    <section ref={ref} className="scroll-reveal">
      {/* Content */}
    </section>
  )
}
```

### 2.2 Stagger Animation

**CSS:** Already in `globals.css` (`.stagger-children`)

**Usage:**
```tsx
<div className="stagger-children">
  <div>Item 1</div> {/* Delay: 0.1s */}
  <div>Item 2</div> {/* Delay: 0.2s */}
  <div>Item 3</div> {/* Delay: 0.3s */}
</div>
```

**Example:** About section bullets, B2B bullet list

---

## 3. Component-Specific Animations

### 3.1 Floating Animation (Hero Mascot)

**CSS:** Already defined in `globals.css`

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
```

**Usage:**
```tsx
<Image 
  src="/assets/images/mascots/pedro_raccoon_phone.png"
  className="animate-float"
  alt="Pedro mascot"
/>
```

**Parameters:**
- Duration: 3s
- Easing: ease-in-out
- Loop: infinite

### 3.2 Scan Line Animation (Features Card 3)

**File:** `src/components/animations/ScanLine.tsx`

```typescript
export default function ScanLine() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className="absolute left-0 w-full h-[3px] bg-pedro-purple animate-scan"
        style={{ 
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  )
}
```

**CSS:**
```css
@keyframes scan {
  0% { transform: translateY(-100%); }
  50% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
}

.animate-scan {
  animation: scan 3s ease-in-out infinite;
}
```

**Usage in Features Card 3:**
```tsx
<div className="relative">
  <Image src="/assets/icons/features/icon_qr.png" alt="QR" />
  <ScanLine />
</div>
```

### 3.3 Parallax Effect

**File:** `src/components/animations/ParallaxElement.tsx`

```typescript
'use client'
import { useEffect, useRef } from 'react'

interface ParallaxProps {
  children: React.ReactNode
  speed?: number // 0.5 = half speed, 2 = double speed
}

export default function ParallaxElement({ children, speed = 0.5 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrolled = window.scrollY
        const elementTop = ref.current.offsetTop
        const offset = (scrolled - elementTop) * speed
        ref.current.style.transform = `translateY(${offset}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={ref} className="parallax-layer will-change-transform">
      {children}
    </div>
  )
}
```

**Usage:**
```tsx
<ParallaxElement speed={0.3}>
  <Image src="/path/to/image" />
</ParallaxElement>
```

### 3.4 Orbiting Icons (B2B Section)

**CSS:**
```css
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

**Usage:**
```tsx
<div className="relative w-64 h-64">
  <Image 
    src="/assets/icons/business/icon_money.png"
    className="orbit-icon absolute"
    style={{ animationDelay: '0s' }}
  />
  <Image 
    src="/assets/icons/business/icon_analytics.png"
    className="orbit-icon absolute"
    style={{ animationDelay: '2.67s' }}
  />
  <Image 
    src="/assets/icons/business/icon_target.png"
    className="orbit-icon absolute"
    style={{ animationDelay: '5.33s' }}
  />
</div>
```

### 3.5 Count-Up Animation

**File:** `src/components/animations/CountUp.tsx`

```typescript
'use client'
import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  end: number
  duration?: number // milliseconds
  start?: number
}

export default function CountUp({ end, duration = 2000, start = 0 }: CountUpProps) {
  const [count, setCount] = useState(start)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true)
          
          const increment = (end - start) / (duration / 16) // 60fps
          let current = start
          
          const timer = setInterval(() => {
            current += increment
            if (current >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, 16)
          
          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, start, duration, hasStarted])

  return <span ref={ref} className="font-bold">{count.toLocaleString('pl-PL')}</span>
}
```

**Usage:**
```tsx
<p>
  <CountUp end={1234} /> transakcji dzisiaj
</p>
```

### 3.6 Wave Animation (Pedro Peeking)

**CSS:** Already defined in `globals.css`

```css
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
}

.animate-wave {
  animation: wave 5s ease-in-out infinite;
}
```

**Usage:**
```tsx
<Image 
  src="/assets/images/mascots/pedro_peeking.png"
  className="animate-wave"
  alt="Pedro peeking"
/>
```

### 3.7 Hover Speech Bubble (Pedro Peeking)

**File:** `src/components/ui/PedroPeeking.tsx`

```typescript
'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function PedroPeeking() {
  const [showBubble, setShowBubble] = useState(false)

  return (
    <div 
      className="absolute bottom-0 right-8"
      onMouseEnter={() => setShowBubble(true)}
      onMouseLeave={() => setShowBubble(false)}
    >
      <Image 
        src="/assets/images/mascots/pedro_peeking.png"
        width={120}
        height={150}
        alt="Pedro peeking"
        className="animate-wave cursor-pointer transition-transform hover:translate-y-[-10px]"
      />
      
      {showBubble && (
        <div className="absolute bottom-full right-0 mb-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white brutal-border rounded-card px-4 py-2 shadow-brutal-sm-lime">
            <p className="text-sm font-bold">Do zobaczenia! 👋</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 3.8 3D Tilt Effect (Feature Cards)

**File:** `src/hooks/useTilt3D.ts`

```typescript
'use client'
import { useRef } from 'react'

export function useTilt3D(maxTilt = 10) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * maxTilt
    const rotateY = ((x - centerX) / centerX) * -maxTilt

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    }
  }

  return { ref, handleMouseMove, handleMouseLeave }
}
```

**Usage:**
```tsx
import { useTilt3D } from '@/hooks/useTilt3D'

export default function FeatureCard() {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt3D()

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="card-brutal transition-transform duration-300"
    >
      {/* Card content */}
    </div>
  )
}
```

### 3.9 Click Ripple Effect

**Implementation:** Already in `animations.css`

```css
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
```

**Usage:**
```tsx
<button className="btn-brutal ripple">
  Click me
</button>
```

---

## 4. Performance Optimization

### 4.1 `will-change` Property

**Apply to animated elements:**

```css
.will-animate {
  will-change: transform, opacity;
}
```

**Usage:**
- Floating elements
- Parallax layers
- Cards with hover effects
- Scrolling elements

**Important:** Remove `will-change` after animation completes to free memory.

### 4.2 Lazy Loading

**Images:**
```tsx
<Image 
  src="/path/to/image.png"
  loading="lazy"  // Native lazy loading
  alt="Description"
/>
```

**Components:**
```tsx
import dynamic from 'next/dynamic'

const B2BSection = dynamic(() => import('@/components/sections/B2B'), {
  loading: () => <div>Loading...</div>,
  ssr: false // If component has client-side only features
})
```

### 4.3 Debounce Scroll Events

```typescript
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Usage:
useEffect(() => {
  const handleScroll = debounce(() => {
    // Scroll logic here
  }, 16) // ~60fps

  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

### 4.4 Reduced Motion

**Respect user preferences:**

```css
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

## Animation Summary

### Hero Section
- ✅ Floating mascot (3s loop)
- ✅ Parallax background layers
- ✅ Glow effect on mascot
- ✅ Floating particles (small circles/shapes)
- ✅ Bounce scroll indicator

### Features Section
- ✅ Scroll reveal (fade + slide-up)
- ✅ Card hover (lift + shadow change)
- ✅ 3D tilt on mouse move
- ✅ Scan line (Card 3, QR icon)

### B2B Section
- ✅ Stagger bullets animation
- ✅ Orbiting icons (8s loop)
- ✅ Count-up number animation
- ✅ CTA arrow slide on hover

### Footer
- ✅ Pedro wave animation (5s loop)
- ✅ Speech bubble on hover
- ✅ Social icon scale + rotate + glow
- ✅ Logo rotate on hover

### Global
- ✅ Smooth scroll
- ✅ Scroll progress bar
- ✅ Mobile sticky CTA
- ✅ Ripple on button click
- ✅ All scroll-triggered reveals

---

## Testing Animations

1. **Visual testing:**
   - Run dev server: `npm run dev`
   - Check each animation plays correctly
   - Verify timing and smoothness
   - Test on different screen sizes

2. **Performance testing:**
   - Chrome DevTools > Performance tab
   - Record while scrolling
   - Check for 60fps
   - Look for layout thrashing

3. **Accessibility testing:**
   - Test with `prefers-reduced-motion` enabled
   - Ensure keyboard navigation works
   - Verify focus states are visible

4. **Browser testing:**
   - Test on Chrome, Firefox, Safari
   - Test on mobile browsers
   - Check for vendor prefix needs

---

## Next Steps

✅ All animations documented → Ready for implementation
