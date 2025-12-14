# Asset Preparation Guide

## Overview
This guide details how to prepare all assets from the `/assets/` folder for use in the PEDRO landing page.

## Asset Inventory

### ✅ Available Assets (from /assets/)

#### Backgrounds
- `back_left_under_text.png` - Hero left background
- `back_right_under_phone.png` - Hero right background

#### Mascots
- `pedro_raccoon_phone.png` - Main hero visual (raccoon + phone)
- `Pedro_Thumbs_Up.png` - About section illustration
- `Pedro_with_smartphone_in_one_hand.png` - Optional accent (Download/Contact)
- `Pedro_Peeking.png` - Footer corner element
- `1.3Pedro Hunting.png` - Available for preloader (if needed)

#### Logos
- `LOGO_white.png` - Navigation logo
- `10.1_LOGO_MAIN.png` - Main logo variant
- `10.2_icon.png` - Icon-only logo
- `10.3_transparent.png` - Transparent logo variant

#### Feature Icons
- `icon_search.png` - **Features Card 1: "Lokalny Radar"**
- `icon_wallet.png` - **Features Card 2: "Portfel bez śmieci"**
- `icon_qr.png` - **Features Card 3: "Skanujesz i masz"**

#### Category Icons
- `2.1 Ikona Pizza.png` → icon_pizza.png
- `2.2 Ikona Burger.png` → icon_burger.png
- `2.3 Ikona DrinkNapój.png` → icon_drink.png
- `2.4 Ikona Nożyczki (Fryzjer).png` → icon_scissors.png
- `2.5 Ikona Bilet Kinowy.png` → icon_ticket.png

#### Functional Icons
- `3.1 Checkmark (Ptaszek).png` → icon_checkmark.png
- `3.2 Strzałka w Prawo (Arrow Right).png` → icon_arrow_right.png
- `3.3 Strzałka w Dół (Scroll Indicator).png` → icon_arrow_down.png
- `3.4 Ikona Lokalizacji (Pin).png` → icon_location.png
- `3.5 Ikona Serca (LikeFavorite).png` → icon_heart.png
- `3.6 Ikona Dzwonka (Notifications).png` → icon_bell.png

#### Business Icons (B2B Section)
- `4.1 Ikona Pieniędzy (MoneyRevenue).png` → icon_money.png
- `4.2 Ikona Wykresu (Analytics).png` → icon_analytics.png
- `4.3 Ikona Celu (Target).png` → icon_target.png
- `4.4 Ikona Sklepu (Store).png` → icon_store.png

#### Social Media Icons
- `5.1 Instagram Icon.png` → icon_instagram.png
- `5.2 TikTok Icon.png` → icon_tiktok.png
- `5.3 Facebook Icon.png` → icon_facebook.png

#### Decorative Elements
- `6.1 Małe Ikony Pattern (Set).png` - Pattern background set
- `6.2 KropkiParticles.png` - Floating particles
- `9.1 Speech Bubble (Dymek).png` - Speech bubble element
- `9.2 BadgePill Shape.png` - Badge/pill shape
- `9.3 Hard Shadow Element (Szablon).png` - Shadow template

#### Other
- `7.3 Kupon Card (Przykładowa Karta).png` - Example coupon card
- `Seamless background pattern...jpg` - Pattern texture

---

## Step-by-Step Asset Preparation

### STEP 1: Create Organized Folder Structure

**Action:** Create the following folders in `/public/assets/`:

```bash
mkdir -p public/assets/images/backgrounds
mkdir -p public/assets/images/mascots
mkdir -p public/assets/images/logos
mkdir -p public/assets/images/patterns
mkdir -p public/assets/icons/features
mkdir -p public/assets/icons/categories
mkdir -p public/assets/icons/functional
mkdir -p public/assets/icons/business
mkdir -p public/assets/icons/social
mkdir -p public/assets/elements
```

### STEP 2: Copy and Rename Files

**Action:** Copy files from `/assets/` to organized structure with clean names:

#### Backgrounds
```bash
# Copy to: public/assets/images/backgrounds/
back_left_under_text.png → back_left_under_text.png
back_right_under_phone.png → back_right_under_phone.png
```

#### Mascots
```bash
# Copy to: public/assets/images/mascots/
pedro_raccoon_phone.png → pedro_raccoon_phone.png
Pedro_Thumbs_Up.png → pedro_thumbs_up.png
Pedro_with_smartphone_in_one_hand.png → pedro_smartphone.png
Pedro_Peeking.png → pedro_peeking.png
1.3Pedro Hunting.png → pedro_hunting.png
```

#### Logos
```bash
# Copy to: public/assets/images/logos/
LOGO_white.png → logo_white.png
10.1_LOGO_MAIN.png → logo_main.png
10.2_icon.png → logo_icon.png
10.3_transparent.png → logo_transparent.png
```

#### Feature Icons
```bash
# Copy to: public/assets/icons/features/
icon_search.png → icon_search.png (already good)
icon_wallet.png → icon_wallet.png (already good)
icon_qr.png → icon_qr.png (already good)
```

#### Category Icons
```bash
# Copy to: public/assets/icons/categories/
2.1 Ikona Pizza.png → icon_pizza.png
2.2 Ikona Burger.png → icon_burger.png
2.3 Ikona DrinkNapój.png → icon_drink.png
2.4 Ikona Nożyczki (Fryzjer).png → icon_scissors.png
2.5 Ikona Bilet Kinowy.png → icon_ticket.png
```

