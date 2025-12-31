import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/contact'
import { contactSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 15

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const userAgent = request.headers.get('user-agent') || ''
  const forwarded = request.headers.get('x-forwarded-for') || ''
  
  try {
    const body = await request.json()
    
    // Walidacja z użyciem istniejącego systemu Zod
    const validatedData = contactSchema.parse(body)
    
    logger.info('Contact form submission started', {
      endpoint: '/api/contact',
      name: validatedData.name,
      email: validatedData.email,
      userAgent,
      forwarded
    })
    
    await sendContactEmail(validatedData)
    
    const duration = Date.now() - startTime
    
    logger.info('Contact form submission successful', {
      endpoint: '/api/contact',
      duration,
      email: validatedData.email
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Wiadomość została wysłana pomyślnie' 
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    
    if (error.name === 'ZodError') {
      logger.warn('Contact form validation error', {
        endpoint: '/api/contact',
        duration,
        validationErrors: error.errors
      })
      
      return NextResponse.json(
        { error: 'Nieprawidłowe dane formularza', details: error.errors },
        { status: 400 }
      )
    }
    
    logger.error('Contact form submission failed', error as Error, {
      endpoint: '/api/contact',
      duration,
      userAgent,
      forwarded
    })
    
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.' },
      { status: 500 }
    )
  }
}