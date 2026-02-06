"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Clock, 
  FileText, 
  Lock,
  Search,
  Stethoscope,
  Shield,
  Users,
  Settings,
  TrendingUp,
  ArrowRight,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardPageProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function DashboardPage({ user }: DashboardPageProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const recentUpdates = [
    {
      id: "1",
      title: "Medication Management Protocol",
      section: "Clinical",
      date: "2 days ago",
      access: "all" as const
    },
    {
      id: "2",
      title: "HIPAA Privacy Policy",
      section: "Compliance",
      date: "1 week ago",
      access: "all" as const
    },
    {
      id: "3",
      title: "Claims Submission Updates",
      section: "Billing",
      date: "2 weeks ago",
      access: "billing" as const
    }
  ];

  const quickLinks = [
    {
      title: "Clinical Protocols",
      description: "Treatment guidelines and medication protocols",
      icon: Stethoscope,
      href: "/clinical",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Company Policies",
      description: "HR, benefits, and compliance policies",
      icon: Shield,
      href: "/policies",
      color: "bg-green-50 text-green-600"
    },
    {
      title: "IT Support",
      description: "Technical support and system access",
      icon: Settings,
      href: "/operations",
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Team Resources",
      description: "Team directory and onboarding materials",
      icon: Users,
      href: "/team",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  const filteredUpdates = recentUpdates.filter(
    update => update.access === "all" || user?.role === "billing"
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--adapt-dark)] mb-2">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-slate-600">
          Here&apos;s what&apos;s happening at Adapt Psychiatry
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full max-w-2xl flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 text-left hover:border-[var(--adapt-primary)]/30 hover:shadow-sm transition-all"
        >
          <Search className="w-5 h-5 text-slate-400" />
          <span className="text-slate-400">Search articles, policies, protocols...</span>
          <span className="ml-auto text-xs text-slate-400 hidden sm:inline">⌘K</span>
        </button>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link key={link.title} href={link.href}>
            <Card className="h-full hover:shadow-md hover:border-[var(--adapt-secondary)]/30 transition-all group">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[var(--adapt-dark)] mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-slate-500">
                  {link.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Updates */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--adapt-dark)]">
                Recent Updates
              </h2>
              <Link 
                href="/updates" 
                className="text-sm text-[var(--adapt-primary)] hover:text-[var(--adapt-primary-light)] flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {filteredUpdates.map((update) => (
                <Card key={update.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[var(--adapt-dark)]">
                            {update.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {update.section} • {update.date}
                          </p>
                        </div>
                      </div>
                      {update.access === "billing" && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                          <Lock className="w-3 h-3 mr-1" />
                          Billing
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Popular Articles */}
          <section>
            <h2 className="text-xl font-semibold text-[var(--adapt-dark)] mb-4">
              Popular Articles
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: "Medication Management Protocol", views: "245 views" },
                { title: "HIPAA Privacy Policy", views: "189 views" },
                { title: "PTO Policy", views: "156 views" },
                { title: "IT Support Guide", views: "134 views" }
              ].map((article) => (
                <Card key={article.title} className="hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[var(--adapt-dark)] truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-slate-500">{article.views}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Announcements */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[var(--adapt-primary)]" />
                <CardTitle className="text-lg">Announcements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pb-4 border-b border-slate-100">
                <p className="text-sm font-medium text-[var(--adapt-dark)] mb-1">
                  New Expense Reimbursement Process
                </p>
                <p className="text-xs text-slate-500">
                  Updated policy effective immediately
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--adapt-dark)] mb-1">
                  Staff Meeting This Friday
                </p>
                <p className="text-xs text-slate-500">
                  9:00 AM in the main conference room
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Articles</span>
                <span className="font-semibold text-[var(--adapt-dark)]">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Last Updated</span>
                <span className="font-semibold text-[var(--adapt-dark)]">Today</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Your Role</span>
                <Badge variant="secondary">
                  {user?.role === "billing" ? "Billing Team" : "Staff"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="bg-gradient-to-br from-[var(--adapt-primary)] to-[var(--adapt-accent)] text-white">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-white/80 mb-4">
                Can&apos;t find what you&apos;re looking for? Contact IT support.
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                className="w-full"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
