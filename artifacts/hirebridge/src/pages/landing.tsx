import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Shield, FileText, CreditCard, Building2, LayoutDashboard, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@workspace/replit-auth-web";

function LoginCard({ title, subtitle, buttonText, href, variant }: {
  title: string;
  subtitle: string;
  buttonText: string;
  href: string;
  variant: "blue" | "green" | "dark";
}) {
  const btnClass =
    variant === "blue"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : variant === "green"
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-gray-900 hover:bg-gray-800 text-white";

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-500 mt-2 text-sm">{subtitle}</p>
        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid={`input-email-${variant}`}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid={`input-password-${variant}`}
          />
          <Link href={href}>
            <button
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${btnClass}`}
              data-testid={`button-login-${variant}`}
            >
              {buttonText}
            </button>
          </Link>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4 cursor-pointer hover:text-gray-600">
          Forgot Password?
        </p>
      </CardContent>
    </Card>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-700 tracking-tight">CareerLinks</h1>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/jobs" className="hover:text-blue-600 transition-colors" data-testid="link-jobs">Browse Jobs</Link>
            <Link href="/company/register" className="hover:text-blue-600 transition-colors" data-testid="link-company-register">For Companies</Link>
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex gap-3 items-center">
            {isLoading ? (
              <div className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse" />
            ) : isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 font-medium">
                  {user?.firstName ?? user?.email ?? "Account"}
                </span>
                <Button size="sm" variant="outline" onClick={logout} data-testid="button-logout">
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/candidate/login">
                  <Button variant="outline" size="sm" data-testid="button-candidate-login">Candidate Login</Button>
                </Link>
                <Link href="/company/login">
                  <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white" data-testid="button-company-login">Company Login</Button>
                </Link>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={login} data-testid="button-sign-in">
                  Sign in
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <Link href="/jobs" className="block text-sm text-gray-700 hover:text-blue-600 py-2" onClick={() => setMobileMenuOpen(false)}>Browse Jobs</Link>
            <Link href="/company/register" className="block text-sm text-gray-700 hover:text-blue-600 py-2" onClick={() => setMobileMenuOpen(false)}>For Companies</Link>
            {isAuthenticated ? (
              <div className="pt-2 space-y-2">
                <p className="text-sm text-gray-500">Signed in as <span className="font-medium text-gray-800">{user?.firstName ?? user?.email}</span></p>
                <Button size="sm" variant="outline" className="w-full" onClick={logout}>
                  <LogOut className="h-3.5 w-3.5 mr-1.5" /> Log out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setMobileMenuOpen(false); login(); }}>
                  Sign in
                </Button>
                <Link href="/candidate/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-candidate-login-mobile">Candidate Login</Button>
                </Link>
                <Link href="/company/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-gray-900 hover:bg-gray-800 text-white" data-testid="button-company-login-mobile">Company Login</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-block bg-blue-500/30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Verified Hiring Platform
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Verified IT &amp; Non-IT<br />Hiring Platform
            </h2>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-blue-100 max-w-2xl">
              Upload your details, generate professional resumes automatically, and connect with trusted companies. Every company is manually approved.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/candidate/register">
                <Button className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-3 h-auto text-base rounded-xl shadow-lg" data-testid="button-create-resume">
                  Create Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/company/register">
                <Button variant="outline" className="w-full sm:w-auto border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 h-auto text-base rounded-xl" data-testid="button-hire-candidates">
                  Hire Candidates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Everything you need to hire smarter</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">A complete ecosystem for candidates and companies — built with trust at the core.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />,
              title: "Auto Resume Builder",
              desc: "Candidates fill a smart form and the platform automatically generates a professional resume ready to share.",
            },
            {
              icon: <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-600" />,
              title: "Verified Companies",
              desc: "Every company is manually approved by our admin team for safer, more trusted hiring.",
            },
            {
              icon: <CreditCard className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-600" />,
              title: "Subscription System",
              desc: "Flexible monthly plans for both candidates and companies. Unlock advanced features as you grow.",
            },
          ].map((f) => (
            <Card key={f.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{f.title}</h3>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Resume Form Preview */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Build Your Resume in Minutes</h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">Fill in your details and we'll generate a professional resume automatically.</p>
          </div>
          <Card className="shadow-xl border-0">
            <CardContent className="p-5 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {["Full Name", "Mobile Number", "Email Address", "Location", "Qualification", "Skills (React, Java, Python...)"].map((ph) => (
                  <input
                    key={ph}
                    className="border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={ph}
                    data-testid={`input-preview-${ph.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                ))}
              </div>
              <div className="mt-4 sm:mt-5">
                <textarea
                  className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full h-24 sm:h-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Career Objective / About Yourself"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                  <input type="file" className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Signature</label>
                  <input type="file" className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full text-sm" />
                </div>
              </div>
              <Link href="/candidate/register">
                <Button className="mt-6 sm:mt-8 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-auto rounded-xl font-semibold text-sm" data-testid="button-submit-preview">
                  Submit &amp; Generate Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Company + Admin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">For Companies</h3>
              </div>
              <ul className="space-y-3">
                {["Search candidates by skills", "Download generated resumes", "Contact verified candidates", "Subscription access"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/company/register" className="mt-6 inline-block w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm" data-testid="button-register-company">
                  Register Your Company
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gray-900 text-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <LayoutDashboard className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h3>
              </div>
              <ul className="space-y-3">
                {["Approve candidates", "Approve companies", "Manage subscriptions", "Remove fake profiles"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/admin/login" className="mt-6 inline-block w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-sm font-semibold" data-testid="button-admin-access">
                  Admin Access
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Login Panels */}
      <section className="bg-slate-100 py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Platform Login Panels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <LoginCard
              title="Candidate Login"
              subtitle="Access your resume dashboard"
              buttonText="Login as Candidate"
              href="/candidate/login"
              variant="blue"
            />
            <LoginCard
              title="Company Login"
              subtitle="Hire verified candidates"
              buttonText="Login as Company"
              href="/company/login"
              variant="green"
            />
            <LoginCard
              title="Admin Login"
              subtitle="Manage platform approvals"
              buttonText="Login as Admin"
              href="/admin/login"
              variant="dark"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-700 py-12 sm:py-16 px-4 sm:px-6 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { label: "Registered Candidates", value: "10,000+" },
            { label: "Verified Companies", value: "500+" },
            { label: "Jobs Posted", value: "2,400+" },
            { label: "Successful Hires", value: "8,000+" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-bold">{s.value}</div>
              <div className="text-blue-200 mt-1 text-xs sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 md:flex-row md:justify-between md:items-center md:gap-4">
          <div className="text-center md:text-left">
            <span className="text-white font-bold text-xl">CareerLinks</span>
            <p className="text-sm mt-1">Smart Resume &amp; Hiring Platform</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
            <Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link>
            <Link href="/candidate/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/company/register" className="hover:text-white transition-colors">For Companies</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin</Link>
          </div>
          <p className="text-sm text-center md:text-right">&copy; 2026 CareerLinks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
