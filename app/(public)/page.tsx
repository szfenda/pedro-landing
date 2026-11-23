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
import PromosByCity from '@/components/sections/PromosByCity'
import { getHomePromoLinks, getPromosToday } from '@/lib/seoPromos'

// T-054/T-089: „Promki na dziś” ze wspólnej kopii (raz na dobę po Weryfikatorze, cron) —
// przeliczenie strony po północy robi cron; 48 h to tylko zapas (= SEO_REVALIDATE_SECONDS)
export const revalidate = 172800

export default async function Home() {
    // null = błąd odczytu albo 0 promocji → sekcji nie pokazujemy
    const [promosToday, promoLinks] = await Promise.all([
        getPromosToday(),
        // T-079b: wejście do stron /promocje/ (ta sama kopia, bez nowych odczytów bazy)
        getHomePromoLinks(),
    ])

    return (
        <>
            <ScrollProgress />
            <Navigation />
            <main>
                <Hero />
                {promosToday && <PromosToday data={promosToday} />}
                {promoLinks && <PromosByCity data={promoLinks} />}
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
