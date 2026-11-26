import { z } from 'zod'

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy format email'),
  password: z.string().min(1, 'Podaj hasło'),
})

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki'),
  email: z.string().email('Nieprawidłowy format email'),
  password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Nieprawidłowy format email'),
})

// Business validation schemas
export const businessFormSchema = z.object({
  companyName: z.string().min(2, 'Nazwa firmy musi mieć co najmniej 2 znaki'),
  nip: z.string().regex(/^\d{10}$/, 'NIP musi składać się z 10 cyfr'),
  businessType: z.string().min(1, 'Wybierz typ biznesu'), // Changed to string to support dynamic types
  address: z.object({
    line1: z.string().min(5, 'Adres musi mieć co najmniej 5 znaków'),
    line2: z.string().optional(),
    city: z.string().min(2, 'Miasto musi mieć co najmniej 2 znaki'),
    postalCode: z.string().regex(/^\d{2}-\d{3}$/, 'Kod pocztowy musi być w formacie XX-XXX'),
    country: z.string().default('Polska'),
  }),
  email: z.string().email('Nieprawidłowy format email'),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]{9,15}$/, 'Nieprawidłowy format telefonu'),
  contactPersonName: z.string().min(2, 'Imię i nazwisko musi mieć co najmniej 2 znaki'),
  website: z.string().url('Nieprawidłowy format URL').optional().or(z.literal('')),
  description: z.string().min(10, 'Opis musi mieć co najmniej 10 znaków'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type BusinessFormData = z.infer<typeof businessFormSchema>

// Contact form validation schema
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

// T-096: „Zgłoś biznes do PEDRO” — tylko link obowiązkowy.
// Komunikaty błędów to klucze tłumaczeń (messages/*.json → zglos.errors.*), formularz pokazuje je przez t().

/** Dopisuje `https://`, gdy ktoś wpisał sam adres (np. `www.firma.pl`, `facebook.com/firma`). */
export function normalizeBusinessLink(raw: string): string {
  const value = raw.trim()
  if (!value) return value
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

/** Poprawny adres http(s) z domeną (z kropką), np. https://facebook.com/firma. */
export function isBusinessLink(raw: string): boolean {
  try {
    const url = new URL(normalizeBusinessLink(raw))
    return (url.protocol === 'http:' || url.protocol === 'https:') && /\.[a-z]{2,}$/i.test(url.hostname)
  } catch {
    return false
  }
}

export const ZGLOS_NOTE_MAX = 500

export const zglosSchema = z.object({
  link: z.string()
    .trim()
    .min(1, 'zglos.errors.linkRequired')
    .max(500, 'zglos.errors.linkInvalid')
    .refine(isBusinessLink, 'zglos.errors.linkInvalid'),
  name: z.string().trim().max(100, 'zglos.errors.tooLong').optional(),
  city: z.string().trim().max(60, 'zglos.errors.tooLong').optional(),
  note: z.string().trim().max(ZGLOS_NOTE_MAX, 'zglos.errors.noteTooLong').optional(),
  email: z.union([
    z.literal(''),
    z.string().trim().email('zglos.errors.emailInvalid').max(100, 'zglos.errors.emailInvalid'),
  ]).optional(),
  owner: z.boolean().optional(),
  // Pułapka na boty (ukryte pole) — człowiek zostawia puste; trasa sprawdza i po cichu odrzuca
  website: z.string().max(500).optional(),
})

export type ZglosFormData = z.infer<typeof zglosSchema>

// User settings validation schemas
export const updateEmailSchema = z.object({
  newEmail: z.string().email('Nieprawidłowy format email'),
  password: z.string().min(1, 'Podaj obecne hasło'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Podaj obecne hasło'),
  newPassword: z.string().min(8, 'Nowe hasło musi mieć co najmniej 8 znaków'),
  confirmPassword: z.string().min(1, 'Potwierdź nowe hasło'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Hasła muszą być identyczne",
  path: ["confirmPassword"],
})

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Podaj hasło'),
  confirmation: z.literal('USUŃ', {
    errorMap: () => ({ message: 'Wpisz "USUŃ" aby potwierdzić' })
  }),
})

export const deleteBusinessSchema = z.object({
  confirmation: z.literal('USUŃ BIZNES', {
    errorMap: () => ({ message: 'Wpisz "USUŃ BIZNES" aby potwierdzić' })
  }),
})

export type UpdateEmailFormData = z.infer<typeof updateEmailSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>
export type DeleteBusinessFormData = z.infer<typeof deleteBusinessSchema>