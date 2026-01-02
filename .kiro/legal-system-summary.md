# Legal Documents System - Quick Reference

## Status: ✅ FULLY IMPLEMENTED (Jan 2025)

### What Was Added
- **Web Pages:** `/legal/regulamin` and `/legal/polityka-prywatnosci`
- **API Endpoints:** `/api/legal/regulamin` and `/api/legal/polityka-prywatnosci`
- **PDF Downloads:** Direct access to PDF versions
- **Integration:** Links in footer and registration form

### File Structure
```
lib/legal/
├── types.ts                  # TypeScript interfaces
├── legal-utils.ts           # Utility functions
├── regulamin.ts             # Terms of Service content
└── politykaPrywatnosci.ts   # Privacy Policy content

components/legal/
├── LegalDocument.tsx        # Document viewer component
└── LegalNavigation.tsx      # Navigation component

app/(public)/legal/
├── layout.tsx               # Legal pages layout
├── regulamin/page.tsx       # Terms page
└── polityka-prywatnosci/page.tsx # Privacy page

app/api/legal/
├── regulamin/route.ts       # Terms API endpoint
└── polityka-prywatnosci/route.ts # Privacy API endpoint

public/legal/
├── regulamin-pedro-beta.pdf
└── polityka-prywatnosci-pedro.pdf
```

### Key Features
- **Type Safety:** Full TypeScript support
- **Version Management:** Git-based versioning
- **Mobile Ready:** JSON API for React Native
- **SEO Optimized:** Static generation
- **Easy Updates:** Simple file editing process

### URLs
- **Web:** `/legal/regulamin`, `/legal/polityka-prywatnosci`
- **API:** `/api/legal/regulamin`, `/api/legal/polityka-prywatnosci`
- **PDF:** `/legal/regulamin-pedro-beta.pdf`, `/legal/polityka-prywatnosci-pedro.pdf`

### Update Process
1. Edit files in `lib/legal/`
2. Update version and date
3. Optionally update PDFs
4. Commit and deploy

### Documentation
- **Mobile Integration:** `technical/legal/MOBILE_INTEGRATION_GUIDE.md`
- **Update Instructions:** `technical/legal/UPDATE_GUIDE.md`
- **Implementation Plan:** `technical/legal/IMPLEMENTATION_PLAN.md`

### Current Version
- **Regulamin:** v1.0.0-beta (2025-01-02)
- **Polityka Prywatności:** v1.0.0-beta (2025-01-02)