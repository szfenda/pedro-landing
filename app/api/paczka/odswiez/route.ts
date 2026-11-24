import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { isCronAuthorized } from '@/lib/cronAuth'
import { PACZKA_CACHE_TAG } from '@/lib/paczka'

/**
 * T-092: POST /api/paczka/odswiez/ — wywołuje Łowca/Weryfikator po każdym zapisie do bazy
 * (nagłówek `Authorization: Bearer <CRON_SECRET>`). Unieważnia tylko paczkę aplikacji;
 * strony /promocje/ zostają przy porannym cronie (D-057).
 * Nowa paczka powstaje przy następnym pobraniu (1 odczyt kolekcji); CDN podmienia ją w ≤5 min.
 */
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    if (!isCronAuthorized(request)) return NextResponse.json({ ok: false }, { status: 401 })
    revalidateTag(PACZKA_CACHE_TAG)
    return NextResponse.json({ ok: true, at: new Date().toISOString() })
}
