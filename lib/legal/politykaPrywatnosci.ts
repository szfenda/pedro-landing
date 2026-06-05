/**
 * Polityka Prywatności PEDRO
 * Ostatnia aktualizacja: 2 stycznia 2025
 * Wersja: 1.0.0-beta
 */

import { LegalDocument } from './types'

export function getPolitykaPrywatnosciDocument(): LegalDocument {
  return {
    id: 'polityka-prywatnosci',
    title: 'Polityka Prywatności PEDRO',
    lastUpdated: '2025-01-02',
    version: '1.0.0-beta',
    slug: 'polityka-prywatnosci',
    description: 'Polityka Prywatności opisuje zasady przetwarzania danych osobowych użytkowników aplikacji mobilnej oraz serwisu internetowego PEDRO.',
    pdfUrl: '/legal/polityka-prywatnosci-pedro.pdf',
    content: [
      {
        id: 'informacje-ogolne',
        title: '1. Informacje ogólne',
        content: 'Niniejsza Polityka Prywatności opisuje zasady przetwarzania danych osobowych użytkowników aplikacji mobilnej oraz serwisu internetowego **PEDRO**.',
        subsections: []
      },
      {
        id: 'administrator-danych',
        title: '2. Administrator danych',
        content: 'Administratorem danych osobowych jest **Marcin Czaplicki**, osoba fizyczna, twórca projektu PEDRO (dalej: „Administrator").',
        subsections: []
      },
      {
        id: 'zakres-danych',
        title: '3. Zakres przetwarzanych danych',
        content: '',
        subsections: [
          {
            id: 'uzytkownicy-koncowi',
            title: 'Użytkownicy końcowi:',
            content: '- imię,\n- adres e-mail,\n- hasło (przechowywane w formie zaszyfrowanej),\n- dane lokalizacyjne (opcjonalnie).'
          },
          {
            id: 'biznesy',
            title: 'Biznesy:',
            content: '- nazwa biznesu,\n- adres,\n- numer NIP (wyłącznie do celów identyfikacyjnych i przyszłych rozliczeń).'
          }
        ]
      },
      {
        id: 'cele-przetwarzania',
        title: '4. Cele przetwarzania danych',
        content: 'Dane przetwarzane są w celu:',
        subsections: [
          {
            id: 'cele-lista',
            title: '',
            content: '- założenia i prowadzenia konta użytkownika lub biznesu,\n- umożliwienia korzystania z funkcji Aplikacji,\n- prezentowania ofert lokalnych,\n- komunikacji dotyczącej funkcjonowania Aplikacji,\n- informowania o nowych funkcjach (za zgodą użytkownika).'
          }
        ]
      },
      {
        id: 'podstawa-prawna',
        title: '5. Podstawa prawna',
        content: 'Dane przetwarzane są na podstawie:',
        subsections: [
          {
            id: 'podstawy-lista',
            title: '',
            content: '- zgody użytkownika (art. 6 ust. 1 lit. a RODO),\n- niezbędności do wykonania usługi (art. 6 ust. 1 lit. b RODO).'
          }
        ]
      },
      {
        id: 'lokalizacja',
        title: '6. Lokalizacja',
        content: '',
        subsections: [
          {
            id: 'wykorzystanie-lokalizacji',
            title: '',
            content: 'Dane lokalizacyjne wykorzystywane są wyłącznie w celu prezentowania ofert w pobliżu użytkownika.\nZgoda na lokalizację może być w każdej chwili cofnięta.'
          }
        ]
      },
      {
        id: 'odbiorcy-danych',
        title: '7. Odbiorcy danych i podmioty przetwarzające',
        content: 'Dane mogą być przetwarzane przez:',
        subsections: [
          {
            id: 'podmioty-lista',
            title: '',
            content: '- **Google Firebase** (Authentication, Firestore, Storage),\n- **Google Analytics** (strona www.pedro.app),\n- **Vercel** (hosting strony),\n- **Expo** (infrastruktura aplikacji mobilnej),\n- **Stripe** – wyłącznie po uruchomieniu płatności dla biznesów.'
          }
        ]
      },
      {
        id: 'cookies',
        title: '8. Cookies',
        content: 'Strona www.pedro.app wykorzystuje pliki cookies (ciasteczka). Poniżej znajduje się szczegółowa informacja o stosowanych plikach cookie.',
        subsections: [
          {
            id: 'cookies-niezbedne',
            title: 'Cookies niezbędne (nie wymagają zgody):',
            content: '- **firebase-auth-token** — cookie sesji autoryzacyjnej, umożliwia zalogowanie się i utrzymanie sesji. Czas życia: 1 godzina. Dostawca: PEDRO.\n- **pedro-locale** — localStorage, zapamiętuje wybrany język interfejsu (PL/EN). Czas życia: bezterminowo. Dostawca: PEDRO.\n- **pedro-cookie-consent** — localStorage, przechowuje informację o wyrażonej zgodzie na cookies. Czas życia: bezterminowo. Dostawca: PEDRO.'
          },
          {
            id: 'cookies-analityczne',
            title: 'Cookies analityczne (wymagają zgody):',
            content: '- **Google Analytics (_ga, _ga_*)** — cookies służące do analizy ruchu na stronie, zbierają anonimowe dane statystyczne. Czas życia: do 2 lat. Dostawca: Google LLC.\n\nCookies analityczne są uruchamiane **wyłącznie po wyrażeniu zgody** przez użytkownika za pomocą okna cookie wyświetlanego przy pierwszej wizycie na stronie.'
          },
          {
            id: 'zarzadzanie-cookies',
            title: 'Zarządzanie cookies:',
            content: 'Użytkownik może zarządzać cookies poprzez:\n- okno zgody wyświetlane przy pierwszej wizycie na stronie,\n- link „Ustawienia cookies" dostępny w stopce strony,\n- ustawienia swojej przeglądarki internetowej.\n\nWycofanie zgody na cookies analityczne nie wpływa na możliwość korzystania ze strony.'
          }
        ]
      },
      {
        id: 'marketing',
        title: '9. Marketing i komunikacja',
        content: '',
        subsections: [
          {
            id: 'informacje-o-funkcjach',
            title: '1.',
            content: 'Administrator może wysyłać informacje o nowych funkcjach Aplikacji.'
          },
          {
            id: 'zgoda-marketing',
            title: '2.',
            content: 'Komunikacja marketingowa odbywa się wyłącznie za wyraźną zgodą użytkownika.'
          },
          {
            id: 'cofniecie-zgody',
            title: '3.',
            content: 'Zgoda może zostać cofnięta w dowolnym momencie.'
          }
        ]
      },
      {
        id: 'okres-przechowywania',
        title: '10. Okres przechowywania danych',
        content: '',
        subsections: [
          {
            id: 'czas-istnienia-konta',
            title: '1.',
            content: 'Dane przechowywane są przez czas istnienia konta.'
          },
          {
            id: 'usuniecie-danych',
            title: '2.',
            content: 'Po usunięciu konta dane są **trwale i nieodwracalnie usuwane**.'
          }
        ]
      },
      {
        id: 'prawa-uzytkownika',
        title: '11. Prawa użytkownika',
        content: 'Użytkownik ma prawo do:',
        subsections: [
          {
            id: 'prawa-lista',
            title: '',
            content: '- dostępu do swoich danych,\n- ich poprawiania,\n- usunięcia,\n- ograniczenia przetwarzania,\n- cofnięcia zgody,\n- wniesienia skargi do Prezesa UODO.'
          }
        ]
      },
      {
        id: 'bezpieczenstwo',
        title: '12. Bezpieczeństwo danych',
        content: 'Administrator stosuje środki techniczne i organizacyjne zapewniające ochronę danych osobowych.',
        subsections: []
      },
      {
        id: 'zmiany-polityki',
        title: '13. Zmiany polityki prywatności',
        content: '',
        subsections: [
          {
            id: 'aktualizacje',
            title: '',
            content: 'Polityka Prywatności może być aktualizowana w związku z rozwojem Aplikacji.\nO istotnych zmianach użytkownicy zostaną poinformowani.'
          }
        ]
      },
      {
        id: 'kontakt',
        title: '14. Kontakt',
        content: 'W sprawach związanych z ochroną danych osobowych prosimy o kontakt: **kontakt@pedro.app**.',
        subsections: []
      }
    ]
  }
}