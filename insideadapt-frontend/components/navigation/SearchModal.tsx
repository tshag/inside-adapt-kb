"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileText,
  Lock,
  Search,
  X
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  section: string;
  access: "all" | "billing";
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

// Mock search results - in production, this would come from an API
const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Medication Management Protocol",
    excerpt: "Standard procedures for medication management at Adapt Psychiatry...",
    href: "/clinical/medications/management-protocol",
    section: "Clinical",
    access: "all"
  },
  {
    id: "2",
    title: "HIPAA Privacy and Security Policy",
    excerpt: "Procedures to protect patient health information in accordance with HIPAA...",
    href: "/policies/compliance/hipaa-privacy",
    section: "Compliance",
    access: "all"
  },
  {
    id: "3",
    title: "Claims Submission Protocol",
    excerpt: "Standard procedures for submitting insurance claims...",
    href: "/billing/claims/submission-protocol",
    section: "Billing",
    access: "billing"
  },
  {
    id: "4",
    title: "PTO Policy",
    excerpt: "Paid time off accrual, requesting time off, and carryover policies...",
    href: "/policies/hr-benefits/pto-policy",
    section: "HR & Benefits",
    access: "all"
  }
];

export function SearchModal({ isOpen, onClose, userRole }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Filter results based on user role
  const filterResults = useCallback((searchQuery: string) => {
    const filtered = mockResults.filter(result => {
      // Hide billing content from non-billing users
      if (result.access === "billing" && userRole !== "billing") {
        return false;
      }
      // Match query
      return (
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setResults(filtered);
    setSelectedIndex(0);
  }, [userRole]);

  useEffect(() => {
    if (query) {
      filterResults(query);
    } else {
      setResults([]);
    }
  }, [query, filterResults]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results[selectedIndex]) {
        router.push(results[selectedIndex].href);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles, policies, protocols..."
            className="flex-1 text-lg outline-none placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query && results.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-slate-400 mt-1">
                Try a different search term
              </p>
            </div>
          )}

          {!query && (
            <div className="px-6 py-8">
              <p className="text-sm font-medium text-slate-500 mb-4">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["HIPAA", "PTO", "Medications", "Insurance"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 text-sm text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              <p className="px-6 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((result, index) => (
                <a
                  key={result.id}
                  href={result.href}
                  className={cn(
                    "flex items-start gap-4 px-6 py-4 transition-colors",
                    index === selectedIndex 
                      ? "bg-[var(--adapt-light)]" 
                      : "hover:bg-slate-50"
                  )}
                  onClick={onClose}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-900 truncate">
                        {result.title}
                      </h4>
                      {result.access === "billing" && (
                        <span className="billing-badge">
                          <Lock className="w-3 h-3" />
                          Billing
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {result.excerpt}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {result.section}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-sans">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-sans">
                ↓
              </kbd>
              <span className="ml-1">to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-sans">
                ↵
              </kbd>
              <span className="ml-1">to select</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-sans">
              ESC
            </kbd>
            <span className="ml-1">to close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
