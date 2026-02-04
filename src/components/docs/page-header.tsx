"use client"

import React from "react";
import Link from "next/link";
import { ChevronRight, Home, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  lastUpdated?: string;
  isBilling?: boolean;
}

export function PageHeader({ 
  title, 
  breadcrumbs = [], 
  lastUpdated,
  isBilling = false 
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Link 
            href="/" 
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-4 w-4" />
              {crumb.href ? (
                <Link 
                  href={crumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title and badges */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {isBilling && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Lock className="h-3 w-3 mr-1" />
            Billing Only
          </Badge>
        )}
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      )}
    </div>
  );
}
