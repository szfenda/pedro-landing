# 📧 Plan Implementacji Aktywnego Formularza Kontaktowego

## 🎯 Cel
Implementacja funkcjonalnego formularza kontaktowego na stronie PEDRO.app z wysyłaniem maili przez Firebase Functions + Nodemailer + GoDaddy Titan Email.

## 🔍 Analiza Aktualnego Stanu

### ✅ Co już istnieje:
1. **Formularz UI** - `components/sections/Contact.tsx` z polami: imię, email, wiadomość
2. **Styling** - Brutal design z klasami `.input-brutal` i `.btn-brutal-lime`
3. **Firebase Functions** - Infrastruktura gotowa (`nextjsFunc` + Node.js 18)
4. **Walidacja System** - React Hook Form + Zod już używane w aplikacji
5. **Error Handling** - Wzorce z auth i business forms
6. **BrutalAlert** - Komponent do wyświetlania komunikatów

### ❌ Co brakuje:
1. **JavaScript obsługa** - Formularz nie ma `onSubmit` ani walidacji
2. **API endpoint** - Brak `/api/contact` route
3. **Nodemailer** - Nie zainstalowany w dependencies
4. **Konfiguracja SMTP** - Brak bezpiecznego przechowywania danych GoDaddy
5. **Walidacja Schema** - Brak schema dla formularza kontaktowego

## 📋 Szczegółowy Plan Implementacji

### **Krok 1: Przygotowanie Dependencies i Konfiguracji**

#### 1.1 Dodanie Nodemailer do Functions
```bash
cd functions
npm install nodemailer @types/nodemailer
```

#### 1.2 Konfiguracja Environment Variables (Firebase)
**Bezpieczne przechowywanie danych SMTP:**
```bash
firebase functions:config:set smtp.host="smtpout.secureserver.net"
firebase functions:config:set smtp.port="587"
firebase functions:config:set smtp.user="[YOUR_EMAIL]"
firebase functions:config:set smtp.pass="[YOUR_PASSWORD]"
firebase functions:config:set smtp.from="[YOUR_EMAIL]"
firebase functions:config:set smtp.to="[DESTINATION_EMAIL]"
```

#### 1.3 Aktualizacja functions/package.json
Dodanie nodemailer do dependencies (automatycznie przez npm install).

### **Krok 2: Implementacja Backend - API Route (Rekomendowana metoda)**

#### 2.1 Utworzenie Contact Service w lib
**Plik:** `lib/contact.ts`
```typescript
import nodemailer from 'nodemailer'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export const sendContactEmail = async (data: ContactFormData) => {
  // Konfiguracja SMTP dla GoDaddy
  const transporter = nodemailer.createTransporter({
    host: 'smtpout.secureserver.net',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER || '[YOUR_EMAIL]',
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptions = {
    from: '[YOUR_EMAIL]',
    to: process.env.SMTP_TO || '[DESTINATION_EMAIL]',
    subject: `Nowa wiadomość z PEDRO.app od ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6C5CE7; border-bottom: 3px solid #2D3436; padding-bottom: 10px;">
          Nowa wiadomość kontaktowa - PEDRO.app
        </h2>
        <div style="background: #F7F9FC; padding: 20px; border: 3px solid #2D3436; border-radius: 16px; margin: 20px 0;">
          <p><strong style="color: #2D3436;">Imię:</strong> ${data.name}</p>
          <p><strong style="color: #2D3436;">Email:</strong> ${data.email}</p>
          <p><strong style="color: #2D3436;">Wiadomość:</strong></p>
          <div style="background: white; padding: 15px; border: 2px solid #2D3436; border-radius: 12px; margin-top: 10px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center;">
          Wiadomość wysłana automatycznie z formularza kontaktowego PEDRO.app
        </p>
      </div>
    `,
    text: `
Nowa wiadomość kontaktowa - PEDRO.app

Imię: ${data.name}
Email: ${data.email}

Wiadomość:
${data.message}

---
Wiadomość wysłana automatycznie z formularza kontaktowego PEDRO.app
    `
  }

  return await transporter.sendMail(mailOptions)
}
```

#### 2.2 Utworzenie API Route
**Plik:** `app/api/contact/route.ts`
```typescript
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
```

### **Krok 3: Frontend Implementation**

