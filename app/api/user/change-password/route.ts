import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { changePasswordSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = changePasswordSchema.parse(body)
    const { currentPassword, newPassword } = validatedData

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

    // Get user record
    const userRecord = await adminAuth.getUser(uid)

    if (!userRecord.email) {
      return NextResponse.json(
        { success: false, message: 'Nie znaleziono adresu email użytkownika' },
        { status: 400 }
      )
    }

    // Note: Firebase Admin SDK doesn't provide a way to verify current password
    // In a production app, you would need to use Firebase Client SDK on the frontend
    // to reauthenticate the user before calling this endpoint
    
    // For now, we'll proceed with updating the password
    // In production, add additional verification steps

    // Update password in Firebase Auth
    await adminAuth.updateUser(uid, {
      password: newPassword,
    })

    // Optionally revoke all refresh tokens to log out other sessions
    await adminAuth.revokeRefreshTokens(uid)

    return NextResponse.json({
      success: true,
      message: 'Hasło zostało pomyślnie zmienione. Zostaniesz wylogowany z innych urządzeń.',
      data: {
        passwordChanged: true,
        tokensRevoked: true,
      }
    })

  } catch (error: any) {
    console.error('Error changing password:', error)

    // Handle specific Firebase errors
    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { success: false, message: 'Hasło jest zbyt słabe. Użyj co najmniej 6 znaków.' },
        { status: 400 }
      )
    }

    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { success: false, message: 'Nie znaleziono konta użytkownika' },
        { status: 404 }
      )
    }

    if (error.code === 'auth/invalid-password') {
      return NextResponse.json(
        { success: false, message: 'Nieprawidłowe hasło' },
        { status: 400 }
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
      { success: false, message: 'Wystąpił błąd podczas zmiany hasła' },
      { status: 500 }
    )
  }
}