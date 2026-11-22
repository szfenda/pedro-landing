/**
 * „Promocje w Trójmieście” (T-079b) — wejście ze strony głównej do stron /promocje/.
 * Komponent serwerowy, dane z lib/seoPromos.ts (ten sam cache co strony SEO, bez nowych odczytów bazy).
 * Zwykłe linki <a href> — widoczne dla Google.
 */
import Link from 'next/link'
import { promoWord, type HomePromoLinks } from '@/lib/seoPromos'

const CITY_EMOJI: Record<string, string> = {
    '/promocje/gdansk/': '⚓',
    '/promocje/gdynia/': '⛵',
    '/promocje/sopot/': '🌊',
    '/promocje/okolice/': '🌲',
}

export default function PromosByCity({ data }: { data: HomePromoLinks }) {
    return (
        <section id="promocje-w-trojmiescie" className="bg-pedro-light py-12 md:py-16 relative z-10 border-b-3 border-pedro-dark">
            <div className="container-pedro">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6 md:mb-8">
                    <div>
                        <h2 className="text-h3 text-pedro-dark">Promocje w Trójmieście</h2>
                        <p className="text-gray-600 mt-1">
                            {data.total} {promoWord(data.total)} w Gdańsku, Gdyni, Sopocie i okolicach — wybierz miasto lub kategorię.
                        </p>
                    </div>
                </div>

                <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {data.cities.map((city) => (
                        <li key={city.path}>
                            <Link
                                href={city.path}
                                className="flex h-full flex-col bg-white brutal-border rounded-card p-4 md:p-5 shadow-brutal-sm-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-brutal-sm-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pedro-purple"
                            >
                                <span className="text-2xl md:text-3xl" aria-hidden="true">
                                    {CITY_EMOJI[city.path] ?? '📍'}
                                </span>
                                <span className="mt-2 font-bold text-lg md:text-xl text-pedro-dark">{city.label}</span>
                                <span className="text-sm text-gray-600">
                                    {city.count} {promoWord(city.count)}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {data.top.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg md:text-xl text-pedro-dark mb-3">Najpopularniejsze</h3>
                        <ul className="flex flex-wrap gap-2">
                            {data.top.map((l) => (
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
                    </div>
                )}

                {data.occasions.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg md:text-xl text-pedro-dark mb-3">Okazje</h3>
                        <ul className="flex flex-wrap gap-2">
                            {data.occasions.map((l) => (
                                <li key={l.path}>
                                    <Link
                                        href={l.path}
                                        className="inline-block bg-pedro-lime brutal-border rounded-full px-4 py-2 text-sm font-bold text-pedro-dark hover:bg-white transition-colors"
                                    >
                                        {l.label} <span className="font-medium">({l.count})</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-6 md:mt-8 text-center md:text-right">
                    <Link href="/promocje/" className="inline-block font-bold text-pedro-purple hover:underline text-lg">
                        Zobacz wszystkie promocje w Trójmieście →
                    </Link>
                </div>
            </div>
        </section>
    )
}
