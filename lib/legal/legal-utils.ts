/**
 * Legal Documents Utilities and Types
 * PEDRO App - Legal System
 */

// Import types from separate file to avoid circular dependencies
import { LegalDocument, LegalSection, LegalSubsection, LEGAL_DOCUMENTS, LegalDocumentType } from './types'
// Import functions from separate files
import { getRegulaminDocument } from './regulamin'
import { getPolitykaPrywatnosciDocument } from './politykaPrywatnosci'

// Re-export types for convenience
export type { LegalDocument, LegalSection, LegalSubsection, LegalDocumentType }
export { LEGAL_DOCUMENTS }

/**
 * Get legal document by slug
 */
export function getLegalDocument(slug: string): LegalDocument | null {
  switch (slug) {
    case LEGAL_DOCUMENTS.REGULAMIN:
      return getRegulaminDocument()
    case LEGAL_DOCUMENTS.POLITYKA_PRYWATNOSCI:
      return getPolitykaPrywatnosciDocument()
    default:
      return null
  }
}

/**
 * Get all available legal documents
 */
export function getAllLegalDocuments(): LegalDocument[] {
  return [
    getRegulaminDocument(),
    getPolitykaPrywatnosciDocument()
  ]
}

/**
 * Format date for display
 */
export function formatLegalDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Generate breadcrumbs for legal pages
 */
export function generateLegalBreadcrumbs(slug: string) {
  const document = getLegalDocument(slug)
  return [
    { label: 'Strona główna', href: '/' },
    { label: 'Dokumenty prawne', href: '/legal' },
    { label: document?.title || 'Dokument', href: `/legal/${slug}` }
  ]
}