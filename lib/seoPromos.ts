/**
 * Strony SEO „promocje <miasto> <kategoria>” (T-079).
 *
 * Dane z `public_promos` czytane WYŁĄCZNIE po stronie serwera przez firebase-admin
 * (`lib/firebase-admin.ts`) — przygotowanie pod App Check (T-077): publiczny REST
 * kiedyś zostanie zamknięty. Brak zmiennych admina → `null` (strony 404, sitemap bez nich),
 * bez obejścia przez REST.
 *
 * Na stronach pokazujemy MNIEJ niż aplikacja: tytuł, firma, rabat, dzielnica, ważność.
 * Bez współrzędnych, adresów, opisów i linków do źródeł (T-077 — mniej do kopiowania).
 * Moduł tylko serwerowy (firebase-admin). `sourceUrl` czytamy tylko do filtra widoczności (jak aplikacja), nigdy nie wychodzi na stronę.
 */
import { unstable_cache } from 'next/cache'
import { adminDb } from '@/lib/firebase-admin'
import { WEB_APP_URL } from '@/lib/publicPromos'

/** Odświeżanie stron i danych (≤ 24 h wg karty; 6 h = ~4 odczyty kolekcji na dobę). */
export const SEO_REVALIDATE_SECONDS = 21600
/** Strona istnieje tylko przy co najmniej tylu promocjach (cienkie strony szkodzą w Google). */
export const MIN_PROMOS = 3
export const SITE_URL = 'https://www.pedro.app'

export interface CityDef {
    slug: string
    name: string
    /** „w Gdańsku” */
    inName: string
}
export const CITIES: CityDef[] = [
    { slug: 'gdansk', name: 'Gdańsk', inName: 'w Gdańsku' },
    { slug: 'gdynia', name: 'Gdynia', inName: 'w Gdyni' },
    { slug: 'sopot', name: 'Sopot', inName: 'w Sopocie' },
    { slug: 'okolice', name: 'okolice Trójmiasta', inName: 'w okolicach Trójmiasta' },
]

export interface CategoryDef {
    id: string
    slug: string
    name: string
    /** do zdań: „w kategorii …” */
    lower: string
    emoji: string
    color: string
}
// Kolory i ikony jak w components/sections/PromosToday.tsx (aplikacja: utils/categories.ts)
export const CATEGORIES: CategoryDef[] = [
    { id: '1', slug: 'restauracje', name: 'Restauracje', lower: 'restauracje', emoji: '🍽️', color: '#F97316' },
    { id: '2', slug: 'uroda', name: 'Uroda', lower: 'uroda', emoji: '💇', color: '#EC4899' },
    { id: '3', slug: 'zdrowie', name: 'Zdrowie', lower: 'zdrowie', emoji: '❤️', color: '#EF4444' },
    { id: '4', slug: 'rozrywka', name: 'Rozrywka', lower: 'rozrywka', emoji: '🎮', color: '#8B5CF6' },
    { id: '5', slug: 'sport', name: 'Sport', lower: 'sport', emoji: '🏋️', color: '#10B981' },
    { id: '6', slug: 'turystyka', name: 'Turystyka', lower: 'turystyka', emoji: '✈️', color: '#3B82F6' },
    { id: '7', slug: 'zakupy', name: 'Zakupy', lower: 'zakupy', emoji: '🎁', color: '#F59E0B' },
    { id: '8', slug: 'uslugi', name: 'Usługi', lower: 'usługi', emoji: '🔧', color: '#6B7280' },
    { id: '9', slug: 'auto', name: 'Auto', lower: 'auto', emoji: '🚗', color: '#1F2937' },
]
export const FALLBACK_CATEGORY_STYLE = { emoji: '🏷️', color: '#6C5CE7' }

