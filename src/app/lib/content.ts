import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { DocPage, DocSection, SearchResult, UserRole } from '@/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Get all document sections
 */
export function getSections(): DocSection[] {
  const sections: DocSection[] = [];
  const docsPath = path.join(CONTENT_DIR, 'docs');
  
  if (!fs.existsSync(docsPath)) {
    return sections;
  }
  
  const entries = fs.readdirSync(docsPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const sectionPath = path.join(docsPath, entry.name, '_index.md');
      if (fs.existsSync(sectionPath)) {
        const fileContent = fs.readFileSync(sectionPath, 'utf-8');
        const { data } = matter(fileContent);
        
        sections.push({
          id: entry.name,
          title: data.title || entry.name,
          slug: entry.name,
          order: data.order || 999,
          description: data.description,
          access: data.access || 'all',
        });
      }
    }
  }
  
  return sections.sort((a, b) => a.order - b.order);
}

/**
 * Get all pages in a section
 */
export function getPagesBySection(sectionSlug: string): DocPage[] {
  const pages: DocPage[] = [];
  const sectionPath = path.join(CONTENT_DIR, 'docs', sectionSlug);
  
  if (!fs.existsSync(sectionPath)) {
    return pages;
  }
  
  const files = fs.readdirSync(sectionPath);
  
  for (const file of files) {
    if (file.endsWith('.md') && file !== '_index.md') {
      const filePath = path.join(sectionPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      pages.push({
        id: data.id || file.replace('.md', ''),
        title: data.title || file.replace('.md', ''),
        slug: `${sectionSlug}/${file.replace('.md', '')}`,
        section: sectionSlug,
        access: data.access || 'all',
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        content,
        excerpt: data.excerpt || content.slice(0, 200).replace(/#.*\n/g, ''),
        order: data.order || 999,
      });
    }
  }
  
  return pages.sort((a, b) => (a.order || 999) - (b.order || 999));
}

/**
 * Get a specific page by slug
 */
export function getPageBySlug(slug: string): DocPage | null {
  const parts = slug.split('/');
  if (parts.length < 2) {
    return null;
  }
  
  const [section, ...pageParts] = parts;
  const pageSlug = pageParts.join('/');
  const filePath = path.join(CONTENT_DIR, 'docs', section, `${pageSlug}.md`);
  
  if (!fs.existsSync(filePath)) {
    // Try billing directory
    const billingPath = path.join(CONTENT_DIR, 'billing', `${pageSlug}.md`);
    if (fs.existsSync(billingPath)) {
      const fileContent = fs.readFileSync(billingPath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      return {
        id: data.id || pageSlug,
        title: data.title || pageSlug,
        slug: `billing/${pageSlug}`,
        section: 'billing',
        access: 'billing',
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        content,
        excerpt: data.excerpt || content.slice(0, 200).replace(/#.*\n/g, ''),
      };
    }
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  return {
    id: data.id || pageSlug,
    title: data.title || pageSlug,
    slug: slug,
    section,
    access: data.access || 'all',
    lastUpdated: data.lastUpdated || new Date().toISOString(),
    content,
    excerpt: data.excerpt || content.slice(0, 200).replace(/#.*\n/g, ''),
  };
}

/**
 * Get all pages (filtered by access if role provided)
 */
export function getAllPages(role?: UserRole): DocPage[] {
  const pages: DocPage[] = [];
  const sections = getSections();
  
  for (const section of sections) {
    // Skip billing sections for non-billing users
    if (section.access === 'billing' && role !== 'billing') {
      continue;
    }
    
    const sectionPages = getPagesBySection(section.slug);
    
    for (const page of sectionPages) {
      // Skip billing pages for non-billing users
      if (page.access === 'billing' && role !== 'billing') {
        continue;
      }
      pages.push(page);
    }
  }
  
  // Also check billing directory for billing users
  if (role === 'billing') {
    const billingPath = path.join(CONTENT_DIR, 'billing');
    if (fs.existsSync(billingPath)) {
      const files = fs.readdirSync(billingPath);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(billingPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const { data, content } = matter(fileContent);
          
          pages.push({
            id: data.id || file.replace('.md', ''),
            title: data.title || file.replace('.md', ''),
            slug: `billing/${file.replace('.md', '')}`,
            section: 'billing',
            access: 'billing',
            lastUpdated: data.lastUpdated || new Date().toISOString(),
            content,
            excerpt: data.excerpt || content.slice(0, 200).replace(/#.*\n/g, ''),
          });
        }
      }
    }
  }
  
  return pages;
}

/**
 * Search pages (server-side, respects access control)
 */
export function searchPages(query: string, role?: UserRole): SearchResult[] {
  const pages = getAllPages(role);
  const results: SearchResult[] = [];
  
  const lowerQuery = query.toLowerCase();
  
  for (const page of pages) {
    const titleMatch = page.title.toLowerCase().includes(lowerQuery);
    const contentMatch = page.content.toLowerCase().includes(lowerQuery);
    
    if (titleMatch || contentMatch) {
      // Generate excerpt around match
      let excerpt = page.excerpt || '';
      if (contentMatch) {
        const contentLower = page.content.toLowerCase();
        const matchIndex = contentLower.indexOf(lowerQuery);
        if (matchIndex !== -1) {
          const start = Math.max(0, matchIndex - 100);
          const end = Math.min(page.content.length, matchIndex + 200);
          excerpt = page.content.slice(start, end).replace(/#.*\n/g, '');
        }
      }
      
      results.push({
        id: page.id,
        title: page.title,
        slug: page.slug,
        section: page.section,
        excerpt: excerpt.slice(0, 300) + (excerpt.length > 300 ? '...' : ''),
        access: page.access,
      });
    }
  }
  
  return results;
}

/**
 * Get navigation structure
 */
export function getNavigation(role?: UserRole): { section: DocSection; pages: DocPage[] }[] {
  const sections = getSections();
  const nav: { section: DocSection; pages: DocPage[] }[] = [];
  
  for (const section of sections) {
    // Skip billing sections for non-billing users
    if (section.access === 'billing' && role !== 'billing') {
      continue;
    }
    
    const pages = getPagesBySection(section.slug).filter(
      page => page.access !== 'billing' || role === 'billing'
    );
    
    nav.push({ section, pages });
  }
  
  return nav;
}

/**
 * Get recently updated pages
 */
export function getRecentlyUpdated(limit: number = 5, role?: UserRole): DocPage[] {
  const pages = getAllPages(role);
  
  return pages
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, limit);
}
