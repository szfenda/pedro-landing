# AUTH FLOW (PEDRO.app) — Specyfikacja stron: Logowanie, Rejestracja, Reset hasła (Neo‑Brutalism x Digital Pop Art)

Poniższy dokument opisuje **3 podstrony** w 100% spójnym stylu z landing page PEDRO.app:
- `/login` — logowanie (tylko email + hasło)
- `/register` — rejestracja (imię + email + hasło + mail z linkiem aktywacyjnym)
- `/forgot-password` — „Zapomniałeś hasła?” (email + wysyłka linku do resetu)
- (opcjonalnie, ale zalecane dla kompletności UX) `/reset-password?token=...` — ustawienie nowego hasła po kliknięciu w link z maila

Wszystkie ekrany mają być spójne między sobą i z landing: **Neo‑Brutalism meets Digital Pop Art**, twarde cienie, grube obrysy, fiolet + limonka, dużo „powietrza”, mikrointerakcje, mocna typografia, perfekcyjna czytelność.

---

## 0) Wspólne założenia (dla wszystkich ekranów auth)

### 0.1 Styl / paleta / typografia (identyczne jak landing)
- Primary Purple: `#6C5CE7`
- Accent Lime: `#CCFF00`
- Accent Pink: `#FF7675`
- Background Light: `#F7F9FC`
- Text Dark: `#2D3436`

Typografia:
- Headline: **Dela Gothic One** lub **Archivo Black**
- Body: **Inter** lub **Outfit**

### 0.2 Neo‑brutal detale UI (wspólny system)
- Border: `3px solid #2D3436`
- Hard shadow (bez blur, offset “plate”):
  - default: `10px 10px 0 #6C5CE7`
  - hover/CTA: `10px 10px 0 #CCFF00`
- Radius:
  - karty: 16px
  - inputy / przyciski: 12px
- Focus ring: wyraźny w `#CCFF00` (dla klawiatury)
- Touch targets: min `44px` wysokości

### 0.3 Layout / spacing (żeby UI zawsze wyglądał “jak projekt”)
- `min-height: 100vh`
- Global container: `max-width: 1200px`
- Padding poziomy: 24px desktop / 16px mobile
- Wersja desktop: **split 50/50** z pionowym separatorem `2px solid #2D3436`
- Animacje: używaj `transform` i `opacity` (wydajność), czas 0.25–0.35s, easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### 0.4 Wspólna rama: `AuthShell` (zalecane jako komponent)
Każda strona auth korzysta z tej samej konstrukcji:
1) **Topbar** (uproszczony, spójny z landing)
2) **Main split**:
   - lewa część: krótki copy + mini‑benefity + (opcjonalnie) grafika Pedro
   - prawa część: karta formularza (biała, border + hard shadow)
3) **Subtle background**: nawiązanie do hero (te same tła) + subtelne dekoracje, ale nie mogą przeszkadzać w wypełnianiu formu.

### 0.5 Assety (osadź, nie generuj)
Wykorzystuj (jeśli dostępne w projekcie):
- `back_left_under_text.png`
- `back_right_under_phone.png`
- `Pedro_Thumbs_Up.png`
- `Pedro_with_smartphone_in_one_hand.png`
- (opcjonalnie) `LOGO_white.png`

**Uwaga:** Ekrany auth nie muszą kopiować hero 1:1, ale mają używać tego samego języka wizualnego i tych samych zasad (border/shadow/typografia/kolor).

---

## 1) Topbar (wspólny dla /login, /register, /forgot-password, /reset-password)

### 1.1 Układ
- Wysokość: 72px desktop / 64px mobile
- Lewo:
  - logo tekstowe `PEDRO` (białe) **lub** `LOGO_white.png`
- Prawo:
  - link/pigułka „Wróć na stronę główną” → `/`
- Opcjonalnie (ale spójnie z landing): środkowa czarna pigułka z mini‑linkami:
  - `Funkcje` → `/#funkcje`
  - `Pobierz` → `/#pobierz`
  (to pomaga w nawigacji, ale ma nie rozpraszać — na mobile może być ukryte)

### 1.2 Interakcje
- Link hover: underline animowany + delikatne rozjaśnienie
- Pigułki: hover `translateY(-2px)` + hard shadow lime (subtelniej niż na landing)

---

## 2) Strona logowania — `/login` (tylko email + hasło)

### 2.1 Cel
Szybkie logowanie i jasny link do rejestracji oraz do resetu hasła.

### 2.2 Layout (desktop)
Split 50/50 + separator 2px.

#### Lewa strona (copy + przekierowanie do rejestracji)
- Tło: `back_left_under_text.png` (cover)
- H1 (plakatowe, białe, “poster shadow”): `Zaloguj się`
- Krótki opis (1 zdanie): „Wróć do polowania na promki.”
- 3 chipsy/badges w limonce:
  - `Lokalnie`
  - `Bez spamu`
  - `Szybko przy kasie`
