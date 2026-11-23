/**
 * „Promki na dziś” (T-054) — typy i linki do aplikacji.
 *
 * T-089 (D-057): dane NIE są już czytane przez publiczny REST co godzinę. Sekcja korzysta
 * z tej samej kopii co strony /promocje/ (`lib/seoPromos.ts` → `getPromosToday`, odczyt admina
 * raz na dobę po Weryfikatorze). Ten plik nie importuje firebase-admin (typy używa komponent kliencki).
 *
 * Reguły widoczności jak w aplikacji (PEDRO_Bolt/services/publicPromosService.ts):
 * `status == 'active'`, jest `sourceUrl`, `validUntil` nie wcześniej niż dziś (Europe/Warsaw).
 * Kolejność: najpierw `featured` z ważnym `featuredUntil`, potem najnowsze `publishedAt`.
 */

// Ten sam adres co CTA (lib/appLink.ts, T-058) — lokalnie np. NEXT_PUBLIC_WEB_APP_URL=http://localhost:8082
export const WEB_APP_URL = (process.env.NEXT_PUBLIC_WEB_APP_URL || 'https://app.pedro.app').replace(/\/+$/, '')

/** Karta promocji — tylko pola potrzebne na landingu (bez zdjęć i logo). */
export interface PromoCardData {
    id: string
    title: string
    businessName: string
    categoryId: string
    place: string
    discountText: string | null
    /** ISO data końca albo null = „do odwołania” */
    validUntil: string | null
    url: string
}

export interface PromosToday {
    promos: PromoCardData[]
    /** Liczba wszystkich widocznych promocji („Zobacz wszystkie N”). */
    total: number
    /** Link „Zobacz wszystkie” (aplikacja web z UTM). */
    allUrl: string
}

/** Link do szczegółów promocji w aplikacji web, z UTM (skąd wejście — jak T-004). */
export function promoUrl(id: string): string {
    return `${WEB_APP_URL}/promo/${encodeURIComponent(id)}?utm_source=landing&utm_medium=promo_card&utm_campaign=promki_na_dzis`
}

export function allPromosUrl(): string {
    return `${WEB_APP_URL}/?utm_source=landing&utm_medium=promo_card&utm_campaign=promki_na_dzis_all`
}
