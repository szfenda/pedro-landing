import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isCronAuthorized } from '@/lib/cronAuth'
import { clearSeoMemo } from '@/lib/seoPromos'

/**
 * T-089: tuż po północy (czas PL) przelicza strony z tej samej kopii danych — BEZ odczytu bazy.
 * Dzięki temu promocje „do wczoraj” znikają z landingu o północy, a nie dopiero rano.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    if (!isCronAuthorized(request)) return NextResponse.json({ ok: false }, { status: 401 })
    clearSeoMemo()
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true, tryb: 'polnoc', at: new Date().toISOString() })
}
