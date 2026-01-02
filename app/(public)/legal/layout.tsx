import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-pedro-light">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}