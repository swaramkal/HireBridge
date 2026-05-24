import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Shield, FileText, CreditCard, Users, Building2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
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
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">HireBridge</h1>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/jobs" className="hover:text-blue-600 transition-colors" data-testid="link-jobs">Browse Jobs</Link>
            <Link href="/company/register" className="hover:text-blue-600 transition-colors" data-testid="link-company-register">For Companies</Link>
          </div>
          <div className="flex gap-3">
            <Link href="/candidate/login">
              <Button variant="outline" size="sm" data-testid="button-candidate-login">Candidate Login</Button>
            </Link>
            <Link href="/company/login">
              <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white" data-testid="button-company-login">Company Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-block bg-blue-500/30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Verified Hiring Platform
            </span>
            <h2 className="text-5xl font-bold leading-tight">
              Verified IT &amp; Non-IT<br />Hiring Platform
            </h2>
            <p className="mt-5 text-lg text-blue-100 max-w-2xl">
              Upload your details, generate professional resumes automatically, and connect with trusted companies. Every company is manually approved.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link href="/candidate/register">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-3 h-auto text-base rounded-xl shadow-lg" data-testid="button-create-resume">
                  Create Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/company/register">
                <Button variant="outline" className="border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 h-auto text-base rounded-xl" data-testid="button-hire-candidates">
                  Hire Candidates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need to hire smarter</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">A complete ecosystem for candidates and companies — built with trust at the core.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FileText className="h-8 w-8 text-blue-600" />,
              title: "Auto Resume Builder",
              desc: "Candidates fill a smart form and the platform automatically generates a professional resume ready to share.",
            },
            {
              icon: <Shield className="h-8 w-8 text-emerald-600" />,
              title: "Verified Companies",
              desc: "Every company is manually approved by our admin team for safer, more trusted hiring.",
            },
            {
              icon: <CreditCard className="h-8 w-8 text-indigo-600" />,
              title: "Subscription System",
              desc: "Flexible monthly plans for both candidates and companies. Unlock advanced features as you grow.",
            },
          ].map((f) => (
            <Card key={f.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Resume Form Preview */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Build Your Resume in Minutes</h2>
            <p className="text-gray-500 mt-3">Fill in your details and we'll generate a professional resume automatically.</p>
          </div>
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-5">
                {["Full Name", "Mobile Number", "Email Address", "Location", "Qualification", "Skills (React, Java, Python...)"].map((ph) => (
                  <input
                    key={ph}
                    className="border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={ph}
                    data-testid={`input-preview-${ph.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                ))}
              </div>
              <div className="mt-5">
                <textarea
                  className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full h-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Career Objective / About Yourself"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-5 mt-5">
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
                <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-auto rounded-xl font-semibold text-sm" data-testid="button-submit-preview">
                  Submit &amp; Generate Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Company + Admin */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">For Companies</h3>
              </div>
              <ul className="space-y-3">
                {["Search candidates by skills", "Download generated resumes", "Contact verified candidates", "Subscription access"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/company/register" className="mt-6 inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm" data-testid="button-register-company">
                  Register Your Company
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gray-900 text-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <LayoutDashboard className="h-6 w-6 text-blue-400" />
                <h3 className="text-2xl font-bold">Admin Dashboard</h3>
              </div>
              <ul className="space-y-3">
                {["Approve candidates", "Approve companies", "Manage subscriptions", "Remove fake profiles"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/admin/login" className="mt-6 inline-block">
                <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-sm font-semibold" data-testid="button-admin-access">
                  Admin Access
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Login Panels */}
      <section className="bg-slate-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Platform Login Panels</h2>
          <div className="grid md:grid-cols-3 gap-8">
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
      <section className="bg-blue-700 py-16 px-6 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Registered Candidates", value: "10,000+" },
            { label: "Verified Companies", value: "500+" },
            { label: "Jobs Posted", value: "2,400+" },
            { label: "Successful Hires", value: "8,000+" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-bold">{s.value}</div>
              <div className="text-blue-200 mt-1 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-white font-bold text-xl">HireBridge</span>
            <p className="text-sm mt-1">Smart Resume &amp; Hiring Platform</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link>
            <Link href="/candidate/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/company/register" className="hover:text-white transition-colors">For Companies</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin</Link>
          </div>
          <p className="text-sm">&copy; 2026 HireBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
