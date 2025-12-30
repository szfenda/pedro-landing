import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/contact'
import { contactSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Walidacja z użyciem istniejącego systemu Zod
    const validatedData = contactSchema.parse(body)
    
    // Rate limiting - prosty mechanizm
    const userAgent = request.headers.get('user-agent') || ''
    const forwarded = request.headers.get('x-forwarded-for') || ''
    
    console.log('Contact form submission:', {
      name: validatedData.name,
      email: validatedData.email,
      userAgent,
      forwarded,
      timestamp: new Date().toISOString()
    })
    
    await sendContactEmail(validatedData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Wiadomość została wysłana pomyślnie' 
    })
  } catch (error: any) {
    console.error('Contact API error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane formularza', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.' },
      { status: 500 }
    )
  }
}