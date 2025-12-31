# 🔒 Security Setup Instructions

## ⚠️ IMPORTANT: Sensitive Data Configuration

This repository contains placeholder values for sensitive data. Before deploying, you must configure the following:

## 🔧 Environment Variables to Configure

### 1. Firebase Configuration
Replace placeholders in Vercel environment variables:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=[YOUR_FIREBASE_API_KEY]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=[YOUR_PROJECT].firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=[YOUR_PROJECT_ID]
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=[YOUR_PROJECT].firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=[YOUR_SENDER_ID]
NEXT_PUBLIC_FIREBASE_APP_ID=[YOUR_APP_ID]
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=[YOUR_MEASUREMENT_ID]
```

### 2. Firebase Admin SDK (Server-side)
```bash
FIREBASE_PROJECT_ID=[YOUR_PROJECT_ID]
FIREBASE_CLIENT_EMAIL=[YOUR_SERVICE_ACCOUNT_EMAIL]
FIREBASE_PRIVATE_KEY="[YOUR_PRIVATE_KEY]"
```

### 3. SMTP Configuration (GoDaddy)
```bash
SMTP_USER=[YOUR_EMAIL]
SMTP_PASS=[YOUR_PASSWORD]
SMTP_TO=[DESTINATION_EMAIL]
```

### 4. Stripe Integration
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[YOUR_PUBLISHABLE_KEY]
STRIPE_SECRET_KEY=[YOUR_SECRET_KEY]
STRIPE_WEBHOOK_SECRET=[YOUR_WEBHOOK_SECRET]
```

## 📝 Files to Update

### 1. Contact Form Email
Update the email address in:
- `components/sections/Contact.tsx` - Replace `[YOUR_EMAIL]` with your actual email
- `lib/contact.ts` - Replace email placeholders

### 2. Documentation References
Update project references in:
- All `.kiro/*.md` files
- All `technical/*.md` files
- `README.md`

## 🛡️ Security Best Practices

1. **Never commit sensitive data** to the repository
2. **Use environment variables** for all secrets
3. **Rotate credentials regularly**
4. **Use different credentials** for development and production
5. **Monitor access logs** for suspicious activity

## 🚀 Deployment Checklist

- [ ] Configure all environment variables in Vercel
- [ ] Update email addresses in contact form
- [ ] Test SMTP configuration
- [ ] Verify Firebase Admin SDK setup
- [ ] Test Stripe integration
- [ ] Update documentation with your project details

## 📞 Support

If you need help with configuration, refer to:
- Vercel documentation for environment variables
- Firebase documentation for Admin SDK setup
- GoDaddy documentation for SMTP configuration
- Stripe documentation for webhook setup