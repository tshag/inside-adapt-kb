import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { canAccessBilling } from "./lib/access";

// Define route patterns
const BILLING_ROUTES = ["/billing", "/docs/billing"];
const API_BILLING_ROUTES = ["/api/billing", "/api/search"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;
    
    // Check if user is authenticated
    if (!token?.email) {
           if (pathname === "/" || pathname.startsWith("/landing")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    
    // Check billing route access
    const isBillingRoute = BILLING_ROUTES.some(route => 
      pathname.startsWith(route)
    );
    
    const isApiBillingRoute = API_BILLING_ROUTES.some(route =>
      pathname.startsWith(route)
    );
    
    if ((isBillingRoute || isApiBillingRoute) && !canAccessBilling(token.email)) {
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
        // Require authentication for all routes except public ones
        const publicPaths = ["/", "/landing", "/auth/signin", "/auth/error", "/403", "/404"];
        if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
          return true;
        }
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
