/**
 * Google Analytics na landingu — WYŁĄCZNIE po zgodzie w banerze cookies (T-006 #3, jak D-014 w web-appce).
 * Przed zgodą / po odrzuceniu: zero żądań do googletagmanager.com i google-analytics.com.
 * Ten sam identyfikator co web-app (Firebase Analytics projektu pedro-bolt-app).
 */
export const GA_MEASUREMENT_ID = 'G-6PDQ84SYH1'
export const COOKIE_CONSENT_KEY = 'pedro-cookie-consent'

type GtagWindow = Window & {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
} & Record<string, unknown>

let loaded = false

/** Ważność decyzji w banerze: 12 miesięcy (T-007 #2, jak w web-appce). */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

/**
 * Zapisana i wciąż ważna decyzja (zgoda lub odmowa). Starsza niż 12 miesięcy albo
 * bez poprawnej daty = brak decyzji → baner pokazuje się ponownie, GA nie startuje.
 */
export function getValidConsent(): { analytics: boolean } | null {
    try {
        const saved = localStorage.getItem(COOKIE_CONSENT_KEY)
        if (!saved) return null
        const parsed = JSON.parse(saved)
        const savedAt = Date.parse(parsed?.timestamp)
        if (!Number.isFinite(savedAt) || Date.now() - savedAt > CONSENT_MAX_AGE_MS) return null
        return { analytics: parsed?.analytics === true }
    } catch {
        return null
    }
}

/** Czy jest ważna zgoda na analitykę. */
export function hasAnalyticsConsent(): boolean {
    return getValidConsent()?.analytics === true
}

/** Ładuje gtag.js i konfiguruje GA (wywoływać tylko po zgodzie). */
export function loadAnalytics(): void {
    if (typeof window === 'undefined') return
    const w = window as unknown as GtagWindow
    w[`ga-disable-${GA_MEASUREMENT_ID}`] = false
    if (loaded) return
    loaded = true

    w.dataLayer = w.dataLayer || []
    w.gtag = function gtag() {
        // gtag wymaga obiektu `arguments`, nie tablicy
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments)
    }
    w.gtag('js', new Date())
    w.gtag('config', GA_MEASUREMENT_ID)

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)
}

/** Wycofanie zgody: wyłącznik gtag + usunięcie ciasteczek _ga / _ga_*. */
export function disableAnalytics(): void {
    if (typeof window === 'undefined') return
    ;(window as unknown as GtagWindow)[`ga-disable-${GA_MEASUREMENT_ID}`] = true
    try {
        const host = window.location.hostname
        const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
        document.cookie.split(';').forEach((cookie) => {
            const name = cookie.split('=')[0].trim()
            if (name === '_ga' || name.startsWith('_ga_') || name === '_gid') {
                domains.forEach((domain) => {
                    document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`
                })
            }
        })
    } catch {
        // ignorujemy
    }
}
