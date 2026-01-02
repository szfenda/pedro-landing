import type { Metadata, Viewport } from 'next'
import { delaGothicOne, inter } from './fonts'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'
import '../styles/animations.css'

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://pedro.app' : 'http://localhost:3000'),
    title: 'PEDRO - Poluj na Promki | Lokalne Promocje w Twojej Dzelnicy',
    description: 'PEDRO to aplikacja mobilna, która pomaga znajdować najlepsze lokalne promocje i kupony w Twojej okolicy. Oszczędzaj pieniądze bez spamu i przeterminowanych kuponów.',
    keywords: ['promocje', 'kupony', 'oszczędności', 'lokalne biznes', 'Pedro', 'Gdańsk'],
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
            { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
    },
    manifest: '/site.webmanifest',
    openGraph: {
        title: 'PEDRO - Poluj na Promki',
        description: 'Znajdź najlepsze lokalne promocje bez spamu',
        type: 'website',
        images: [
            {
                url: '/android-chrome-512x512.png',
                width: 512,
                height: 512,
                alt: 'PEDRO - Poluj na Promki',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: 'PEDRO - Poluj na Promki',
        description: 'Znajdź najlepsze lokalne promocje bez spamu',
        images: ['/android-chrome-512x512.png'],
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pl" className={`${delaGothicOne.variable} ${inter.variable}`}>
            <head>
                <meta name="theme-color" content="#6C5CE7" />
                <meta name="msapplication-TileColor" content="#6C5CE7" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
            </head>
            <body className={inter.className}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
