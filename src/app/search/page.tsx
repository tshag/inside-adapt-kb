"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { searchPages, getNavigation } from "@/lib/content";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Lock, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/types";

export default function SearchPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = React.useState(initialQuery);
  const [results, setResults] = React.useState<any[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  React.useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const userRole = (session.user.role || "member") as UserRole;
  const navigation = getNavigation(userRole);

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    // Server-side search with role-based filtering
    const searchResults = searchPages(searchQuery, userRole);
    setResults(searchResults);
    setHasSearched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <Sidebar navigation={navigation} userRole={userRole} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <ScrollArea className="flex-1">
          <main className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Search</h1>
            
            {/* Search form */}
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents, policies, protocols..."
                  className="pl-10 pr-10 h-12 text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Button type="submit" size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                {hasSearched && (
                  <Button type="button" variant="outline" size="lg" onClick={clearSearch}>
                    Clear
                  </Button>
                )}
              </div>
            </form>

            {/* Results */}
            {hasSearched && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">
                    {results.length === 0 
                      ? "No results found" 
                      : `${results.length} result${results.length === 1 ? "" : "s"} found`
                    }
                  </h2>
                </div>

                {results.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium">No documents found</p>
                      <p className="text-muted-foreground mt-1">
                        Try adjusting your search terms or browse the sections instead.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {results.map((result) => (
                      <Link 
                        key={result.id} 
                        href={result.slug.startsWith('billing') 
                          ? `/${result.slug}` 
                          : `/docs/${result.slug}`
                        }
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium">{result.title}</p>
                                    {result.access === "billing" && (
                                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 flex-shrink-0">
                                        <Lock className="h-3 w-3 mr-1" />
                                        Billing
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground capitalize mb-2">
                                    {result.section}
                                  </p>
                                  {result.excerpt && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {result.excerpt}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Initial state - suggestions */}
            {!hasSearched && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  Enter a search term to find documents, policies, and protocols.
                </p>
              </div>
            )}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
