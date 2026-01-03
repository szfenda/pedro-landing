# PEDRO - System Edycji Danych Użytkownika i Zarządzania Kontem

## Przegląd

Dokument opisuje implementację systemu edycji danych użytkownika i biznesu oraz możliwości usuwania konta w aplikacji PEDRO. Rozwiązanie wykorzystuje obecną architekturę Firebase Auth + Firestore i minimalizuje zmiany w istniejącym kodzie.

## Obecna Architektura (Analiza)

### Struktura danych:
- **Firebase Auth** - autoryzacja użytkowników (email, hasło)
- **Firestore kolekcje**:
  - `partners` - dokumenty biznesów (zawierają `userId` z Firebase Auth)
  - Brak kolekcji `users` - dane użytkownika tylko w Firebase Auth

### Typy użytkowników:
1. **Zwykły użytkownik** - tylko Firebase Auth, bez biznesu
2. **Użytkownik z biznesem** - Firebase Auth + dokument w `partners`

### Obecny flow:
1. Rejestracja/logowanie → Firebase Auth
2. Resolver sprawdza czy istnieje dokument `PARTNER` dla `userId`
3. Brak biznesu → `/no-business`
4. Ma biznes → `/dashboard`

## Nowa Funkcjonalność - Specyfikacja

### 1. Nowe Strony i Komponenty

#### A) Strona Ustawień Użytkownika: `/settings`
**Lokalizacja**: `app/(protected)/settings/page.tsx`

**Funkcjonalność**:
- Edycja danych Firebase Auth (email, hasło)
- Sekcja bezpieczeństwa (zmiana hasła)
- Link do edycji danych biznesu (jeśli użytkownik ma biznes)
- Strefa niebezpieczna - usuwanie konta
- Spójny design z resztą aplikacji (Brutal UI)

**Layout**:
```
┌─────────────────────────────────────┐
│ AuthNavigation                      │
├─────────────────────────────────────┤
│ Header: "Ustawienia konta"          │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Dane osobowe                    │ │
│ │ - Email                         │ │
│ │ - [Zmień email]                 │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Bezpieczeństwo                  │ │
│ │ - Zmiana hasła                  │ │
│ │ - [Zmień hasło]                 │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Dane biznesu (jeśli ma biznes)  │ │
│ │ - Nazwa firmy: XYZ              │ │
│ │ - [Edytuj dane biznesu]         │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Strefa niebezpieczna            │ │
│ │ - [Usuń biznes] (jeśli ma)      │ │
│ │ - [Usuń konto]                  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### B) Strona Edycji Biznesu: `/edit-business`
**Lokalizacja**: `app/(protected)/edit-business/page.tsx`

**Funkcjonalność**:
- Formularz identyczny jak `/register-business` ale z wypełnionymi danymi
- Wszystkie sekcje edytowalne (dane firmy, adres, kontakt, opis)
- Przycisk "Zapisz zmiany" zamiast "Zapisz i przejdź do płatności"
- Przycisk "Anuluj" → powrót do `/dashboard`
- Walidacja identyczna jak przy rejestracji

**Komponenty do wykorzystania**:
- `BusinessForm.tsx` (modyfikacja - tryb edycji)
- `BusinessFormSection.tsx` (bez zmian)
- `ProgressIndicator.tsx` (bez zmian)

#### C) Nowe Komponenty Settings

**1. `components/settings/UserSettingsForm.tsx`**
```typescript
interface UserSettingsFormProps {
  user: User
  onEmailUpdate: (newEmail: string) => Promise<void>
}
```
- Formularz edycji emaila
- Walidacja email (Zod)
- Loading states
- Error handling

**2. `components/settings/SecuritySettings.tsx`**
```typescript
interface SecuritySettingsProps {
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<void>
}
```
- Formularz zmiany hasła
- Pola: obecne hasło, nowe hasło, powtórz hasło
- Walidacja siły hasła
- Success/error feedback

**3. `components/settings/BusinessSettingsCard.tsx`**
```typescript
interface BusinessSettingsCardProps {
  partner: PartnerData | null
  loading: boolean
}
```
- Wyświetla podstawowe dane biznesu
- Link do edycji biznesu
- Status weryfikacji

**4. `components/settings/DangerZone.tsx`**
```typescript
interface DangerZoneProps {
  hasPartner: boolean
  onDeleteBusiness: () => Promise<void>
  onDeleteAccount: () => Promise<void>
}
```
- Sekcja z niebezpiecznymi operacjami
- Modalne potwierdzenia
- Różne opcje w zależności od typu użytkownika

### 2. Modyfikacje Istniejących Komponentów

#### A) Navigation.tsx - Dropdown Menu
**Plik**: `components/layout/Navigation.tsx`

**Zmiany**:
```typescript
// W dropdown menu dodać przed "Wyloguj":
<button
  onClick={() => router.push('/settings')}
  className="w-full text-left px-4 py-3 hover:bg-pedro-light rounded-button transition-colors flex items-center gap-3 font-medium text-pedro-dark"
