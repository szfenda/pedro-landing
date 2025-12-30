# Firebase Functions Configuration

## Overview
PEDRO web application uses Firebase Functions to host the entire Next.js application, providing server-side rendering and API route functionality.

## Current Functions

### `nextjsFunc` - Main Application Function
- **Purpose:** Hosts the complete Next.js application on Firebase Functions
- **Runtime:** Node.js 18
- **Location:** `functions/src/index.ts`
- **Functionality:** 
  - Handles all HTTP requests to the application
  - Provides server-side rendering (SSR)
  - Serves API routes for Stripe integration
  - Manages authentication and protected routes

```typescript
export const nextjsFunc = onRequest(async (req, res) => {
  await nextjsServer.prepare()
  return nextjsHandle(req, res)
})
```

## Configuration

### Firebase Hosting Rewrites
All requests are routed through the single `nextjsFunc`:
```json
{
  "rewrites": [
    { "source": "/api/**", "function": "nextjsFunc" },
    { "source": "**", "function": "nextjsFunc" }
  ]
}
```

### TypeScript Configuration
**Fixed Configuration (`functions/tsconfig.json`):**
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "types": ["node"]
  }
}
```

**Key Settings:**
- `esModuleInterop: true` - Required for Next.js compatibility
- `skipLibCheck: true` - Prevents external type checking errors
- `types: ["node"]` - Limits automatic type loading to prevent cors/nodemailer errors

## API Routes Served by Functions

### Stripe Integration
1. **`/api/stripe/create-checkout-session`**
   - Creates Stripe subscription checkout sessions
   - Handles Pay-per-Use (PPU) model setup
   - Requires Firebase Auth token

2. **`/api/stripe/create-portal-session`**
   - Creates Stripe Customer Portal sessions
   - Allows users to manage billing and subscriptions
   - Requires Firebase Auth token

3. **`/api/stripe/webhook`**
   - Processes Stripe webhook events
   - Updates user subscription status in Firestore
   - Handles payment success/failure events

## Dependencies

### Production Dependencies
```json
{
  "firebase-admin": "^11.11.0",
  "firebase-functions": "^4.5.0",
  "next": "^15.1.2"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.7.2",
  "@types/node": "^18.0.0"
}
```

## Build Process

### Commands
```bash
# Build functions only
npm run build:functions

# Build entire application
npm run build && npm run build:functions

# Deploy functions only
npm run deploy:functions

# Full deployment
npm run deploy
```

### Build Output
- **Source:** `functions/src/`
- **Compiled:** `functions/lib/` (excluded from Git)
- **Next.js Build:** `functions/lib/` references `../.next/` folder

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

### Security
- **Firestore Rules:** User-scoped access control
- **Auth Verification:** Server-side token validation in API routes
- **CORS:** Handled automatically by Firebase Functions
- **Environment Variables:** Secure configuration through Firebase

## Troubleshooting

### Common Issues Fixed
1. **TypeScript Errors:** Resolved by proper tsconfig.json configuration
2. **Missing Dependencies:** Fixed by running `npm install` in functions folder
3. **Build Failures:** Resolved by adding esModuleInterop for Next.js compatibility

### Monitoring
- **Firebase Console:** Function logs and performance metrics
- **Error Tracking:** Automatic error reporting in Firebase Console
- **Usage Monitoring:** Request count and execution time tracking