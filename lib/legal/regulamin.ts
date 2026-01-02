/**
 * Regulamin korzystania z aplikacji PEDRO (wersja BETA)
 * Ostatnia aktualizacja: 2 stycznia 2025
 * Wersja: 1.0.0-beta
 */

import { LegalDocument } from './types'

export function getRegulaminDocument(): LegalDocument {
  return {
    id: 'regulamin',
    title: 'Regulamin korzystania z aplikacji PEDRO',
    lastUpdated: '2025-01-02',
    version: '1.0.0-beta',
    slug: 'regulamin',
    description: 'Regulamin określa zasady korzystania z aplikacji mobilnej oraz serwisu internetowego PEDRO w fazie BETA.',
    pdfUrl: '/legal/regulamin-pedro-beta.pdf',
    content: [
      {
        id: 'informacje-ogolne',
        title: '§1. Informacje ogólne',
        content: '',
        subsections: [
          {
            id: 'definicja-regulaminu',
            title: '1.',
            content: 'Niniejszy Regulamin określa zasady korzystania z aplikacji mobilnej oraz serwisu internetowego **PEDRO** (dalej: „Aplikacja").'
          },
          {
            id: 'faza-beta',
            title: '2.',
            content: 'Aplikacja PEDRO jest projektem w fazie **BETA**, udostępnianym w celu testowania funkcjonalności oraz zebrania opinii użytkowników.'
          },
          {
            id: 'terytorium',
            title: '3.',
            content: 'Aplikacja działa wyłącznie na terytorium Rzeczypospolitej Polskiej.'
          },
          {
            id: 'bezplatnosc',
            title: '4.',
            content: 'Korzystanie z Aplikacji jest dobrowolne i bezpłatne.'
          }
        ]
      },
      {
        id: 'administrator',
        title: '§2. Administrator i status prawny projektu',
        content: '',
        subsections: [
          {
            id: 'administrator-danych',
            title: '1.',
            content: 'Administratorem Aplikacji oraz podmiotem odpowiedzialnym za jej funkcjonowanie jest **Marcin Czaplicki**, osoba fizyczna, twórca projektu PEDRO.'
          },
          {
            id: 'status-prawny',
            title: '2.',
            content: 'Projekt PEDRO w fazie BETA nie jest prowadzony w ramach działalności gospodarczej.'
          },
          {
            id: 'brak-oplat',
            title: '3.',
            content: 'Administrator nie świadczy w fazie BETA usług odpłatnych, nie pobiera opłat oraz nie wystawia faktur.'
          }
        ]
      },
      {
        id: 'charakter-aplikacji',
        title: '§3. Charakter Aplikacji',
        content: '',
        subsections: [
          {
            id: 'definicja-pedro',
            title: '1.',
            content: 'PEDRO jest platformą informacyjną agregującą oferty, promocje i kupony lokalnych biznesów.'
          },
          {
            id: 'funkcjonalnosci',
            title: '2.',
            content: 'Aplikacja umożliwia:\na) użytkownikom końcowym – przeglądanie ofert oraz zapisywanie kuponów,\nb) biznesom – dodawanie i edycję ofert promocyjnych w celach testowych.'
          },
          {
            id: 'brak-odpowiedzialnosci-umowy',
            title: '3.',
            content: 'Aplikacja nie jest stroną umowy sprzedaży pomiędzy użytkownikiem a biznesem.'
          }
        ]
      },
      {
        id: 'rejestracja',
        title: '§4. Rejestracja i konta użytkowników',
        content: '',
        subsections: [
          {
            id: 'wymaganie-konta',
            title: '1.',
            content: 'Korzystanie z Aplikacji wymaga utworzenia konta.'
          },
          {
            id: 'dane-rejestracji',
            title: '2.',
            content: 'Podczas rejestracji użytkownik podaje:\na) imię,\nb) adres e-mail,\nc) hasło.'
          },
          {
            id: 'dobrowolnosc-danych',
            title: '3.',
            content: 'Podanie danych jest dobrowolne, lecz niezbędne do korzystania z Aplikacji.'
          },
          {
            id: 'usuniecie-konta',
            title: '4.',
            content: 'Użytkownik może w każdej chwili usunąć konto, co skutkuje trwałym usunięciem danych.'
          }
        ]
      },
      {
        id: 'lokalizacja',
        title: '§5. Lokalizacja',
        content: '',
        subsections: [
          {
            id: 'wykorzystanie-lokalizacji',
            title: '1.',
            content: 'Aplikacja może wykorzystywać dane lokalizacyjne użytkownika w celu prezentowania ofert w pobliżu.'
          },
          {
            id: 'odmowa-lokalizacji',
            title: '2.',
            content: 'Użytkownik może w każdej chwili odmówić dostępu do lokalizacji lub ją wyłączyć.'
          },
          {
            id: 'brak-blokady',
            title: '3.',
            content: 'Brak zgody na lokalizację nie blokuje korzystania z Aplikacji.'
          }
        ]
      },
      {
        id: 'konta-biznesowe',
        title: '§6. Konta biznesowe',
        content: '',
        subsections: [
          {
            id: 'testowanie-biznesow',
            title: '1.',
            content: 'W fazie BETA biznesy mogą zakładać konta w celu testowania funkcji dodawania ofert.'
          },
          {
            id: 'dane-biznesu',
            title: '2.',
            content: 'Wymagane dane biznesu:\na) nazwa biznesu,\nb) adres,\nc) numer NIP (wyłącznie do celów identyfikacyjnych i przyszłych rozliczeń).'
          },
          {
            id: 'prywatnosc-nip',
            title: '3.',
            content: 'Numer NIP nie jest widoczny dla użytkowników końcowych.'
          },
          {
            id: 'widocznosc-danych',
            title: '4.',
            content: 'Dane biznesowe są widoczne dla użytkowników w zakresie nazwy, adresu i opisu.'
          }
        ]
      },
      {
        id: 'faza-beta-platnosci',
        title: '§7. Faza BETA i przyszłe płatności',
        content: '',
        subsections: [
          {
            id: 'bezplatnosc-beta',
            title: '1.',
            content: 'Wszystkie funkcje Aplikacji w fazie BETA są nieodpłatne.'
          },
          {
            id: 'zastrzezenie-platnosci',
            title: '2.',
            content: 'Administrator zastrzega możliwość wprowadzenia płatności po zakończeniu fazy BETA.'
          },
          {
            id: 'wyprzedzenie-informacji',
            title: '3.',
            content: 'O zakończeniu fazy BETA oraz planowanym uruchomieniu płatności biznesy zostaną poinformowane z co najmniej **7-dniowym wyprzedzeniem**.'
          },
          {
            id: 'warunek-platnosci',
            title: '4.',
            content: 'Płatności nie zostaną uruchomione bez powołania podmiotu prawnego.'
          }
        ]
      },
      {
        id: 'odpowiedzialnosc',
        title: '§8. Odpowiedzialność',
        content: '',
        subsections: [
          {
            id: 'as-is',
            title: '1.',
            content: 'Aplikacja jest udostępniana w formule „as is".'
          },
          {
            id: 'brak-gwarancji',
            title: '2.',
            content: 'Administrator nie gwarantuje ciągłości działania ani kompletności danych.'
          },
          {
            id: 'brak-odpowiedzialnosci-tresci',
            title: '3.',
            content: 'Administrator nie ponosi odpowiedzialności za treść ofert publikowanych przez biznesy.'
          }
        ]
      },
      {
        id: 'reklamacje',
        title: '§9. Reklamacje i kontakt',
        content: '',
        subsections: [
          {
            id: 'adres-kontaktowy',
            title: '1.',
            content: 'Wszelkie uwagi i reklamacje można zgłaszać na adres: **kontakt@pedro.app**.'
          },
          {
            id: 'czas-odpowiedzi',
            title: '2.',
            content: 'Administrator dołoży starań, aby odpowiedzieć w rozsądnym terminie.'
          }
        ]
      },
      {
        id: 'postanowienia-koncowe',
        title: '§10. Postanowienia końcowe',
        content: '',
        subsections: [
          {
            id: 'zmiany-regulaminu',
            title: '1.',
            content: 'Regulamin może być zmieniany w trakcie fazy BETA.'
          },
          {
            id: 'informowanie-o-zmianach',
            title: '2.',
            content: 'O istotnych zmianach użytkownicy zostaną poinformowani.'
          },
          {
            id: 'prawo-polskie',
            title: '3.',
            content: 'W sprawach nieuregulowanych zastosowanie ma prawo polskie.'
          }
        ]
      }
    ]
  }
}