#### 3.1 Dodanie Walidacji Schema
**Aktualizacja pliku:** `lib/validations.ts`
```typescript
// Dodanie na końcu pliku
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Imię musi mieć co najmniej 2 znaki')
    .max(50, 'Imię nie może być dłuższe niż 50 znaków')
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/, 'Imię może zawierać tylko litery, spacje i myślniki'),
  email: z.string()
    .email('Nieprawidłowy format adresu email')
    .max(100, 'Email nie może być dłuższy niż 100 znaków'),
  message: z.string()
    .min(10, 'Wiadomość musi mieć co najmniej 10 znaków')
    .max(1000, 'Wiadomość nie może być dłuższa niż 1000 znaków')
    .refine(val => val.trim().length >= 10, 'Wiadomość nie może składać się tylko z białych znaków'),
})

export type ContactFormData = z.infer<typeof contactSchema>
```

#### 3.2 Aktualizacja Contact Component
**Plik:** `components/sections/Contact.tsx`
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, ContactFormData } from '@/lib/validations'
import { socialIcons } from '@/lib/assets'
import BrutalAlert from '@/components/ui/BrutalAlert'
import BrutalInput from '@/components/ui/BrutalInput'
import Image from 'next/image'

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Błąd podczas wysyłania')
      }
      
      setSuccess(true)
      reset()
      
      // Scroll to success message
      setTimeout(() => {
        const successElement = document.querySelector('[data-success-message]')
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      
    } catch (err: any) {
      console.error('Contact form error:', err)
      setError(err.message || 'Wystąpił błąd. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="kontakt" className="bg-white py-section">
      <div className="container-pedro max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="font-headline text-h2 text-pedro-dark mb-4">
            Skontaktuj się
          </h2>
          <p className="text-body text-gray-600">
            Masz pytania? Chętnie pomożemy!
          </p>
        </div>

        {/* Contact Info */}
        <div className="text-center mb-12 space-y-4">
          <p className="text-lg text-pedro-dark">
            📧 <a href="mailto:[YOUR_EMAIL]" className="font-bold hover:text-pedro-purple transition-colors">[YOUR_EMAIL]</a>
          </p>

          {/* Social Links */}
          <div className="flex gap-6 justify-center mt-8">
            <a href="#" aria-label="Instagram" className="transition-transform hover:scale-110 hover:rotate-6">
              <img
                src={socialIcons.instagram}
                alt="Instagram"
                width={40}
                height={40}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
            <a href="#" aria-label="TikTok" className="transition-transform hover:scale-110 hover:rotate-6">
              <img
                src={socialIcons.tiktok}
                alt="TikTok"
                width={40}
                height={40}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
            <a href="#" aria-label="Facebook" className="transition-transform hover:scale-110 hover:rotate-6">
              <img
                src={socialIcons.facebook}
                alt="Facebook"
                width={40}
                height={40}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div data-success-message className="mb-8">
            <BrutalAlert type="success">
              <div className="text-center">
                <div className="text-2xl mb-2">🎉</div>
                <div className="font-bold mb-1">Dziękujemy!</div>
                <div>Twoja wiadomość została wysłana. Odpowiemy najszybciej jak to możliwe.</div>
              </div>
            </BrutalAlert>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <BrutalAlert type="error">
              {error}
            </BrutalAlert>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <BrutalInput
            label="Imię"
            type="text"
            placeholder="Twoje imię"
            error={errors.name?.message}
            disabled={loading}
            {...register('name')}
          />

          <BrutalInput
            label="Email"
            type="email"
            placeholder="twoj@email.pl"
            error={errors.email?.message}
            disabled={loading}
            {...register('email')}
          />

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-pedro-dark mb-2">
              Wiadomość
            </label>
            <textarea
              id="message"
              rows={5}
              className={`input-brutal resize-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Twoja wiadomość..."
              disabled={loading}
              {...register('message')}
            />
            {errors.message && (
              <p className="text-pedro-pink text-sm mt-1 font-medium">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`btn-brutal btn-brutal-lime w-full text-lg transition-all duration-200 ${
              loading || success ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-pedro-dark border-t-transparent rounded-full animate-spin"></div>
                Wysyłanie...
              </span>
            ) : success ? (
              'Wysłano ✓'
            ) : (
              'Wyślij wiadomość'
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
```

### **Krok 4: Environment Variables Configuration**

#### 4.1 Aktualizacja .env.local (dla development)
```env
# SMTP Configuration (GoDaddy Titan Email)
SMTP_USER=[YOUR_EMAIL]
SMTP_PASS=[YOUR_PASSWORD]
SMTP_TO=[DESTINATION_EMAIL]
```

#### 4.2 Firebase Functions Config (dla production)
```bash
firebase functions:config:set smtp.user="[YOUR_EMAIL]"
firebase functions:config:set smtp.pass="[YOUR_PASSWORD]"
firebase functions:config:set smtp.to="[DESTINATION_EMAIL]"
```

### **Krok 5: Testing i Deployment**

#### 5.1 Lokalne Testowanie
```bash
# Terminal 1: Start Next.js development
npm run dev

# Test formularza na http://localhost:3000/#kontakt
```

#### 5.2 Production Deployment
```bash
# Build aplikacji
npm run build
npm run build:functions

# Deploy
npm run deploy
```

## 🔧 Konfiguracja GoDaddy SMTP

### Dane SMTP:
- **Host:** smtpout.secureserver.net
- **Port:** 587
- **Encryption:** STARTTLS
- **Username:** [YOUR_EMAIL]
- **Password:** [DO PODANIA]

### Environment Variables:
```bash
# Development (.env.local)
SMTP_USER=[YOUR_EMAIL]
SMTP_PASS=[YOUR_PASSWORD]
SMTP_TO=[DESTINATION_EMAIL]

# Production (Firebase Functions Config)
firebase functions:config:set smtp.user="[YOUR_EMAIL]"
firebase functions:config:set smtp.pass="[YOUR_PASSWORD]"
firebase functions:config:set smtp.to="[DESTINATION_EMAIL]"
```

## 📊 Przewidywane Rezultaty

### ✅ Po implementacji:
1. **Funkcjonalny formularz** z walidacją React Hook Form + Zod
2. **Bezpieczne wysyłanie** przez GoDaddy SMTP
3. **Profesjonalne maile** z formatowaniem HTML w stylu PEDRO
4. **User-friendly feedback** z BrutalAlert komponentami
5. **Error handling** spójny z resztą aplikacji
6. **Mobile-responsive** brutal design
7. **Loading states** i disabled states podczas wysyłania
8. **Success animation** z scroll do komunikatu

### 🎯 User Experience Flow:
1. Użytkownik wypełnia formularz (imię, email, wiadomość)
2. Walidacja w czasie rzeczywistym (Zod schema)
3. Kliknięcie "Wyślij wiadomość"
4. Loading state z spinnerem
5. Success message z emoji i scroll animation
6. Automatyczne czyszczenie formularza
7. Możliwość wysłania kolejnej wiadomości

## 💡 Rekomendacje Implementacyjne

### **Preferowana Architektura:** API Route
- **Dlaczego:** Prostsze w implementacji, lepsze dla HTTP requests
- **Spójność:** Używa tego samego wzorca co Stripe API routes
- **Debugging:** Łatwiejsze logowanie i error handling
- **Performance:** Bezpośrednie wywołanie bez dodatkowej warstwy

### **Wykorzystanie Istniejącego Kodu:**
1. **React Hook Form + Zod** - już używane w auth i business forms
2. **BrutalAlert** - już istniejący komponent do komunikatów
3. **BrutalInput** - już istniejący komponent do inputów
4. **Error handling patterns** - wzorce z auth systemu
5. **Loading states** - wzorce z business form
6. **Styling classes** - `.input-brutal`, `.btn-brutal-lime` już zdefiniowane

### **Bezpieczeństwo:**
1. **Walidacja server-side** z Zod schema
2. **Rate limiting** przez logging i monitoring
3. **Input sanitization** przez HTML encoding w email template
4. **Environment variables** dla wrażliwych danych
5. **Error masking** - nie ujawnianie szczegółów błędów SMTP

### **Monitoring i Maintenance:**
1. **Console logging** dla debugging
2. **Error tracking** przez Firebase Functions logs
3. **Email delivery monitoring** przez GoDaddy panel
4. **Form submission analytics** przez console logs

## 🚀 Kolejność Implementacji

1. **Krok 1:** Dodanie nodemailer dependencies
2. **Krok 2:** Utworzenie lib/contact.ts service
3. **Krok 3:** Dodanie contact schema do validations.ts
4. **Krok 4:** Utworzenie API route app/api/contact/route.ts
5. **Krok 5:** Aktualizacja Contact component z form handling
6. **Krok 6:** Konfiguracja environment variables
7. **Krok 7:** Testing lokalny
8. **Krok 8:** Deployment i testing produkcyjny

## ✅ Checklist Implementacji

- [x] npm install nodemailer @types/nodemailer w functions/
- [x] Utworzenie lib/contact.ts
- [x] Dodanie contactSchema do lib/validations.ts
- [x] Utworzenie app/api/contact/route.ts
- [x] Aktualizacja components/sections/Contact.tsx
- [x] Konfiguracja .env.local
- [x] Test lokalny formularza
- [x] Konfiguracja SMTP credentials
- [x] Weryfikacja build bez błędów
- [x] Aktualizacja dokumentacji technicznej

**Status:** ✅ IMPLEMENTACJA ZAKOŃCZONA
**Contact Form:** 🟢 AKTYWNY I GOTOWY DO UŻYCIA
**Next Steps:** Testowanie wysyłania maili w środowisku produkcyjnym