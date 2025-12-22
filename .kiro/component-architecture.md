# Component Architecture & Implementation

## Component Organization
```
components/
├── auth/                  # Authentication components
│   ├── AuthShell.tsx      # Auth page layout wrapper
│   ├── AuthCard.tsx       # Main auth card with tabs
│   ├── LoginTab.tsx       # Login form with validation
│   ├── RegisterTab.tsx    # Registration form
│   └── ResetPasswordTab.tsx # Password reset form
├── business/              # Business management components
│   ├── BusinessForm.tsx   # 4-section business registration
│   ├── BusinessFormSection.tsx # Individual form sections
│   └── BillingCard.tsx    # Stripe billing management
├── ui/                    # Brutal design system
│   ├── BrutalButton.tsx   # Styled buttons with variants
│   ├── BrutalInput.tsx    # Form inputs with validation
│   ├── BrutalTabs.tsx     # Tab navigation component
│   ├── BrutalAlert.tsx    # Alert/notification component
│   ├── BrutalCard.tsx     # Card container component
│   └── ProgressIndicator.tsx # Multi-step progress bar
├── layout/
│   ├── Navigation.tsx     # Fixed top nav with auth state
│   ├── AuthNavigation.tsx # Auth-specific navigation
│   └── Footer.tsx         # Dark footer with Pedro Peeking
└── sections/              # Landing page sections
    ├── Hero.tsx           # 100vh split layout (CRITICAL: 1:1 design)
    ├── About.tsx          # 2-column with Pedro Thumbs Up
    ├── Features.tsx       # 3 cards with animations (CRITICAL: 1:1 design)
    ├── B2B.tsx            # Lime background with orbiting icons
    ├── SocialProof.tsx    # Testimonials and dream partners (UPDATED Dec 2024)
    ├── FAQ.tsx            # Accordion with brutal styling
    ├── Download.tsx       # Store badges repeat
    └── Contact.tsx        # Form with brutal inputs
```

## Auth System Components (NEW)

### AuthShell.tsx
**Purpose:** Layout wrapper for authentication pages
- Minimal navigation with logo and back button
- Centered content area with proper spacing
- Responsive design for mobile/desktop

### AuthCard.tsx
**Features:**
- Tab-based interface (Login, Register, Reset Password)
- Brutal design system styling
- Form state management with React Hook Form
- Real-time validation feedback
- Loading states and error handling

**Tab Structure:**
```tsx
<BrutalTabs defaultValue="login">
  <LoginTab />
  <RegisterTab />
  <ResetPasswordTab />
</BrutalTabs>
```

### LoginTab.tsx
**Form Fields:**
- Email with validation
- Password with show/hide toggle
- Remember me checkbox
- Submit with loading state

**Validation:**
```typescript
const schema = z.object({
  email: z.string().email('Nieprawidłowy email'),
  password: z.string().min(6, 'Hasło musi mieć min. 6 znaków'),
})
```

### RegisterTab.tsx
**Form Fields:**
- Email, password, confirm password
- Terms acceptance checkbox
- Real-time password strength indicator
- Firebase Auth integration

### ResetPasswordTab.tsx
**Features:**
- Email input with validation
- Firebase password reset integration
- Success/error state handling
- Return to login flow

## Business Management Components (NEW)

### BusinessForm.tsx
**Structure:** 4-section progressive form
1. **Company Data:** Name, NIP, industry
2. **Address:** Street, city, postal code
3. **Contact:** Phone, email, website
4. **Description:** Business description, services

**Features:**
- Section-by-section validation
- Progress indicator
- Save draft functionality
- Firestore integration

### BusinessFormSection.tsx
**Props Interface:**
```typescript
interface BusinessFormSectionProps {
  title: string
  description: string
  children: React.ReactNode
  isActive: boolean
  isCompleted: boolean
  onNext: () => void
  onPrevious: () => void
}
```

### BillingCard.tsx
**Features:**
- Current plan display
- Usage statistics
- Stripe Checkout integration
- Customer Portal access
- Payment method management

**Stripe Integration:**
```typescript
const handleCheckout = async () => {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId: 'price_xxx' })
  })
}
```

## Brutal UI System Components (NEW)

### BrutalButton.tsx
**Variants:**
- `default`: White background, black border
- `purple`: Purple background, white text
- `lime`: Lime background, black text
- `outline`: Transparent background, colored border

**Features:**
- Hard shadow effects
- Hover animations
- Loading states
- Icon support

### BrutalInput.tsx
**Features:**
- Consistent brutal styling
- Validation state indicators
- Error message display
- Label and placeholder support
- Password visibility toggle

### BrutalTabs.tsx
**Implementation:**
```tsx
<div className="brutal-tabs">
  <div className="tab-list">
    {tabs.map(tab => (
      <button className={`tab ${active ? 'active' : ''}`}>
        {tab.label}
      </button>
    ))}
  </div>
  <div className="tab-content">
    {activeContent}
  </div>
</div>
```

### BrutalAlert.tsx
**Types:**
- `success`: Green background, checkmark icon
- `error`: Red background, X icon
- `warning`: Yellow background, warning icon
- `info`: Blue background, info icon

### ProgressIndicator.tsx
**Features:**
- Multi-step progress visualization
- Completed/current/upcoming states
- Responsive design
- Smooth transitions

**Usage:**
```tsx
<ProgressIndicator 
  steps={['Company', 'Address', 'Contact', 'Description']}
  currentStep={2}
  completedSteps={[0, 1]}
/>
```

## Updated Navigation Components

### Navigation.tsx (UPDATED)
**New Features:**
- Auth state awareness
- Dynamic login/dashboard button
- User menu dropdown (when logged in)
- Logout functionality

**Auth Integration:**
```tsx
const { user } = useAuth()

const handleAuthClick = () => {
  if (user) {
    router.push('/dashboard')
  } else {
    router.push('/auth')
  }
}
```

### AuthNavigation.tsx (NEW)
**Purpose:** Simplified navigation for auth pages
- Logo only
- Back to home button
- Minimal design to focus on auth flow

## Critical Landing Page Components (Must Match Design 1:1)
## Critical Landing Page Components (Must Match Design 1:1)

### Hero.tsx ✅ TRANSPARENCY FIXED
**Layout:** 100vh height, 50/50 split
- Left: Text + store badges over `back_left_under_text.png`
- Right: `pedro_raccoon_phone.png` with **PERFECT TRANSPARENCY** over `back_right_under_phone.png`
- Divider: 2px solid #2D3436 between halves
- Navigation: Fixed top with logo, black pill nav, login button
- Scroll indicator: Bottom center with bounce animation

**BREAKTHROUGH:** Uses CSS background-image instead of Next.js Image for perfect transparency rendering.

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

### About.tsx ✅ TRANSPARENCY FIXED
**Layout:** 2-column (desktop) / 1-column (mobile)
- H2: "Co to jest PEDRO?"
- 3 bullet points with checkmark icons
- Illustration: `pedro_thumbs_up.png` with **PERFECT TRANSPARENCY**
- Scroll reveal animations with stagger

**FIXED:** Changed from Next.js Image to regular img tag for proper transparency rendering.

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

### SocialProof.tsx ✅ UPDATED Dec 2024
**Layout:** Testimonials + Dream Partners sections
- **Testimonials:** 3 future-focused testimonials with realistic pre-launch messaging
- **Partners:** 4-card responsive grid (1/2/4 columns) with emoji categories
- **Content Tone:** Honest pre-launch messaging instead of fake success stories
- **Animations:** Hover effects with lime shadows, scroll reveals

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