# Security Notes

This document explains how billing data is protected in the Adapt Psychiatry Knowledge Base.

## Overview

The knowledge base implements defense-in-depth security for billing content, ensuring it is never accessible to unauthorized users through any vector.

## Authentication

### Google OAuth

- Only users with verified @adaptwny.com email addresses can authenticate
- `email_verified` claim must be true
- Hosted domain (`hd`) claim is verified when available
- Sessions expire after 24 hours of inactivity

### Session Security

- HttpOnly cookies prevent JavaScript access
- Secure flag enforced in production
- SameSite=Lax prevents CSRF
- Session tokens are cryptographically random

## Authorization

### Role-Based Access Control (RBAC)

Two roles are defined:

1. **Member**: All authenticated @adaptwny.com users
2. **Billing**: Only users in the explicit allowlist

### Billing Allowlist

The billing team is hardcoded in `src/lib/access.ts`:

```typescript
export const BILLING_ALLOWLIST = new Set([
  "nko@adaptwny.com",
  "iimperial@adaptwny.com",
  "fpedrosa@adaptwny.com",
  "shilario@adaptwny.com",
  "nferraren@adaptwny.com",
  "limperial@adaptwny.com",
]);
```

Comparison is case-insensitive.

## Route Protection

### Middleware (`src/middleware.ts`)

All requests pass through middleware that:

1. Verifies authentication
2. Checks domain restriction
3. Validates billing access for billing routes
4. Returns 403 for unauthorized access

### Route-Level Protection

Billing routes have additional server-side checks:

```typescript
// In billing page component
if (!canAccessBilling(session.user.email)) {
  redirect("/403");
}
```

This ensures content is never rendered without authorization.

## Content Protection

### File System Organization

```
content/
├── docs/           # General content (access: all)
│   ├── general-policies/
│   ├── clinical-policies/
│   └── benefits-policies/
└── billing/        # Billing content (access: billing)
    ├── claims-submission.md
    └── reimbursement-rates.md
```

### Frontmatter Access Control

Each document specifies its access level:

```yaml
---
title: "Claims Submission"
access: billing  # or "all"
---
```

### Server-Side Content Loading

The `getAllPages()` function filters content by role:

```typescript
// Billing pages only returned for billing users
if (page.access === 'billing' && role !== 'billing') {
  continue;
}
```

## Search Protection

### Server-Side Search

Search is performed server-side in `/api/search/route.ts`:

```typescript
// Filter results by user role
const filteredResults = userRole === "billing" 
  ? results 
  : results.filter(r => r.access !== "billing");
```

### No Client-Side Search Index

- No search index is sent to the client
- All search queries go through the API
- Results are filtered server-side before response

## Static Asset Protection

### No Public Billing Assets

- Billing content is never in `/public`
- All content is loaded through authorized API routes
- MDX is rendered server-side

## Security Headers

The following headers are set in `next.config.js`:

```javascript
{
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Robots-Tag': 'noindex, nofollow',
}
```

### robots.txt

```
User-agent: *
Disallow: /
```

Prevents search engine indexing.

## Audit Logging

The database schema includes an `AuditLog` table for tracking:

- Authentication events
- Authorization failures
- Content access (metadata only, not content)

Example log entry:

```typescript
{
  userId: "user_id",
  action: "billing_access_denied",
  resource: "/billing/claims",
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  createdAt: "2024-01-01T00:00:00Z"
}
```

## Common Attack Vectors and Mitigations

### Direct URL Access

**Attack**: User guesses billing URL and tries to access directly.

**Mitigation**: 
- Middleware checks authentication and authorization
- Server-side role verification before content rendering
- Returns 403 if unauthorized

### Search Result Leakage

**Attack**: User searches for billing terms and sees results.

**Mitigation**:
- Server-side search with role filtering
- Billing content excluded from search index for non-billing users
- No client-side search index

### Static Asset Access

**Attack**: User tries to access billing files directly in `/public`.

**Mitigation**:
- Billing content never in `/public`
- All content loaded through authorized routes
- MDX rendered server-side

### Session Hijacking

**Attack**: Attacker steals session cookie.

**Mitigation**:
- HttpOnly cookies
- Secure flag in production
- Short session lifetime (24 hours)
- Database-backed sessions (can be revoked)

### CSRF Attacks

**Attack**: Attacker tricks user into performing actions.

**Mitigation**:
- SameSite=Lax cookies
- NextAuth.js CSRF protection
- State parameter in OAuth flow

## Security Checklist

### Deployment

- [ ] `NEXTAUTH_SECRET` is strong (32+ random bytes)
- [ ] `GOOGLE_CLIENT_SECRET` is production-only
- [ ] `NODE_ENV=production` in production
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] robots.txt blocks indexing

### Access Control

- [ ] Billing allowlist is current
- [ ] Domain restriction works
- [ ] Test user cannot access billing
- [ ] Billing user can access billing
- [ ] Non-domain user cannot sign in

### Monitoring

- [ ] Failed auth attempts logged
- [ ] Billing access attempts logged
- [ ] Error rates monitored
- [ ] Alerts configured

## Incident Response

### Suspected Data Breach

1. Immediately revoke all sessions (restart app)
2. Rotate OAuth credentials
3. Review access logs
4. Notify affected users
5. Document incident

### Unauthorized Access Discovered

1. Remove user from allowlist
2. Revoke their sessions
3. Review their access history
4. Assess data exposure
5. Take corrective action

## Contact

For security concerns, contact:
- **Security Officer**: security@adaptwny.com
- **Technical Lead**: [email]

---

*Last updated: 2024-01-01*
