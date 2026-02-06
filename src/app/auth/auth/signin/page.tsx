"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Shield, 
  Lock, 
  AlertCircle,
  ArrowLeft,
  Mail,
  Building2,
  CheckCircle,
  XCircle
} from "lucide-react";

// Assume these are provided by the existing auth system
interface SignInPageProps {
  signIn?: (provider: string) => void;
  error?: string | null;
  callbackUrl?: string;
}

export default function SignInPage({ 
  signIn, 
  error, 
  callbackUrl = "/" 
}: SignInPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    // Call the existing signIn function from NextAuth
    signIn?.("google");
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "AccessDenied":
        return {
          title: "Access Denied",
          message: "Only @adaptwny.com email addresses are allowed. Please sign in with your Adapt Psychiatry Google account.",
          icon: XCircle,
          variant: "error" as const
        };
      case "Configuration":
        return {
          title: "Configuration Error",
          message: "There was a problem with the server configuration. Please contact IT support.",
          icon: AlertCircle,
          variant: "error" as const
        };
      case "Verification":
        return {
          title: "Verification Failed",
          message: "The verification token has expired or has already been used. Please try signing in again.",
          icon: AlertCircle,
          variant: "error" as const
        };
      default:
        return {
          title: "Sign In Error",
          message: "An unexpected error occurred. Please try again or contact support.",
          icon: AlertCircle,
          variant: "error" as const
        };
    }
  };

  const errorInfo = error ? getErrorMessage(error) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[var(--adapt-light)] flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <a 
            href="/" 
            className="inline-flex items-center gap-3 text-[var(--adapt-dark)] hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl adapt-gradient flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Inside Adapt</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[var(--adapt-primary)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </a>

          {/* Sign In Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Card Header */}
            <div className="px-8 pt-8 pb-6 text-center">
              <div className="w-16 h-16 rounded-2xl adapt-gradient flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--adapt-dark)] mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-600">
                Sign in to access the Adapt Psychiatry Knowledge Base
              </p>
            </div>

            {/* Error Message */}
            {errorInfo && (
              <div className="px-8 mb-6">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                  <errorInfo.icon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">{errorInfo.title}</p>
                    <p className="text-sm text-red-600 mt-1">{errorInfo.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sign In Button */}
            <div className="px-8 pb-8">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full adapt-button-primary py-4 text-base font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" cy="12" r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        fill="none"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="px-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-400">Secure Access</span>
                </div>
              </div>
            </div>

            {/* Requirements Info */}
            <div className="px-8 py-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--adapt-light)] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[var(--adapt-primary)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--adapt-dark)] text-sm">@adaptwny.com Required</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    You must use your Adapt Psychiatry Google Workspace account
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--adapt-light)] flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-[var(--adapt-primary)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--adapt-dark)] text-sm">Staff Only</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Access is restricted to current Adapt Psychiatry employees
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-800 text-sm">Billing Access</p>
                  <p className="text-sm text-amber-600 mt-0.5">
                    Restricted content is only visible to authorized billing team members
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <CheckCircle className="w-4 h-4 text-[var(--adapt-secondary)]" />
                <span>Protected by enterprise-grade security</span>
              </div>
            </div>
          </div>

          {/* Help Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Having trouble signing in?{" "}
              <a 
                href="mailto:hello@meetadapt.com" 
                className="text-[var(--adapt-primary)] hover:text-[var(--adapt-primary-light)] font-medium"
              >
                Contact IT Support
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Adapt Psychiatry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
