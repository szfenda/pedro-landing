# PEDRO Legal Documents - Update Guide

## Przegląd

Ten przewodnik opisuje jak aktualizować dokumenty prawne (Regulamin i Politykę Prywatności) w aplikacji PEDRO. System został zaprojektowany tak, aby aktualizacje były proste i bezpieczne.

## Struktura Systemu

### Pliki do Edycji
```
lib/legal/
├── regulamin.ts              # Treść regulaminu
├── politykaPrywatnosci.ts    # Treść polityki prywatności
├── types.ts                  # Typy TypeScript (rzadko edytowane)
└── legal-utils.ts            # Funkcje pomocnicze (rzadko edytowane)

public/legal/
├── regulamin-pedro-beta.pdf
└── polityka-prywatnosci-pedro.pdf
```

### Automatycznie Generowane
- Strony webowe: `/legal/regulamin`, `/legal/polityka-prywatnosci`
- API endpoints: `/api/legal/regulamin`, `/api/legal/polityka-prywatnosci`
- Metadata i wersjonowanie

## Proces Aktualizacji Krok po Kroku

### 1. Przygotowanie

#### Sprawdź Aktualną Wersję
```bash
# Sprawdź aktualną wersję w pliku
grep "version:" lib/legal/regulamin.ts
grep "version:" lib/legal/politykaPrywatnosci.ts
```

#### Utwórz Branch (Opcjonalnie)
```bash
git checkout -b update-legal-docs-v1.1.0
```

### 2. Aktualizacja Regulaminu

#### Edytuj Plik
```typescript
// lib/legal/regulamin.ts

export function getRegulaminDocument(): LegalDocument {
  return {
    id: 'regulamin',
    title: 'Regulamin korzystania z aplikacji PEDRO',
    lastUpdated: '2025-01-15',        // ← AKTUALIZUJ DATĘ
    version: '1.1.0',                 // ← AKTUALIZUJ WERSJĘ
    slug: 'regulamin',
    description: 'Regulamin określa zasady...',
    pdfUrl: '/legal/regulamin-pedro-beta.pdf',
    content: [
      // ← EDYTUJ TREŚĆ TUTAJ
      {
        id: 'informacje-ogolne',
        title: '§1. Informacje ogólne',
        content: '',
        subsections: [
          {
            id: 'definicja-regulaminu',
            title: '1.',
            content: 'Niniejszy Regulamin określa...' // ← EDYTUJ
          }
          // Dodaj nowe subsections tutaj
        ]
      }
      // Dodaj nowe sections tutaj
    ]
  }
}
```

#### Struktura Treści

**Sekcja (Section):**
```typescript
{
  id: 'unique-section-id',           // Unikalny identyfikator
  title: '§X. Tytuł Sekcji',        // Tytuł sekcji
  content: 'Opcjonalny tekst...',    // Tekst wprowadzający (opcjonalny)
  subsections: [...]                 // Podsekcje (opcjonalne)
}
```

**Podsekcja (Subsection):**
```typescript
{
  id: 'unique-subsection-id',        // Unikalny identyfikator
  title: '1.',                       // Numer lub tytuł podsekcji
  content: 'Treść podsekcji...'      // Główna treść
}
```

#### Formatowanie Tekstu

**Pogrubienie:**
```typescript
content: 'Tekst z **pogrubieniem** w środku.'
```

**Nowe linie:**
```typescript
content: 'Pierwsza linia.\nDruga linia.\nTrzecia linia.'
```

**Listy:**
```typescript
content: 'Aplikacja umożliwia:\na) użytkownikom końcowym – przeglądanie ofert,\nb) biznesom – dodawanie ofert.'
```

### 3. Aktualizacja Polityki Prywatności

Proces identyczny jak dla regulaminu, ale edytuj plik:
```typescript
// lib/legal/politykaPrywatnosci.ts
```

### 4. Aktualizacja PDF (Opcjonalnie)

#### Zastąp Pliki PDF
```bash
# Skopiuj nowe pliki PDF
cp "nowy-regulamin.pdf" "public/legal/regulamin-pedro-beta.pdf"
cp "nowa-polityka.pdf" "public/legal/polityka-prywatnosci-pedro.pdf"
```

#### Sprawdź Rozmiary
```bash
ls -la public/legal/
```

### 5. Testowanie Lokalne

#### Uruchom Serwer Deweloperski
```bash
npm run dev
```

#### Sprawdź Strony
- http://localhost:3000/legal/regulamin
- http://localhost:3000/legal/polityka-prywatnosci

#### Sprawdź API
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/legal/regulamin"
Invoke-RestMethod -Uri "http://localhost:3000/api/legal/polityka-prywatnosci"

# lub curl
curl http://localhost:3000/api/legal/regulamin
curl http://localhost:3000/api/legal/polityka-prywatnosci
```

#### Sprawdź PDF
- http://localhost:3000/legal/regulamin-pedro-beta.pdf
- http://localhost:3000/legal/polityka-prywatnosci-pedro.pdf

### 6. Build i Walidacja

#### Sprawdź TypeScript
```bash
npx tsc --noEmit
```

#### Zbuduj Aplikację
```bash
npm run build
```

#### Sprawdź Logi
Upewnij się, że nie ma błędów w build process.

### 7. Deploy

#### Commit Zmian
```bash
git add .
git commit -m "Update legal documents to v1.1.0

