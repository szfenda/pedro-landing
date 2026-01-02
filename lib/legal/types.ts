/**
 * Legal Documents Types
 * PEDRO App - Legal System
 */

export interface LegalSubsection {
  id: string
  title: string
  content: string
}

export interface LegalSection {
  id: string
  title: string
  content: string
  subsections?: LegalSubsection[]
}

export interface LegalDocument {
  id: string
  title: string
  lastUpdated: string
  version: string
  content: LegalSection[]
  pdfUrl: string
  slug: string
  description: string
}

export const LEGAL_DOCUMENTS = {
  REGULAMIN: 'regulamin',
  POLITYKA_PRYWATNOSCI: 'polityka-prywatnosci'
} as const

export type LegalDocumentType = typeof LEGAL_DOCUMENTS[keyof typeof LEGAL_DOCUMENTS]