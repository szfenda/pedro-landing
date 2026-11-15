import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

/**
 * T-058: jednorazowe przekazanie logowania z www.pedro.app do app.pedro.app.
 *
 * POST, nagłówek `Authorization: Bearer <Firebase ID token>` zalogowanego użytkownika
 * → `{ token }` = custom token Firebase dla tego samego UID (ważny 1 h, jednorazowy w praktyce:
 * aplikacja wymienia go od razu przez `signInWithCustomToken` na trasie `/auth/handoff`).
 *
 * Bez nagłówka / zły lub przeterminowany ID token → 401. Tokenów nigdy nie logujemy.
 */
export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store' }

export async function POST(request: NextRequest) {
    const header = request.headers.get('authorization') || ''
    const idToken = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : ''

    if (!idToken) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: NO_STORE })
    }

    if (!adminAuth) {
        // Brak konfiguracji konta serwisowego (FIREBASE_PRIVATE_KEY itd.) — bez szczegółów w odpowiedzi
        console.error('[app-token] Firebase Admin nie jest skonfigurowany')
        return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: NO_STORE })
    }

    let uid: string
    try {
        // checkRevoked: wylogowane/zablokowane konto nie dostaje tokenu
        const decoded = await adminAuth.verifyIdToken(idToken, true)
        uid = decoded.uid
    } catch {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: NO_STORE })
    }

    try {
        const token: string = await adminAuth.createCustomToken(uid)
        return NextResponse.json({ token }, { status: 200, headers: NO_STORE })
    } catch (error: any) {
        // Tylko kod błędu — bez tokenów i danych użytkownika
        console.error('[app-token] createCustomToken nie powiódł się:', error?.code || 'unknown')
        return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: NO_STORE })
    }
}
