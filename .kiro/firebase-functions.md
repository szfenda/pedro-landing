# Vercel Deployment Architecture

## Overview
PEDRO web application is now deployed on Vercel, providing serverless functions and edge network distribution for optimal performance.

## Current Deployment

### Main Application
- **Platform:** Vercel
- **URL:** https://pedro-landing-sage.vercel.app
- **Framework:** Next.js 15.1.2 with App Router
- **Runtime:** Node.js 18

## Serverless Functions

### API Routes on Vercel
All API routes are deployed as Vercel serverless functions:

1. **`/api/health`** - Health monitoring endpoint
   - Returns system status and timestamp
   - Used for uptime monitoring
   - Response time tracking

2. **`/api/contact`** - Contact form submission
   - Handles form validation
   - Sends emails via SMTP (GoDaddy)
   - Returns JSON responses in Polish
   - Timeout: 10 seconds (configured in vercel.json)

3. **`/api/stripe/create-checkout-session`**
   - Creates Stripe subscription checkout sessions
   - Handles Pay-per-Use (PPU) model setup
   - Requires Firebase Auth token

4. **`/api/stripe/create-portal-session`**
   - Creates Stripe Customer Portal sessions
   - Allows users to manage billing and subscriptions
   - Requires Firebase Auth token

5. **`/api/stripe/webhook`**
   - Processes Stripe webhook events
   - Updates user subscription status in Firestore
   - Handles payment success/failure events

## Configuration

### Vercel Configuration (`vercel.json`)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "app/api/contact/route.ts": {
      "maxDuration": 10
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Next.js Configuration for Vercel
```javascript
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['nodemailer']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  }
}
```

## Environment Variables

### Firebase Configuration (Client-side)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBQwpbtbcbXXbcZKtaQ_dNiaxng2wVrksc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pedro-bolt-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pedro-bolt-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pedro-bolt-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=467575898751
NEXT_PUBLIC_FIREBASE_APP_ID=1:467575898751:web:14ae1e19b0a8cff12e754a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6PDQ84SYH1
```

### Firebase Admin SDK (Server-side)
```bash
FIREBASE_PROJECT_ID=pedro-bolt-app
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@pedro-bolt-app.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### SMTP Configuration (GoDaddy)
```bash
SMTP_USER=kontakt@pedro.app
SMTP_PASS=P3dro@2025
SMTP_TO=kontakt@pedro.app
```

### Stripe Integration
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Shared Firebase Project

### Integration with Mobile App
- **Project ID:** pedro-bolt-app
- **Shared Resources:**
  - Firestore database (USER collection shared)
  - Firebase Auth (same user base)
  - Storage buckets
- **Web-Specific:**
  - PARTNER collection (business registration)
  - Stripe integration
  - Web-specific security rules

## Migration from Firebase Functions

### Changes Made
1. **Removed Firebase Functions dependency**
2. **Updated middleware.ts for Vercel cookie handling**
3. **Fixed auth-context.tsx for proper token management**
4. **Added health monitoring endpoint**
5. **Implemented structured logging system**
6. **Configured SMTP with proper error handling**

### Benefits of Vercel
- **Faster cold starts** compared to Firebase Functions
- **Better Next.js integration** with automatic optimization
- **Global edge network** for improved performance
- **Simplified deployment** with Git integration
- **Better monitoring** and analytics

## Monitoring & Logging

### Health Monitoring
- **Endpoint:** `/api/health`
- **Response:** JSON with status, timestamp, and system info
- **Usage:** Uptime monitoring and performance tracking

### Structured Logging
- **Format:** JSON with timestamp, level, message, and context
- **Implementation:** `lib/logger.ts`
- **Usage:** All API routes and error handling

### Error Tracking
- **Platform:** Vercel dashboard
- **Automatic:** Function errors and performance metrics
- **Custom:** Structured error logging in application code

## Security

### Authentication
- **Firebase Auth:** Client-side authentication
- **Server-side verification:** Firebase Admin SDK in API routes
- **Middleware:** Auth state management and redirects

### Environment Security
- **Vercel Environment Variables:** Secure storage of secrets
- **No client-side secrets:** Only public Firebase config exposed
- **HTTPS only:** All traffic encrypted

## Performance

### Edge Network
- **Global CDN:** Automatic edge caching
- **Static assets:** Optimized delivery
- **Function regions:** Automatic optimal placement

### Optimization
- **Bundle splitting:** Next.js automatic optimization
- **Image optimization:** Vercel Image Optimization
- **Caching:** Automatic static and dynamic caching

## Troubleshooting

### Common Issues
1. **Function timeouts:** Configured 10s timeout for contact form
2. **SMTP errors:** Proper error handling and timeouts implemented
3. **Auth issues:** Middleware handles cookie-based auth properly
4. **Build errors:** Webpack configuration handles Node.js modules

### Monitoring
- **Vercel Dashboard:** Real-time function logs and metrics
- **Health endpoint:** System status monitoring
- **Error tracking:** Automatic error reporting and alerting