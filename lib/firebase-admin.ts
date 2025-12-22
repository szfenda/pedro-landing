import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Only initialize in server environment with proper credentials
let adminAuth: any = null
let adminDb: any = null

if (typeof window === 'undefined' && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      })
    }

    adminAuth = getAuth()
    adminDb = getFirestore()
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
  }
}

export { adminAuth, adminDb }