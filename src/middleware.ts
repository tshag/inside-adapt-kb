// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { canAccessBilling } from "./lib/access";

// Define route patterns
const BILLING_ROUTES = ["/billing", "/docs/billing"];
const API_BILLING_ROUTES = ["/api/billing", "/api/search"];

// Exact public paths (not using startsWith)
const PUBLIC_PATHS = ["/", "/landing", "/auth/signin", "/auth/error", "/403", "/404"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;
    
    // Check billing route access
    const isBillingRoute = BILLING_ROUTES.some(route => 
      pathname.startsWith(route)
    );
    
    const isApiBillingRoute = API_BILLING_ROUTES.some(route =>
      pathname.startsWith(route)
    );
    
    if ((isBillingRoute || isApiBillingRoute) && token?.email && !canAccessBilling(token.email)) {
      // Return 403 for API routes
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Forbidden - Billing access required" },
          { status: 403 }
        );
      }
      
      // Redirect to 403 page for regular routes
      return NextResponse.redirect(new URL("/403", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        
        // Allow exact public paths without authentication
        if (PUBLIC_PATHS.includes(pathname)) {
          return true;
        }
        
        // Allow landing subpaths
        if (pathname.startsWith("/landing")) {
          return true;
        }
        
        // Allow auth callback routes
        if (pathname.startsWith("/api/auth/")) {
          return true;
        }
        
        // Allow static files
        if (pathname.startsWith("/_next/") || pathname.startsWith("/static/")) {
          return true;
        }
        
        // Require authentication for everything else
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
