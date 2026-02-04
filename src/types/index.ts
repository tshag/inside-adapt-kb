export type UserRole = "none" | "member" | "billing";

export interface DocPage {
  id: string;
  title: string;
  slug: string;
  section: string;
  access: "all" | "billing";
  lastUpdated: string;
  content: string;
  excerpt?: string;
  parentId?: string;
  order?: number;
}

export interface DocSection {
  id: string;
  title: string;
  slug: string;
  order: number;
  description?: string;
  access: "all" | "billing";
}

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  section: string;
  excerpt: string;
  access: "all" | "billing";
}

export interface NavItem {
  id: string;
  title: string;
  slug: string;
  access: "all" | "billing";
  children?: NavItem[];
}

export interface UserSession {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: UserRole;
}
