import { NextRequest, NextResponse } from 'next/server'
import { sendZglosEmail } from '@/lib/contact'
import { normalizeBusinessLink, zglosSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'

// T-096: „Zgłoś biznes do PEDRO” — tylko mail na kontakt@pedro.app, bez zapisu do bazy.
export const runtime = 'nodejs'
export const maxDuration = 15

// Prosty limit: ≤ 5 zgłoszeń na IP na godzinę (w pamięci instancji — wystarczy na start).
const LIMIT = 5
const WINDOW_MS = 60 * 60 * 1000
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= LIMIT) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  // Sprzątanie, żeby mapa nie rosła bez końca
  if (hits.size > 5000) {
    hits.forEach((times, key) => {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key)
    })
  }
  return false
}

export async function POST(request: NextRequest) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe dane formularza' }, { status: 400 })
  }

  const parsed = zglosSchema.safeParse(body)
  if (!parsed.success) {
    logger.warn('Zglos validation error', { endpoint: '/api/zglos', validationErrors: parsed.error.errors })
    return NextResponse.json(
      { error: 'Nieprawidłowe dane formularza', details: parsed.error.errors },
      { status: 400 }
    )
  }
  const data = parsed.data

  // Pułapka wypełniona = bot. Udajemy sukces, nic nie wysyłamy.
  if (data.website) {
    logger.warn('Zglos honeypot triggered', { endpoint: '/api/zglos' })
    return NextResponse.json({ success: true })
  }

  if (rateLimited(ip)) {
    logger.warn('Zglos rate limit', { endpoint: '/api/zglos' })
    return NextResponse.json(
      { error: 'Za dużo zgłoszeń z tego adresu. Spróbuj ponownie za godzinę.' },
      { status: 429 }
    )
  }

  try {
    await sendZglosEmail({
      link: normalizeBusinessLink(data.link),
      name: data.name || undefined,
      city: data.city || undefined,
      note: data.note || undefined,
      email: data.email || undefined,
      owner: data.owner === true,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Zglos submission failed', error as Error, { endpoint: '/api/zglos' })
    return NextResponse.json(
      { error: 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę.' },
      { status: 500 }
    )
  }
}
