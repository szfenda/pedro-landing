# Authentication & Business Flow System

## Overview
Complete authentication and business onboarding system built with Firebase Auth, Firestore, and Stripe integration. Supports user registration, business registration, and subscription billing.

## Authentication Flow

### 1. Landing Page (`/`)
- Public landing page with hero, features, testimonials
- "Log in" button in navigation
- Redirects to `/auth` when clicked

### 2. Auth Page (`/auth`)
- Tab-based interface: Login, Register, Reset Password
- Firebase Auth integration
- Form validation with React Hook Form + Zod
- Real-time error handling and loading states

### 3. Auth Resolver (`/resolver`)
- Automatic redirect after successful authentication
- Checks if user has registered business in Firestore
- Routes to `/no-business` or `/dashboard` based on business status

### 4. Business Registration Flow
- **No Business Page** (`/no-business`): Explains business registration requirement
- **Register Business Page** (`/register-business`): 4-section progressive form
- **Billing Page** (`/billing`): Stripe subscription setup
- **Dashboard Page** (`/dashboard`): Business management interface

## Route Protection

### Middleware (`middleware.ts`)
```typescript
// Protected routes require authentication
const protectedPaths = [
  '/resolver',
  '/no-business', 
  '/register-business',
  '/billing',
  '/dashboard'
]

// Redirects to /auth if not authenticated
```

### Auth Context (`lib/auth-context.tsx`)
```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
}

// Provides auth state throughout the application
// Listens to Firebase Auth state changes
```

## Business Registration System

### 4-Section Progressive Form
1. **Company Data**
   - Company name (required)
   - NIP (Polish tax number with validation)
   - Industry selection
   - Company type

2. **Address Information**
   - Street address
   - City, postal code
   - Country (default: Poland)

3. **Contact Details**
   - Phone number
   - Business email
   - Website URL (optional)

4. **Business Description**
   - Services offered
   - Target audience
   - Business description

### Form Features
- Section-by-section validation
- Progress indicator
- Save draft functionality (localStorage)
- Real-time validation feedback
- NIP format validation for Polish tax numbers

### Data Structure (Firestore)
```typescript
// PARTNER collection document
{
  userId: string,           // Firebase Auth UID
  companyName: string,
  nip: string,
  industry: string,
  address: {
    street: string,
    city: string,
    postalCode: string,
    country: string
  },
  contact: {
    phone: string,
    email: string,
    website?: string
  },
  description: {
    services: string,
    targetAudience: string,
    businessDescription: string
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  status: 'pending' | 'approved' | 'rejected'
}
```

## Stripe Billing Integration

### Pay-Per-Use (PPU) Model
- Monthly subscription with usage-based billing
- Base plan: €29/month
- Additional charges based on transaction volume
- Customer portal for billing management

### Stripe Endpoints
1. **Create Checkout Session** (`/api/stripe/create-checkout-session`)
   - Creates Stripe Checkout session
   - Handles subscription setup
   - Returns checkout URL

2. **Webhook Handler** (`/api/stripe/webhook`)
   - Processes Stripe events
   - Updates user subscription status
   - Handles payment success/failure

3. **Customer Portal** (`/api/stripe/create-portal-session`)
   - Creates Stripe Customer Portal session
   - Allows users to manage billing
   - Update payment methods, view invoices

### Billing Flow
1. User completes business registration
2. Redirected to `/billing` page
3. Stripe Checkout integration for subscription setup
4. Webhook updates user status in Firestore
5. Access to dashboard after successful payment

## Dashboard System

### Real-time Data Display
- Company information overview
- Verification status
- Current subscription plan
- Usage statistics (mock data)
- Billing management actions

### Firestore Integration
- Real-time listeners for live data updates
- Automatic UI updates when data changes
- Optimistic updates for better UX

### Features
- Edit company information
- View subscription details
- Access billing portal
- Monitor usage statistics
- Business verification status

## Security Implementation

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /USER/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Partners can only access their own business data
    match /PARTNER/{partnerId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Client-side Protection
- Route middleware for protected pages
- Auth context for component-level protection
- Loading states during auth checks
- Automatic redirects for unauthorized access

## Form Validation System

### Zod Schemas (`lib/validations.ts`)
```typescript
// Login validation
export const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(6, 'Hasło musi mieć minimum 6 znaków'),
})

// Business registration validation
export const businessSchema = z.object({
  companyName: z.string().min(2, 'Nazwa firmy jest wymagana'),
  nip: z.string().regex(/^\d{10}$/, 'NIP musi składać się z 10 cyfr'),
  // ... other fields
})
```

### React Hook Form Integration
- Real-time validation feedback
- Error message display
- Form state management
- Submission handling with loading states

## Error Handling

### Firebase Auth Errors
```typescript
// Translated error messages for Polish users
const getAuthErrorMessage = (error: FirebaseError) => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'Nie znaleziono użytkownika z tym adresem email'
    case 'auth/wrong-password':
      return 'Nieprawidłowe hasło'
    case 'auth/email-already-in-use':
      return 'Ten adres email jest już używany'
    // ... more cases
  }
}
```

### Global Error Boundaries
- Catch and display user-friendly error messages
- Fallback UI for component errors
- Error reporting for debugging

## Performance Optimizations

### Code Splitting
- Route-based code splitting with Next.js App Router
- Lazy loading of non-critical components
- Dynamic imports for heavy libraries

### Caching Strategy
- Firebase Auth state persistence
- Form data caching in localStorage
- Optimistic UI updates

### Bundle Optimization
- Tree shaking for unused code
- Minimal bundle size for auth components
- Efficient re-renders with React optimization

## Testing Strategy

### Unit Tests
- Form validation logic
- Utility functions
- Component rendering

### Integration Tests
- Auth flow end-to-end
- Business registration process
- Stripe integration

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Password reset functionality
- [ ] Business form validation
- [ ] Stripe checkout process
- [ ] Dashboard data display
- [ ] Route protection
- [ ] Error handling
- [ ] Mobile responsiveness

## Production Deployment

### Environment Setup
- Firebase project configuration
- Stripe account setup
- Environment variables configuration
- Security rules deployment

### Monitoring
- Firebase Auth usage monitoring
- Firestore read/write monitoring
- Stripe webhook monitoring
- Error tracking and logging

## Future Enhancements

### Planned Features
- Email verification requirement
- Two-factor authentication
- Business document upload
- Advanced billing analytics
- Multi-language support
- Admin panel for business approval

### Technical Improvements
- Server-side rendering for auth pages
- Advanced caching strategies
- Real-time notifications
- Offline support
- Progressive Web App features