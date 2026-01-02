import type { Metadata } from 'next'
import { LegalDocumentComponent } from '@/components/legal/LegalDocument'
import { LegalNavigation } from '@/components/legal/LegalNavigation'
import { getLegalDocument, LEGAL_DOCUMENTS } from '@/lib/legal/legal-utils'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Regulamin - PEDRO App',
  description: 'Regulamin korzystania z aplikacji PEDRO w wersji BETA. Zasady użytkowania platformy agregującej lokalne promocje i kupony.',
  robots: 'index, follow',
  openGraph: {
    title: 'Regulamin - PEDRO App',
    description: 'Regulamin korzystania z aplikacji PEDRO w wersji BETA',
    type: 'article',
  }
}

export default function RegulaminPage() {
  const document = getLegalDocument(LEGAL_DOCUMENTS.REGULAMIN)
  
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