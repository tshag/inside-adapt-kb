import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNavigation, getRecentlyUpdated, getSections } from "@/lib/content";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Clock, 
  Shield, 
  BookOpen, 
  ArrowRight,
  Lock,
  Users,
  Stethoscope,
  HeartPulse
} from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/types";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const userRole = (session.user.role || "member") as UserRole;
  const navigation = getNavigation(userRole);
  const recentlyUpdated = getRecentlyUpdated(5, userRole);
  const sections = getSections().filter(
    s => s.access !== "billing" || userRole === "billing"
  );

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
          <main className="p-8 max-w-6xl mx-auto">
            {/* Welcome section */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-3">
                Welcome, {session.user.name?.split(' ')[0] || session.user.email}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                This knowledge base is the central hub for all vital information at Adapt Psychiatry. 
                Find protocols, policies, and resources to support exceptional psychiatric care.
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{sections.length}</p>
                      <p className="text-sm text-muted-foreground">Sections</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {navigation.reduce((acc, nav) => acc + nav.pages.length, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Documents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">All Staff</p>
                      <p className="text-sm text-muted-foreground">Access Level</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {userRole === "billing" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <Lock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">Billing</p>
                        <p className="text-sm text-muted-foreground">Team Access</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sections grid */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Browse by Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((section) => (
                  <Link key={section.id} href={`/docs/${section.slug}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          {section.access === "billing" && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                              <Lock className="h-3 w-3 mr-1" />
                              Billing
                            </Badge>
                          )}
                        </div>
                        {section.description && (
                          <CardDescription>{section.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center text-sm text-primary">
                          <span>View documents</span>
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recently updated */}
            {recentlyUpdated.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recently Updated</h2>
                <div className="space-y-3">
                  {recentlyUpdated.map((page) => (
                    <Link key={page.id} href={`/docs/${page.slug}`}>
                      <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{page.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {page.section}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {page.access === "billing" && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Billing
                                </Badge>
                              )}
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(page.lastUpdated).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
