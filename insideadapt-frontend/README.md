# Inside Adapt - Frontend Components & Content

This package contains frontend components and MDX content for the Inside Adapt Knowledge Base at insideadapt.com.

## What's Included

```
insideadapt-frontend/
├── app/                          # Page components
│   ├── page.tsx                  # Landing page (public)
│   └── auth/signin/page.tsx      # Login page design
├── components/                   # Reusable UI components
│   ├── layout/
│   │   ├── AppShell.tsx          # Main app layout wrapper
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── TopBar.tsx            # Header with user menu
│   │   └── ArticleLayout.tsx     # Article page layout
│   └── navigation/
│       └── SearchModal.tsx       # Global search UI
├── content/                      # MDX content files
│   ├── clinical/                 # Clinical protocols
│   ├── policies/                 # Company policies
│   ├── billing/                  # Billing content (restricted)
│   ├── operations/               # Operations docs
│   └── team/                     # Team resources
├── styles/
│   └── globals.css               # Global styles & CSS variables
├── lib/
│   └── utils.ts                  # Utility functions
└── docs/
    └── CONTENT_MANAGEMENT.md     # Content management guide
```

## Integration Instructions

### 1. Copy Files to Existing Repo

Copy these files into your existing Next.js project:

```bash
# Copy page components
cp -r app/* your-repo/app/

# Copy components
cp -r components/* your-repo/components/

# Copy content
cp -r content/* your-repo/content/

# Copy styles (merge with existing)
cp styles/globals.css your-repo/styles/

# Copy utilities
cp lib/utils.ts your-repo/lib/
```

### 2. Install Dependencies

Ensure these dependencies are installed:

```bash
npm install lucide-react clsx tailwind-merge
```

### 3. Update Tailwind Config

Add these color variables to your `tailwind.config.js`:

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

### 4. Update Global Styles

Import or merge `styles/globals.css` with your existing global styles.

### 5. Wire Up Authentication

The components assume these props/functions are available:

**Landing Page (`app/page.tsx`):**
```tsx
interface LandingPageProps {
  signIn?: () => void;  // Call your existing signIn function
}
```

**Login Page (`app/auth/signin/page.tsx`):**
```tsx
interface SignInPageProps {
  signIn?: (provider: string) => void;  // NextAuth signIn
  error?: string | null;                 // Auth error message
  callbackUrl?: string;                  // Redirect after login
}
```

**App Shell (`components/layout/AppShell.tsx`):**
```tsx
interface AppShellProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;  // "member" or "billing"
  };
  signOut?: () => void;  // NextAuth signOut
}
```

### 6. Wire Up Search

The SearchModal component assumes:

```tsx
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;  // "member" or "billing"
}
```

**Note:** Currently uses mock data. Replace with your actual search API:

```tsx
// In SearchModal.tsx, replace mockResults with:
const [results, setResults] = useState<SearchResult[]>([]);

useEffect(() => {
  if (query) {
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setResults(data.results));
  }
}, [query]);
```

### 7. Role-Based Access

The sidebar automatically hides billing content for non-billing users:

```tsx
// In your authenticated layout:
<AppShell 
  user={{
    name: session.user.name,
    email: session.user.email,
    role: session.user.role  // "member" or "billing"
  }}
  signOut={signOut}
>
  {children}
</AppShell>
```

**Billing Team Members:**
- Tanvir Shagar
- Samantha Churley
- Nancy (nko@adaptwny.com)
- Shaira (shilario@adaptwny.com)
- Frankie (fpedrosa@adaptwny.com)
- Ivy (iimperial@adaptwny.com)
- Nick (nferraren@adaptwny.com)

### 8. Content Rendering

For MDX content pages, use the ArticleLayout component:

```tsx
// app/[...slug]/page.tsx
import { ArticleLayout } from '@/components/layout/ArticleLayout';

export default async function ArticlePage({ params }) {
  const content = await getContent(params.slug); // Your content fetch
  
  return (
    <ArticleLayout 
      meta={{
        title: content.title,
        description: content.description,
        lastUpdated: content.lastUpdated,
        author: content.author,
        section: content.section,
        sectionHref: `/${content.section}`,
        access: content.access,
        readingTime: content.readingTime
      }}
      toc={content.toc}  // Table of contents
    >
      {content.body}
    </ArticleLayout>
  );
}
```

### 9. Keyboard Shortcuts

Add global keyboard shortcut for search:

```tsx
// In your layout or _app.tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(true);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

## Brand Colors

The design uses Adapt Psychiatry's brand colors:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#1a5f7a` | Buttons, links, accents |
| Primary Light | `#2a8faf` | Gradients, hover states |
| Secondary | `#57c5b6` | Highlights, badges |
| Accent | `#159895` | Teal accents |
| Dark | `#002b5b` | Headings, text |
| Light | `#e8f6f3` | Backgrounds, subtle accents |

## Content Management

See `docs/CONTENT_MANAGEMENT.md` for:
- Notion sync workflow
- Frontmatter template
- Content formatting guide
- Billing content security

## Assumptions Made

1. **NextAuth is already configured** - Components assume `signIn`, `signOut`, and `session` are available
2. **Tailwind CSS is set up** - Components use Tailwind utility classes
3. **shadcn/ui components exist** - Some components reference shadcn/ui (Button, Input, Card, etc.)
4. **Role-based access is backend-enforced** - UI hides billing content but backend must also enforce it
5. **MDX rendering is configured** - Content files assume MDX support is set up

## Optional Improvements

These are suggestions for future enhancement:

1. **Dark Mode** - Add `dark:` variants to all components
2. **Page Analytics** - Track popular articles and searches
3. **Content Feedback** - "Was this helpful?" buttons on articles
4. **Recent Activity** - Show recently viewed pages
5. **Bookmarks** - Allow users to save favorite articles
6. **Comments** - Add commenting system for article discussions
7. **Version History** - Show content changes over time
8. **Print Styles** - Optimize articles for printing

## Questions?

Contact the development team for integration support.
