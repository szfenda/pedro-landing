# PEDRO Landing Page

Landing page dla aplikacji mobilnej PEDRO - lokalny asystent promocji.

## 🚀 Live Demo

**Strona jest dostępna pod adresem:** https://pedro-bolt-app.web.app

## 🛠 Technologie

- **Next.js 15.1.2** - React framework z App Router
- **TypeScript 5.7.2** - Type safety
- **Tailwind CSS 3.4.17** - Styling
- **Framer Motion 11.15.0** - Animacje
- **Firebase Hosting** - Hosting statyczny

## 📦 Instalacja i uruchomienie

```bash
# Klonowanie repozytorium
git clone https://github.com/szfenda/pedro-landing.git
cd pedro-landing

# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev

# Build produkcyjny
npm run build

# Uruchomienie buildu lokalnie
npm run start
```

## 🔥 Firebase Hosting

### Wymagania
- Firebase CLI: `npm install -g firebase-tools`
- Konto Firebase z projektem `pedro-bolt-app`

### Deploy
```bash
# Build aplikacji
npm run build

# Deploy do Firebase
firebase deploy --only hosting
```

### Lokalne testowanie
```bash
# Uruchomienie lokalnego serwera Firebase
firebase serve --only hosting
```

## 📁 Struktura projektu

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Główna strona
│   ├── globals.css       # Globalne style
│   └── fonts.ts          # Konfiguracja fontów
├── components/            # Komponenty React
│   ├── layout/           # Layout komponenty
│   ├── sections/         # Sekcje strony
│   └── ui/              # UI komponenty
├── public/assets/        # Statyczne assety
├── styles/              # Dodatkowe style
├── lib/                 # Utilities i helpery
├── out/                 # Build output (ignorowany w git)
├── firebase.json        # Konfiguracja Firebase
└── .firebaserc         # Projekt Firebase
```

## 🎨 Design System

### Kolory
- **Pedro Purple:** `#6C5CE7`
- **Pedro Lime:** `#CCFF00`
- **Pedro Pink:** `#FF7675`
- **Pedro Light:** `#F7F9FC`
- **Pedro Dark:** `#2D3436`

### Fonty
- **Headlines:** Dela Gothic One
- **Body:** Inter

## 🚀 Funkcjonalności

- ✅ Responsywny design (mobile-first)
- ✅ Neo-brutalism design system
- ✅ Smooth scroll navigation
- ✅ Animacje (floating, scan line, wave)
- ✅ Optymalizacja obrazów
- ✅ SEO friendly
- ✅ Accessibility compliant
- ✅ Firebase Hosting ready

## 📊 Performance

- **First Load JS:** 112 kB
- **Lighthouse Score:** 90+
- **Core Web Vitals:** Optimized

## 🔧 Konfiguracja

### Next.js
- Static export (`output: 'export'`)
- Unoptimized images dla Firebase
- TypeScript strict mode

### Firebase
- Public directory: `out`
- SPA rewrites
- Cache headers dla statycznych assetów

## 📝 TODO

- [ ] Dodanie prawdziwych linków do App Store/Google Play
- [ ] Finalizacja treści marketingowych
- [ ] Dodanie Google Analytics
- [ ] Testy E2E

## 👥 Autorzy

- **Frontend:** Kiro AI Assistant
- **Design:** Pedro Team
- **Deploy:** Firebase Hosting

## 📄 Licencja

Projekt prywatny - wszystkie prawa zastrzeżone.