export interface OccasionDef {
    slug: string
    /** prefiks wartości w polu `campaigns` (np. `black-friday-2026`) */
    campaignPrefix: string
    name: string
    intro: string
}
export const OCCASIONS: OccasionDef[] = [
    {
        slug: 'black-friday',
        campaignPrefix: 'black-friday',
        name: 'Black Friday',
        intro: 'Promocje Black Friday i Black Week w lokalnych firmach z Trójmiasta i okolic.',
    },
    {
        slug: 'sylwester',
        campaignPrefix: 'sylwester',
        name: 'Sylwester',
        intro: 'Sylwestrowe oferty i promocje lokalnych firm z Trójmiasta i okolic.',
    },
]

/** Karta promocji na stronie SEO — celowo mało pól. */
export interface SeoPromo {
    id: string
    title: string
    businessName: string
    categoryId: string
    citySlug: string
    /** dzielnica albo miejscowość (bez adresu) */
    place: string
    discountText: string | null
    /** ISO albo null = „do odwołania” */
    validUntil: string | null
    campaigns: string[]
    publishedAt: number
}

export interface SeoData {
    promos: SeoPromo[]
    /** ISO — kiedy dane pobrano */
    updatedAt: string
}

const warsawDay = (d: Date) => d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' })
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const toDate = (v: any): Date | null => {
    if (!v) return null
    if (typeof v.toDate === 'function') return v.toDate()
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
}

export function citySlugOf(city: string): string {
    const c = city.toLowerCase()
    if (c === 'gdańsk' || c === 'gdansk') return 'gdansk'
    if (c === 'gdynia') return 'gdynia'
    if (c === 'sopot') return 'sopot'
    return 'okolice'
}

async function readFromFirestore(): Promise<SeoData | null> {
    if (!adminDb) {
        console.error('[seoPromos] Brak firebase-admin (zmienne FIREBASE_* nieustawione) — strony /promocje/ niedostępne')
        return null
    }
    const snap = await adminDb
        .collection('public_promos')
        .where('status', '==', 'active')
        .select(
            'title',
            'businessName',
            'categoryId',
            'city',
            'district',
            'discountText',
            'validUntil',
            'validUntilEstimated',
            'sourceUrl',
            'status',
            'publishedAt',
            'campaigns'
        )
        .get()

    const now = new Date()
    const today = warsawDay(now)
    const promos: SeoPromo[] = []
    snap.forEach((doc: any) => {
        const f = doc.data() ?? {}
        const title = str(f.title)
        const validUntil = toDate(f.validUntil)
        // Reguły widoczności jak w aplikacji i lib/publicPromos.ts
        if (!title || !str(f.sourceUrl)) return
        if (validUntil && warsawDay(validUntil) < today) return
        const city = str(f.city)
        const citySlug = citySlugOf(city)
        const district = str(f.district)
        promos.push({
            id: doc.id,
            title,
            businessName: str(f.businessName),
            categoryId: str(f.categoryId),
            citySlug,
            place: citySlug === 'okolice' ? [city, district].filter(Boolean).join(', ') : district || city,
            discountText: str(f.discountText) || null,
            validUntil: f.validUntilEstimated === true || !validUntil ? null : validUntil.toISOString(),
            campaigns: Array.isArray(f.campaigns) ? f.campaigns.filter((c: unknown) => typeof c === 'string') : [],
            publishedAt: toDate(f.publishedAt)?.getTime() ?? 0,
        })
    })
    promos.sort((a, b) => b.publishedAt - a.publishedAt)
    return { promos, updatedAt: now.toISOString() }
}

/**
 * Jeden odczyt kolekcji na okres odświeżania — wspólny dla wszystkich stron i sitemap
 * (cache danych Next.js), a w obrębie procesu dodatkowo zapamiętana obietnica (build).
 */
const cachedRead = unstable_cache(readFromFirestore, ['seo-public-promos-v1'], {
    revalidate: SEO_REVALIDATE_SECONDS,
})
let memo: { at: number; promise: Promise<SeoData | null> } | null = null

