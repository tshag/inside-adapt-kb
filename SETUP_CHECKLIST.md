# Setup Checklist

Use this checklist to set up and deploy the Adapt Psychiatry Knowledge Base.

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] Git repository created
- [ ] Google Cloud account access
- [ ] Vercel account (recommended) or alternative hosting

## Google OAuth Setup

- [ ] Create project in Google Cloud Console
- [ ] Configure OAuth consent screen
  - [ ] Set as "Internal" app
  - [ ] Add app name: "Adapt Psychiatry KB"
  - [ ] Add user support email
  - [ ] Add authorized domain: `adaptwny.com`
- [ ] Create OAuth 2.0 credentials
  - [ ] Application type: Web application
  - [ ] Add authorized redirect URIs:
    - [ ] `http://localhost:3000/api/auth/callback/google` (dev)
    - [ ] `https://your-domain.com/api/auth/callback/google` (prod)
- [ ] Save Client ID and Client Secret securely

## Local Development

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in environment variables:
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
  - [ ] `NEXTAUTH_URL=http://localhost:3000`
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Run `npm run dev`
- [ ] Test sign-in with @adaptwny.com email
- [ ] Verify billing access for billing team members

## Content Migration

- [ ] Review current Notion structure
- [ ] Set `NOTION_TOKEN` environment variable
- [ ] Set `NOTION_ROOT_PAGE_ID` environment variable
- [ ] Run `npm run content:sync` (if using Notion API)
- [ ] Or manually copy content to `content/` directory
- [ ] Review and update frontmatter for all pages
- [ ] Identify and flag billing content
- [ ] Commit content changes

## Production Deployment

### Vercel (Recommended)

- [ ] Connect Git repository to Vercel
- [ ] Configure build settings
- [ ] Add production environment variables:
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `NEXTAUTH_SECRET` (different from dev!)
  - [ ] `NEXTAUTH_URL` (production URL)
  - [ ] `NODE_ENV=production`
- [ ] Deploy
- [ ] Add custom domain (optional)
- [ ] Update Google OAuth redirect URIs with production URL

### Alternative Hosting

- [ ] Build application: `npm run build`
- [ ] Set all environment variables
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Enable HTTPS
- [ ] Set up process manager (PM2/systemd)

## Security Verification

- [ ] Test domain restriction
  - [ ] @adaptwny.com user can sign in
  - [ ] Non-domain user cannot sign in
- [ ] Test billing access control
  - [ ] Billing team member can access billing content
  - [ ] Regular member cannot access billing content
  - [ ] Direct URL to billing returns 403
  - [ ] Search excludes billing content for members
- [ ] Verify security headers
- [ ] Confirm robots.txt blocks indexing
- [ ] Check CSP headers

## Post-Deployment

- [ ] Test all navigation links
- [ ] Verify search functionality
- [ ] Check mobile responsiveness
- [ ] Test 403 and 404 pages
- [ ] Verify recently updated section
- [ ] Test sign-out and sign-in flow
- [ ] Share access instructions with team

## Team Onboarding

- [ ] Send sign-in instructions to all staff
- [ ] Provide overview of knowledge base structure
- [ ] Explain billing access restrictions
- [ ] Share feedback channel for issues

## Documentation

- [ ] Update access logs
- [ ] Document any customizations
- [ ] Note any known issues
- [ ] Schedule regular content review

## Ongoing Maintenance

- [ ] Set calendar reminder for OAuth secret rotation (90 days)
- [ ] Schedule monthly content review
- [ ] Monitor error logs weekly
- [ ] Review access logs monthly
- [ ] Update billing allowlist as needed

---

## Quick Reference

### Environment Variables

```bash
# Required
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=https://your-domain.com

# Optional
DATABASE_URL="file:./dev.db"
NOTION_TOKEN=xxx
NOTION_ROOT_PAGE_ID=xxx
```

### Billing Team

```
nko@adaptwny.com
iimperial@adaptwny.com
fpedrosa@adaptwny.com
shilario@adaptwny.com
nferraren@adaptwny.com
limperial@adaptwny.com
```

### Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Database
npx prisma studio
npx prisma db push

# Content sync
npm run content:sync
```

---

*Complete this checklist before considering the knowledge base production-ready.*
