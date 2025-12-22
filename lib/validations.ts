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
  businessType: z.enum(['restaurant', 'retail', 'service', 'other']),
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