#### Functional Icons
```bash
# Copy to: public/assets/icons/functional/
3.1 Checkmark (Ptaszek).png → icon_checkmark.png
3.2 Strzałka w Prawo (Arrow Right).png → icon_arrow_right.png
3.3 Strzałka w Dół (Scroll Indicator).png → icon_arrow_down.png
3.4 Ikona Lokalizacji (Pin).png → icon_location.png
3.5 Ikona Serca (LikeFavorite).png → icon_heart.png
3.6 Ikona Dzwonka (Notifications).png → icon_bell.png
```

#### Business Icons
```bash
# Copy to: public/assets/icons/business/
4.1 Ikona Pieniędzy (MoneyRevenue).png → icon_money.png
4.2 Ikona Wykresu (Analytics).png → icon_analytics.png
4.3 Ikona Celu (Target).png → icon_target.png
4.4 Ikona Sklepu (Store).png → icon_store.png
```

#### Social Icons
```bash
# Copy to: public/assets/icons/social/
5.1 Instagram Icon.png → icon_instagram.png
5.2 TikTok Icon.png → icon_tiktok.png
5.3 Facebook Icon.png → icon_facebook.png
```

#### Elements
```bash
# Copy to: public/assets/elements/
6.1 Małe Ikony Pattern (Set).png → pattern_icons.png
6.2 KropkiParticles.png → particles.png
9.1 Speech Bubble (Dymek).png → speech_bubble.png
9.2 BadgePill Shape.png → badge_pill.png
```

#### Patterns
```bash
# Copy to: public/assets/images/patterns/
Seamless background pattern...jpg → seamless_pattern.jpg
```

### STEP 3: Remove Icon Backgrounds

**Context:** All icons have backgrounds that need to be removed to work properly with the landing page design.

**Where to do this:**
- Use an image editing tool (Photoshop, GIMP, Figma, or online tools like remove.bg)
- OR use code/script with libraries like `sharp` or `jimp` in Node.js

**Which files need background removal:**

1. **Feature Icons** (HIGH PRIORITY):
   - icon_search.png
   - icon_wallet.png
   - icon_qr.png

2. **Category Icons**:
   - icon_pizza.png
   - icon_burger.png
   - icon_drink.png
   - icon_scissors.png
   - icon_ticket.png

3. **Functional Icons**:
   - All icons in functional folder

4. **Business Icons**:
   - All icons in business folder

5. **Social Icons**:
   - icon_instagram.png
   - icon_tiktok.png
   - icon_facebook.png

**Process:**
1. Open each icon file
2. Remove or make transparent any background color
3. Ensure only the icon graphic remains
4. Save as PNG with transparency
5. Verify transparency by viewing on different backgrounds

### STEP 4: Optimize Images

**For PNG files:**
```bash
# Use online tools or command line
# Example with imagemagick:
magick mogrify -strip -quality 85 *.png

# Or use online: tinypng.com, squoosh.app
```

**For mascot images:**
- Keep high quality (they're hero elements)
- Ensure transparent backgrounds
- Optimize for web (~200-500KB each)

**For icons:**
- Target size: ~20-50KB each
- Ensure 100% transparency
- Consider converting to SVG for scalability (optional enhancement)

### STEP 5: Create Asset Constants

**Action:** Create a TypeScript file for asset paths

**File:** `src/lib/assets.ts`

```typescript
// Backgrounds
export const backgrounds = {
  heroLeft: '/assets/images/backgrounds/back_left_under_text.png',
  heroRight: '/assets/images/backgrounds/back_right_under_phone.png',
} as const;

// Mascots
export const mascots = {
  raccoonPhone: '/assets/images/mascots/pedro_raccoon_phone.png',
  thumbsUp: '/assets/images/mascots/pedro_thumbs_up.png',
  smartphone: '/assets/images/mascots/pedro_smartphone.png',
  peeking: '/assets/images/mascots/pedro_peeking.png',
  hunting: '/assets/images/mascots/pedro_hunting.png',
} as const;

// Logos
export const logos = {
  white: '/assets/images/logos/logo_white.png',
  main: '/assets/images/logos/logo_main.png',
  icon: '/assets/images/logos/logo_icon.png',
  transparent: '/assets/images/logos/logo_transparent.png',
} as const;

// Feature Icons
export const featureIcons = {
  search: '/assets/icons/features/icon_search.png',
  wallet: '/assets/icons/features/icon_wallet.png',
  qr: '/assets/icons/features/icon_qr.png',
} as const;

// And so on for other categories...
```

### STEP 6: Verification Checklist

After preparation, verify:

- [ ] All files are in correct folders
- [ ] File names follow snake_case convention
- [ ] All icons have transparent backgrounds
- [ ] Images are optimized for web
- [ ] Asset constants file is created
- [ ] No broken file references
- [ ] Test loading each asset in browser

---

## Critical Assets for Each Section

### Hero Section
- ✅ `back_left_under_text.png`
- ✅ `back_right_under_phone.png`
- ✅ `pedro_raccoon_phone.png`
- ✅ `logo_white.png`

### About Section
- ✅ `pedro_thumbs_up.png`
- ✅ `icon_checkmark.png` (for bullets)

### Features Section
- ✅ `icon_search.png`
- ✅ `icon_wallet.png`
- ✅ `icon_qr.png`
- ✅ `icon_pizza.png`, `icon_burger.png`, etc. (background doodles)

### B2B Section
- ✅ `icon_money.png`
- ✅ `icon_analytics.png`
- ✅ `icon_target.png`

### Download Section
- ✅ `pedro_smartphone.png` (optional)

### Footer
- ✅ `pedro_peeking.png`
- ✅ `icon_instagram.png`
- ✅ `icon_tiktok.png`
- ✅ `icon_facebook.png`

---

## Next Steps

Once assets are prepared:
1. ✅ Verify all files are accessible
2. ✅ Set up Next.js Image component imports
3. ✅ Test image loading in development
4. ✅ Proceed to styling setup (03_styling_setup.md)
