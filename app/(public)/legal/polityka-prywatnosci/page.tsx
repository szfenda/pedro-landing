import type { Metadata } from 'next'
import { LegalDocumentComponent } from '@/components/legal/LegalDocument'
import { LegalNavigation } from '@/components/legal/LegalNavigation'
import { getLegalDocument, LEGAL_DOCUMENTS } from '@/lib/legal/legal-utils'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Polityka Prywatności - PEDRO App',
  description: 'Polityka Prywatności aplikacji PEDRO. Zasady przetwarzania danych osobowych użytkowników aplikacji mobilnej i serwisu internetowego.',
  robots: 'index, follow',
  openGraph: {
    title: 'Polityka Prywatności - PEDRO App',
    description: 'Polityka Prywatności aplikacji PEDRO - ochrona danych osobowych',
    type: 'article',
  }
}

export default function PolitykaPrywatnosciPage() {
  const document = getLegalDocument(LEGAL_DOCUMENTS.POLITYKA_PRYWATNOSCI)
  
  if (!document) {
    notFound()
  }

  return (
    <>
      <LegalNavigation />
      <LegalDocumentComponent document={document} />
    </>
  )
}