import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  const timestamp = new Date().toISOString()
  
  try {
    // Test Firebase connection
    let firebaseStatus = 'disconnected'
    try {
      if (adminDb) {
        await adminDb.collection('_health').doc('test').get()
        firebaseStatus = 'connected'
      }
    } catch (error) {
      console.error('Firebase health check failed:', error)
    }

    // Test SMTP configuration
    const smtpStatus = process.env.SMTP_USER && process.env.SMTP_PASS ? 'configured' : 'missing'

    // Test Stripe configuration
    const stripeStatus = process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing'

    const healthData = {
      status: 'ok',
      timestamp,
      environment: process.env.NODE_ENV || 'unknown',
      services: {
        firebase: firebaseStatus,
        smtp: smtpStatus,
        stripe: stripeStatus
      }
    }

    // Structured logging
    console.log(JSON.stringify({
      level: 'info',
      message: 'Health check performed',
      timestamp,
      data: healthData
    }))

    return NextResponse.json(healthData)
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Health check failed',
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error'
    }))

    return NextResponse.json(
      { status: 'error', timestamp, error: 'Health check failed' },
      { status: 500 }
    )
  }
}