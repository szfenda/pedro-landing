'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrutalCard from '@/components/ui/BrutalCard'
import { LEGAL_DOCUMENTS } from '@/lib/legal/legal-utils'

const legalPages = [
  {
    slug: LEGAL_DOCUMENTS.REGULAMIN,
    title: 'Regulamin',
    description: 'Zasady korzystania z aplikacji PEDRO',
    icon: '📄'
  },
  {
    slug: LEGAL_DOCUMENTS.POLITYKA_PRYWATNOSCI,
    title: 'Polityka Prywatności',
    description: 'Ochrona danych osobowych',
    icon: '🛡️'
  }
]

export function LegalNavigation() {
  const pathname = usePathname()
  
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link 
              href="/" 
              className="hover:text-pedro-purple transition-colors flex items-center"
            >
              <span className="mr-1">🏠</span>
              Strona główna
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700">Dokumenty prawne</li>
        </ol>
      </nav>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {legalPages.map((page) => {
          const isActive = pathname.includes(page.slug)
          
          return (
            <Link key={page.slug} href={`/legal/${page.slug}`}>
              <BrutalCard 
                className={`p-6 transition-all duration-200 hover:scale-105 cursor-pointer ${
                  isActive 
                    ? 'border-pedro-purple shadow-brutal-purple bg-purple-50' 
                    : 'hover:border-pedro-purple hover:shadow-brutal-purple'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg text-2xl ${
                    isActive ? 'bg-pedro-purple text-white' : 'bg-gray-100'
                  }`}>
                    {page.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      isActive ? 'text-pedro-purple' : 'text-pedro-dark'
                    }`}>
                      {page.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {page.description}
                    </p>
                  </div>
                </div>
              </BrutalCard>
            </Link>
          )
        })}
      </div>
    </div>
  )
}