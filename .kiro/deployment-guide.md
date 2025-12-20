# Firebase Hosting Deployment Guide

## Current Deployment Status
**✅ LIVE:** https://pedro-bolt-app.web.app  
**Firebase Project:** pedro-bolt-app  
**GitHub Repo:** https://github.com/szfenda/pedro-landing

## Quick Deploy Commands
```bash
# Build and deploy
npm run build
firebase deploy --only hosting

# Local testing
firebase serve --only hosting
```

## Configuration Files

### firebase.json
```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{"source": "**", "destination": "/index.html"}],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]
      }
    ]
  }
}
```

### next.config.js (Firebase optimized)
```javascript
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    // ... rest of config
}
```

## Deployment Checklist
- [x] Firebase CLI installed and authenticated
- [x] Project initialized with pedro-bolt-app
- [x] Static export configured in Next.js
- [x] Build process generates /out folder
- [x] Firebase hosting points to /out directory
- [x] Cache headers configured for performance
- [x] SPA routing configured for all paths
- [x] GitHub repository updated with configs

## Performance Metrics
- **Bundle Size:** 112 kB First Load JS
- **Files Deployed:** 243 static files
- **Cache Strategy:** 1 year for static assets
- **CDN:** Global Firebase CDN enabled

## Troubleshooting
- **Build fails:** Check Next.js config for static export compatibility
- **Assets not loading:** Verify /public/assets/ structure
- **Routing issues:** Ensure SPA rewrites in firebase.json
- **Performance:** Check cache headers and bundle analysis