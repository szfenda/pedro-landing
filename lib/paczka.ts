/**
 * T-092 (etap 2, D-057): „paczka promocji” dla aplikacji (app.pedro.app).
 * Wszystkie aktywne `public_promos` w jednym pliku JSON. Aplikacja pobiera go z CDN Vercel
 * zamiast czytać Firestore, więc liczba odczytów nie rośnie z liczbą użytkowników.
 *
 * Zawartość = dokładnie to, co dziś czyta aplikacja: `status == 'active'`, pola z `toPromo`
 * (PEDRO_Bolt/services/publicPromosService.ts). Nowe pole w `toPromo` → dopisać je w PACZKA_FIELDS.
 * Daty jako tekst ISO (aplikacja zamienia je na Date tak samo jak Timestamp).
 *
 * Odświeżanie:
 *  - po każdym zapisie Łowcy/Weryfikatora: POST /api/paczka/odswiez/ (Bearer CRON_SECRET),
 *  - poranny cron /api/cron/promocje-dane/,
 *  - zapas: kopia starsza niż PACZKA_REVALIDATE_SECONDS jest czytana od nowa przy następnym pobraniu.
 */
import { unstable_cache } from 'next/cache'
import { adminDb } from '@/lib/firebase-admin'

export const PACZKA_CACHE_TAG = 'paczka-promos'
export const PACZKA_VERSION = 1
/** Zapas, gdyby odświeżenie po zapisie się nie udało: najwyżej 4 odczyty kolekcji na dobę. */
export const PACZKA_REVALIDATE_SECONDS = 6 * 60 * 60

export const PACZKA_FIELDS = [
    'title',
    'summary',
    'businessName',
    'categoryId',
    'city',
    'district',
    'address',
    'latitude',
    'longitude',
    'discountText',
    'schedule',
    'requirements',
    'validFrom',
    'validUntil',
    'validUntilEstimated',
    'sourceUrl',
    'sourceDomain',
    'checkedAt',
    'publishedAt',
    'featured',
    'featuredUntil',
    'campaigns',
    'eventDate',
    'imageUrl',
    'imageKind',
    'status',
] as const

export type Paczka = {
    v: number
    generatedAt: string
    count: number
    promos: Array<Record<string, unknown> & { id: string }>
}

/** Timestamp → ISO; reszta (tekst, liczby, tablice tekstów) bez zmian. */
function plain(value: any): unknown {
    if (value && typeof value.toDate === 'function') return value.toDate().toISOString()
    if (Array.isArray(value)) return value.map(plain)
    return value
}

async function readPaczka(): Promise<Paczka> {
    if (!adminDb) throw new Error('Brak firebase-admin (zmienne FIREBASE_*)')
    const snap = await adminDb
        .collection('public_promos')
        .where('status', '==', 'active')
        .select(...PACZKA_FIELDS)
        .get()
    const promos: Paczka['promos'] = []
    snap.forEach((doc: any) => {
        const data = doc.data() ?? {}
        const promo: Record<string, unknown> & { id: string } = { id: doc.id }
        for (const f of PACZKA_FIELDS) {
            if (data[f] !== undefined && data[f] !== null) promo[f] = plain(data[f])
        }
        promos.push(promo)
    })
    return { v: PACZKA_VERSION, generatedAt: new Date().toISOString(), count: promos.length, promos }
}

/** Błąd odczytu nie trafia do pamięci (unstable_cache zapisuje tylko udane wyniki). */
export const getPaczka = unstable_cache(readPaczka, ['paczka-aktywne-v1'], {
    revalidate: PACZKA_REVALIDATE_SECONDS,
    tags: [PACZKA_CACHE_TAG],
})
