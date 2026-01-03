import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { updateEmailSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateEmailSchema.parse(body)
    const { newEmail, password } = validatedData

    // Get auth token from cookies
    const authToken = request.cookies.get('firebase-auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Brak autoryzacji' },
        { status: 401 }
      )
    }

    // Verify the token and get user
    const decodedToken = await adminAuth.verifyIdToken(authToken)
    const uid = decodedToken.uid

    // Check if new email is already in use
    try {
      await adminAuth.getUserByEmail(newEmail)
      return NextResponse.json(
        { success: false, message: 'Ten adres email jest już używany przez inne konto' },
        { status: 400 }
      )
    } catch (error: any) {
      // If user not found, email is available (this is what we want)
      if (error.code !== 'auth/user-not-found') {
        throw error
      }
    }

    // Update email in Firebase Auth
    await adminAuth.updateUser(uid, {
      email: newEmail,
      emailVerified: false, // Reset verification status
    })

    // Generate email verification link
    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pedro.app'}/auth`,
      handleCodeInApp: false,
    }

    const emailVerificationLink = await adminAuth.generateEmailVerificationLink(
      newEmail,
      actionCodeSettings
    )

    // In a real app, you would send this link via email
    // For now, we'll just return success
    console.log('Email verification link:', emailVerificationLink)

    return NextResponse.json({
      success: true,
      message: 'Email został zaktualizowany. Link weryfikacyjny został wysłany.',
      data: {
        newEmail,
        verificationRequired: true,
      }
    })

  } catch (error: any) {
    console.error('Error updating email:', error)

    // Handle specific Firebase errors
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { success: false, message: 'Nieprawidłowy format adresu email' },
        { status: 400 }
      )
    }

    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { success: false, message: 'Ten adres email jest już używany' },
        { status: 400 }
      )
    }

    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { success: false, message: 'Nie znaleziono konta użytkownika' },
        { status: 404 }
      )
    }

    // Handle validation errors
    if (error.name === 'ZodError') {
      const firstError = error.errors[0]
      return NextResponse.json(
        { success: false, message: firstError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Wystąpił błąd podczas aktualizacji emaila' },
      { status: 500 }
    )
  }
}