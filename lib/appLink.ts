/**
 * Link do web-appki PEDRO (T-004, D-012). Google Play/App Store wstrzymane (D-001),
 * więc CTA na landingu prowadzą do wersji w przeglądarce.
 * UTM: skąd wejście — utm_campaign = miejsce przycisku na stronie.
 */
export const WEB_APP_URL = 'https://app.pedro.app'

export type WebAppCtaPlace = 'hero' | 'download' | 'sticky'

export function webAppLink(place: WebAppCtaPlace): string {
    return `${WEB_APP_URL}/?utm_source=landing&utm_medium=cta&utm_campaign=${place}`
}
