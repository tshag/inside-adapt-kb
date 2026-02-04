"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileX, Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileX className="h-8 w-8 text-slate-600" />
            </div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
            <CardDescription>
              The document you&apos;re looking for doesn&apos;t exist or has been moved
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              <Button asChild variant="default" className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/search">
                  <Search className="h-4 w-4 mr-2" />
                  Search Documents
                </Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Can&apos;t find what you&apos;re looking for?</p>
              <p>Try searching or browse the knowledge base sections.</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Error 404 - Not Found
        </p>
      </div>
    </div>
  );
}
