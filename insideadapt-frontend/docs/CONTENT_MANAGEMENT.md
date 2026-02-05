# Content Management Guide

This document outlines the recommended approach for managing content in the Inside Adapt Knowledge Base.

## Recommended Approach: Option B — Notion Sync Workflow

After evaluating the three options, **Option B (Notion Sync Workflow)** is recommended for Adapt Psychiatry because:

1. **Team Familiarity:** Staff already use Notion for documentation
2. **Low Technical Barrier:** No coding required to update content
3. **Version Control:** Notion provides built-in page history
4. **Collaboration:** Multiple team members can edit simultaneously
5. **Cost:** No additional software costs

---

## Notion Sync Workflow

### Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│   Notion    │────▶│ Export/Sync  │────▶│   MDX Files │────▶│   Deploy    │
│  (Source)   │     │   Script     │     │  (Content)  │     │  (Vercel)   │
└─────────────┘     └──────────────┘     └─────────────┘     └─────────────┘
```

### Folder Structure

```
content/
├── clinical/              # Clinical protocols and procedures
│   ├── _meta.mdx         # Section metadata
│   ├── medication-management.mdx
│   ├── assessment-guidelines.mdx
│   └── ...
├── policies/              # Company policies
│   ├── general/          # General company policies
│   │   ├── _meta.mdx
│   │   ├── hipaa-privacy.mdx
│   │   └── ...
│   ├── hr-benefits/      # HR and benefits policies
│   │   ├── _meta.mdx
│   │   ├── pto-policy.mdx
│   │   └── ...
│   └── compliance/       # Compliance policies
│       ├── _meta.mdx
│       └── ...
├── operations/            # Operations and IT
│   ├── _meta.mdx
│   └── ...
├── billing/               # Billing content (RESTRICTED)
│   ├── _meta.mdx
│   ├── claims-submission.mdx
│   └── ...
└── team/                  # Team resources
    ├── _meta.mdx
    └── ...
```

### Frontmatter Template

Every MDX file must include frontmatter at the top:

```yaml
---
title: "Page Title"
description: "Brief description for search and previews"
lastUpdated: "YYYY-MM-DD"
author: "Team or Person Name"
section: "section-name"
access: "all" | "billing"
readingTime: "X min"
---
```

**Field Descriptions:**

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Page title displayed in browser and navigation |
| `description` | Yes | Brief summary for search results and SEO |
| `lastUpdated` | Yes | Date of last significant update (YYYY-MM-DD) |
| `author` | No | Content owner or team responsible |
| `section` | Yes | Top-level section (clinical, policies, etc.) |
| `access` | Yes | `"all"` for everyone, `"billing"` for billing team only |
| `readingTime` | No | Estimated reading time (auto-calculated if omitted) |

### Content Formatting Guide

#### Headers

```markdown
# Page Title (H1 - Only one per page)

## Section Header (H2)

### Subsection (H3)

#### Sub-subsection (H4 - Use sparingly)
```

#### Lists

```markdown
- Bullet point
- Another point
  - Nested point
  - Another nested point

1. Numbered item
2. Second item
3. Third item
```

#### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

#### Callouts

```markdown
> **Note:** Important information goes here.

> **Warning:** Be careful about this.

> **Tip:** Helpful suggestion.
```

#### Checkboxes

```markdown
- [ ] Unchecked item
- [x] Checked item
```

---

## Content Update Process

### For Non-Technical Users

1. **Edit in Notion**
   - Make changes to the relevant Notion page
   - Use Notion's formatting tools
   - Add comments for significant changes

2. **Notify Content Manager**
   - Tag @Tanvir or designated content manager
   - Briefly describe changes made

3. **Content Manager Syncs**
   - Exports updated content from Notion
   - Runs sync script
   - Reviews changes
   - Deploys to production

### For Technical Users

1. **Edit MDX directly**
   - Update the relevant `.mdx` file
   - Follow frontmatter template
   - Use proper Markdown formatting

2. **Test locally**
   ```bash
   npm run dev
   ```

3. **Commit and push**
   ```bash
   git add content/
   git commit -m "Update [page name]: [brief description]"
   git push
   ```

4. **Deploy**
   - Vercel auto-deploys on push
   - Or manually trigger deployment

---

## Billing Content Security

### Critical Rules

1. **Always mark billing content:**
   ```yaml
   access: "billing"
   ```

2. **Never include in non-billing pages:**
   - Contract rates
   - Payer-specific information
   - Financial projections

3. **Use billing warning banner:**
   ```markdown
   ## ⚠️ BILLING TEAM ONLY
   
   This document contains sensitive billing information.
   ```

### Billing Team Members

The following users have billing access:
- Tanvir Shagar
- Samantha Churley
- Nancy (nko@adaptwny.com)
- Shaira (shilario@adaptwny.com)
- Frankie (fpedrosa@adaptwny.com)
- Ivy (iimperial@adaptwny.com)
- Nick (nferraren@adaptwny.com)

---

## Sync Script (For Developers)

### Installation

```bash
npm install @notionhq/client gray-matter
```

### Environment Variables

```bash
NOTION_TOKEN=secret_xxx
NOTION_ROOT_PAGE_ID=xxx
```

### Running the Sync

```bash
# Full sync
npm run content:sync

# Sync specific section
npm run content:sync -- --section=clinical
```

### Sync Script Location

The sync script is at:
```
scripts/sync-content.ts
```

---

## Content Checklist

Before publishing new content:

- [ ] Frontmatter is complete and accurate
- [ ] `access` field is set correctly
- [ ] Content is well-structured with headers
- [ ] Links are working
- [ ] Images are optimized and accessible
- [ ] No sensitive information exposed
- [ ] Spell check completed
- [ ] Reviewed by subject matter expert

---

## Questions?

Contact Tanvir or the IT team for content management questions.
