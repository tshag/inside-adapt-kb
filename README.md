# Adapt Psychiatry Knowledge Base

A production-ready internal knowledge base website with Google Workspace OAuth authentication and role-based access control.

## Features

- **Authentication**: Google OAuth restricted to @adaptwny.com domain
- **Authorization**: Role-based access control (Member / Billing)
- **Content**: Markdown-based documentation with MDX support
- **Search**: Server-side search with access control
- **Navigation**: Sidebar navigation with section organization
- **Security**: Protected billing content, secure cookies, CSP headers

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js with Google Provider
- **Database**: Prisma + SQLite (configurable)
- **Styling**: Tailwind CSS + shadcn/ui
- **Content**: MDX with gray-matter frontmatter

## Quick Start

### Prerequisites

- Node.js 18+
- Google OAuth credentials
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd adapt-kb
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to access the knowledge base.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | Yes |
| `NEXTAUTH_URL` | Base URL of the application | Yes |
| `DATABASE_URL` | Database connection string | No (defaults to SQLite) |

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   ├── middleware.ts    # Route protection
│   └── types/           # TypeScript types
├── content/             # Markdown content
│   ├── docs/           # General documentation
│   └── billing/        # Billing-only content
├── prisma/             # Database schema
└── docs/               # Project documentation
```

## Access Control

### Billing Team Allowlist

The following email addresses have billing access:
- nko@adaptwny.com
- iimperial@adaptwny.com
- fpedrosa@adaptwny.com
- shilario@adaptwny.com
- nferraren@adaptwny.com
- limperial@adaptwny.com

### Content Access Levels

- **Public (all)**: Accessible to all authenticated @adaptwny.com users
- **Billing**: Accessible only to billing team members

## Content Management

### Adding New Documents

1. Create a `.md` file in `content/docs/<section>/`
2. Add frontmatter:
```yaml
---
title: "Document Title"
lastUpdated: "2024-01-01"
access: all  # or "billing"
order: 1
---
```
3. Write content in Markdown

### Creating New Sections

1. Create a directory in `content/docs/<new-section>/`
2. Add `_index.md` with section metadata
3. Add documents to the section

## Security

See [SECURITY_NOTES.md](./docs/SECURITY_NOTES.md) for detailed security information.

## Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for deployment instructions.

## Operations

See [RUNBOOK.md](./docs/RUNBOOK.md) for operational procedures.

## License

Internal use only - Adapt Psychiatry
