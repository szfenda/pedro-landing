import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { deleteBusinessSchema } from '@/lib/validations'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = deleteBusinessSchema.parse(body)
    const { partnerId, confirmation } = body

    if (!partnerId) {
      return NextResponse.json(
        { success: false, message: 'Brak ID partnera' },
        { status: 400 }
      )
    }

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

    // Get partner document to verify ownership
    const partnerDoc = await adminDb.collection('partners').doc(partnerId).get()

    if (!partnerDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Nie znaleziono biznesu' },
        { status: 404 }
      )
    }

    const partnerData = partnerDoc.data()

    // Verify user owns this partner
    if (partnerData?.userId !== uid) {
      return NextResponse.json(
        { success: false, message: 'Brak uprawnień do usunięcia tego biznesu' },
        { status: 403 }
      )
    }

    // Get Stripe customer ID for cleanup
    const stripeCustomerId = partnerData?.billing?.stripeCustomerId

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
        // Continue with business deletion even if Stripe cleanup fails
      }
    }

    // Delete partner document
    await adminDb.collection('partners').doc(partnerId).delete()
    
    console.log(`Deleted partner: ${partnerId}`)

    return NextResponse.json({
      success: true,
      message: 'Biznes został pomyślnie usunięty. Twoje konto użytkownika zostało zachowane.',
      data: {
        businessDeleted: true,
        stripeCleanup: !!stripeCustomerId,
        userAccountPreserved: true,
      }
    })

  } catch (error: any) {
    console.error('Error deleting business:', error)

    // Handle validation errors
    if (error.name === 'ZodError') {
      const firstError = error.errors[0]
      return NextResponse.json(
        { success: false, message: firstError.message },
        { status: 400 }
      )
    }

    // Handle Firestore errors
    if (error.code === 'not-found') {
      return NextResponse.json(
        { success: false, message: 'Nie znaleziono biznesu' },
        { status: 404 }
      )
    }

    if (error.code === 'permission-denied') {
      return NextResponse.json(
        { success: false, message: 'Brak uprawnień' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Wystąpił błąd podczas usuwania biznesu' },
      { status: 500 }
    )
  }
}