- **Link do rejestracji (wymagane):**
  - Tekst: „Nie masz konta? Zarejestruj się →”
  - Prowadzi do: `/register`
  - Styl: underline animowany + hover uniesienie o 1–2px

#### Prawa strona (formularz w karcie)
- Tło: `back_right_under_phone.png` (cover)
- Karta formularza (centered):
  - białe tło
  - border 3px dark
  - hard shadow purple
  - padding 32–40px
  - max-width karty: ~460–520px (żeby forma była “zbita” i czytelna)

Elementy w karcie:
- Nagłówek H2/H3: `Logowanie`
- Pole 1: `Email`
  - type: email
  - placeholder: `np. ola@pedro.app`
- Pole 2: `Hasło`
  - type: password
  - opcja „pokaż/ukryj hasło” (ikonka)
- Rząd akcji pod polami:
  - **Link (wymagane):** „Zapomniałeś hasła?” → `/forgot-password`
  - (opcjonalnie) „Zapamiętaj mnie” — jeśli nie implementujesz, pomiń, żeby nie wprowadzać w błąd
- Primary CTA (wymagane): `Zaloguj się`
  - tło: `#6C5CE7`, tekst biały
  - border 3px dark
  - hard shadow dark lub purple
  - hover: `translateY(-6px)` + shadow lime
  - active: `scale(0.98)`
- Pod CTA (mały tekst):
  - „Logując się, akceptujesz Regulamin i Politykę Prywatności.” (linki)

### 2.3 Stany walidacji i błędy (konkret)
- Walidacja inline:
  - brak email → „Podaj email.”
  - zły format → „Nieprawidłowy format email.”
  - brak hasła → „Podaj hasło.”
- Błąd logowania (np. błędne dane):
  - brutalistyczny alert box (border 3px, hard shadow)
  - akcent błędu w `#FF7675`
  - treść: „Nieprawidłowy email lub hasło.”
- Loading:
  - CTA zmienia tekst na „Loguję…” + mały loader chunky

### 2.4 Responsywność
- Mobile: layout w kolumnę:
  - topbar
  - H1 + krótkie copy
  - karta formularza
  - link do rejestracji widoczny również pod kartą (dla pewności)
- CTA full width

---

## 3) Strona rejestracji — `/register` (Imię + Email + Hasło + aktywacja mailem)

### 3.1 Cel
Szybka rejestracja, jasna informacja o mailu aktywacyjnym, spójny link do logowania.

### 3.2 Layout (desktop)
Ten sam AuthShell 50/50.

#### Lewa strona (copy + grafika)
- Tło: `back_left_under_text.png`
- H1: `Załóż konto`
- Opis: „Stwórz konto w 20 sekund. Potem tylko skanujesz i masz.”
- Grafika główna tej sekcji:
  - **użyj `Pedro_Thumbs_Up.png`** (najlepsze do “welcome”)
  - animacja: delikatny floating (2.8–3.2s)
- Link:
  - „Masz już konto? Zaloguj się →” → `/login`

#### Prawa strona (formularz w karcie)
Karta identyczna stylowo jak login.

W karcie:
- Nagłówek: `Rejestracja`
- Pole 1: `Imię` (text), placeholder: `np. Ola`
- Pole 2: `Email` (email)
- Pole 3: `Hasło` (password) + show/hide
- Informacja pod polami (wymagana):
  - „Wyślemy Ci link aktywacyjny na email. Bez aktywacji konto nie będzie działać.”
- Primary CTA: `Utwórz konto` (ten sam styl co login)

### 3.3 Stany po wysłaniu (ważne dla UX)
Po sukcesie rejestracji NIE przenoś od razu na login bez komunikatu. Pokaż success state w tej samej karcie:
- Tytuł: `Sprawdź skrzynkę`
- Tekst: „Wysłaliśmy link aktywacyjny na: **[email]**”
- Secondary CTA: `Wyślij link ponownie`
  - disabled przez 30s (cooldown)
- Link: `Zmień email` (wraca do formularza)
- (Opcjonalnie) mały akcent graficzny w rogu karty:
  - `Pedro_with_smartphone_in_one_hand.png` jako mini‑sticker (jeśli nie za ciężkie wizualnie)

### 3.4 Walidacja
- Imię: min 2 znaki
- Email: format
- Hasło: min 8 znaków
- Błędy: tekst pod polem + akcent różowy `#FF7675`

### 3.5 Responsywność
- Mobile: kolumna, grafika może zostać mniejsza lub przeniesiona pod nagłówek

---

## 4) Strona „Zapomniałeś hasła?” — `/forgot-password`

### 4.1 Cel
Użytkownik wpisuje email → dostaje maila z linkiem do ustawienia nowego hasła.

