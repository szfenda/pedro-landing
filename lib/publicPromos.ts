/**
 * „Promki na dziś” (T-054): prawdziwe promocje publiczne z Firestore `public_promos`
 * (projekt pedro-bolt-app, publiczny odczyt — PEDRO_HQ/specs/public_promo.md §6).
 *
 * Czytamy po stronie serwera Next.js przez publiczne REST API Firestore (bez Firebase SDK
 * w przeglądarce), z odświeżaniem co godzinę (ISR, `revalidate`). Błąd odczytu → null,
 * sekcja się nie pokazuje, a reszta strony działa.
 *
 * Reguły widoczności jak w aplikacji (PEDRO_Bolt/services/publicPromosService.ts):
 * `status == 'active'`, jest `sourceUrl`, `validUntil` nie wcześniej niż dziś (Europe/Warsaw).
 * Kolejność: najpierw `featured` z ważnym `featuredUntil`, potem najnowsze `publishedAt`.
 */

const PROJECT_ID = 'pedro-bolt-app'
const COLLECTION = 'public_promos'
const PAGE_SIZE = 300
const MAX_PAGES = 5
export const PROMOS_REVALIDATE_SECONDS = 3600
export const WEB_APP_URL = 'https://app.pedro.app'

const FIELDS = [
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
    'featured',
    'featuredUntil',
]

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

type FirestoreValue = {
    stringValue?: string
    booleanValue?: boolean
    timestampValue?: string
    integerValue?: string
    doubleValue?: number
}
type FirestoreDoc = { name: string; fields?: Record<string, FirestoreValue> }

const str = (v?: FirestoreValue) => (typeof v?.stringValue === 'string' ? v.stringValue.trim() : '')
const date = (v?: FirestoreValue) => {
    if (!v?.timestampValue) return null
    const d = new Date(v.timestampValue)
    return isNaN(d.getTime()) ? null : d
}

/** RRRR-MM-DD w strefie Polski — „do 30.11” obowiązuje przez cały 30.11. */
const warsawDay = (d: Date) => d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' })

/** Link do szczegółów promocji w aplikacji web, z UTM (skąd wejście — jak T-004). */
export function promoUrl(id: string): string {
    return `${WEB_APP_URL}/promo/${encodeURIComponent(id)}?utm_source=landing&utm_medium=promo_card&utm_campaign=promki_na_dzis`
}

export function allPromosUrl(): string {
    return `${WEB_APP_URL}/?utm_source=landing&utm_medium=promo_card&utm_campaign=promki_na_dzis_all`
}

async function fetchAllDocs(): Promise<FirestoreDoc[]> {
    const docs: FirestoreDoc[] = []
    let pageToken = ''
    for (let page = 0; page < MAX_PAGES; page++) {
        const params = new URLSearchParams({ pageSize: String(PAGE_SIZE) })
        FIELDS.forEach((f) => params.append('mask.fieldPaths', f))
        if (pageToken) params.set('pageToken', pageToken)
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?${params}`
        const res = await fetch(url, { next: { revalidate: PROMOS_REVALIDATE_SECONDS } })
        if (!res.ok) throw new Error(`Firestore REST ${res.status}`)
        const json = (await res.json()) as { documents?: FirestoreDoc[]; nextPageToken?: string }
        docs.push(...(json.documents ?? []))
        if (!json.nextPageToken) break
        pageToken = json.nextPageToken
    }
    return docs
}

/** Wybór promocji (czysta funkcja — łatwa do sprawdzenia). */
export function selectPromos(docs: FirestoreDoc[], now: Date, limit = 6): PromosToday {
    const today = warsawDay(now)
    const visible = docs
        .map((doc) => {
            const f = doc.fields ?? {}
            const validUntil = date(f.validUntil)
            const featuredUntil = date(f.featuredUntil)
            return {
                id: doc.name.split('/').pop() ?? '',
                title: str(f.title),
                businessName: str(f.businessName),
                categoryId: str(f.categoryId),
                city: str(f.city),
                district: str(f.district),
                discountText: str(f.discountText) || null,
                status: str(f.status),
                sourceUrl: str(f.sourceUrl),
                validUntil,
                validUntilEstimated: f.validUntilEstimated?.booleanValue === true,
                publishedAt: date(f.publishedAt),
                isFeatured:
                    f.featured?.booleanValue === true && !!featuredUntil && featuredUntil.getTime() >= now.getTime(),
            }
        })
        .filter(
            (p) =>
                p.id &&
                p.title &&
                p.status === 'active' &&
                p.sourceUrl &&
                (!p.validUntil || warsawDay(p.validUntil) >= today)
        )

    visible.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
        return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0)
    })

    return {
        total: visible.length,
        allUrl: allPromosUrl(),
        promos: visible.slice(0, limit).map((p) => ({
            id: p.id,
            title: p.title,
            businessName: p.businessName,
            categoryId: p.categoryId,
            place: [p.businessName, p.district || p.city].filter(Boolean).join(' · '),
            discountText: p.discountText,
            validUntil: p.validUntilEstimated || !p.validUntil ? null : p.validUntil.toISOString(),
            url: promoUrl(p.id),
        })),
    }
}

/** Dane sekcji albo null (błąd / brak promocji) — wtedy sekcji nie pokazujemy. */
export async function getPromosToday(): Promise<PromosToday | null> {
    try {
        const result = selectPromos(await fetchAllDocs(), new Date())
        return result.total > 0 ? result : null
    } catch (error) {
        console.error('[PromosToday] Nie udało się pobrać public_promos:', error)
        return null
    }
}
