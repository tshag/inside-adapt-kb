/**
 * Access Control Configuration
 * 
 * This file defines the billing allowlist and role-based access control
 * for the Adapt Psychiatry Knowledge Base.
 */

// Billing team allowlist - case-insensitive comparison
export const BILLING_ALLOWLIST = new Set([
  "nko@adaptwny.com",
  "iimperial@adaptwny.com",
  "fpedrosa@adaptwny.com",
  "shilario@adaptwny.com",
  "nferraren@adaptwny.com",
  "limperial@adaptwny.com",
].map(e => e.toLowerCase()));

// Domain restriction
const ALLOWED_DOMAIN = "@adaptwny.com";

export type UserRole = "none" | "member" | "billing";

/**
 * Get the user's role based on their email address
 * @param email - User's email address
 * @returns UserRole - "billing", "member", or "none"
 */
export function getRole(email: string): UserRole {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check domain restriction
  if (!normalizedEmail.endsWith(ALLOWED_DOMAIN)) {
    return "none";
  }
  
  // Check billing allowlist
  if (BILLING_ALLOWLIST.has(normalizedEmail)) {
    return "billing";
  }
  
  // Default to member for valid domain users
  return "member";
}

/**
 * Check if a user has access to billing content
 * @param email - User's email address
 * @returns boolean
 */
export function canAccessBilling(email: string): boolean {
  return getRole(email) === "billing";
}

/**
 * Check if a user can access the application at all
 * @param email - User's email address
 * @returns boolean
 */
export function canAccessApplication(email: string): boolean {
  return getRole(email) !== "none";
}

/**
 * Validate Google OAuth profile
 * @param profile - Google OAuth profile
 * @returns boolean - Whether the profile is valid for access
 */
export function isValidGoogleProfile(profile: {
  email?: string | null;
  email_verified?: boolean | null;
  hd?: string | null;
}): boolean {
  // Must have verified email
  if (!profile.email_verified) {
    return false;
  }
  
  // Must have email
  if (!profile.email) {
    return false;
  }
  
  // Check domain (either via hd claim or email suffix)
  if (profile.hd && profile.hd !== "adaptwny.com") {
    return false;
  }
  
  // Final domain check via email
  return profile.email.toLowerCase().endsWith(ALLOWED_DOMAIN);
}
