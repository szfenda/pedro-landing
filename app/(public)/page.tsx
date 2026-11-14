import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import PromosToday from '@/components/sections/PromosToday'
import About from '@/components/sections/About'
import Features from '@/components/sections/Features'
import B2B from '@/components/sections/B2B'
import SocialProof from '@/components/sections/SocialProof'
import FAQ from '@/components/sections/FAQ'
import Download from '@/components/sections/Download'
import Contact from '@/components/sections/Contact'
import ScrollProgress from '@/components/ui/ScrollProgress'
import MobileStickyCTA from '@/components/ui/MobileStickyCTA'
import { getPromosToday } from '@/lib/publicPromos'

// T-054: „Promki na dziś” z Firestore — strona odświeżana co godzinę (ISR)
export const revalidate = 3600

export default async function Home() {
    // null = błąd odczytu albo 0 promocji → sekcji nie pokazujemy
    const promosToday = await getPromosToday()

    return (
        <>
            <ScrollProgress />
            <Navigation />
            <main>
                <Hero />
                {promosToday && <PromosToday data={promosToday} />}
                <About />
                <Features />
                <B2B />
                <SocialProof />
                <FAQ />
                <Download />
                <Contact />
            </main>
            <Footer />
            <MobileStickyCTA />
        </>
    )
}
