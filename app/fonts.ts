import { Dela_Gothic_One, Archivo_Black, Inter, Outfit } from 'next/font/google'

// Headline fonts
export const delaGothicOne = Dela_Gothic_One({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-dela-gothic',
    display: 'swap',
})

export const archivoBlack = Archivo_Black({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-archivo-black',
    display: 'swap',
})

// Body fonts
export const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
})
