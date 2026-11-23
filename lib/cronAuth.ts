/**
 * T-089: trasy /api/cron/* wywołuje tylko cron Vercel. Vercel dokleja nagłówek
 * `Authorization: Bearer <CRON_SECRET>`, gdy zmienna CRON_SECRET jest ustawiona w projekcie.
 * Brak zmiennej → trasa zawsze odmawia (dane odświeży wtedy zapas 48 h).
 */
export function isCronAuthorized(request: Request): boolean {
    const secret = process.env.CRON_SECRET
    if (!secret) {
        console.error('[cron] Brak CRON_SECRET — odświeżanie z crona wyłączone')
        return false
    }
    return request.headers.get('authorization') === `Bearer ${secret}`
}
