# Operations Runbook

This document provides operational procedures for the Adapt Psychiatry Knowledge Base.

## Table of Contents

1. [Adding a New Billing Team Member](#adding-a-new-billing-team-member)
2. [Removing a Billing Team Member](#removing-a-billing-team-member)
3. [Resyncing Content from Notion](#resyncing-content-from-notion)
4. [Rotating OAuth Secrets](#rotating-oauth-secrets)
5. [Adding New Content](#adding-new-content)
6. [Backup and Recovery](#backup-and-recovery)
7. [Monitoring and Alerts](#monitoring-and-alerts)

---

## Adding a New Billing Team Member

To grant billing access to a new team member:

1. **Update the allowlist** in `src/lib/access.ts`:

```typescript
export const BILLING_ALLOWLIST = new Set([
  // ... existing emails
  "newuser@adaptwny.com",  // Add new email
].map(e => e.toLowerCase()));
```

2. **Commit and deploy**:

```bash
git add src/lib/access.ts
git commit -m "Add [Name] to billing allowlist"
git push
```

3. **Verify access**:
   - Ask the user to sign out and sign back in
   - Confirm they can access billing content
   - Check that billing navigation appears

4. **Document the change** in your internal access log

---

## Removing a Billing Team Member

To revoke billing access:

1. **Update the allowlist** in `src/lib/access.ts`:

```typescript
export const BILLING_ALLOWLIST = new Set([
  // ... other emails
  // Remove: "formeruser@adaptwny.com",
].map(e => e.toLowerCase()));
```

2. **Commit and deploy**:

```bash
git add src/lib/access.ts
git commit -m "Remove [Name] from billing allowlist"
git push
```

3. **Verify revocation**:
   - The user's session will expire within 24 hours
   - They will lose billing access on next sign-in
   - To force immediate logout, restart the application

---

## Resyncing Content from Notion

### Prerequisites

- Notion integration token
- Root page ID of the knowledge base

### Sync Process

1. **Set environment variables**:

```bash
export NOTION_TOKEN=secret_xxx
export NOTION_ROOT_PAGE_ID=xxx
```

2. **Run the sync script**:

```bash
npm run content:sync
```

3. **Review changes**:

```bash
git diff content/
```

4. **Commit and deploy**:

```bash
git add content/
git commit -m "Sync content from Notion - $(date +%Y-%m-%d)"
git push
```

### Manual Content Import

If automatic sync is not available:

1. Export content from Notion as Markdown
2. Place files in appropriate `content/` subdirectories
3. Add frontmatter to each file
4. Commit and deploy

---

## Rotating OAuth Secrets

### When to Rotate

- Every 90 days (recommended)
- After suspected compromise
- When team members with access leave

### Rotation Process

1. **Generate new Google OAuth credentials**:
   - Go to Google Cloud Console
   - Create new OAuth client ID
   - Save new Client ID and Secret

2. **Update environment variables**:
   - In Vercel dashboard: Settings > Environment Variables
   - Update `GOOGLE_CLIENT_ID`
   - Update `GOOGLE_CLIENT_SECRET`

3. **Redeploy**:
   - Trigger a new deployment in Vercel
   - Or push an empty commit: `git commit --allow-empty -m "Rotate secrets" && git push`

4. **Verify**:
   - Test sign-in with new credentials
   - Confirm existing sessions still work

5. **Delete old credentials** from Google Cloud Console after 24 hours

---

## Adding New Content

### Creating a New Document

1. **Create the markdown file**:

```bash
# For general content
touch content/docs/section-name/document-name.md

# For billing content
touch content/billing/document-name.md
```

2. **Add frontmatter**:

```markdown
---
title: "Document Title"
lastUpdated: "2024-01-01"
access: all  # or "billing"
order: 1     # for sorting within section
---

# Document Title

Content here...
```

3. **Commit and deploy**:

```bash
git add content/
git commit -m "Add [document title]"
git push
```

### Creating a New Section

1. **Create directory and index**:

```bash
mkdir content/docs/new-section
touch content/docs/new-section/_index.md
```

2. **Add section metadata**:

```markdown
---
title: "New Section Name"
description: "Description of this section"
order: 4
access: all
---
```

3. **Add documents to the section**

---

## Backup and Recovery

### Database Backup

The SQLite database is stored in `prisma/dev.db` (development) or your configured `DATABASE_URL`.

**Automated backups (Vercel)**:
- Database is backed up with deployments
- Use Vercel's backup features for production data

**Manual backup**:

```bash
# Backup SQLite database
cp prisma/dev.db backups/dev-$(date +%Y%m%d).db
```

### Content Backup

Content is stored in Git, so it's automatically versioned.

**To create a content snapshot**:

```bash
git tag content-snapshot-$(date +%Y%m%d)
git push --tags
```

### Recovery

**Restore database**:

```bash
# Stop the application
cp backups/dev-20240101.db prisma/dev.db
# Restart the application
```

**Restore content**:

```bash
git checkout <commit-hash> -- content/
```

---

## Monitoring and Alerts

### Health Checks

The application exposes these health endpoints:

- `/api/health` - Application health
- `/api/health/db` - Database connectivity

### Log Monitoring

Watch for these events:

- **Unauthorized billing access attempts**
  - Log level: WARN
  - Pattern: `Unauthorized billing API access attempt`

- **Failed sign-in attempts**
  - Log level: INFO
  - Pattern: `SignIn error`

- **Domain violations**
  - Log level: WARN
  - Pattern: `Domain check failed`

### Performance Monitoring

Key metrics to track:

- Page load times
- API response times
- Search query performance
- Authentication latency

### Alerting Thresholds

Set up alerts for:

- Error rate > 5%
- Response time > 2 seconds
- Failed authentication rate > 10%
- Database connection failures

---

## Emergency Contacts

- **Technical Lead:** [email]
- **Billing Manager:** [email]
- **IT Support:** [email]

## Incident Response

### Security Incident

1. Immediately rotate all secrets
2. Review access logs
3. Notify affected users
4. Document incident

### Outage

1. Check Vercel status page
2. Verify database connectivity
3. Check Google OAuth status
4. Consider rollback if needed

---

*Last updated: 2024-01-01*
