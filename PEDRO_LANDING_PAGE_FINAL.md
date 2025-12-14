# PROMPT: Landing Page dla PEDRO.app (Neo‑Brutalism x Digital Pop Art) — FINAL

Zbuduj nowoczesną, interaktywną one‑page landing page dla aplikacji mobilnej **PEDRO.app** w stylu **Neo‑Brutalism meets Digital Pop Art**. Strona ma być estetycznie dopracowana, przyjazna, szybka i responsywna. Najważniejsze: **Sekcja HERO oraz sekcja FEATURES (3 karty) mają wyglądać możliwie 1:1 jak dostarczone screeny** (układ, proporcje, grubości obrysów, cienie, spacing, pozycje elementów). Pozostałe sekcje mają być wykonane wg specyfikacji poniżej, spójnie z tym samym językiem wizualnym.

---

## 0) ASSETS (NIE generuj – tylko osadź; użyj DOKŁADNIE tych nazw plików)

### HERO
- HERO left background: `back_left_under_text.png`
- HERO right background: `back_right_under_phone.png`
- HERO main visual (szop + telefon razem w jednym PNG): `pedro_raccoon_phone.png`

### ABOUT („O nas”)
- About illustration (wybór — użyj tej, która lepiej wspiera przekaz „Pedro pomaga i prowadzi użytkownika”):
  - **Primary (preferowana do #o-nas):** `Pedro_Thumbs_Up.png` (bardziej „welcome/introdukcja”)
  - Secondary (może być użyta dodatkowo w #pobierz lub #kontakt jako dekor/akcent): `Pedro_with_smartphone_in_one_hand.png` (smartfon + widoczny QR)

### FEATURES (3 karty)
- `icon_search.png`
- `icon_wallet.png`
- `icon_qr.png`

### FOOTER
- Footer mascot “peeking”: `Pedro_Peeking.png`

### NAV (opcjonalnie)
- Logo image (jeśli istnieje): `LOGO_white.png`  
  Jeśli brak, użyj tekstu „PEDRO”.

---

## 1) Ogólny charakter i zasady wizualne

### Styl
- Vibe: „TikTok energy” + streetwear + neo‑brutal, ale czytelny i UX‑friendly.
- Klucz: grube obrysy, twarde cienie, mocne typografie, żywe akcenty, dużo „powietrza”, dużo mikrointerakcji.

### Paleta (dokładnie)
- Primary Purple: `#6C5CE7`
- Accent CTA Lime: `#CCFF00`
- Accent Emotion Pink: `#FF7675`
- Background Light: `#F7F9FC`
- Text Dark: `#2D3436`
Zasada 60‑30‑10.

### Typografia
- Headline: **Dela Gothic One** lub **Archivo Black**
- Body: **Inter** lub **Outfit**

Skale:
- H1 (hero): bardzo duże jak na screenie (plakatowo) ~64–80px (desktop)
- H2: ~44–52px
- H3: ~28–36px
- Body: 18px, small: 14px

### Neo‑brutal detale UI
- Border: `3px solid #2D3436`
- Hard shadow (offset, bez blur):
  - default: `10px 10px 0 #6C5CE7`
  - hover/CTA: `10px 10px 0 #CCFF00`
- Radius:
  - karty: 16px
  - przyciski: 12px

### Layout / spacing (parametry stabilizujące wygląd)
- Global container: `max-width: 1200px`
- Padding poziomy: 24px desktop / 16px mobile
- Transitions: `0.25–0.35s cubic-bezier(0.4, 0, 0.2, 1)`
- Animacje: preferuj `transform` i `opacity` (performance)

---

## 2) Technologia (preferencje)
- Framework: **Next.js** (SEO)
- Styling: **Tailwind CSS** + custom CSS dla hard‑shadow / scan line / floating
- Animacje: **Framer Motion** lub IntersectionObserver + CSS (preferuj CSS gdzie się da)
- Ikony: użyj moich gotowych **PNG**
- Performance: lazy loading, `will-change` dla animowanych elementów, minimalny JS

---

## 3) Struktura strony (one‑page) + anchor links (WSZYSTKIE muszą istnieć)

Sekcje i ich `id` (kolejność):
1. HERO `#top`
2. O nas `#o-nas`
3. Funkcje (3 karty) `#funkcje`
4. B2B `#dla-biznesu`
5. Social proof `#opinie`
6. FAQ `#faq`
7. Pobierz `#pobierz`
8. Kontakt `#kontakt`
9. Footer

Nawigacja w HERO ma scrollować do: `#o-nas`, `#funkcje`, `#pobierz`, `#kontakt`.
Scroll indicator w HERO scrolluje do `#funkcje`.

---

## 4) HERO (100vh) — MA WYGLĄDAĆ 1:1 jak screen (bez kropek/mockupu)

### 4.1 Ramy i layout
- Brak kropek/mockupu okna przeglądarki (to nie jest część designu).
- `height: 100vh`
- Split dokładnie 50/50: lewa tekst, prawa wizual
- Divider między połowami: `2px solid #2D3436`
- Left BG: `back_left_under_text.png` (cover, no-repeat, center)
- Right BG: `back_right_under_phone.png` (cover, no-repeat, center)

### 4.2 Top navigation (jak screen)
- Wysokość: 72px desktop / 64px mobile
- Lewo: logo „PEDRO” (biały, bold) lub `LOGO_white.png`
- Środek: czarna pigułka nav (`rounded-full`) z linkami:
  - O nas
  - Funkcje
  - Pobierz
  - Kontakt
- Prawo: osobny przycisk/pigułka „Log in”
Interakcje:
- link hover: lekkie podświetlenie + underline animowany
- Log in hover: uniesienie + hard shadow lime

### 4.3 Lewa strona HERO (tekst + CTA)
- Brak podtytułu.
- H1: bardzo duży, biały, plakatowy:
  - line-height: 0.95–1.0
  - letter-spacing: ok. `-0.02em`
  - „poster shadow”: np. `text-shadow: 4px 4px 0 rgba(0,0,0,0.35)` + ewentualnie drugi cień dla wzmocnienia looku
- Tekst H1 w 4 liniach (dokładnie):
  - PEDRO NIE
  - PRZEPŁACA.
  - PEDRO POLUJE
  - NA PROMKI

CTA (store badges):
- 2 przyciski obok siebie: „App Store”, „Google Play”
- Uwaga: **linków jeszcze nie ma**, więc:
  - zrób je jako klikalne elementy (`button` lub `a` z `href="#"`), ale wyraźnie zostaw TODO/placeholder na późniejsze URL
  - dodaj atrybuty `aria-label`
- Style:
  - tło czarne, tekst/ikonki białe
  - radius 12px
  - min-height 52px
  - gap 16px
  - limonkowy akcent: hard shadow/outline w `#CCFF00`
- Hover: `translateY(-6px)` + shadow lime
- Active: `scale(0.98)`

### 4.4 Prawa strona HERO (wizual)
- Użyj `pedro_raccoon_phone.png` jako głównego elementu (telefon + szop w jednym).
- Umieść centralnie w prawej połowie, z wrażeniem pierwszego planu (większy niż połowa wysokości hero).
- Animacje:
  - floating góra‑dół: ~3s ease-in-out loop
  - delikatny parallax przy scrollu
  - subtelny glow lime wokół: `#CCFF00` blur ok. 40px
- Dodaj kilka małych pływających kształtów (lime/pink/purple) jako dekor tła (nigdy na wierzchu głównego PNG).

### 4.5 Scroll indicator
- Na dole HERO, wycentrowany:
  - okrągły przycisk 44px
  - border 3px dark + hard shadow purple/lime
  - bounce co 1.2s
  - klik → scroll do `#funkcje`

---

## 5) Sekcja „O nas” (#o-nas) — krótka, konwersyjna, spójna

Cel: szybko wyjaśnić, czym jest PEDRO i dlaczego warto pobrać.

Layout:
- Tło jasne `#F7F9FC`
- Container 1200px, padding top/bottom ~96–120px
- Układ 2‑kolumnowy (desktop), 1‑kolumnowy (mobile)

Treść:
- H2: „Co to jest PEDRO?”
- 2–3 zdania (placeholder) w stylu przyjaznym i konkretnym.
- 3 mini‑bullet’y (chunky check/ikonki):
  - Lokalnie (Twoja dzielnica)
  - Bez spamu (tylko realne promki)
  - Szybko przy kasie (skanujesz i masz)

Grafika:
- Użyj `Pedro_Thumbs_Up.png` jako głównej grafiki tej sekcji (lepsza do „introdukcji”).
- Dodatkowo możesz w rogu sekcji dodać mały „sticker”/akcent z `Pedro_with_smartphone_in_one_hand.png` (opcjonalnie), ale tylko jeśli nie przeładuje to layoutu.

Interakcje:
- Wejście przy scroll (fade + slide-up, stagger dla bulletów).
- Delikatny hover na grafice (micro-tilt 3D lub lekki bounce).

---

## 6) Sekcja Funkcje (#funkcje) — 3 karty 1:1 jak screen

Tło i dekoracje:
- Tło: `#F7F9FC` / biały z delikatnym gradientem
- Subtelne doodle (pizza, burger, nożyczki) w tle (opacity 0.6–0.8)

Grid i karty:
- Grid: 3 kolumny desktop / 1 kolumna mobile
- Karty:
  - białe tło
  - border 3px dark
  - radius 16px
  - hard shadow 10px 10px 0 purple
  - min-height 380–420px (równe wizualnie)
  - padding 32–40px

Ikony:
- Duża ikona na górze, wycentrowana:
  - K1: `icon_search.png`
  - K2: `icon_wallet.png`
  - K3: `icon_qr.png`
- Rozmiar ikon: ~96–120px wysokości

Treści kart:
- K1:
  - tytuł w 2 liniach: „Lokalny” / „Radar”
  - badge lime `#CCFF00` z krótkim tekstem (placeholder)
- K2:
  - tytuł: „Portfel” / „bez śmieci”
  - linia: „0 przeterminowanych kuponów” (0 bold)
- K3:
  - tytuł: „Skanujesz” / „i masz”
  - scan line: fioletowa pozioma kreska przechodząca przez ikonę QR
  - animacja scan line: góra‑dół co ~3s

Hover i UX:
- Hover: translateY(-8px), shadow → lime, subtelny tilt 3D
- Focus: wyraźny focus ring w lime

---

## 7) B2B (#dla-biznesu) — jak w poprzednim opisie, dopracowane
- Tło: pełne `#CCFF00`
- Diagonal split: w górnym rogu nachodzi fioletowy trójkąt (clip-path)
- 60/40 split: tekst / ilustracja (mockup dashboardu)
- H2: „Masz lokalny biznes? Zatrudnij Pedra.”
- Copy (placeholder): płacisz za efekt, nie za klik
- Bullet list z chunky checkmarkami (stagger)
- CTA: „Dodaj swoją firmę →”
  - purple background, border 3px dark, hard shadow dark
  - hover: skok + animacja strzałki
- Prawa strona: tablet/dashboard placeholder + orbitujące ikony 💰 📊 🎯
- Dodatkowo: count-up „1,234 transakcji dzisiaj” + mini testimonial slider

---

## 8) Social proof (#opinie)
- Jasne tło
- 3 logotypy partnerów (placeholder)
- 2–3 opinie w brutal kartach (border + hard shadow)
- Animacje wejścia przy scroll

---

## 9) FAQ (#faq)
- 6–8 pytań (placeholder)
- Akordeon `details/summary`:
  - brutal border + hard shadow
  - animacja plus/minus
  - focus i keyboard navigation

---

## 10) Pobierz (#pobierz) — sekcja konwersyjna (DODAJ)
Cel: domknąć instalacje po przeczytaniu funkcji/opinii/FAQ.

- Tło: jasne lub purple gradient (spójnie)
- H2: „Pobierz PEDRO i poluj na promki”
- Powtórz store badges:
  - klikalne elementy bez docelowych URL (placeholdery)
  - wyraźny styl jak w HERO
- 3 krótkie benefity w chips/badges (lime)
- (Opcjonalnie) użyj `Pedro_with_smartphone_in_one_hand.png` jako akcentu w tej sekcji (tu pasuje najlepiej, bo ma QR na telefonie).

---

## 11) Kontakt (#kontakt)
- Prosty blok:
  - email (placeholder)
  - social (placeholder)
  - opcjonalny mini formularz: imię, email, wiadomość
- Inputy: border 3px + hard shadow, focus lime
- CTA „Wyślij” w stylu brandu

---

## 12) Footer
- Tło `#2D3436`, border-top 4px lime
- Logo PEDRO hover lime + rotate 5°
- Linki: Regulamin | Polityka Prywatności | Kontakt | Dla Biznesu
- Social icons lime, hover: scale + rotate + glow
- Tekst: „Made with 🍕 in Gdańsk”
- Prawy dolny róg: `Pedro_Peeking.png` (wave co 5s, hover: wysuwa się bardziej + dymek)

---

## 13) Globalne interakcje i efekty
- Smooth scroll + progress bar u góry (cienka lime)
- Fade/slide-in on scroll (IntersectionObserver)
- Subtelny parallax warstw
- Click ripple na CTA
- Button press: scale(0.95)
- Mobile: sticky bottom mini‑CTA „Pobierz PEDRO” po wyjściu poza HERO (opcjonalnie, preferowane)

---

## 14) Output requirements
Wygeneruj komplet:
- struktura komponentów (Hero, Nav, About, Features, B2B, SocialProof, FAQ, Download, Contact, Footer)
- komplet stylów (Tailwind + custom CSS dla hard‑shadow / scan line / floating)
- komplet animacji (Framer Motion lub CSS)
- wszystkie obrazki jako importy/ścieżki do podmiany (użyj dokładnie nazw z sekcji ASSETS)
- zadbaj o A11y + SEO + performance