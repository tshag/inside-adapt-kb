"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  FileText,
  History,
  Link2,
  Lock,
  Printer,
  Share2,
  User
} from "lucide-react";

interface ArticleLayoutProps {
  children: React.ReactNode;
  meta: {
    title: string;
    description?: string;
    lastUpdated?: string;
    author?: string;
    section: string;
    sectionHref: string;
    access: "all" | "billing";
    readingTime?: string;
  };
  toc?: { id: string; text: string; level: number }[];
}

export function ArticleLayout({ children, meta, toc }: ArticleLayoutProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Billing Warning */}
          {meta.access === "billing" && (
            <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">
                    Billing Team Only
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    This document contains sensitive billing information. 
                    Do not share with unauthorized personnel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/dashboard" className="hover:text-slate-700">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={meta.sectionHref} className="hover:text-slate-700 capitalize">
              {meta.section}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 truncate">{meta.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--adapt-dark)] leading-tight">
                {meta.title}
              </h1>
              {meta.access === "billing" && (
                <span className="billing-badge flex-shrink-0">
                  <Lock className="w-3 h-3" />
                  Billing Only
                </span>
              )}
            </div>

            {meta.description && (
              <p className="text-lg text-slate-600 mb-6">
                {meta.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              {meta.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{meta.author}</span>
                </div>
              )}
              {meta.lastUpdated && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {meta.lastUpdated}</span>
                </div>
              )}
              {meta.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{meta.readingTime} read</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Link2 className="w-4 h-4" />
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors ml-auto">
                <Edit className="w-4 h-4" />
                Suggest edit
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="prose-adapt">
            {children}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FileText className="w-4 h-4" />
                <span>Adapt Psychiatry Knowledge Base</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <History className="w-4 h-4" />
                <Link href="#" className="hover:text-slate-700">
                  View history
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </div>

      {/* Table of Contents - Desktop Only */}
      {toc && toc.length > 0 && (
        <aside className="hidden xl:block w-72 flex-shrink-0 border-l border-slate-200 bg-slate-50/50">
          <div className="sticky top-20 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">
              On this page
            </h3>
            <nav className="space-y-1">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={cn(
                    "block w-full text-left text-sm transition-colors py-1.5",
                    item.level === 2 
                      ? "text-slate-600 hover:text-slate-900" 
                      : "text-slate-500 hover:text-slate-700 pl-4"
                  )}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}
