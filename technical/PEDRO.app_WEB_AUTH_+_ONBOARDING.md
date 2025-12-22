# PEDRO.app — WEB AUTH + ONBOARDING + BILLING FLOW (Neo‑Brutalism x Digital Pop Art) — FINAL SPEC (Firebase Auth + USER + PARTNER)

Dokument opisuje **wszystkie widoki/kroki webowe** związane z logowaniem/rejestracją, resolverem, onboardingiem biznesu, billingiem i MVP dashboardem — **spójne wizualnie z landing page** i **spójne logicznie z istniejącym Auth/USER/PARTNER**.

Ten flow jest „dorosły” (MVP), nie duplikuje logiki aplikacji mobilnej i nie wprowadza nowych ról/kolekcji.

---

## 0) ZAŁOŻENIA STARTOWE (BARDZO WAŻNE — NIE ZMIENIAĆ)

### 0.1 Istniejące byty i zasady danych
- **Firebase Auth** już istnieje (jedyny auth).
- Kolekcje/dokumenty:
  - `USER` — jeden dokument na jedno konto z Firebase Auth
  - `PARTNER` — dokument biznesu
- Relacja kluczowa:
  - `PARTNER.createdBy / userId === USER.id` (w praktyce `auth.uid`)
- Nie wprowadzamy:
  - nowych ról
  - nowych kolekcji
  - duplikacji danych

### 0.2 Główna zasada logiki landing page (po zalogowaniu)
Landing/web po zalogowaniu zadaje **TYLKO JEDNO** pytanie:
> Czy istnieje dokument `PARTNER`, którego `userId === auth.uid`?

Na tej podstawie realizujemy 100% flow.

---

## 1) WSPÓLNY SYSTEM UI/STYLE (identyczny jak landing)

### 1.1 Paleta
- Primary Purple: `#6C5CE7`
- Accent CTA Lime: `#CCFF00`
- Accent Emotion Pink: `#FF7675`
- Background Light: `#F7F9FC`
- Text Dark: `#2D3436`

### 1.2 Typografia
- Headline: **Dela Gothic One** lub **Archivo Black**
- Body: **Inter** lub **Outfit**

### 1.3 Neo‑brutal detale (wspólny system komponentów)
- Border: `3px solid #2D3436`
- Hard shadow:
  - default: `10px 10px 0 #6C5CE7`
  - hover/CTA: `10px 10px 0 #CCFF00`
- Radius:
  - Card: 16px
  - Inputs/Buttons: 12px
- Focus ring: lime `#CCFF00` (mocny i widoczny)
- Animacje: 0.25–0.35s, easing: `cubic-bezier(0.4, 0, 0.2, 1)`, preferuj `transform` + `opacity`

### 1.4 Layout bazowy (AuthShell / AppShell dla webu)
- `min-height: 100vh`
- Container: `max-width: 1200px`
- Padding: 24px desktop / 16px mobile
- Tła nawiązujące do hero (subtelniej):
  - lewa warstwa: `back_left_under_text.png`
  - prawa warstwa: `back_right_under_phone.png`
- Dekoracje: tylko lekkie pływające kształty w tle (nigdy nad polami formularza)

### 1.5 Wspólny Topbar (na wszystkich widokach webowych)
- Lewo: logo `PEDRO` lub `LOGO_white.png` (jeśli istnieje)
- Prawo:
  - gdy niezalogowany: „Wróć na landing” → `/`
  - gdy zalogowany: „Wyloguj” (signOut) + ewentualnie „Panel” (jeśli user ma PARTNER)
- Styl: pigułki jak na landing (czarne tło, biały tekst), hover: lekki lift + shadow lime

---

## 2) FLOW HIGH‑LEVEL (stany)

### STAN 0 — NIEZALOGOWANY (PUBLIC LANDING)
**Widok:** `PublicLanding`