>
  <span className="text-lg">⚙️</span>
  Ustawienia
</button>
```

#### B) Dashboard - Przycisk Edycji
**Plik**: `app/(protected)/dashboard/page.tsx`

**Zmiany**:
```typescript
// W karcie "Status biznesu" dodać przycisk:
<div className="pt-4">
  <BrutalButton
    variant="outline"
    size="sm"
    onClick={() => router.push('/edit-business')}
    className="w-full"
  >
    ⚙️ Edytuj dane biznesu
  </BrutalButton>
</div>
```

#### C) BusinessForm.tsx - Tryb Edycji
**Plik**: `components/business/BusinessForm.tsx`

**Nowe props**:
```typescript
interface BusinessFormProps {
  mode?: 'create' | 'edit'
  partnerId?: string
  onSubmit?: (data: BusinessFormData) => void
  onCancel?: () => void
  initialData?: Partial<BusinessFormData>
}
```

**Zmiany**:
- Conditional rendering przycisku (Create vs Update)
- Różne API endpoints w zależności od trybu
- Różne redirect po sukcesie

### 3. Nowe API Endpoints

#### A) `/api/user/update-email` - Zmiana Emaila
**Plik**: `app/api/user/update-email/route.ts`

**Funkcjonalność**:
```typescript
POST /api/user/update-email
Body: { newEmail: string, password: string }
Response: { success: boolean, message: string }
```

**Implementacja**:
- Weryfikacja obecnego hasła
- Aktualizacja email w Firebase Auth
- Wysyłka emaila weryfikacyjnego
- Error handling (email zajęty, słabe hasło, etc.)

#### B) `/api/user/change-password` - Zmiana Hasła
**Plik**: `app/api/user/change-password/route.ts`

**Funkcjonalność**:
```typescript
POST /api/user/change-password
Body: { currentPassword: string, newPassword: string }
Response: { success: boolean, message: string }
```

**Implementacja**:
- Weryfikacja obecnego hasła (reauthentication)
- Aktualizacja hasła w Firebase Auth
- Invalidacja sesji (opcjonalnie)

#### C) `/api/user/delete-account` - Usuwanie Konta
**Plik**: `app/api/user/delete-account/route.ts`

**Funkcjonalność**:
```typescript
DELETE /api/user/delete-account
Body: { password: string, confirmation: string }
Response: { success: boolean, message: string }
```

**Implementacja**:
1. Weryfikacja hasła (reauthentication)
2. Sprawdzenie confirmation === "USUŃ"
3. Usunięcie dokumentu `PARTNER` (jeśli istnieje)
4. Cleanup w Stripe (anulowanie subskrypcji)
5. Usunięcie konta z Firebase Auth
6. Cleanup cookies

#### D) `/api/business/update` - Aktualizacja Biznesu
**Plik**: `app/api/business/update/route.ts`

**Funkcjonalność**:
```typescript
PUT /api/business/update
Body: BusinessFormData & { partnerId: string }
Response: { success: boolean, partner: PartnerData }
```

**Implementacja**:
- Walidacja danych (identyczna jak przy tworzeniu)
- Sprawdzenie uprawnień (userId === auth.uid)
- Aktualizacja dokumentu w Firestore
- Zwrócenie zaktualizowanych danych

#### E) `/api/business/delete` - Usuwanie Biznesu
**Plik**: `app/api/business/delete/route.ts`

**Funkcjonalność**:
```typescript
DELETE /api/business/delete
Body: { partnerId: string, confirmation: string }
Response: { success: boolean, message: string }
```

**Implementacja**:
1. Sprawdzenie uprawnień
2. Weryfikacja confirmation === "USUŃ BIZNES"
3. Cleanup w Stripe (anulowanie subskrypcji)
4. Usunięcie dokumentu z Firestore
5. Zachowanie konta użytkownika

### 4. Middleware - Nowe Ścieżki Chronione

**Plik**: `middleware.ts`

**Zmiany**:
```typescript
const protectedPaths = [
  '/resolver',
  '/no-business', 
  '/register-business',
  '/billing',
  '/dashboard',
  '/settings',        // NOWE
  '/edit-business'    // NOWE
]
```

### 5. Walidacja - Nowe Schematy

**Plik**: `lib/validations.ts`

**Nowe schematy**:
```typescript
// Zmiana emaila
export const updateEmailSchema = z.object({
  newEmail: z.string().email('Nieprawidłowy format email'),
  password: z.string().min(1, 'Podaj obecne hasło'),
})

