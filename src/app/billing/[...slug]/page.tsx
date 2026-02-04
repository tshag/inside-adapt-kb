import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPageBySlug, getNavigation } from "@/lib/content";
import { canAccessBilling } from "@/lib/access";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/docs/page-header";
import { TableOfContents, extractHeadings } from "@/components/docs/table-of-contents";
import { mdxComponents } from "@/components/docs/mdx-components";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MDXRemote } from "next-mdx-remote/rsc";
import { UserRole } from "@/types";

interface BillingPageProps {
  params: {
    slug: string[];
  };
}

export default async function BillingPage({ params }: BillingPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Strict billing access check
  if (!canAccessBilling(session.user.email)) {
    redirect("/403");
  }

  const userRole = "billing" as UserRole;
  const slug = `billing/${params.slug.join("/")}`;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const navigation = getNavigation(userRole);
  const tocItems = extractHeadings(page.content);
  
  const breadcrumbs = [
    { label: "Billing", href: "/billing" },
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
              {/* Billing warning banner */}
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-medium">Billing Team Only</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  This document contains sensitive billing information. Do not share with unauthorized personnel.
                </p>
              </div>

              <article className="prose prose-slate max-w-none">
                <PageHeader
                  title={page.title}
                  breadcrumbs={breadcrumbs}
                  lastUpdated={page.lastUpdated}
                  isBilling={true}
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
                  Adapt Psychiatry Knowledge Base • Billing Team Only
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
