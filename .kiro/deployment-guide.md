# Vercel Deployment Guide

## Current Deployment Status
**✅ LIVE:** https://pedro-landing-sage.vercel.app  
**Platform:** Vercel  
**GitHub Repo:** https://github.com/szfenda/pedro-landing

## Quick Deploy Commands
```bash
# Build and deploy
npm run build
vercel --prod

# Local testing
npm run dev
vercel dev
```

## Configuration Files

### vercel.json
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

### next.config.js (Vercel optimized)
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

## Environment Variables (Vercel)
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBQwpbtbcbXXbcZKtaQ_dNiaxng2wVrksc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pedro-bolt-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pedro-bolt-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pedro-bolt-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=467575898751
NEXT_PUBLIC_FIREBASE_APP_ID=1:467575898751:web:14ae1e19b0a8cff12e754a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6PDQ84SYH1

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=pedro-bolt-app
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@pedro-bolt-app.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# SMTP Configuration (GoDaddy)
SMTP_USER=kontakt@pedro.app
SMTP_PASS=P3dro@2025
SMTP_TO=kontakt@pedro.app

# Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Deployment Checklist
- [x] Vercel CLI installed and authenticated
- [x] Project connected to GitHub repository
- [x] Environment variables configured in Vercel dashboard
- [x] Next.js configured for Vercel deployment
- [x] Firebase Admin SDK configured for server-side
- [x] SMTP configuration tested and working
- [x] Health monitoring endpoint active
- [x] Structured logging implemented
- [x] Contact form fully functional

## Performance Metrics
- **Bundle Size:** Optimized for Vercel Edge Network
- **Cold Start:** < 1s with Vercel Functions
- **Global CDN:** Automatic edge caching
- **Health Check:** /api/health endpoint monitoring

## Monitoring & Logging
- **Health Endpoint:** `/api/health` - Returns system status
- **Structured Logging:** JSON format with timestamps and context
- **Error Tracking:** Automatic error reporting in Vercel dashboard
- **Performance:** Real-time metrics in Vercel Analytics

## Migration from Firebase Hosting
**Completed Steps:**
1. ✅ Installed Vercel CLI and created vercel.json
2. ✅ Updated next.config.js for Vercel compatibility
3. ✅ Configured environment variables in Vercel
4. ✅ Fixed auth middleware for Vercel cookie handling
5. ✅ Updated auth context for proper token management
6. ✅ Added health monitoring and structured logging
7. ✅ Tested and deployed contact form with SMTP
8. ✅ Removed Firebase Functions dependency

## Troubleshooting
- **Build fails:** Check webpack configuration and external packages
- **Auth issues:** Verify Firebase Admin SDK environment variables
- **SMTP errors:** Check GoDaddy credentials and timeout settings
- **Performance:** Monitor Vercel Functions execution time
- **Routing:** Ensure middleware.ts handles auth redirects properly