// Zmiana hasła
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Podaj obecne hasło'),
  newPassword: z.string().min(8, 'Nowe hasło musi mieć co najmniej 8 znaków'),
  confirmPassword: z.string().min(1, 'Potwierdź nowe hasło'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Hasła muszą być identyczne",
  path: ["confirmPassword"],
})

// Usuwanie konta
export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Podaj hasło'),
  confirmation: z.literal('USUŃ', {
    errorMap: () => ({ message: 'Wpisz "USUŃ" aby potwierdzić' })
  }),
})

// Usuwanie biznesu
export const deleteBusinessSchema = z.object({
  confirmation: z.literal('USUŃ BIZNES', {
    errorMap: () => ({ message: 'Wpisz "USUŃ BIZNES" aby potwierdzić' })
  }),
})

export type UpdateEmailFormData = z.infer<typeof updateEmailSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>
export type DeleteBusinessFormData = z.infer<typeof deleteBusinessSchema>
```

### 6. UX Flow - Scenariusze Użycia

#### Scenariusz 1: Zwykły użytkownik (bez biznesu)
1. Dashboard → "Moje konto" → "Ustawienia" → `/settings`
2. Widzi sekcje: "Dane osobowe", "Bezpieczeństwo", "Strefa niebezpieczna"
3. Może: zmienić email, zmienić hasło, usunąć konto
4. Nie widzi sekcji "Dane biznesu"

#### Scenariusz 2: Użytkownik z biznesem
1. Dashboard → "Moje konto" → "Ustawienia" → `/settings`
2. Widzi wszystkie sekcje + "Dane biznesu"
3. "Edytuj dane biznesu" → `/edit-business`
4. Może: edytować wszystkie dane biznesu, usunąć biznes, usunąć całe konto

#### Scenariusz 3: Edycja danych biznesu
1. `/settings` → "Edytuj dane biznesu" → `/edit-business`
2. Formularz z wypełnionymi danymi (identyczny jak rejestracja)
3. Może edytować wszystkie sekcje
4. "Zapisz zmiany" → aktualizacja w Firestore → powrót do `/dashboard`
5. "Anuluj" → powrót do `/dashboard` bez zmian

### 7. Bezpieczeństwo - Potwierdzenia i Walidacje

#### Zmiana Emaila:
- Wymagane obecne hasło
- Walidacja formatu email
- Sprawdzenie czy email nie jest zajęty
- Wysyłka emaila weryfikacyjnego
- Tymczasowa blokada zmiany (cooldown)

#### Zmiana Hasła:
- Wymagane obecne hasło (reauthentication)
- Walidacja siły nowego hasła
- Potwierdzenie nowego hasła
- Opcjonalne wylogowanie z innych sesji

#### Usuwanie Konta:
```typescript
// Modal z ostrzeżeniem:
"⚠️ UWAGA: Ta operacja jest nieodwracalna!"
"Usunięcie konta spowoduje:"
"• Utratę dostępu do aplikacji"
"• Usunięcie wszystkich danych"
"• Anulowanie subskrypcji (jeśli aktywna)"
"• Usunięcie biznesu (jeśli istnieje)"

// Formularz potwierdzenia:
"Wpisz swoje hasło:"
[password input]
"Wpisz 'USUŃ' aby potwierdzić:"
[confirmation input]
[USUŃ KONTO - czerwony przycisk]
```

#### Usuwanie Biznesu:
```typescript
// Modal z informacją:
"Usunięcie biznesu spowoduje:"
"• Utratę dostępu do dashboardu biznesu"
"• Anulowanie subskrypcji Stripe"
"• Usunięcie wszystkich danych biznesu"
"• Zachowanie konta użytkownika"

