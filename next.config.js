/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: {
        domains: ['firebasestorage.googleapis.com'],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // T-006 #2: stare/zewnętrzne adresy (linki z aplikacji, QR partnera) → istniejące strony.
    async redirects() {
        const appDownload = 'https://app.pedro.app/?utm_source=landing&utm_medium=redirect&utm_campaign=download'
        return [
            { source: '/legal/privacy', destination: '/legal/polityka-prywatnosci/', permanent: true },
            { source: '/legal/terms', destination: '/legal/regulamin/', permanent: true },
            { source: '/legal/cookies', destination: '/legal/polityka-prywatnosci/#cookies', permanent: true },
            // Brak osobnej strony licencji open source — regulamin opisuje zasady korzystania z aplikacji
            { source: '/legal/licenses', destination: '/legal/regulamin/', permanent: true },
            { source: '/download', destination: appDownload, permanent: true },
            { source: '/update', destination: appDownload, permanent: true },
            // QR partnera (https://pedro.app/partner/<id>) zeskanowany zwykłym aparatem → oferty partnera w web-appce
            { source: '/partner/:id', destination: 'https://app.pedro.app/partner/:id', permanent: true },
        ]
    },
    // Usuń env section - Vercel zarządza tym automatycznie
}

module.exports = nextConfig
