import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { adminDb } from '@/lib/firebase-admin'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    
    // Find partner by customer ID
    const partnersQuery = await adminDb
      .collection('partners')
      .where('billing.stripeCustomerId', '==', customerId)
      .get()

    if (partnersQuery.empty) {
      console.error('Partner not found for customer:', customerId)
      return
    }

    const partnerDoc = partnersQuery.docs[0]
    const partnerId = partnerDoc.id

    // Update partner document
    await adminDb.collection('partners').doc(partnerId).update({
      'businessModel.ppuEnabled': subscription.status === 'active',
      'businessModel.ppuActivatedAt': subscription.status === 'active' ? new Date() : null,
      'billing.subscriptionId': subscription.id,
      'billing.subscriptionStatus': subscription.status,
      'billing.currentPeriodStart': new Date(subscription.current_period_start * 1000),
      'billing.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
      updatedAt: new Date(),
    })

    console.log(`Updated partner ${partnerId} subscription status: ${subscription.status}`)
  } catch (error) {
    console.error('Error handling subscription change:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    
    // Find partner by customer ID
    const partnersQuery = await adminDb
      .collection('partners')
      .where('billing.stripeCustomerId', '==', customerId)
      .get()

    if (partnersQuery.empty) {
      console.error('Partner not found for customer:', customerId)
      return
    }

    const partnerDoc = partnersQuery.docs[0]
    const partnerId = partnerDoc.id

    // Update partner document
    await adminDb.collection('partners').doc(partnerId).update({
      'businessModel.ppuEnabled': false,
      'businessModel.currentPhase': 'beta_free',
      'billing.subscriptionId': null,
      'billing.subscriptionStatus': 'canceled',
      updatedAt: new Date(),
    })

    console.log(`Canceled subscription for partner ${partnerId}`)
  } catch (error) {
    console.error('Error handling subscription deletion:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string
    
    // Find partner by customer ID
    const partnersQuery = await adminDb
      .collection('partners')
      .where('billing.stripeCustomerId', '==', customerId)
      .get()

    if (partnersQuery.empty) {
      console.error('Partner not found for customer:', customerId)
      return
    }

    const partnerDoc = partnersQuery.docs[0]
    const partnerId = partnerDoc.id

    // Log successful payment
    console.log(`Payment succeeded for partner ${partnerId}, amount: ${invoice.amount_paid}`)

    // You could store payment history here if needed
    // await adminDb.collection('partners').doc(partnerId).collection('payments').add({
    //   invoiceId: invoice.id,
    //   amount: invoice.amount_paid,
    //   currency: invoice.currency,
    //   status: 'succeeded',
    //   paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
    // })
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string
    
    // Find partner by customer ID
    const partnersQuery = await adminDb
      .collection('partners')
      .where('billing.stripeCustomerId', '==', customerId)
      .get()

    if (partnersQuery.empty) {
      console.error('Partner not found for customer:', customerId)
      return
    }

    const partnerDoc = partnersQuery.docs[0]
    const partnerId = partnerDoc.id

    console.log(`Payment failed for partner ${partnerId}`)

    // You might want to notify the partner or take other actions
    // For now, just log the failure
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}