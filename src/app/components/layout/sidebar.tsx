"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, FileText, Lock } from "lucide-react";
import { DocSection, DocPage } from "@/types";

interface SidebarProps {
  navigation: { section: DocSection; pages: DocPage[] }[];
  userRole: string;
}

export function Sidebar({ navigation, userRole }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight">Adapt Psychiatry</span>
            <span className="text-xs text-muted-foreground">Knowledge Base</span>
          </div>
        </Link>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 pb-4">
          {navigation.map(({ section, pages }) => (
            <SidebarSection
              key={section.id}
              section={section}
              pages={pages}
              pathname={pathname}
              userRole={userRole}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface SidebarSectionProps {
  section: DocSection;
  pages: DocPage[];
  pathname: string;
  userRole: string;
}

function SidebarSection({ section, pages, pathname, userRole }: SidebarSectionProps) {
  const isActive = pathname.startsWith(`/docs/${section.slug}`) || 
                   (section.slug === 'billing' && pathname.startsWith('/billing'));
  const [isOpen, setIsOpen] = React.useState(isActive);

  const isBillingSection = section.access === 'billing';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{section.title}</span>
          {isBillingSection && (
            <Lock className="h-3 w-3 text-amber-500" />
          )}
        </div>
        <ChevronRight 
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-90"
          )} 
        />
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="ml-4 mt-1 space-y-0.5 border-l pl-3">
          {pages.map((page) => {
            const pagePath = page.slug.startsWith('billing') 
              ? `/billing/${page.slug.replace('billing/', '')}` 
              : `/docs/${page.slug}`;
            const isPageActive = pathname === pagePath;
            const isBillingPage = page.access === 'billing';

            return (
              <Link
                key={page.id}
                href={pagePath}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  isPageActive 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span className="truncate">{page.title}</span>
                {isBillingPage && (
                  <Lock className="h-3 w-3 text-amber-500 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
