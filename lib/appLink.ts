/**
 * Link do web-appki PEDRO (T-004, D-012). Google Play/App Store wstrzymane (D-001),
 * więc CTA na landingu prowadzą do wersji w przeglądarce.
 * UTM: skąd wejście — utm_campaign = miejsce przycisku na stronie.
 *
 * T-058: zalogowany na www przechodzi do aplikacji BEZ ponownego logowania —
 * jednorazowy custom token z `/api/auth/app-token` w fragmencie `#ct=…` adresu
 * `{WEB_APP_URL}/auth/handoff` (fragment nie trafia do serwera, logów ani GA).
 */
import type { MouseEvent } from 'react'
import { auth } from '@/lib/firebase'

/** Adres aplikacji web — lokalnie np. `NEXT_PUBLIC_WEB_APP_URL=http://localhost:8082`. */
export const WEB_APP_URL = (process.env.NEXT_PUBLIC_WEB_APP_URL || 'https://app.pedro.app').replace(/\/+$/, '')

export type WebAppCtaPlace =
    | 'hero'
    | 'download'
    | 'sticky'
    | 'no_business'
    | 'dashboard'
    | 'billing'

/** Ścieżki w aplikacji, do których wolno przejść po przekazaniu logowania (kontrakt T-058). */
export type WebAppNext = '/' | '/partner/dashboard' | '/partner/create-offer'

const utm = (place: WebAppCtaPlace) => `utm_source=landing&utm_medium=cta&utm_campaign=${place}`

/** Zwykły link (gość albo błąd przekazania logowania). */
export function webAppLink(place: WebAppCtaPlace): string {
    return `${WEB_APP_URL}/?${utm(place)}`
}

/** Adres przekazania logowania — token TYLKO we fragmencie `#`, nigdy w `?`. */
export function webAppHandoffUrl(place: WebAppCtaPlace, token: string, next: WebAppNext = '/'): string {
    return `${WEB_APP_URL}/auth/handoff?${utm(place)}#ct=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`
}

/**
 * Otwiera aplikację w tej samej karcie. Zalogowany → z przekazaniem logowania;
 * gość albo jakikolwiek błąd → zwykły link (użytkownik zaloguje się w aplikacji ręcznie).
 */
export async function openWebApp(place: WebAppCtaPlace, next: WebAppNext = '/'): Promise<void> {
    const user = auth.currentUser
    if (!user) {
        window.location.assign(webAppLink(place))
        return
    }
    try {
        const idToken = await user.getIdToken()
        const res = await fetch('/api/auth/app-token/', {
            method: 'POST',
            headers: { Authorization: `Bearer ${idToken}` },
            cache: 'no-store',
        })
        if (!res.ok) throw new Error(`app-token ${res.status}`)
        const { token } = (await res.json()) as { token?: string }
        if (!token) throw new Error('app-token: brak tokenu')
        window.location.assign(webAppHandoffUrl(place, token, next))
    } catch {
        // Bez szczegółów (nie logujemy tokenów) — przejście jako gość
        window.location.assign(webAppLink(place))
    }
}

/**
 * Dla linków `<a href={webAppLink(place)}>`: gość idzie zwykłym linkiem,
 * zalogowany — przez przekazanie logowania. Ctrl/⌘/środkowy klik zostają zwykłym linkiem.
 */
export function webAppLinkClick(place: WebAppCtaPlace, next: WebAppNext = '/') {
    return (event: MouseEvent<HTMLElement>) => {
        if (!auth.currentUser) return
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        void openWebApp(place, next)
    }
}
