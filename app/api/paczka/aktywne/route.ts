import { NextResponse } from 'next/server'
import { getPaczka } from '@/lib/paczka'

/**
 * T-092: GET /api/paczka/aktywne/ — paczka aktywnych promocji dla aplikacji.
 * Funkcja czyta kopię z pamięci Vercel (unstable_cache), a odpowiedź trzyma CDN Vercel 5 min
 * (s-maxage), więc 1 czy 10 000 użytkowników = tyle samo odczytów Firestore.
 * Błąd → 503 bez zapisu w CDN; aplikacja czyta wtedy Firestore jak dawniej.
 * CORS `*`: dane i tak są publiczne (strony /promocje/, publiczny odczyt public_promos).
 */
export const dynamic = 'force-dynamic'

const CORS = { 'Access-Control-Allow-Origin': '*' }

export async function GET() {
    try {
        const paczka = await getPaczka()
        return new NextResponse(JSON.stringify(paczka), {
            headers: {
                ...CORS,
                'Content-Type': 'application/json; charset=utf-8',
                // przeglądarka: zawsze pyta (aplikacja i tak trzyma listę 60 min);
                // CDN: 5 min, potem odświeża w tle
                'Cache-Control': 'public, max-age=0, must-revalidate',
                'CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
            },
        })
    } catch (error) {
        console.error('[paczka] Nie udało się zbudować paczki:', error)
        return NextResponse.json({ ok: false }, { status: 503, headers: { ...CORS, 'Cache-Control': 'no-store' } })
    }
}
