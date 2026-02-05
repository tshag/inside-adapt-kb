import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import { getRole, isValidGoogleProfile } from "./access";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          hd: "adaptwny.com", // Hint for Google Workspace domain
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: getRole(profile.email),
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Validate Google profile
      if (account?.provider === "google") {
        // Cast profile to any so email_verified can be accessed without a type error
        if (!profile?.email || !(profile as any).email_verified) {
          return false;
        }

        // Check domain
        const email = profile.email.toLowerCase();
        if (!email.endsWith("@adaptwny.com")) {
          return false;
        }

        // Check hosted domain claim if available
if ((profile as any).hd && (profile as any).hd !== "adaptwny.com") {
          return false;
        }

        return true;
      }

      return false;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = getRole(user.email || "");
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = getRole(user.email || "");
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

// Extend session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
