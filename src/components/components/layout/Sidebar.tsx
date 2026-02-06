"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  LayoutDashboard,
  Lock,
  Search,
  Settings,
  Shield,
  Stethoscope,
  Users,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

interface NavSection {
  id: string;
  title: string;
  icon: React.ElementType;
  href: string;
  access: "all" | "billing";
  children?: { id: string; title: string; href: string }[];
}

const navigation: NavSection[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    access: "all"
  },
  {
    id: "clinical",
    title: "Clinical",
    icon: Stethoscope,
    href: "/clinical",
    access: "all",
    children: [
      { id: "protocols", title: "Protocols", href: "/clinical/protocols" },
      { id: "medications", title: "Medications", href: "/clinical/medications" },
      { id: "assessments", title: "Assessments", href: "/clinical/assessments" }
    ]
  },
  {
    id: "policies",
    title: "Policies",
    icon: Shield,
    href: "/policies",
    access: "all",
    children: [
      { id: "general", title: "General Policies", href: "/policies/general" },
      { id: "hr", title: "HR & Benefits", href: "/policies/hr-benefits" },
      { id: "compliance", title: "Compliance", href: "/policies/compliance" }
    ]
  },
  {
    id: "operations",
    title: "Operations",
    icon: Settings,
    href: "/operations",
    access: "all",
    children: [
      { id: "it", title: "IT Support", href: "/operations/it" },
      { id: "facilities", title: "Facilities", href: "/operations/facilities" }
    ]
  },
  {
    id: "team",
    title: "Team",
    icon: Users,
    href: "/team",
    access: "all"
  },
  {
    id: "billing",
    title: "Billing",
    icon: Lock,
    href: "/billing",
    access: "billing",
    children: [
      { id: "claims", title: "Claims", href: "/billing/claims" },
      { id: "contracts", title: "Contracts", href: "/billing/contracts" },
      { id: "rates", title: "Rates", href: "/billing/rates" }
    ]
  }
];

function NavItem({ 
  section, 
  isActive,
  userRole 
}: { 
  section: NavSection; 
  isActive: boolean;
  userRole?: string;
}) {
  const [expanded, setExpanded] = useState(isActive);
  const hasChildren = section.children && section.children.length > 0;
  const Icon = section.icon;

  // Hide billing section for non-billing users
  if (section.access === "billing" && userRole !== "billing") {
    return null;
  }

  return (
    <div className="space-y-1">
      <Link
        href={section.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive 
            ? "bg-[var(--adapt-primary)]/10 text-[var(--adapt-primary)]" 
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
        <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-[var(--adapt-primary)]")} />
        <span className="flex-1">{section.title}</span>
        {section.access === "billing" && (
          <Lock className="w-3.5 h-3.5 text-amber-500" />
        )}
        {hasChildren && (
          expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> 
                  : <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </Link>

      {hasChildren && expanded && (
        <div className="ml-4 pl-4 border-l border-slate-200 space-y-1">
          {section.children?.map((child) => (
            <Link
              key={child.id}
              href={child.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>{child.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ isOpen, onClose, userRole }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg adapt-gradient flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-[var(--adapt-dark)]">Inside Adapt</span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <Link
          href="/search"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-500 hover:bg-slate-100 hover:border-slate-300 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <span className="ml-auto text-xs text-slate-400">⌘K</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 pb-4 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {navigation.map((section) => (
          <NavItem
            key={section.id}
            section={section}
            isActive={pathname?.startsWith(section.href) || false}
            userRole={userRole}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-[var(--adapt-primary)]/10 flex items-center justify-center">
            <span className="text-sm font-medium text-[var(--adapt-primary)]">
              {userRole === "billing" ? "B" : "S"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">
              {userRole === "billing" ? "Billing Team" : "Staff Member"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {userRole === "billing" ? "Full Access" : "Standard Access"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
