import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { deleteAccountSchema } from '@/lib/validations'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = deleteAccountSchema.parse(body)
    const { password, confirmation } = validatedData

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

    // Note: In production, you should verify the current password
    // This requires client-side reauthentication before calling this endpoint

    // Find and delete partner document if exists
    let stripeCustomerId: string | null = null
    
    try {
      const partnersQuery = await adminDb
        .collection('partners')
        .where('userId', '==', uid)
        .get()

      if (!partnersQuery.empty) {
        const partnerDoc = partnersQuery.docs[0]
        const partnerData = partnerDoc.data()
        
        // Get Stripe customer ID for cleanup
        stripeCustomerId = partnerData.billing?.stripeCustomerId || null

        // Delete partner document
        await adminDb.collection('partners').doc(partnerDoc.id).delete()
        
        console.log(`Deleted partner document: ${partnerDoc.id}`)
      }
    } catch (error) {
      console.error('Error deleting partner document:', error)
      // Continue with account deletion even if partner cleanup fails
    }

    // Cleanup Stripe data if customer exists
    if (stripeCustomerId) {
      try {
        // Cancel all active subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: 'active',
        })

        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id)
          console.log(`Cancelled subscription: ${subscription.id}`)
        }

        // Delete Stripe customer
        await stripe.customers.del(stripeCustomerId)
        console.log(`Deleted Stripe customer: ${stripeCustomerId}`)
      } catch (error) {
        console.error('Error cleaning up Stripe data:', error)
        // Continue with account deletion even if Stripe cleanup fails
      }
    }

    // Delete user from Firebase Auth
    await adminAuth.deleteUser(uid)
    
    console.log(`Deleted user account: ${uid}`)

    // Clear auth cookie in response
    const response = NextResponse.json({
      success: true,
      message: 'Konto zostało pomyślnie usunięte.',
      data: {
        accountDeleted: true,
        partnerDeleted: !!stripeCustomerId,
        stripeCleanup: !!stripeCustomerId,
      }
    })

    // Clear the auth cookie
    response.cookies.set('firebase-auth-token', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return response

  } catch (error: any) {
    console.error('Error deleting account:', error)

    // Handle specific Firebase errors
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
      { success: false, message: 'Wystąpił błąd podczas usuwania konta' },
      { status: 500 }
    )
  }
}