Widoczne CTA (wymagane):
- „Zaloguj się” → przejście do widoku `AuthCard` (na tej samej ścieżce web)
- „Dodaj swój biznes” → jeśli niezalogowany, też kieruje do `AuthCard` z preferowaną zakładką „Załóż konto”
- „Pobierz aplikację” → placeholder link (jak ustalone wcześniej)

Brak dostępu do:
- billing
- danych
- Stripe

---

## 3) STAN 1 — LOGOWANIE / REJESTRACJA (JEDEN WIDOK, JEDNA KARTA)
**Widok:** `AuthCard`  
**Zasada:** jedna strona / jeden widok — **bez dzielenia na osobne podstrony login/register**.  
Wewnątrz jednej karty są zakładki (tabs).

### 3.1 Konstrukcja widoku AuthCard
- Background: jak AuthShell (subtelne hero tła)
- Centralnie: 1 duża karta (brutalistyczna) z:
  - nagłówkiem + krótkim copy
  - zakładkami: `Zaloguj się` | `Załóż konto`
  - dynamiczną zawartością formularza
- Pod kartą (lub w stopce karty):
  - mały tekst prawny (Regulamin/Polityka) — linki
  - krótkie info: „Web służy do onboardingu i rozliczeń. Produkt jest w aplikacji mobilnej.”

### 3.2 Tabs (wymagane)
- Tab style:
  - jak pigułki / brutal tabs: border 3px, radius 12px
  - aktywna zakładka: tło lime `#CCFF00`, tekst dark, hard shadow minimalny
  - nieaktywna: tło białe, hover: lift + shadow lime
- Zmiana zakładki animowana (fade/slide 150–250ms)

---

## 4) TAB: „Zaloguj się” (AuthCard / login)

### 4.1 Pola
- `Email` (type=email)
- `Hasło` (type=password)
  - opcja show/hide hasło (ikonka) — zalecane

### 4.2 Akcje i linki (WYMAGANE)
- Primary CTA: `Zaloguj się`
- Link: `Nie pamiętasz hasła?`
  - klik → przełącza kartę w **tryb Reset Hasła** (patrz sekcja 6) w ramach tej samej AuthCard

**Dodatkowa informacja (WYMAGANA wg Twojej prośby):**
- Tekst/CTA do rejestracji:
  - „Nie masz konta? Załóż konto →”
  - klik → przełącza zakładkę na `Załóż konto`

### 4.3 Logika (wymagana)
- Firebase Auth:
  - `signInWithEmailAndPassword(email, password)`
- Po sukcesie: przejście do kroku logicznego `AuthResolver` (sekcja 7)
- Błędy:
  - brutal alert box (border + shadow) z akcentem `#FF7675`
  - tekst przykładowy: „Nieprawidłowy email lub hasło.”

### 4.4 UX stany
- Loading na CTA: „Loguję…” + loader
- Disabled CTA jeśli pola puste lub invalid
- Walidacja inline (pod polem):
  - „Podaj email.”
  - „Podaj hasło.”
  - „Nieprawidłowy format email.”

---

## 5) TAB: „Załóż konto” (AuthCard / register)

### 5.1 Pola (zgodnie z Twoim flow — UWAGA: tu jest IMIĘ + NAZWISKO)
- `Imię` (firstName)
- `Nazwisko` (lastName)
- `Email`
- `Hasło` (min 8 znaków)

### 5.2 Akcje i linki
- Primary CTA: `Utwórz konto`
- Secondary/link:
  - „Masz już konto? Zaloguj się →” (przełącza na tab login)

### 5.3 Logika (wymagana)
1) Firebase Auth:
   - create user (np. `createUserWithEmailAndPassword`)