export async function getSeoData(): Promise<SeoData | null> {
    if (memo && Date.now() - memo.at < 5 * 60 * 1000) return memo.promise
    const promise = cachedRead().catch((error) => {
        console.error('[seoPromos] Nie udało się pobrać public_promos:', error)
        memo = null
        return null
    })
    memo = { at: Date.now(), promise }
    return promise
}

// ---- wybór i struktura stron (czyste funkcje) ----

export const findCity = (slug: string) => CITIES.find((c) => c.slug === slug)
export const findCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug)
export const findOccasion = (slug: string) => OCCASIONS.find((o) => o.slug === slug)
export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id)

export function promosFor(data: SeoData, citySlug?: string, categorySlug?: string): SeoPromo[] {
    const cat = categorySlug ? findCategory(categorySlug) : undefined
    return data.promos.filter(
        (p) => (!citySlug || p.citySlug === citySlug) && (!cat || p.categoryId === cat.id)
    )
}

export function promosForOccasion(data: SeoData, occasion: OccasionDef): SeoPromo[] {
    return data.promos.filter((p) => p.campaigns.some((c) => c.startsWith(occasion.campaignPrefix)))
}

export interface PageLink {
    path: string
    label: string
    count: number
}

/** Wszystkie strony, które mają ≥ MIN_PROMOS promocji (spis, sitemap, generateStaticParams). */
export function buildPages(data: SeoData) {
    const cities = CITIES.map((city) => {
        const all = promosFor(data, city.slug)
        const categories: PageLink[] = CATEGORIES.map((cat) => ({
            path: `/promocje/${city.slug}/${cat.slug}/`,
            label: cat.name,
            count: promosFor(data, city.slug, cat.slug).length,
        })).filter((l) => l.count >= MIN_PROMOS)
        return { city, count: all.length, path: `/promocje/${city.slug}/`, categories }
    }).filter((c) => c.count >= MIN_PROMOS)

    const occasions: PageLink[] = OCCASIONS.map((o) => ({
        path: `/promocje/okazje/${o.slug}/`,
        label: o.name,
        count: promosForOccasion(data, o).length,
    })).filter((l) => l.count >= MIN_PROMOS)

    const paths = [
        '/promocje/',
        ...cities.flatMap((c) => [c.path, ...c.categories.map((l) => l.path)]),
        ...occasions.map((o) => o.path),
    ]
    return { cities, occasions, paths }
}

/** Link do promocji w aplikacji (UTM: seo / landing / <miasto>-<kategoria>). */
export function seoPromoUrl(id: string, campaign: string): string {
    return `${WEB_APP_URL}/promo/${encodeURIComponent(id)}?utm_source=seo&utm_medium=landing&utm_campaign=${encodeURIComponent(campaign)}`
}

export function seoAppUrl(campaign: string): string {
    return `${WEB_APP_URL}/?utm_source=seo&utm_medium=landing&utm_campaign=${encodeURIComponent(campaign)}`
}

/** „21.11.2026, 14:05” w strefie Polski. */
export function formatUpdated(iso: string): string {
    return new Date(iso).toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Warsaw',
    })
}

/** „promocja / promocje / promocji” */
export function promoWord(n: number): string {
    if (n === 1) return 'promocja'
    const d = n % 10
    const t = n % 100
    if (d >= 2 && d <= 4 && (t < 12 || t > 14)) return 'promocje'
    return 'promocji'
}

export function cityLabel(city: CityDef): string {
    return city.slug === 'okolice' ? 'okolice Trójmiasta' : city.name
}

/** Metadane strony SEO: title, description, canonical, Open Graph. */
export function seoMetadata(path: string, title: string, description: string) {
    const url = `${SITE_URL}${path}`
    const image = `${SITE_URL}/android-chrome-512x512.png`
    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: 'website' as const,
            locale: 'pl_PL',
            siteName: 'PEDRO',
            images: [{ url: image, width: 512, height: 512, alt: 'PEDRO — Poluj na promki' }],
        },
        twitter: { card: 'summary' as const, title, description, images: [image] },
    }
}
