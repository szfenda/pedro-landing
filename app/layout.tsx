import type { Metadata, Viewport } from 'next'
import { delaGothicOne, inter } from './fonts'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'
import '../styles/animations.css'

export const metadata: Metadata = {
    title: 'PEDRO - Poluj na Promki | Lokalne Promocje w Twojej Dzelnicy',
    description: 'PEDRO to aplikacja mobilna, która pomaga znajdować najlepsze lokalne promocje i kupony w Twojej okolicy. Oszczędzaj pieniądze bez spamu i przeterminowanych kuponów.',
    keywords: ['promocje', 'kupony', 'oszczędności', 'lokalne biznes', 'Pedro', 'Gdańsk'],
    openGraph: {
        title: 'PEDRO - Poluj na Promki',
        description: 'Znajdź najlepsze lokalne promocje bez spamu',
        type: 'website',
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
            <body className={inter.className}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