- Updated regulamin with new section about XYZ
- Updated polityka prywatnosci with GDPR compliance
- Updated PDF files"
```

#### Push do Repository
```bash
git push origin main
# lub jeśli używasz branch:
git push origin update-legal-docs-v1.1.0
```

#### Automatyczny Deploy
Vercel automatycznie zdeployuje zmiany po push do main branch.

### 8. Weryfikacja Produkcyjna

#### Sprawdź Strony Live
- https://pedro.app/legal/regulamin
- https://pedro.app/legal/polityka-prywatnosci

#### Sprawdź API Live
```bash
Invoke-RestMethod -Uri "https://pedro.app/api/legal/regulamin"
```

#### Sprawdź PDF Live
- https://pedro.app/legal/regulamin-pedro-beta.pdf
- https://pedro.app/legal/polityka-prywatnosci-pedro.pdf

## Wersjonowanie

### Semantic Versioning

**Format:** `MAJOR.MINOR.PATCH`

#### MAJOR (X.0.0)
Istotne zmiany prawne wymagające ponownej akceptacji użytkowników:
- Zmiana warunków płatności
- Nowe obowiązki użytkowników
- Zmiana jurysdykcji
- Istotne zmiany w przetwarzaniu danych

#### MINOR (1.X.0)
Dodanie nowych sekcji lub znaczące uzupełnienia:
- Nowe sekcje regulaminu
- Rozszerzenie polityki prywatności
- Dodanie nowych usług
- Aktualizacja kontaktów

#### PATCH (1.1.X)
Drobne poprawki i korekty:
- Poprawki językowe
- Korekty formatowania
- Aktualizacja dat
- Drobne wyjaśnienia

### Przykłady Wersjonowania

```typescript
// Drobna poprawka językowa
version: '1.0.1'
lastUpdated: '2025-01-15'

// Dodanie nowej sekcji o cookies
version: '1.1.0'
lastUpdated: '2025-02-01'

// Istotne zmiany w warunkach płatności
version: '2.0.0'
lastUpdated: '2025-03-01'
```

## Najlepsze Praktyki

### 1. Przed Edycją

#### Backup
```bash
# Utwórz kopię zapasową
cp lib/legal/regulamin.ts lib/legal/regulamin.ts.backup
cp lib/legal/politykaPrywatnosci.ts lib/legal/politykaPrywatnosci.ts.backup
```

#### Sprawdź Aktualną Wersję
```bash
grep -n "version\|lastUpdated" lib/legal/*.ts
```

### 2. Podczas Edycji

#### Zachowaj Strukturę
- Nie zmieniaj `id` sekcji i podsekcji (używane w linkach)
- Zachowaj hierarchię numeracji (§1, §2, etc.)
- Używaj spójnego formatowania

#### Testuj Formatowanie
- Sprawdź jak wygląda tekst na stronie
- Przetestuj długie linie
- Sprawdź listy i numerowanie

### 3. Po Edycji

#### Sprawdź Wszystkie Formaty
- Strona webowa
- API response
- PDF (jeśli aktualizowany)

#### Dokumentuj Zmiany
```bash
# W commit message opisz co zostało zmienione
git commit -m "Update legal docs v1.1.0

Changes:
- Added section about data retention (§8.5)
- Updated contact information (§9.1)
- Fixed typos in privacy policy (§3.2)
- Updated PDF files with new content"
```

## Częste Problemy i Rozwiązania

### 1. Błędy TypeScript

#### Problem: Cannot find module
```
Cannot find module './politykaPrywatnosci'
```

**Rozwiązanie:**
- Sprawdź nazwę pliku (bez myślników!)
- Sprawdź import w `legal-utils.ts`
- Restart TypeScript server w IDE

#### Problem: Type errors
```
Property 'content' is missing in type
```

**Rozwiązanie:**
- Sprawdź strukturę obiektu w pliku
- Upewnij się, że wszystkie wymagane pola są wypełnione
- Sprawdź typy w `types.ts`

### 2. Błędy Build

#### Problem: Build fails
```
Failed to compile
```

**Rozwiązanie:**
```bash
# Sprawdź szczegóły błędu
npm run build

# Sprawdź TypeScript
npx tsc --noEmit

# Wyczyść cache
rm -rf .next
npm run build
```

### 3. Problemy z PDF

#### Problem: PDF nie ładuje się
**Rozwiązanie:**
- Sprawdź czy plik istnieje w `public/legal/`
- Sprawdź rozmiar pliku (nie powinien być za duży)
- Sprawdź czy plik nie jest uszkodzony

### 4. Problemy z API

#### Problem: API zwraca błąd 500
**Rozwiązanie:**
- Sprawdź logi Vercel
- Sprawdź czy wszystkie pliki są poprawnie zaimportowane
- Sprawdź strukturę danych w plikach

## Monitoring i Maintenance

### 1. Regularne Sprawdzenia

#### Miesięcznie
- Sprawdź czy wszystkie linki działają
- Sprawdź czy PDF-y są dostępne
- Sprawdź API endpoints

#### Kwartalnie
- Przejrzyj treść pod kątem aktualności
- Sprawdź zgodność z nowymi przepisami
- Zaktualizuj daty jeśli potrzeba

### 2. Monitoring Błędów

#### Vercel Logs
```bash
# Sprawdź logi produkcyjne
vercel logs
```

#### Health Check
```bash
# Sprawdź status API
curl https://pedro.app/api/health
```

## Kontakt i Wsparcie

### W przypadku problemów:
- **Email:** kontakt@pedro.app
- **Dokumentacja:** `/technical/legal/`
- **Logi:** Vercel Dashboard
- **Status:** `/api/health`

### Pilne zmiany prawne:
1. Wykonaj zmiany zgodnie z tym przewodnikiem
2. Użyj MAJOR version bump (np. 2.0.0)
3. Przetestuj dokładnie przed deploy
4. Poinformuj użytkowników o zmianach
5. Rozważ wymaganie ponownej akceptacji