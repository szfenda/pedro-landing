/**
 * Wspólny układ stron SEO /promocje/… (T-079) — komponent serwerowy.
 * Karta: tytuł, firma, rabat, dzielnica, ważność. Bez adresu, współrzędnych, opisu i źródła.
 */
import Link from 'next/link'
import type { ReactNode } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import {
    FALLBACK_CATEGORY_STYLE,
    categoryById,
    formatUpdated,
    promoWord,
    seoAppUrl,
    seoPromoUrl,
    type PageLink,
    type SeoPromo,
} from '@/lib/seoPromos'

function shortDate(iso: string): string {
    return new Date(iso).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', timeZone: 'Europe/Warsaw' })
}

export interface Crumb {
    label: string
    href?: string
}

export function SeoShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-pedro-light">
            <Navigation />
            <main className="pt-24 pb-12">
                <div className="container-pedro">{children}</div>
            </main>
            <Footer />
        </div>
    )
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <div role="navigation" aria-label="Ścieżka" className="text-sm text-gray-600 mb-4">
            <ol className="flex flex-wrap gap-1">
                {items.map((c, i) => (
                    <li key={i} className="flex gap-1">
                        {i > 0 && <span aria-hidden="true">/</span>}
                        {c.href ? (
                            <Link href={c.href} className="hover:text-pedro-purple underline-offset-2 hover:underline">
                                {c.label}
                            </Link>
                        ) : (
                            <span className="text-pedro-dark font-medium">{c.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    )
}

export function SeoHeader({
    title,
    intro,
    count,
    updatedAt,
    campaign,
}: {
    title: string
    intro: string
    count: number
    updatedAt: string
    campaign: string
}) {
    return (
        <header className="mb-8">
            <h1 className="text-h3 md:text-h2 text-pedro-dark leading-tight">{title}</h1>
            <p className="text-gray-700 mt-3 max-w-3xl">{intro}</p>
            <p className="text-sm text-gray-600 mt-2">
                <strong className="text-pedro-dark">
                    {count} {promoWord(count)}
                </strong>{' '}
                · zaktualizowano {formatUpdated(updatedAt)}
            </p>
            <a
                href={seoAppUrl(campaign)}
                className="btn-brutal btn-brutal-lime inline-block mt-5 px-6 py-3 font-bold"
            >
                Otwórz w aplikacji →
            </a>
        </header>
    )
}

export function PromoGrid({ promos, campaign }: { promos: SeoPromo[]; campaign: string }) {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {promos.map((promo) => {
                const cat = categoryById(promo.categoryId)
                const style = cat ?? FALLBACK_CATEGORY_STYLE
                return (
                    <li key={promo.id}>
                        <a
                            href={seoPromoUrl(promo.id, campaign)}
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
                                    <h2 className="font-bold text-pedro-dark leading-snug line-clamp-2 text-base">
                                        {promo.title}
                                    </h2>
                                    {promo.businessName && (
                                        <p className="text-sm text-gray-700 truncate">{promo.businessName}</p>
                                    )}
                                    {promo.place && <p className="text-xs text-gray-500 truncate">{promo.place}</p>}
                                </div>
                            </div>
                            <div className="mt-auto pt-4 flex items-center justify-between gap-2 text-sm">
                                {promo.discountText ? (
                                    <span className="bg-pedro-lime text-pedro-dark font-bold px-3 py-1 rounded-full brutal-border text-xs whitespace-nowrap max-w-[55%] truncate">
                                        {promo.discountText}
                                    </span>
                                ) : (
                                    <span />
                                )}
                                <span className="text-gray-600 whitespace-nowrap">
                                    {promo.validUntil ? `do ${shortDate(promo.validUntil)}` : 'do odwołania'}
                                </span>
                            </div>
                            <span className="mt-3 text-sm font-bold text-pedro-purple group-hover:underline">
                                Otwórz w aplikacji →
                            </span>
                        </a>
                    </li>
                )
            })}
        </ul>
    )
}

export function LinkChips({ title, links }: { title: string; links: PageLink[] }) {
    if (!links.length) return null
    return (
        <section className="mt-10">
            <h2 className="text-xl md:text-2xl text-pedro-dark mb-3">{title}</h2>
            <ul className="flex flex-wrap gap-2">
                {links.map((l) => (
                    <li key={l.path}>
                        <Link
                            href={l.path}
                            className="inline-block bg-white brutal-border rounded-full px-4 py-2 text-sm font-medium text-pedro-dark hover:bg-pedro-lime transition-colors"
                        >
                            {l.label} <span className="text-gray-500">({l.count})</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}
