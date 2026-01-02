import { NextResponse } from 'next/server'
import { getLegalDocument, LEGAL_DOCUMENTS } from '@/lib/legal/legal-utils'

export async function GET() {
  try {
    const document = getLegalDocument(LEGAL_DOCUMENTS.REGULAMIN)
    
    if (!document) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Document not found' 
        },
        { status: 404 }
      )
    }

    const response = {
      success: true,
      document: {
        id: document.id,
        title: document.title,
        version: document.version,
        lastUpdated: document.lastUpdated,
        description: document.description,
        content: document.content,
        pdfUrl: document.pdfUrl,
        webUrl: `/legal/${document.slug}`
      },
      metadata: {
        timestamp: new Date().toISOString(),
        apiVersion: '1.0.0'
      }
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('Error fetching regulamin:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}