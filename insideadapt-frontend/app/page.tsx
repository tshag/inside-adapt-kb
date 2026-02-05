"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Shield, 
  Search, 
  Lock, 
  Users, 
  FileText,
  ArrowRight,
  CheckCircle,
  Building2,
  Stethoscope,
  ChevronRight
} from "lucide-react";

// Assume signIn function is provided by the existing auth system
interface LandingPageProps {
  signIn?: () => void;
}

export default function LandingPage({ signIn }: LandingPageProps) {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: FileText,
      title: "Clinical Protocols",
      description: "Access evidence-based treatment guidelines and medication management protocols."
    },
    {
      icon: Building2,
      title: "Company Policies",
      description: "Stay informed on HR policies, benefits, and operational procedures."
    },
    {
      icon: Shield,
      title: "HIPAA & Compliance",
      description: "Review privacy policies, security protocols, and compliance requirements."
    },
    {
      icon: Users,
      title: "Team Resources",
      description: "Connect with colleague information, training materials, and team updates."
    }
  ];

  const stats = [
    { value: "50+", label: "Clinical Protocols" },
    { value: "30+", label: "Company Policies" },
    { value: "100%", label: "Staff Access" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl adapt-gradient flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-[var(--adapt-dark)]">Inside Adapt</span>
                <span className="hidden sm:inline text-slate-400 mx-2">|</span>
                <span className="hidden sm:inline text-sm text-slate-500">Knowledge Base</span>
              </div>
            </div>
            <button
              onClick={signIn}
              className="adapt-button-primary text-sm px-5 py-2.5"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--adapt-light)] via-white to-white" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[var(--adapt-secondary)]/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--adapt-primary)]/10 text-[var(--adapt-primary)] text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>Secure Staff Portal</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--adapt-dark)] leading-tight">
                Everything you need to deliver{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--adapt-primary)] to-[var(--adapt-accent)]">
                  exceptional care
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
                Inside Adapt is your centralized resource for clinical protocols, company policies, 
                and team information at Adapt Psychiatry.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={signIn}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="adapt-button-primary text-base px-8 py-4 group"
                >
                  <span>Sign in with Google</span>
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${isHovered ? "translate-x-1" : ""}`} />
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--adapt-secondary)]" />
                  <span>@adaptwny.com required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--adapt-secondary)]" />
                  <span>Secure access</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                {/* Mock KB Interface */}
                <div className="bg-slate-50 border-b border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg adapt-gradient flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="h-8 flex-1 bg-white rounded-lg border border-slate-200 flex items-center px-3">
                      <Search className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-400">Search protocols, policies...</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--adapt-light)] border border-[var(--adapt-secondary)]/20">
                    <Stethoscope className="w-5 h-5 text-[var(--adapt-primary)]" />
                    <div>
                      <p className="font-medium text-sm text-[var(--adapt-dark)]">Medication Management Protocol</p>
                      <p className="text-xs text-slate-500">Clinical Policies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-100">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-sm text-slate-700">HIPAA Privacy Policy</p>
                      <p className="text-xs text-slate-500">Compliance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-100">
                    <Users className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-sm text-slate-700">PTO Policy</p>
                      <p className="text-xs text-slate-500">HR & Benefits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <Lock className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-sm text-amber-800">Claims Submission Protocol</p>
                      <p className="text-xs text-amber-600">Billing Team Only</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--adapt-secondary)]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[var(--adapt-primary)]/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="adapt-section-title mb-4">What&apos;s Inside</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A comprehensive resource designed to support our team in delivering 
              the highest quality psychiatric care.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-[var(--adapt-secondary)]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--adapt-primary)]/10 to-[var(--adapt-secondary)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[var(--adapt-primary)]" />
                </div>
                <h3 className="font-semibold text-lg text-[var(--adapt-dark)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 adapt-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <p className="text-4xl sm:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Info Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 lg:p-12">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--adapt-dark)] mb-2">
                  Staff Access Only
                </h2>
                <p className="text-slate-600">
                  Inside Adapt is exclusively for Adapt Psychiatry team members. 
                  Access requires a verified @adaptwny.com Google account.
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                <CheckCircle className="w-5 h-5 text-[var(--adapt-secondary)] flex-shrink-0" />
                <span className="text-slate-700">Sign in with your Adapt Google Workspace account</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                <CheckCircle className="w-5 h-5 text-[var(--adapt-secondary)] flex-shrink-0" />
                <span className="text-slate-700">Access clinical protocols and company policies</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                <CheckCircle className="w-5 h-5 text-[var(--adapt-secondary)] flex-shrink-0" />
                <span className="text-slate-700">Billing team members have additional restricted access</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[var(--adapt-light)] border border-[var(--adapt-secondary)]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Users className="w-5 h-5 text-[var(--adapt-primary)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--adapt-dark)]">Need Access?</p>
                  <p className="text-sm text-slate-600">Contact your supervisor or IT support</p>
                </div>
              </div>
              <a 
                href="mailto:hello@meetadapt.com" 
                className="text-[var(--adapt-primary)] hover:text-[var(--adapt-primary-light)] font-medium text-sm flex items-center gap-1"
              >
                Contact Support
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold">Inside Adapt</span>
                <span className="text-slate-400 text-sm ml-2">Adapt Psychiatry Knowledge Base</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>&copy; {new Date().getFullYear()} Adapt Psychiatry</span>
              <span className="hidden sm:inline">|</span>
              <a href="https://www.meetadapt.com" className="hover:text-white transition-colors">
                meetadapt.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
