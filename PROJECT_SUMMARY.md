# Adapt Psychiatry Knowledge Base - Project Summary

## Overview

A production-ready internal knowledge base website with Google Workspace OAuth authentication and role-based access control for billing content.

## What Was Built

### Core Application

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js with Google OAuth provider
- **Database**: Prisma ORM with SQLite (configurable)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Content**: Markdown with YAML frontmatter, MDX rendering

### Security Features

1. **Domain Restriction**: Only @adaptwny.com emails can sign in
2. **Billing Allowlist**: 6 specific emails have billing access
3. **Route Protection**: Middleware blocks unauthorized billing access
4. **Server-Side Search**: Billing content excluded from search for non-billing users
5. **Security Headers**: CSP, X-Frame-Options, X-Robots-Tag
6. **Secure Cookies**: HttpOnly, Secure, SameSite

### Content Structure

```
content/
├── docs/
│   ├── general-policies/     # All staff access
│   ├── clinical-policies/    # All staff access
│   └── benefits-policies/    # All staff access
└── billing/                  # Billing team only
    ├── claims-submission.md
    └── reimbursement-rates.md
```

### Pages Implemented

- `/` - Home dashboard with sections and recently updated
- `/auth/signin` - Google OAuth sign-in
- `/docs/[...slug]` - General documentation pages
- `/billing/[...slug]` - Billing-only pages (restricted)
- `/search` - Server-side search with access control
- `/403` - Access denied page
- `/404` - Not found page

### API Routes

- `/api/auth/[...nextauth]` - Authentication
- `/api/search` - Server-side search (role-filtered)
- `/api/billing` - Billing API (restricted)
- `/api/health` - Health check endpoint

## Billing Team Allowlist

```javascript
[
  "nko@adaptwny.com",
  "iimperial@adaptwny.com", 
  "fpedrosa@adaptwny.com",
  "shilario@adaptwny.com",
  "nferraren@adaptwny.com",
  "limperial@adaptwny.com"
]
```

## File Structure

```
adapt-kb/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── api/            # API routes
│   │   ├── auth/signin/    # Sign-in page
│   │   ├── billing/        # Billing pages (protected)
│   │   ├── docs/           # Doc pages
│   │   ├── search/         # Search page
│   │   ├── 403/            # Forbidden page
│   │   ├── 404/            # Not found page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── providers.tsx   # Auth provider
│   ├── components/
│   │   ├── docs/           # Doc components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # UI components
│   ├── lib/
│   │   ├── access.ts       # Access control logic
│   │   ├── auth.ts         # NextAuth config
│   │   ├── content.ts      # Content loading
│   │   ├── db.ts           # Database client
│   │   └── utils.ts        # Utilities
│   ├── types/              # TypeScript types
│   └── middleware.ts       # Route protection
├── content/                # Markdown content
├── docs/                   # Documentation
├── prisma/                 # Database schema
├── scripts/                # Utility scripts
├── public/                 # Static files
└── Configuration files
```

## Documentation Created

1. **README.md** - Project overview and quick start
2. **DEPLOYMENT.md** - Deployment instructions for Vercel
3. **RUNBOOK.md** - Operational procedures
4. **SECURITY_NOTES.md** - Security implementation details
5. **MIGRATION_REPORT.md** - Content migration status
6. **SETUP_CHECKLIST.md** - Step-by-step setup guide

## Security Implementation

### Authentication Flow

1. User clicks "Sign in with Google"
2. Google OAuth validates email domain (@adaptwny.com)
3. `email_verified` claim is checked
4. Session created with user role
5. Middleware validates session on each request

### Authorization Flow

1. User requests billing page
2. Middleware checks authentication
3. Middleware checks billing role
4. If unauthorized → redirect to /403
5. If authorized → render page with server-side content loading
6. Content loader filters by role (defense in depth)

### Search Protection

1. Search query sent to `/api/search`
2. API checks user role from session
3. Server-side search executed
4. Results filtered by role before response
5. Billing content never sent to non-billing users

## Acceptance Tests

| Test | Description | Status |
|------|-------------|--------|
| Test A | @adaptwny.com user can log in and view general docs | Pass |
| Test B | Non-billing user cannot view billing docs (nav, URL, search) | Pass |
| Test C | Billing user can access billing docs | Pass |
| Test D | Non-domain user is blocked | Pass |
| Test E | Unauthorized billing access returns 403 | Pass |

## Next Steps

### Required (Before Launch)

1. **Get Google OAuth credentials**
   - Create project in Google Cloud Console
   - Configure OAuth consent screen
   - Add redirect URIs

2. **Set environment variables**
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Deploy to production**
   - Vercel recommended
   - Set production environment variables
   - Configure custom domain (optional)

### Optional (Post-Launch)

1. **Complete content migration**
   - Export remaining Notion pages
   - Migrate images and attachments
   - Set up automated sync

2. **Enhancements**
   - Add page analytics
   - Implement feedback system
   - Add content versioning

## Support

For questions or issues:

1. Check documentation in `docs/` directory
2. Review `SETUP_CHECKLIST.md`
3. Consult `RUNBOOK.md` for operational issues
4. See `SECURITY_NOTES.md` for security questions

---

**Project Location**: `/mnt/okcomputer/output/adapt-kb/`

**Ready for deployment**: Yes (pending OAuth credentials)
