import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs, LinkChips, SeoHeader, SeoShell } from '@/components/promos/SeoPromoPage'
import { buildPages, cityLabel, getSeoData, promoWord, seoMetadata } from '@/lib/seoPromos'

// T-079: spis stron „promocje <miasto> <kategoria>” — ISR (T-089: cron raz na dobę)
export const revalidate = 172800 // T-089: zapas 48 h; odświeża cron (dane rano, strony po północy)

export async function generateMetadata(): Promise<Metadata> {
    const data = await getSeoData()
    const n = data?.promos.length ?? 0
    return seoMetadata(
        '/promocje/',
        'Promocje w Trójmieście — Gdańsk, Gdynia, Sopot | PEDRO',
        `${n} aktualnych promocji lokalnych firm z Gdańska, Gdyni, Sopotu i okolic: restauracje, uroda, sport, zakupy i więcej. Sprawdzane codziennie przez PEDRO.`
    )
}

export default async function PromocjePage() {
    const data = await getSeoData()
    if (!data || data.promos.length === 0) notFound()
    const { cities, occasions } = buildPages(data)

    return (
        <SeoShell>
            <Breadcrumbs items={[{ label: 'PEDRO', href: '/' }, { label: 'Promocje' }]} />
            <SeoHeader
                title="Promocje w Trójmieście"
                intro="Aktualne promocje lokalnych firm z Gdańska, Gdyni, Sopotu i okolic, zebrane z ich stron i sprawdzane codziennie przez PEDRO. Wybierz miasto i kategorię."
                count={data.promos.length}
                updatedAt={data.updatedAt}
                campaign="spis"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cities.map(({ city, count, path, categories }) => (
                    <section key={city.slug} className="bg-white brutal-border rounded-card p-5 shadow-brutal-sm-dark">
                        <h2 className="text-2xl text-pedro-dark">
                            <Link href={path} className="hover:text-pedro-purple">
                                Promocje — {cityLabel(city)}
                            </Link>
                        </h2>
                        <p className="text-sm text-gray-600 mb-3">
                            {count} {promoWord(count)}
                        </p>
                        <ul className="flex flex-wrap gap-2">
                            {categories.map((l) => (
                                <li key={l.path}>
                                    <Link
                                        href={l.path}
                                        className="inline-block bg-pedro-light brutal-border rounded-full px-3 py-1 text-sm text-pedro-dark hover:bg-pedro-lime transition-colors"
                                    >
                                        {l.label} <span className="text-gray-500">({l.count})</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            <LinkChips title="Okazje" links={occasions} />
        </SeoShell>
    )
}
