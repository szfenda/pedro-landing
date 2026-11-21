import type { MetadataRoute } from 'next'
const SITE_URL = 'https://www.pedro.app'

// T-079: wyszukiwarki mogą indeksować landing (w tym /promocje/); panel firmy i API pomijamy.
// Zakaz automatycznego pobierania bazy przez inne roboty — regulamin §8 (T-078).
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/auth/',
                    '/resolver/',
                    '/dashboard/',
                    '/billing/',
                    '/settings/',
                    '/edit-business/',
                    '/register-business/',
                    '/no-business/',
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
