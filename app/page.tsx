import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Features from '@/components/sections/Features'
import B2B from '@/components/sections/B2B'
import SocialProof from '@/components/sections/SocialProof'
import FAQ from '@/components/sections/FAQ'
import Download from '@/components/sections/Download'
import Contact from '@/components/sections/Contact'

export default function Home() {
    return (
        <>
            <Navigation />
            <main>
                <Hero />
                <About />
                <Features />
                <B2B />
                <SocialProof />
                <FAQ />
                <Download />
                <Contact />
            </main>
            <Footer />
        </>
    )
}
