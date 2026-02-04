"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, ArrowLeft, Home } from "lucide-react";

export default function ForbiddenPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to access this resource
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Billing Content Restricted</p>
                  <p className="text-amber-700 mt-1">
                    This page contains sensitive billing information that is only accessible 
                    to authorized billing team members.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Signed in as: <span className="font-medium">{session?.user?.email}</span>
              </p>
              
              <div className="flex flex-col gap-2">
                <Button asChild variant="default" className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Home
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/search">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Search Documents
                  </Link>
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Need billing access?</p>
              <p>Contact your administrator to request access.</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Error 403 - Forbidden
        </p>
      </div>
    </div>
  );
}
