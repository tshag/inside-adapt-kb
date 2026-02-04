import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPageBySlug, getNavigation, getSections } from "@/lib/content";
import { canAccessBilling } from "@/lib/access";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/docs/page-header";
import { TableOfContents, extractHeadings } from "@/components/docs/table-of-contents";
import { mdxComponents } from "@/components/docs/mdx-components";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MDXRemote } from "next-mdx-remote/rsc";
import { UserRole } from "@/types";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const userRole = (session.user.role || "member") as UserRole;
  const slug = params.slug.join("/");
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  // Check billing access
  if (page.access === "billing" && !canAccessBilling(session.user.email)) {
    redirect("/403");
  }

  const navigation = getNavigation(userRole);
  const tocItems = extractHeadings(page.content);
  
  // Build breadcrumbs
  const sections = getSections();
  const section = sections.find(s => s.slug === page.section);
  const breadcrumbs = [
    ...(section ? [{ label: section.title, href: `/docs/${section.slug}` }] : []),
    { label: page.title },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <Sidebar navigation={navigation} userRole={userRole} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Document content */}
          <ScrollArea className="flex-1">
            <main className="p-8 max-w-4xl mx-auto">
              <article className="prose prose-slate max-w-none">
                <PageHeader
                  title={page.title}
                  breadcrumbs={breadcrumbs}
                  lastUpdated={page.lastUpdated}
                  isBilling={page.access === "billing"}
                />
                
                <div className="mt-8">
                  <MDXRemote 
                    source={page.content} 
                    components={mdxComponents}
                  />
                </div>
              </article>
              
              <footer className="mt-16 pt-8 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  Adapt Psychiatry Knowledge Base • Internal Use Only
                </p>
              </footer>
            </main>
          </ScrollArea>

          {/* Table of Contents - Desktop only */}
          {tocItems.length > 0 && (
            <aside className="w-64 hidden xl:block border-l bg-muted/30">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <TableOfContents items={tocItems} />
                </div>
              </ScrollArea>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
