import type { MetadataRoute } from 'next'
import { SITE_URL, buildPages, getSeoData } from '@/lib/seoPromos'

// T-079: mapa strony dla wyszukiwarek — strona główna, dokumenty prawne i strony /promocje/ (≥ 3 promocje)
export const revalidate = 172800 // T-089: zapas 48 h; odświeża cron (dane rano, strony po północy)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()
    const base: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
        { url: `${SITE_URL}/legal/regulamin/`, changeFrequency: 'yearly', priority: 0.2 },
        { url: `${SITE_URL}/legal/polityka-prywatnosci/`, changeFrequency: 'yearly', priority: 0.2 },
    ]
    const data = await getSeoData()
    if (!data) return base
    const updated = new Date(data.updatedAt)
    const promoPages: MetadataRoute.Sitemap = buildPages(data).paths.map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: updated,
        changeFrequency: 'daily',
        priority: path === '/promocje/' ? 0.9 : path.split('/').length === 4 ? 0.8 : 0.7,
    }))
    return [...base, ...promoPages]
}
