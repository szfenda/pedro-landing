import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { isCronAuthorized } from '@/lib/cronAuth'
import { PROMOS_CACHE_TAG, clearSeoMemo } from '@/lib/seoPromos'

/**
 * T-089 (D-057): raz na dobę, 1–2 h po porannym Weryfikatorze (~7:12) — `vercel.json` crons.
 * Unieważnia kopię `public_promos` (następne wejście = 1 odczyt kolekcji) i wszystkie strony.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    if (!isCronAuthorized(request)) return NextResponse.json({ ok: false }, { status: 401 })
    clearSeoMemo()
    revalidateTag(PROMOS_CACHE_TAG)
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true, tryb: 'dane', at: new Date().toISOString() })
}
