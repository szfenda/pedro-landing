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
    // Usuń env section - Vercel zarządza tym automatycznie
}

module.exports = nextConfig
