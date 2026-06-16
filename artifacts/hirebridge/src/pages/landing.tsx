import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Shield, FileText, Users, Building2, LayoutDashboard, Star, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function img(path: string) {
  return `${BASE}${path}`;
}

function VideoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <iframe
          className="w-full aspect-video"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
          title="CareerLinks Platform Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Software Engineer at TechNova",
    photo: "/images/testimonial-1.png",
    quote: "CareerLinks helped me land my dream job in just 3 weeks. The auto resume builder made my profile stand out instantly.",
    stars: 5,
  },
  {
    name: "Priya Sharma",
    role: "Financial Analyst at FinEdge",
    photo: "/images/testimonial-2.png",
    quote: "As a non-IT professional, I was worried about finding the right platform. CareerLinks had the perfect companies for my profile.",
    stars: 5,
  },
  {
    name: "Rohan Nair",
    role: "Full Stack Developer",
    photo: "/images/testimonial-3.png",
    quote: "The verified company network gave me confidence that every application I sent was to a legitimate employer. Highly recommend.",
    stars: 5,
  },
];

const steps = [
  { num: "01", title: "Create Your Profile", desc: "Fill in your details, skills, and career objective. It takes less than 5 minutes." },
  { num: "02", title: "Get Verified", desc: "Our admin team reviews your profile and approves it for visibility to companies." },
  { num: "03", title: "Connect & Apply", desc: "Browse verified companies, apply to jobs, and receive direct interview invitations." },
];

export default function LandingPage() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}

      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">CareerLinks</h1>
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
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDB2Nmg2di02aC02em0tNiAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <span className="inline-block bg-blue-500/30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide border border-blue-400/30">
              ✦ Verified Hiring Platform
            </span>
            <h2 className="text-5xl font-extrabold leading-tight tracking-tight">
              Land Your<br />
              <span className="text-yellow-300">Dream Job</span><br />
              Faster
            </h2>
            <p className="mt-5 text-lg text-blue-100 max-w-xl leading-relaxed">
              Upload your details, generate professional resumes automatically, and connect with trusted companies. Every company is manually approved.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap items-center">
              <Link href="/candidate/register">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3 h-auto text-base rounded-xl shadow-lg" data-testid="button-create-resume">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <button
                onClick={() => setShowVideo(true)}
                className="flex items-center gap-3 text-white/90 hover:text-white group transition-colors"
                data-testid="button-watch-video"
              >
                <span className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <Play className="h-4 w-4 fill-white ml-0.5" />
                </span>
                <span className="font-semibold text-sm">Watch Demo</span>
              </button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-400" /> Free to join</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-400" /> Verified companies</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-400" /> No spam</span>
            </div>
          </div>

          {/* Hero image */}
          <div className="hidden lg:block relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
              <img
                src={img("/images/hero-team.png")}
                alt="Diverse team of professionals collaborating"
                className="w-full h-80 object-cover"
              />
            </div>
            {/* Floating stats card */}
            <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">New match found</p>
                <p className="text-sm font-bold text-gray-900">Senior React Developer</p>
              </div>
            </div>
            {/* Floating hiring card */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Hired this week</p>
              <div className="flex -space-x-2">
                {["/images/testimonial-1.png", "/images/testimonial-2.png", "/images/testimonial-3.png"].map((src, i) => (
                  <img key={i} src={img(src)} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100 py-6 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Candidates Registered", value: "10,000+" },
            { label: "Verified Companies", value: "500+" },
            { label: "Jobs Posted", value: "2,400+" },
            { label: "Successful Hires", value: "8,000+" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-extrabold text-blue-700">{s.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Simple Process</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Get hired in 3 easy steps</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features with image */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">What we offer</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-8">Everything you need to hire smarter</h2>
            <div className="space-y-6">
              {[
                {
                  icon: <FileText className="h-5 w-5 text-blue-600" />,
                  bg: "bg-blue-50",
                  title: "Auto Resume Builder",
                  desc: "Fill a smart form and get a professional resume generated instantly — no design skills needed.",
                },
                {
                  icon: <Shield className="h-5 w-5 text-emerald-600" />,
                  bg: "bg-emerald-50",
                  title: "Verified Companies Only",
                  desc: "Every company is manually reviewed by our admin team. No fake jobs, no spam.",
                },
                {
                  icon: <Users className="h-5 w-5 text-purple-600" />,
                  bg: "bg-purple-50",
                  title: "Two-Way Matching",
                  desc: "Candidates apply to companies and companies invite candidates — a true two-way connection.",
                },
              ].map((f) => (
                <div key={f.title} className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{f.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/candidate/register" className="mt-8 inline-block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6" data-testid="button-feature-cta">
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <img
              src={img("/images/feature-resume.png")}
              alt="Resume builder illustration"
              className="w-full rounded-2xl shadow-xl"
            />
            <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg px-4 py-3">
              <p className="text-xs text-gray-500">Resume score</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-emerald-500 rounded-full" />
                </div>
                <span className="text-sm font-bold text-emerald-600">92%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video demo section */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-950 py-20 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 50%, #6366f1 0%, transparent 50%)" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">See it in action</span>
          <h2 className="text-3xl font-extrabold mt-2 mb-4">Watch how CareerLinks works</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            From profile creation to landing an interview — see the entire journey in under 2 minutes.
          </p>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 cursor-pointer group" onClick={() => setShowVideo(true)}>
            <img
              src={img("/images/cta-candidate.png")}
              alt="Platform demo preview"
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-blue-600 fill-blue-600 ml-1" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <p className="text-white text-xs font-medium">▶ Platform Demo · 1:47</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Success Stories</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">What our users say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-7">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={img(t.photo)}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* For companies & admin */}
      <section className="bg-slate-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Platform Access</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Built for every stakeholder</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Candidate */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img src={img("/images/cta-candidate.png")} alt="Candidate" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Candidates</h3>
                <ul className="space-y-2 mb-5">
                  {["Auto-generate your resume", "Apply to verified companies", "Track your application status", "Get interview invitations"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <Link href="/candidate/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl" data-testid="button-register-candidate">
                    Create Free Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Company */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Companies</h3>
                <ul className="space-y-2 mb-5">
                  {["Search by skills & qualification", "View auto-generated resumes", "Post job openings", "Invite candidates directly"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <Link href="/company/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl" data-testid="button-register-company">
                    Register Company
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-gray-900 text-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Admin Dashboard</h3>
                <ul className="space-y-2 mb-5">
                  {["Approve candidates & companies", "Platform-wide analytics", "Manage subscriptions", "Remove fake profiles"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-300 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <Link href="/admin/login">
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-semibold" data-testid="button-admin-access">
                    Admin Access
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to find your next opportunity?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join 10,000+ professionals already using CareerLinks.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/candidate/register">
              <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3 h-auto rounded-xl text-base shadow-lg">
                Create Resume — It's Free
              </Button>
            </Link>
            <Link href="/company/register">
              <Button variant="outline" className="border-white/40 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 h-auto rounded-xl text-base">
                Hire Candidates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-white font-bold text-xl">CareerLinks</span>
            <p className="text-sm mt-1">Smart Resume &amp; Hiring Platform</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link>
            <Link href="/candidate/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/company/register" className="hover:text-white transition-colors">For Companies</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin</Link>
          </div>
          <p className="text-sm">&copy; 2026 CareerLinks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