2) Tworzysz dokument `USER` (jedno konto = jeden dokument), format dokładnie:
```js
{
  id: uid,
  email,
  firstName,
  lastName,
  userType: "customer",
  emailVerified: false,
  createdAt
}
3) Redirect → AuthResolver
❗ Na tym etapie NIE tworzysz PARTNER.

### 5.4 UX stany
Po poprawnej rejestracji:
pokazuj success message w karcie (bez tworzenia PARTNER)
informacja: „Sprawdź mail i potwierdź konto (jeśli wymagane).”
Błędy:
email zajęty / słabe hasło → brutal alert + komunikat

## 6) TRYB: „Reset hasła” (AuthCard / reset) — TRZECI WIDOK W TEJ SAMEJ KARCIE
To nie jest osobna strona. To stan/tryb wewnątrz AuthCard.

### 6.1 Jak użytkownik tu trafia
klik w login: Nie pamiętasz hasła?
### 6.2 UI (w karcie)
Nagłówek: Reset hasła
Opis: „Podaj email, wyślemy Ci link do ustawienia nowego hasła.”
Pole:
Email
Primary CTA:
Wyślij link resetujący
Secondary/link (wymagane):
„Wróć do logowania →” (wraca do tab login)
### 6.3 Logika (wymagana)
Firebase Auth:
sendPasswordResetEmail(email)
Po sukcesie:
pokaż success message (brutal success box)
brak redirectów (użytkownik zostaje na tej karcie)
### 6.4 UX stany
CTA loading: „Wysyłam…”
Disabled CTA jeśli email invalid
Success message:
„Jeśli konto istnieje, wysłaliśmy link resetujący na: [email].”

## 7) STAN 2 — AUTH RESOLVER (LOGICZNE SERCE)
Widok: AuthResolver
To nie jest widok dla użytkownika. To krok logiczny po loginie/rejestracji.

### 7.1 Sprawdzenia (wymagane)
auth.uid istnieje
USER exists (document dla id === auth.uid)
Query:
PARTNER where userId == auth.uid
### 7.2 Wyniki (deterministyczne)
WYNIK A — ❌ USER bez biznesu:
redirect → NoBusinessView
WYNIK B — ✅ USER z biznesem:
redirect → BusinessDashboard
### 7.3 Edge cases (zalecane)
jeśli USER nie istnieje (a auth istnieje):
pokaż ekran błędu technicznego (brutal alert) + CTA „Wyloguj i spróbuj ponownie”
nie twórz alternatywnych userów bez Twojej decyzji (żeby nie robić duplikacji)

## 8) STAN 3A — USER BEZ BIZNESU
Widok: NoBusinessView
Cel: jasno komunikować „masz konto, ale nie masz biznesu” i dać 2 logiczne drogi.

### 8.1 Layout
Widok webowy po zalogowaniu (AppShell)
Możesz użyć gridu 2‑kolumnowego desktop / 1‑kolumnowego mobile
Tło jasne #F7F9FC, subtelne dekoracje
### 8.2 KARTA 1: „Korzystasz jako użytkownik”
Tytuł: Korzystasz jako użytkownik
Treść:
„Masz konto użytkownika PEDRO. Pełna funkcjonalność dostępna jest w aplikacji mobilnej.”
CTA:
Pobierz aplikację (placeholder link, klikalny)
### 8.3 KARTA 2: „Dodaj swój biznes”
Tytuł: Dodaj swój biznes
Treść:
„Chcesz dodać restaurację, sklep lub usługę? Zarejestruj swój biznes i włącz pakiet.”
CTA (wymagane):
Dodaj biznes
klik → RegisterBusinessView
### 8.4 Dodatkowe elementy (zalecane dla jasności)
Mały badge u góry strony:
„Zalogowano jako: [email]”
Link wylogowania: „Wyloguj”

## 9) STAN 3B — REJESTRACJA BIZNESU
Widok: RegisterBusinessView
To najważniejszy formularz webu.

### 9.1 Struktura formularza (sekcje + pola)
Sekcja: Dane firmy
companyName
nip
businessType
Sekcja: Adres
address.line1
address.line2
city
postalCode
country
Sekcja: Kontakt
email
phone
contactPersonName
website
Sekcja: Opis
description (textarea)
### 9.2 UI formularza (wymagane komponenty)
Sekcje jako „brutal fieldsets”:
nagłówek sekcji (H3)
border 3px
delikatny hard shadow
Inputy:
label + placeholder
helper text (opcjonalnie) np. format NIP/telefon
Walidacja:
inline errors + czerwony akcent (pink #FF7675)
Przyciski:
Primary CTA: Zapisz i przejdź do płatności
Secondary: Anuluj (wraca do NoBusinessView)
(opcjonalnie) Zapisz szkic — tylko jeśli już istnieje w Twoim projekcie; w przeciwnym razie nie dodawaj
### 9.3 Logika po submit (WYMAGANE)
Tworzysz dokument PARTNER dokładnie w istniejącym formacie:

js
Copy
{
  createdBy: auth.uid,
  userId: auth.uid,
  companyName,
  nip,
  address,
  email,
  phone,
  description,
  businessModel: {
    currentPhase: "beta_free",
    ppuEnabled: false
  },
  billing: {
    stripeCustomerId: null
  },
  isActive: true,
  createdAt
}
➡️ Redirect → BillingView

## 10) STAN 4 — BILLING / STRIPE
Widok: BillingView
Cel: aktywacja płatnego modelu. Zero funkcji produktowych.

### 10.1 KARTA: Status konta (wymagana)
Pokazuje:

currentPhase
ppuEnabled
Info (wymagane):
„Panel webowy służy wyłącznie do rozliczeń i płatności.”
### 10.2 KARTA: Wybór modelu (wymagana)
Opcje (zgodnie z modelem):

Beta free (jeśli aktywna)
PPU – Pay per use
CTA (wymagane):

Aktywuj PPU → Stripe Checkout
### 10.3 Po powrocie ze Stripe (wymagane zachowanie)
Webhook zapisuje:

stripeCustomerId
ppuEnabled: true
ppuActivatedAt
➡️ Redirect → BusinessDashboard

### 10.4 Dodatkowe przyciski (zalecane)
Zarządzaj płatnością (prowadzi do Stripe Customer Portal, jeśli masz)
Wróć do panelu (jeśli PPU aktywne)
## 11) STAN 5 — BUSINESS DASHBOARD (MVP)
Widok: BusinessDashboard
To nie jest pełny dashboard.

### 11.1 KARTA: Status biznesu (wymagana)
companyName
verificationStatus (jeśli istnieje w danych; jeśli nie — pokaż placeholder „Weryfikacja: w toku” bez tworzenia nowego pola)
isActive
### 11.2 KARTA: Rozliczenia (wymagana)
currentPhase
ppuEnabled
monthlyUsage.redeemedCoupons
monthlyUsage.totalAmount
CTA:

Pobierz fakturę (jeśli funkcja istnieje; jeśli nie — placeholder disabled + tooltip „Wkrótce”)
Zarządzaj płatnością (Stripe portal, jeśli jest)
### 11.3 KARTA: Gdzie zarządzać ofertami (wymagana)
Treść:

„Oferty i kupony dodasz w aplikacji mobilnej PEDRO.”
CTA:
Przejdź do aplikacji (placeholder link)
### 11.4 Dodatkowe elementy (zalecane)
Pasek informacyjny:
„Web = onboarding + billing. App = produkt.”
Wyloguj

## 12) PODSUMOWANIE (ARCHITEKTONICZNIE — MUST HAVE)
✔️ Jeden auth (Firebase Auth)
✔️ Jedna baza / jedno źródło prawdy
✔️ Jeden dokument USER na uid
✔️ Biznes to dokument PARTNER po userId === auth.uid
✔️ Web = onboarding + billing
✔️ App = produkt
✔️ Po zalogowaniu tylko jedno pytanie: „czy istnieje PARTNER dla uid?”

Ten flow:
nie koliduje z aplikacją mobilną
nie duplikuje logiki
jest skalowalny
jest MVP, ale „dorosły”
Koniec specyfikacji.






