import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs, LinkChips, PromoGrid, SeoHeader, SeoShell } from '@/components/promos/SeoPromoPage'
import {
    CITIES,
    MIN_PROMOS,
    buildPages,
    cityLabel,
    findCategory,
    findCity,
    getSeoData,
    promosFor,
    seoMetadata,
} from '@/lib/seoPromos'

// T-079: /promocje/<miasto>/<kategoria>/ — ISR co 6 h; strona tylko przy ≥ 3 promocjach
export const revalidate = 21600

type Params = Promise<{ miasto: string; kategoria: string }>

export async function generateStaticParams() {
    const data = await getSeoData()
    if (!data) return []
    return buildPages(data).cities.flatMap((c) =>
        c.categories.map((l) => ({ miasto: c.city.slug, kategoria: l.path.split('/')[3] }))
    )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { miasto, kategoria } = await params
    const city = findCity(miasto)
    const cat = findCategory(kategoria)
    const data = await getSeoData()
    if (!city || !cat || !data) return {}
    const n = promosFor(data, city.slug, cat.slug).length
    return seoMetadata(
        `/promocje/${city.slug}/${cat.slug}/`,
        `Promocje ${cat.lower} ${cityLabel(city)} — ${n} aktualnych | PEDRO`,
        `${n} aktualnych promocji i rabatów ${city.inName} w kategorii ${cat.lower}. Oferty lokalnych firm sprawdzane przez PEDRO — szczegóły i mapa w aplikacji.`
    )
}

export default async function CityCategoryPage({ params }: { params: Params }) {
    const { miasto, kategoria } = await params
    const city = findCity(miasto)
    const cat = findCategory(kategoria)
    const data = await getSeoData()
    if (!city || !cat || !data) notFound()
    const promos = promosFor(data, city.slug, cat.slug)
    if (promos.length < MIN_PROMOS) notFound()

    const label = cityLabel(city)
    const campaign = `${city.slug}-${cat.slug}`
    const pages = buildPages(data)
    // Linki wewnętrzne: inne kategorie w tym mieście + ta sama kategoria w innych miastach
    const otherCategories = (pages.cities.find((c) => c.city.slug === city.slug)?.categories ?? []).filter(
        (l) => !l.path.endsWith(`/${cat.slug}/`)
    )
    const sameInOtherCities = CITIES.filter((c) => c.slug !== city.slug)
        .map((c) => ({
            path: `/promocje/${c.slug}/${cat.slug}/`,
            label: cityLabel(c),
            count: promosFor(data, c.slug, cat.slug).length,
        }))
        .filter((l) => l.count >= MIN_PROMOS)

    return (
        <SeoShell>
            <Breadcrumbs
                items={[
                    { label: 'PEDRO', href: '/' },
                    { label: 'Promocje', href: '/promocje/' },
                    { label, href: `/promocje/${city.slug}/` },
                    { label: cat.name },
                ]}
            />
            <SeoHeader
                title={`Promocje ${cat.lower} — ${label}`}
                intro={`Aktualne promocje i rabaty ${city.inName} w kategorii ${cat.lower}, zebrane ze stron lokalnych firm i sprawdzane przez PEDRO. Szczegóły, mapę i warunki znajdziesz w aplikacji.`}
                count={promos.length}
                updatedAt={data.updatedAt}
                campaign={campaign}
            />
            <PromoGrid promos={promos} campaign={campaign} />
            <LinkChips title={`Inne kategorie ${city.inName}`} links={otherCategories} />
            <LinkChips title={`${cat.name} w innych miastach`} links={sameInOtherCities} />
        </SeoShell>
    )
}