// Formularz potwierdzenia:
"Wpisz 'USUŃ BIZNES' aby potwierdzić:"
[confirmation input]
[USUŃ BIZNES - czerwony przycisk]
```

### 8. Implementacja - Lista Plików

#### Nowe pliki do stworzenia:
1. `technical/USER_SETTINGS_AND_ACCOUNT_MANAGEMENT.md` ✅
2. `app/(protected)/settings/page.tsx`
3. `app/(protected)/edit-business/page.tsx`
4. `components/settings/UserSettingsForm.tsx`
5. `components/settings/SecuritySettings.tsx`
6. `components/settings/BusinessSettingsCard.tsx`
7. `components/settings/DangerZone.tsx`
8. `app/api/user/update-email/route.ts`
9. `app/api/user/change-password/route.ts`
10. `app/api/user/delete-account/route.ts`
11. `app/api/business/update/route.ts`
12. `app/api/business/delete/route.ts`

#### Pliki do modyfikacji:
1. `middleware.ts` - dodanie nowych ścieżek chronionych
2. `components/layout/Navigation.tsx` - link "Ustawienia" w dropdown
3. `app/(protected)/dashboard/page.tsx` - przycisk "Edytuj dane biznesu"
4. `components/business/BusinessForm.tsx` - tryb edycji
5. `lib/validations.ts` - nowe schematy walidacji

### 9. Integracja z Firebase

#### Firebase Auth Operations:
```typescript
// Zmiana emaila
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'

// Zmiana hasła
import { updatePassword, reauthenticateWithCredential } from 'firebase/auth'

// Usuwanie konta
import { deleteUser, reauthenticateWithCredential } from 'firebase/auth'
```

#### Firestore Operations:
```typescript
// Aktualizacja biznesu
import { doc, updateDoc, getDoc } from 'firebase/firestore'

// Usuwanie biznesu
import { doc, deleteDoc } from 'firebase/firestore'
```

#### Stripe Cleanup:
```typescript
// Anulowanie subskrypcji przy usuwaniu
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Cancel subscription
await stripe.subscriptions.cancel(subscriptionId)

// Delete customer
await stripe.customers.del(customerId)
```

### 10. Testowanie - Scenariusze

#### Test Cases:
1. **Edycja emaila** - poprawny email, zajęty email, błędny format
2. **Zmiana hasła** - poprawne hasło, błędne obecne hasło, słabe nowe hasło
3. **Edycja biznesu** - wszystkie pola, walidacja NIP, walidacja telefonu
4. **Usuwanie biznesu** - z subskrypcją Stripe, bez subskrypcji
5. **Usuwanie konta** - z biznesem, bez biznesu, błędne potwierdzenie
6. **Autoryzacja** - dostęp do cudzych danych, niezalogowany użytkownik
7. **UI/UX** - responsywność, loading states, error handling

### 11. Zalety Rozwiązania

1. **Minimalne zmiany** - wykorzystuje 90% istniejącego kodu
2. **Bezpieczeństwo** - wszystkie operacje wymagają autoryzacji i potwierdzenia
3. **UX** - intuicyjne umiejscowienie w nawigacji i dashboardzie
4. **Skalowalność** - łatwo dodać więcej opcji (2FA, eksport danych, etc.)
5. **Spójność** - używa obecnych komponentów UI (Brutal design)
6. **Separacja** - jasny podział między danymi użytkownika a biznesu
7. **Rollback** - możliwość łatwego cofnięcia zmian

### 12. Przyszłe Rozszerzenia (Opcjonalne)

#### Faza 2:
- **Eksport danych** - GDPR compliance
- **Historia zmian** - audit log
- **2FA** - dwuskładnikowa autoryzacja
- **Backup konta** - przed usunięciem

#### Faza 3:
- **Przeniesienie biznesu** - między kontami
- **Współwłaściciele** - wielu użytkowników na biznes
- **Uprawnienia** - różne role w biznesie

## Podsumowanie

Rozwiązanie zapewnia kompletny system zarządzania kontem użytkownika i danymi biznesu, zachowując spójność z obecną architekturą aplikacji PEDRO. Implementacja jest bezpieczna, skalowalna i przyjazna użytkownikowi.

**Status**: Gotowe do implementacji
**Priorytet**: Wysoki (podstawowa funkcjonalność)
**Szacowany czas**: 2-3 dni robocze
**Ryzyko**: Niskie (wykorzystuje istniejące komponenty)