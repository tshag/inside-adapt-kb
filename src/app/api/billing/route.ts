import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessBilling } from "@/lib/access";

/**
 * API route for billing-specific operations
 * All endpoints here require billing team access
 */

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Strict billing access check
  if (!canAccessBilling(session.user.email)) {
    // Log unauthorized access attempt
    console.warn(`Unauthorized billing API access attempt by: ${session.user.email}`);
    
    return NextResponse.json(
      { error: "Forbidden - Billing access required" },
      { status: 403 }
    );
  }

  // Return billing data (implement as needed)
  return NextResponse.json({ 
    message: "Billing API access granted",
    user: session.user.email,
  });
}

export const runtime = "nodejs";
