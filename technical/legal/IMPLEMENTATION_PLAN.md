# Plan Implementacji Dokumentów Prawnych - PEDRO App

## Przegląd projektu

**Cel:** Dodanie dokumentów prawnych (Regulamin i Polityka Prywatności) do aplikacji PEDRO z możliwością łatwych aktualizacji i dostępem zarówno przez stronę www jak i aplikację mobilną.

**Status aplikacji:** Produkcyjna aplikacja Next.js 15 na Vercel z Firebase backend

## Analiza wymagań

### Wymagania funkcjonalne:
1. Dokumenty dostępne na www.pedro.app
2. API endpoints dla aplikacji mobilnej
3. Łatwe aktualizacje (edycja plików + deploy)
4. Wersjonowanie przez Git
5. Backup w formie PDF
6. Integracja z istniejącym design systemem

### Wymagania techniczne:
1. Wykorzystanie istniejącej architektury Next.js App Router
2. Zgodność z brutal design system
3. Responsywność
4. SEO optimization
5. Performance (statyczne treści)

## Struktura implementacji

### 1. Struktura folderów

```
app/
├── (public)/
│   ├── legal/
│   │   ├── layout.tsx                    # Layout dla stron prawnych
│   │   ├── regulamin/
│   │   │   └── page.tsx                  # /legal/regulamin
│   │   └── polityka-prywatnosci/
│   │       └── page.tsx                  # /legal/polityka-prywatnosci
│   └── page.tsx                          # Istniejący landing page
├── api/
│   └── legal/
│       ├── regulamin/
│       │   └── route.ts                  # API endpoint dla regulaminu
│       └── polityka-prywatnosci/
│           └── route.ts                  # API endpoint dla polityki
└── layout.tsx                            # Istniejący root layout

public/
└── legal/                                # Nowy folder
    ├── regulamin-pedro-beta.pdf
    └── polityka-prywatnosci-pedro.pdf

lib/
└── legal/                                # Nowy folder
    ├── regulamin.ts                      # Treść regulaminu jako const
    ├── polityka-prywatnosci.ts           # Treść polityki jako const
    └── legal-utils.ts                    # Utilities i typy

components/
└── legal/                                # Nowy folder
    ├── LegalDocument.tsx                 # Komponent wyświetlania dokumentu
    └── LegalNavigation.tsx               # Nawigacja między dokumentami
```

### 2. URL Structure

**Strony webowe:**
- `https://www.pedro.app/legal/regulamin`
- `https://www.pedro.app/legal/polityka-prywatnosci`

**API endpoints (dla aplikacji mobilnej):**
- `https://www.pedro.app/api/legal/regulamin`
- `https://www.pedro.app/api/legal/polityka-prywatnosci`

**Pliki PDF:**
- `https://www.pedro.app/legal/regulamin-pedro-beta.pdf`
- `https://www.pedro.app/legal/polityka-prywatnosci-pedro.pdf`

### 3. Struktura danych

```typescript
// lib/legal/legal-utils.ts
export interface LegalDocument {
  id: string
  title: string
  lastUpdated: string
  version: string
  content: LegalSection[]
  pdfUrl: string
  slug: string
}

export interface LegalSection {
  id: string
  title: string
  content: string
  subsections?: LegalSubsection[]
}

export interface LegalSubsection {
  id: string
  title: string
  content: string
}

export const LEGAL_DOCUMENTS = {
  REGULAMIN: 'regulamin',
  POLITYKA_PRYWATNOSCI: 'polityka-prywatnosci'
} as const

export type LegalDocumentType = typeof LEGAL_DOCUMENTS[keyof typeof LEGAL_DOCUMENTS]
```

## Plan implementacji krok po kroku

### Krok 1: Przygotowanie struktury danych
- [ ] Utworzenie `lib/legal/legal-utils.ts` z typami i utilities
- [ ] Konwersja markdown dokumentów na strukturę TypeScript
- [ ] Utworzenie `lib/legal/regulamin.ts`
- [ ] Utworzenie `lib/legal/polityka-prywatnosci.ts`

### Krok 2: Komponenty UI
- [ ] Utworzenie `components/legal/LegalDocument.tsx`
- [ ] Utworzenie `components/legal/LegalNavigation.tsx`
- [ ] Wykorzystanie istniejących komponentów z brutal design system

### Krok 3: Strony webowe
- [ ] Utworzenie `app/(public)/legal/layout.tsx`
- [ ] Utworzenie `app/(public)/legal/regulamin/page.tsx`
- [ ] Utworzenie `app/(public)/legal/polityka-prywatnosci/page.tsx`
- [ ] Test stron w przeglądarce

### Krok 4: API endpoints
- [ ] Utworzenie `app/api/legal/regulamin/route.ts`
- [ ] Utworzenie `app/api/legal/polityka-prywatnosci/route.ts`
- [ ] Test API endpoints

### Krok 5: Pliki PDF
- [ ] Skopiowanie PDF-ów do `public/legal/`
- [ ] Test dostępności plików

### Krok 6: Integracja z aplikacją
- [ ] Dodanie linków w `components/layout/Footer.tsx`
- [ ] Dodanie linków w formularzu rejestracji
- [ ] Test integracji

### Krok 7: Testy i optymalizacja
- [ ] Test wszystkich ścieżek
- [ ] Sprawdzenie responsywności
- [ ] Walidacja SEO
- [ ] Test performance

## Szczegóły implementacji

### 1. Design System Integration

