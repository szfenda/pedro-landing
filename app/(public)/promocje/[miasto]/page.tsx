import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs, LinkChips, PromoGrid, SeoHeader, SeoShell } from '@/components/promos/SeoPromoPage'
import { MIN_PROMOS, buildPages, cityLabel, findCity, getSeoData, promosFor, seoMetadata } from '@/lib/seoPromos'

// T-079: /promocje/<miasto>/ — ISR co 6 h; strona tylko przy ≥ 3 promocjach
export const revalidate = 21600
/** Na stronie miasta najnowsze; pełne listy są w kategoriach. */
const CITY_LIMIT = 30

type Params = Promise<{ miasto: string }>

export async function generateStaticParams() {
    const data = await getSeoData()
    if (!data) return []
    return buildPages(data).cities.map((c) => ({ miasto: c.city.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { miasto } = await params
    const city = findCity(miasto)
    const data = await getSeoData()
    if (!city || !data) return {}
    const n = promosFor(data, city.slug).length
    return seoMetadata(
        `/promocje/${city.slug}/`,
        `Promocje ${cityLabel(city)} — ${n} aktualnych ofert | PEDRO`,
        `Aktualne promocje i rabaty ${city.inName}: restauracje, uroda, zdrowie, sport, zakupy i usługi. ${n} ofert lokalnych firm sprawdzanych przez PEDRO.`
    )
}

export default async function CityPage({ params }: { params: Params }) {
    const { miasto } = await params
    const city = findCity(miasto)
    const data = await getSeoData()
    if (!city || !data) notFound()
    const promos = promosFor(data, city.slug)
    if (promos.length < MIN_PROMOS) notFound()

    const pages = buildPages(data)
    const categories = pages.cities.find((c) => c.city.slug === city.slug)?.categories ?? []
    const otherCities = pages.cities
        .filter((c) => c.city.slug !== city.slug)
        .map((c) => ({ path: c.path, label: cityLabel(c.city), count: c.count }))
    const label = cityLabel(city)
    const campaign = `${city.slug}-wszystkie`

    return (
        <SeoShell>
            <Breadcrumbs items={[{ label: 'PEDRO', href: '/' }, { label: 'Promocje', href: '/promocje/' }, { label }]} />
            <SeoHeader
                title={`Promocje — ${label}`}
                intro={`Aktualne promocje lokalnych firm ${city.inName}, zebrane z ich stron i sprawdzane przez PEDRO. Poniżej najnowsze — pełne listy są w kategoriach, a mapa i szczegóły w aplikacji.`}
                count={promos.length}
                updatedAt={data.updatedAt}
                campaign={campaign}
            />
            <LinkChips title={`Kategorie ${city.inName}`} links={categories} />
            <h2 className="text-xl md:text-2xl text-pedro-dark mt-10 mb-4">Najnowsze promocje</h2>
            <PromoGrid promos={promos.slice(0, CITY_LIMIT)} campaign={campaign} />
            <LinkChips title="Inne miasta" links={otherCities} />
            <LinkChips title="Okazje" links={pages.occasions} />
        </SeoShell>
    )
}
