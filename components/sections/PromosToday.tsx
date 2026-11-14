'use client'

import { useTranslation } from '@/lib/i18n-context'
import type { PromosToday as PromosTodayData } from '@/lib/publicPromos'

/**
 * „Promki na dziś” (T-054) — 6 prawdziwych promocji publicznych zaraz pod hero.
 * Dane przychodzą z serwera (app/(public)/page.tsx → lib/publicPromos.ts).
 * Bez zdjęć i logo firm (spec public_promo §7) — ikona i kolor kategorii jak w aplikacji.
 */

// Kategorie jak w aplikacji (PEDRO_Bolt/utils/categories.ts): kolor + ikona (tu emoji, bez bibliotek ikon)
const CATEGORY_STYLE: Record<string, { emoji: string; color: string }> = {
    '1': { emoji: '🍽️', color: '#F97316' },
    '2': { emoji: '💇', color: '#EC4899' },
    '3': { emoji: '❤️', color: '#EF4444' },
    '4': { emoji: '🎮', color: '#8B5CF6' },
    '5': { emoji: '🏋️', color: '#10B981' },
    '6': { emoji: '✈️', color: '#3B82F6' },
    '7': { emoji: '🎁', color: '#F59E0B' },
    '8': { emoji: '🔧', color: '#6B7280' },
    '9': { emoji: '🚗', color: '#1F2937' },
}
const FALLBACK_STYLE = { emoji: '🏷️', color: '#6C5CE7' }

/** „DD.MM” w strefie Polski. */
function shortDate(iso: string): string {
    return new Date(iso).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', timeZone: 'Europe/Warsaw' })
}

export default function PromosToday({ data }: { data: PromosTodayData }) {
    const { t } = useTranslation()

    return (
        <section id="promki-na-dzis" className="bg-white py-12 md:py-16 relative z-10 border-y-3 border-pedro-dark">
            <div className="container-pedro">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6 md:mb-8">
                    <div>
                        <h2 className="font-headline text-h3 text-pedro-dark">{t('promosToday.title')}</h2>
                        <p className="text-gray-600 mt-1">{t('promosToday.subtitle', { count: data.total })}</p>
                    </div>
                </div>

                {/* Telefon: przewijany rząd; desktop: siatka 3×2 */}
                <ul
                    className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-4 -mx-4 px-4 md:mx-0 md:px-0 pb-4 pt-1"
                    aria-label={t('promosToday.title')}
                >
                    {data.promos.map((promo) => {
                        const style = CATEGORY_STYLE[promo.categoryId] ?? FALLBACK_STYLE
                        return (
                            <li key={promo.id} className="snap-start shrink-0 w-[78%] sm:w-[45%] md:w-auto">
                                <a
                                    href={promo.url}
                                    className="group flex h-full flex-col bg-white brutal-border rounded-card p-4 shadow-brutal-sm-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-brutal-sm-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pedro-purple"
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                                            style={{ backgroundColor: style.color }}
                                            aria-hidden="true"
                                        >
                                            {style.emoji}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-pedro-dark leading-snug line-clamp-2">
                                                {promo.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 truncate">{promo.place}</p>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 flex items-center justify-between gap-2 text-sm">
                                        {promo.discountText ? (
                                            <span className="bg-pedro-lime text-pedro-dark font-bold px-3 py-1 rounded-full brutal-border text-xs whitespace-nowrap">
                                                {promo.discountText}
                                            </span>
                                        ) : (
                                            <span />
                                        )}
                                        <span className="text-gray-600 whitespace-nowrap">
                                            {promo.validUntil
                                                ? t('promosToday.until', { date: shortDate(promo.validUntil) })
                                                : t('promosToday.untilFurtherNotice')}
                                        </span>
                                    </div>
                                </a>
                            </li>
                        )
                    })}
                </ul>

                <div className="mt-4 md:mt-6 text-center md:text-right">
                    <a
                        href={data.allUrl}
                        className="inline-block font-bold text-pedro-purple hover:underline text-lg"
                    >
                        {t('promosToday.seeAll', { count: data.total })}
                    </a>
                </div>
            </div>
        </section>
    )
}