### 4.2 Layout (desktop)
Ten sam AuthShell 50/50.

#### Lewa strona (copy + mały akcent)
- Tło: `back_left_under_text.png`
- H1: `Reset hasła`
- Opis: „Podaj email, wyślemy Ci link do ustawienia nowego hasła.”
- Mała grafika/akcent:
  - użyj **`Pedro_with_smartphone_in_one_hand.png`** (tu pasuje, bo “link/QR/akcja”)
  - subtelny floating
- Link powrotny:
  - „Wróć do logowania →” → `/login`

#### Prawa strona (formularz w karcie)
- Karta jak w login/register
- Nagłówek: `Zapomniałeś hasła?`
- Pole: `Email`
- Primary CTA: `Wyślij link resetujący`
  - styl: purple + border + hard shadow
  - hover: uniesienie + shadow lime
- Pod CTA (mały tekst):
  - „Jeśli konto istnieje, wyślemy wiadomość na podany adres.”

### 4.3 Stany po wysłaniu
Po kliknięciu pokaż success state w karcie:
- Tytuł: `Sprawdź pocztę`
- Tekst: „Jeśli konto istnieje, wysłaliśmy link do resetu hasła na: **[email]**.”
- Secondary CTA: `Wyślij ponownie` (cooldown 30s)
- Link: `Zmień email`

### 4.4 Walidacja
- Email wymagany + format
- Błędy jak w innych formach

---

## 5) (Zalecane) Strona ustawienia nowego hasła — `/reset-password?token=...`

> Ten ekran jest praktycznie konieczny w pełnym flow resetu hasła, bo `/forgot-password` tylko wysyła mail. Jeśli backend już to obsługuje, ten ekran jest “final step”.

### 5.1 Cel
Użytkownik po kliknięciu linka z maila ustawia nowe hasło.

### 5.2 Layout
Może być split 50/50 jak reszta albo uproszczony (karta na środku). Zalecenie: zachowaj split 50/50 dla spójności.

#### Lewa strona
- H1: `Ustaw nowe hasło`
- Opis: „Wpisz nowe hasło i gotowe.”
- Link: „Wróć do logowania →” (na wypadek problemów)

#### Prawa strona (karta)
- Nagłówek: `Nowe hasło`
- Pole 1: `Nowe hasło`
- Pole 2: `Powtórz hasło`
- Primary CTA: `Zapisz nowe hasło`
- Walidacja:
  - min 8 znaków
  - hasła muszą być identyczne
- Sukces:
  - success card: „Hasło zmienione”
  - CTA: `Przejdź do logowania` → `/login`

### 5.3 Obsługa błędów tokena (ważne)
Jeśli token:
- wygasł → pokaż brutal alert + CTA „Wyślij nowy link” → `/forgot-password`
- niepoprawny → podobnie, z jasnym komunikatem

---

## 6) Mikrointerakcje i spójność (checklista dla wszystkich ekranów)

### 6.1 Wspólne zachowania UI
- Każdy input:
  - ma label
  - ma focus ring lime
  - ma stan błędu (border lub underline) w `#FF7675`
- Każdy primary CTA:
  - hover: `translateY(-6px)` + shadow lime
  - active: `scale(0.98)`
- Każda karta formularza:
  - border + hard shadow
  - delikatny micro-tilt na hover (tylko desktop, bardzo subtelny)

### 6.2 Dostępność (A11y)
- `aria-label` dla przycisków (np. show/hide password)
- `aria-describedby` dla błędów
- focus states widoczne
- poprawny tab order
- komunikaty nie tylko kolorem (zawsze tekst)

### 6.3 SEO / meta
- Każda strona ma własny title:
  - „PEDRO — Logowanie”
  - „PEDRO — Rejestracja”
  - „PEDRO — Reset hasła”
  - „PEDRO — Ustaw nowe hasło”
- Open Graph można pominąć dla auth, ale title/description warto.

---

## 7) Wymagania klikalności linków (bez docelowych URL store)

- Na landing store badges są klikalne, ale bez URL (placeholder).
- W auth:
  - `/login` ma link do `/register` (wymagane) oraz do `/forgot-password` (wymagane)
  - `/register` ma link do `/login` (wymagane)
  - `/forgot-password` ma link do `/login` (wymagane)
  - `/reset-password` ma CTA do `/login` po sukcesie (zalecane)

---

## 8) Kopia (tone of voice — spójny z PEDRO)
- Krótko, konkretnie, lekko żartobliwie, ale nie przesadnie.
- Przykładowe mikrocopy (placeholdery):
  - Login: „Wróć do polowania na promki.”
  - Register: „Załóż konto i działamy.”
  - Forgot: „Nie panikuj. Wyślemy link i jedziemy dalej.”
  - Reset: „Nowe hasło = nowy start.”

Koniec specyfikacji.