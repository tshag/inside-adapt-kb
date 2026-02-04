import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { searchPages } from "@/lib/content";
import { canAccessBilling } from "@/lib/access";
import { UserRole } from "@/types";

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userRole = (session.user.role || "member") as UserRole;
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  // Server-side search with role-based filtering
  // This ensures billing content is never returned to non-billing users
  const results = searchPages(query, userRole);

  // Additional safety: filter out any billing content for non-billing users
  const filteredResults = userRole === "billing" 
    ? results 
    : results.filter(r => r.access !== "billing");

  return NextResponse.json({ 
    results: filteredResults,
    query: query.trim(),
    total: filteredResults.length,
  });
}

// Rate limiting middleware could be added here
export const runtime = "nodejs";
