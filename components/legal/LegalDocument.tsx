'use client'

import { LegalDocument, formatLegalDate } from '@/lib/legal/legal-utils'
import BrutalCard from '@/components/ui/BrutalCard'
import BrutalButton from '@/components/ui/BrutalButton'
import { functionalIcons } from '@/lib/assets'

interface LegalDocumentProps {
  document: LegalDocument
}

export function LegalDocumentComponent({ document }: LegalDocumentProps) {
  const handleDownloadPDF = () => {
    window.open(document.pdfUrl, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-pedro-dark mb-4 font-dela">
          {document.title}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {document.description}
        </p>
        
        {/* Metadata */}
        <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <span>Ostatnia aktualizacja: {formatLegalDate(document.lastUpdated)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📄</span>
            <span>Wersja: {document.version}</span>
          </div>
        </div>

        {/* Download PDF Button */}
        <BrutalButton
          variant="outline"
          onClick={handleDownloadPDF}
          className="mb-8"
        >
          <span className="mr-2">⬇️</span>
          Pobierz PDF
        </BrutalButton>
      </div>

      {/* Content */}
      <BrutalCard className="p-8">
        <div className="prose prose-lg max-w-none">
          {document.content.map((section) => (
            <div key={section.id} className="mb-8">
              <h2 className="text-2xl font-bold text-pedro-dark mb-4 font-dela">
                {section.title}
              </h2>
              
              {section.content && (
                <div 
                  className="mb-4 text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') 
                  }}
                />
              )}
              
              {section.subsections && section.subsections.length > 0 && (
                <div className="space-y-4">
                  {section.subsections.map((subsection) => (
                    <div key={subsection.id} className="ml-4">
                      {subsection.title && (
                        <h3 className="font-semibold text-pedro-dark mb-2">
                          {subsection.title}
                        </h3>
                      )}
                      <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: subsection.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br />') 
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </BrutalCard>

      {/* Footer Actions */}
      <div className="mt-8 text-center">
        <BrutalButton
          variant="primary"
          onClick={handleDownloadPDF}
          className="mr-4"
        >
          <span className="mr-2">⬇️</span>
          Pobierz PDF
        </BrutalButton>
        
        <BrutalButton
          variant="outline"
          onClick={() => window.history.back()}
        >
          Powrót
        </BrutalButton>
      </div>
    </div>
  )
}