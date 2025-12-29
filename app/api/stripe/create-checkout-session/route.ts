import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Get request body
    const { partnerId } = await request.json()

    if (!partnerId) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 })
    }

    // Get partner document
    const partnerDoc = await adminDb.collection('partners').doc(partnerId).get()
    
    if (!partnerDoc.exists) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    const partnerData = partnerDoc.data()
    
    // Verify ownership
    if (partnerData?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create or get Stripe customer
    let customerId = partnerData?.billing?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: partnerData?.email,
        name: partnerData?.companyName,
        metadata: {
          partnerId: partnerId,
          userId: userId,
        },
      })
      customerId = customer.id

      // Update partner document with customer ID
      await adminDb.collection('partners').doc(partnerId).update({
        'billing.stripeCustomerId': customerId,
      })
    }

    // Create checkout session for PPU subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'PEDRO Pay-per-Use',
              description: 'Płać tylko za wykorzystane kupony',
            },
            unit_amount: 0, // Base subscription is free
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/billing?canceled=true`,
      metadata: {
        partnerId: partnerId,
        userId: userId,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}