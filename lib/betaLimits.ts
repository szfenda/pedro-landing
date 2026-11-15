/**
 * Limity fazy beta dla firm (T-056, D-040) — panel www.
 * Te same stałe, pola i reguła co `PEDRO_Bolt/utils/betaLimits.ts` (kontrakt w karcie T-056):
 * pierwsze 100 firm → `verificationStatus: 'verified'`, `beta: true`,
 * `betaTrialEndsAt` = rejestracja + 90 dni; 101. firma i dalej → `'pending'` jak dotąd.
 * Nic nie blokujemy po 90 dniach — tylko zapisujemy i pokazujemy (decyzja Szefa).
 */

export const BETA_MAX_PARTNERS = 100
export const BETA_TRIAL_DAYS = 90
export const MAX_ACTIVE_OFFERS = 10
export const MAX_COUPONS_PER_OFFER = 100
export const MAX_OFFER_DAYS = 30

const DAY_MS = 24 * 60 * 60 * 1000

export interface PartnerBetaFields {
    verificationStatus: 'verified' | 'pending'
    isActive: true
    beta?: true
    betaTrialEndsAt?: Date
}

/**
 * Pola statusu nowej firmy. `existingPartners` — liczba firm w bazie przed rejestracją
 * (zapytanie `count` na `partners`); `null`, gdy nie udało się policzyć → bezpiecznie `pending`.
 */
export function betaRegistrationFields(existingPartners: number | null, now: Date = new Date()): PartnerBetaFields {
    if (existingPartners === null || existingPartners >= BETA_MAX_PARTNERS) {
        return { verificationStatus: 'pending', isActive: true }
    }
    return {
        verificationStatus: 'verified',
        isActive: true,
        beta: true,
        betaTrialEndsAt: new Date(now.getTime() + BETA_TRIAL_DAYS * DAY_MS),
    }
}

/** Timestamp Firestore / Date / string → Date albo null. */
export function toDate(value: unknown): Date | null {
    if (!value) return null
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value
    if (typeof value === 'object') {
        const v = value as { toDate?: () => Date; seconds?: number }
        if (typeof v.toDate === 'function') return v.toDate()
        if (typeof v.seconds === 'number') return new Date(v.seconds * 1000)
    }
    if (typeof value === 'string' || typeof value === 'number') {
        const d = new Date(value)
        return isNaN(d.getTime()) ? null : d
    }
    return null
}

const pad = (n: number) => String(n).padStart(2, '0')
export const formatDayPL = (date: Date) => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`

/**
 * Dane do linii „Faza beta — bezpłatnie do DD.MM.RRRR (zostało N dni)”.
 * `null` dla firm spoza bety. Liczenie dni jak w aplikacji (pełne dni kalendarzowe, min. 0).
 */
export function betaTrialInfo(
    betaTrialEndsAt: unknown,
    now: Date = new Date()
): { date: string; daysLeft: number } | null {
    const end = toDate(betaTrialEndsAt)
    if (!end) return null
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    const endDay = new Date(end)
    endDay.setHours(0, 0, 0, 0)
    const daysLeft = Math.max(0, Math.round((endDay.getTime() - today.getTime()) / DAY_MS))
    return { date: formatDayPL(end), daysLeft }
}
