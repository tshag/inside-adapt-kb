# Inside Adapt Frontend - Delivery Summary

## Project Overview

This package contains all frontend components and content for the Inside Adapt Knowledge Base (insideadapt.com).

**Created for:** Tanvir Shagar, Adapt Psychiatry  
**Date:** January 2024  
**Version:** 1.0.0

---

## What's Included

### 1. Landing Page (`app/page.tsx`)
A professional, healthcare-appropriate landing page featuring:
- Clean, modern design matching Adapt Psychiatry branding
- Clear value proposition
- Prominent Google Sign-In button
- Feature grid showcasing content categories
- Staff access requirements explanation
- Responsive design for all devices

### 2. Login Page (`app/auth/signin/page.tsx`)
A branded sign-in experience with:
- Google OAuth integration point
- Clear access restriction messaging
- Error state handling (AccessDenied, Configuration, etc.)
- Requirements info section
- Helpful links for support

### 3. Dashboard (`app/dashboard/page.tsx`)
The authenticated home experience featuring:
- Welcome message with user name
- Quick search bar
- Quick links to major sections
- Recent updates feed
- Popular articles
- Announcements sidebar
- Knowledge base stats

### 4. Layout Components (`components/layout/`)

**AppShell.tsx**
- Main application wrapper
- Handles sidebar and top bar positioning
- Responsive mobile layout

**Sidebar.tsx**
- Navigation sidebar with sections
- Collapsible subsections
- Role-based access (billing content hidden for non-billing users)
- User role indicator

**TopBar.tsx**
- Header with breadcrumbs
- Search button
- Notifications
- User menu with profile/settings/sign out

**ArticleLayout.tsx**
- Article page layout with TOC
- Billing warning banner for restricted content
- Meta information display
- Action buttons (copy link, share, print)
- Breadcrumb navigation

### 5. Search Component (`components/navigation/SearchModal.tsx`)
- Global search modal
- Keyboard navigation (arrow keys, enter, escape)
- Results filtered by user role
- Popular searches suggestions
- Keyboard shortcut hints

### 6. Content Files (`content/`)

**Clinical:**
- `medication-management.mdx` - Medication protocols

**Policies:**
- `general/hipaa-privacy.mdx` - HIPAA compliance
- `hr-benefits/pto-policy.mdx` - PTO policy

**Operations:**
- `it-support.mdx` - IT support guide

**Billing (RESTRICTED):**
- `claims-submission.mdx` - Claims submission protocol

**Team:**
- `welcome.mdx` - New hire welcome guide

### 7. Styles (`styles/globals.css`)
- Adapt brand color variables
- Custom utility classes
- Prose styling for articles
- Component-specific styles

### 8. Utilities (`lib/utils.ts`)
- `cn()` - Class name merging
- `formatDate()` - Date formatting
- `slugify()` - String slugification
- `extractHeadings()` - TOC extraction

---

## Billing Team Members

The following users should have `role: "billing"`:

1. Tanvir Shagar
2. Samantha Churley
3. Nancy (nko@adaptwny.com)
4. Shaira (shilario@adaptwny.com)
5. Frankie (fpedrosa@adaptwny.com)
6. Ivy (iimperial@adaptwny.com)
7. Nick (nferraren@adaptwny.com)

All other @adaptwny.com users should have `role: "member"`.

---

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#1a5f7a` | Buttons, links, accents |
| Primary Light | `#2a8faf` | Gradients, hover states |
| Secondary | `#57c5b6` | Highlights, badges |
| Accent | `#159895` | Teal accents |
| Dark | `#002b5b` | Headings, text |
| Light | `#e8f6f3` | Backgrounds, subtle accents |

---

## Content Management Recommendation

**Recommended Approach: Notion Sync Workflow (Option B)**

Rationale:
- Team already uses Notion
- Low technical barrier
- No additional costs
- Built-in version control
- Easy collaboration

See `docs/CONTENT_MANAGEMENT.md` for detailed workflow.

---

## Integration Checklist

### Files to Copy

```
app/
  ├── page.tsx                    → your-repo/app/page.tsx
  ├── auth/signin/page.tsx        → your-repo/app/auth/signin/page.tsx
  └── dashboard/page.tsx          → your-repo/app/dashboard/page.tsx

components/
  ├── layout/AppShell.tsx         → your-repo/components/layout/AppShell.tsx
  ├── layout/Sidebar.tsx          → your-repo/components/layout/Sidebar.tsx
  ├── layout/TopBar.tsx           → your-repo/components/layout/TopBar.tsx
  ├── layout/ArticleLayout.tsx    → your-repo/components/layout/ArticleLayout.tsx
  └── navigation/SearchModal.tsx  → your-repo/components/navigation/SearchModal.tsx

content/                          → your-repo/content/

styles/
  └── globals.css                 → Merge with your-repo/styles/globals.css

lib/
  └── utils.ts                    → your-repo/lib/utils.ts (or merge)
```

### Dependencies to Install

```bash
npm install lucide-react clsx tailwind-merge
```

### Tailwind Config Updates

Add to your `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      adapt: {
        primary: '#1a5f7a',
        'primary-light': '#2a8faf',
        secondary: '#57c5b6',
        accent: '#159895',
        dark: '#002b5b',
        light: '#e8f6f3',
      }
    }
  }
}
```

### Props to Wire Up

**Landing Page:**
```tsx
<LandingPage signIn={() => signIn('google')} />
```

**Login Page:**
```tsx
<SignInPage 
  signIn={signIn} 
  error={searchParams?.error}
  callbackUrl={searchParams?.callbackUrl}
/>
```

**App Shell:**
```tsx
<AppShell 
  user={{
    name: session.user.name,
    email: session.user.email,
    role: session.user.role // "member" or "billing"
  }}
  signOut={signOut}
>
  {children}
</AppShell>
```

**Search Modal:**
```tsx
<SearchModal 
  isOpen={searchOpen}
  onClose={() => setSearchOpen(false)}
  userRole={session.user.role}
/>
```

---

## Security Notes

1. **Backend must enforce role-based access** - UI hiding is for UX only
2. **Billing content has `access: "billing"` in frontmatter**
3. **Search results are filtered client-side** - API should also filter
4. **All MDX content should be rendered server-side** when possible

---

## Testing Checklist

- [ ] Landing page displays correctly
- [ ] Sign-in button calls NextAuth signIn
- [ ] Login page shows error states
- [ ] Dashboard loads with user info
- [ ] Sidebar navigation works
- [ ] Billing section hidden for non-billing users
- [ ] Billing section visible for billing users
- [ ] Search modal opens with ⌘K
- [ ] Search results filter by role
- [ ] Article pages render MDX correctly
- [ ] TOC navigation works
- [ ] Mobile responsive design

---

## Questions or Issues?

Contact the development team for support with integration.

---

## License

Internal use only - Adapt Psychiatry
