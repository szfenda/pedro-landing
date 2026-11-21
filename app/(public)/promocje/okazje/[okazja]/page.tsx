import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs, LinkChips, PromoGrid, SeoHeader, SeoShell } from '@/components/promos/SeoPromoPage'
import {
    MIN_PROMOS,
    buildPages,
    findOccasion,
    getSeoData,
    promosForOccasion,
    seoMetadata,
} from '@/lib/seoPromos'

// T-079: /promocje/okazje/<okazja>/ (pole `campaigns`) — ISR co 6 h; strona tylko przy ≥ 3 promocjach
export const revalidate = 21600

type Params = Promise<{ okazja: string }>

export async function generateStaticParams() {
    const data = await getSeoData()
    if (!data) return []
    return buildPages(data).occasions.map((o) => ({ okazja: o.path.split('/')[3] }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { okazja } = await params
    const occasion = findOccasion(okazja)
    const data = await getSeoData()
    if (!occasion || !data) return {}
    const n = promosForOccasion(data, occasion).length
    return seoMetadata(
        `/promocje/okazje/${occasion.slug}/`,
        `${occasion.name} — promocje w Trójmieście (${n}) | PEDRO`,
        `${occasion.intro} ${n} aktualnych ofert z Gdańska, Gdyni, Sopotu i okolic, sprawdzanych przez PEDRO.`
    )
}

export default async function OccasionPage({ params }: { params: Params }) {
    const { okazja } = await params
    const occasion = findOccasion(okazja)
    const data = await getSeoData()
    if (!occasion || !data) notFound()
    const promos = promosForOccasion(data, occasion)
    if (promos.length < MIN_PROMOS) notFound()

    const campaign = `okazje-${occasion.slug}`
    const pages = buildPages(data)
    const otherOccasions = pages.occasions.filter((o) => !o.path.endsWith(`/${occasion.slug}/`))
    const cities = pages.cities.map((c) => ({
        path: c.path,
        label: c.city.slug === 'okolice' ? 'Okolice Trójmiasta' : c.city.name,
        count: c.count,
    }))

    return (
        <SeoShell>
            <Breadcrumbs
                items={[{ label: 'PEDRO', href: '/' }, { label: 'Promocje', href: '/promocje/' }, { label: occasion.name }]}
            />
            <SeoHeader
                title={`${occasion.name} — promocje w Trójmieście`}
                intro={`${occasion.intro} Szczegóły, mapę i warunki znajdziesz w aplikacji PEDRO.`}
                count={promos.length}
                updatedAt={data.updatedAt}
                campaign={campaign}
            />
            <PromoGrid promos={promos} campaign={campaign} />
            <LinkChips title="Inne okazje" links={otherOccasions} />
            <LinkChips title="Promocje w miastach" links={cities} />
        </SeoShell>
    )
}