Wykorzystanie istniejących komponentów:
- `BrutalCard` dla kontenerów
- `BrutalButton` dla przycisków
- Istniejące klasy CSS z `globals.css`
- Kolory: pedro-purple, pedro-lime, pedro-pink
- Typografia: Dela Gothic One dla nagłówków, Inter dla tekstu

### 2. Layout Structure

```tsx
// app/(public)/legal/layout.tsx
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-pedro-light">
      <Navigation /> {/* Istniejący komponent */}
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <LegalNavigation />
          {children}
        </div>
      </main>
      <Footer /> {/* Istniejący komponent */}
    </div>
  )
}
```

### 3. API Response Format

```typescript
// API Response Structure
interface LegalApiResponse {
  success: boolean
  document: {
    title: string
    version: string
    lastUpdated: string
    content: LegalSection[]
    pdfUrl: string
    webUrl: string
  }
  metadata: {
    timestamp: string
    version: string
  }
}
```

### 4. SEO Optimization

```typescript
// Metadata dla każdej strony
export const metadata: Metadata = {
  title: 'Regulamin - PEDRO App',
  description: 'Regulamin korzystania z aplikacji PEDRO w wersji BETA',
  robots: 'index, follow',
  openGraph: {
    title: 'Regulamin - PEDRO App',
    description: 'Regulamin korzystania z aplikacji PEDRO',
    type: 'article',
  }
}
```

### 5. Error Handling

- Graceful fallback dla brakujących dokumentów
- 404 strony dla nieprawidłowych ścieżek
- Error boundaries dla komponentów
- Logging błędów w API endpoints

### 6. Performance Considerations

- Statyczne generowanie stron (SSG)
- Lazy loading dla dużych dokumentów
- Optymalizacja obrazów (jeśli będą)
- Caching headers dla API endpoints

## Proces aktualizacji dokumentów

### Standardowa aktualizacja:
1. Edytować plik w `lib/legal/`
2. Zaktualizować `version` i `lastUpdated`
3. Commit zmian do Git
4. Deploy na Vercel (automatyczny)

### Większe zmiany:
1. Zaktualizować plik TypeScript
2. Zaktualizować PDF w `public/legal/`
3. Opcjonalnie dodać migration notice
4. Commit i deploy

### Wersjonowanie:
- Semantic versioning (1.0.0, 1.1.0, 2.0.0)
- Git tags dla ważnych wersji
- Changelog w komentarzach plików

## Bezpieczeństwo i zgodność

### RODO Compliance:
- Jasne informacje o przetwarzaniu danych
- Linki do kontaktu w sprawie danych osobowych
- Informacje o prawach użytkownika

### Dostępność:
- Semantic HTML
- Proper heading hierarchy
- Alt texts dla obrazów
- Keyboard navigation
- Screen reader compatibility

## Monitoring i analytics

### Metryki do śledzenia:
- Odwiedziny stron prawnych
- Pobrania PDF-ów
- API calls z aplikacji mobilnej
- Bounce rate na stronach prawnych

### Implementacja:
- Google Analytics events
- Vercel Analytics
- Custom logging w API endpoints

## Backup i recovery

### Backup strategy:
- Git repository jako primary backup
- PDF files jako secondary backup
- Database backup (jeśli będzie potrzebny)

### Recovery plan:
- Rollback przez Git
- Restore z PDF-ów
- Manual recreation jako last resort

## Testing Strategy

### Unit Tests:
- Utilities functions
- Component rendering
- API endpoints

### Integration Tests:
- Full page rendering
- API response format
- Link functionality

### E2E Tests:
- User journey przez strony prawne
- Mobile app integration
- PDF download flow

## Deployment Checklist

### Pre-deployment:
- [ ] Wszystkie testy przechodzą
- [ ] Code review completed
- [ ] Performance audit
- [ ] SEO audit
- [ ] Accessibility audit

### Post-deployment:
- [ ] Smoke tests na produkcji
- [ ] Monitor error rates
- [ ] Check analytics setup
- [ ] Verify PDF accessibility
- [ ] Test mobile app integration

## Maintenance Plan

### Regularne zadania:
- Miesięczny przegląd dokumentów
- Kwartalna aktualizacja PDF-ów
- Roczny audit compliance
- Monitoring performance metrics

### Planowane ulepszenia:
- Search functionality w dokumentach
- Multi-language support
- Version history viewer
- Interactive consent management

## Risk Assessment

### Potencjalne ryzyka:
1. **Breaking changes** - Minimalizowane przez wykorzystanie istniejącej architektury
2. **Performance impact** - Mitigowane przez static generation
3. **SEO impact** - Pozytywny wpływ przez dodanie nowych stron
4. **User confusion** - Minimalizowane przez jasną nawigację

### Mitigation strategies:
- Incremental deployment
- Feature flags (jeśli potrzebne)
- Rollback plan
- User communication

## Success Metrics

### Technical metrics:
- Zero breaking changes w istniejącej funkcjonalności
- Page load time < 2s
- API response time < 500ms
- 100% uptime podczas deployment

### Business metrics:
- Zwiększona compliance
- Lepsza user experience
- Łatwiejsze zarządzanie dokumentami
- Przygotowanie na skalowanie

## Conclusion

Ten plan zapewnia:
1. **Minimalne ryzyko** - wykorzystanie istniejącej architektury
2. **Maksymalną funkcjonalność** - web + mobile + PDF
3. **Łatwą maintenance** - Git-based updates
4. **Przyszłościowość** - skalowalna struktura
5. **Compliance** - RODO i legal requirements

Implementacja będzie przeprowadzona krok po kroku z testowaniem na każdym etapie.