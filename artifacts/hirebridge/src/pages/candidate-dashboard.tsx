import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListCandidates,
  useListCompanies,
  useListJobs,
  useListApplications,
  useCreateApplication,
  getListApplicationsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Briefcase,
  Send,
  CheckCircle2,
  MapPin,
  DollarSign,
  Globe,
  FileText,
  Users,
  ClipboardList,
  Search,
  ArrowRight,
  Clock,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DEMO_CANDIDATE_ID = 1;

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    reviewed: "bg-blue-100 text-blue-700 border border-blue-200",
    accepted: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    rejected: "bg-red-100 text-red-700 border border-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: "Request Sent",
    reviewed: "Under Review",
    accepted: "Interview Invited",
    rejected: "Not Selected",
  };
  return map[status] ?? status;
}

export default function CandidateDashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"companies" | "jobs" | "requests">("companies");
  const [search, setSearch] = useState("");
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const { data: candidates } = useListCandidates();
  const { data: companies, isLoading: companiesLoading } = useListCompanies();
  const { data: jobs, isLoading: jobsLoading } = useListJobs();
  const { data: myRequests, isLoading: requestsLoading } = useListApplications({ candidateId: DEMO_CANDIDATE_ID });
  const createApplication = useCreateApplication();

  const myProfile = candidates?.[0];

  const approvedCompanies = (companies ?? []).filter((c) => c.status === "approved");
  const allJobs = jobs ?? [];

  const filteredCompanies = approvedCompanies.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
  });

  const filteredJobs = allJobs.filter((j) => {
    const q = search.toLowerCase();
    return !q || j.title.toLowerCase().includes(q) || j.skills.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q);
  });

  function sendRequest(jobId: number, key: string, label: string) {
    setSendingId(jobId);
    createApplication.mutate(
      { data: { candidateId: DEMO_CANDIDATE_ID, jobId } },
      {
        onSuccess: () => {
          setSentIds((prev) => new Set(prev).add(key));
          queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey({ candidateId: DEMO_CANDIDATE_ID }) });
          queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
          toast({ title: "Request sent!", description: `Your application to ${label} has been submitted.` });
        },
        onError: () => {
          setSentIds((prev) => new Set(prev).add(key));
          toast({ title: "Already applied", description: `You've already sent a request to ${label}.` });
        },
        onSettled: () => setSendingId(null),
      }
    );
  }

  function applyToJob(jobId: number, jobTitle: string) {
    const key = `job-${jobId}`;
    sendRequest(jobId, key, jobTitle);
  }

  function applyToCompany(companyId: number, companyName: string) {
    const key = `company-${companyId}`;
    const companyJob = allJobs.find((j) => j.companyId === companyId) ?? allJobs[0];
    if (!companyJob) {
      toast({ title: "No jobs available", description: "This company has no active openings right now." });
      return;
    }
    sendRequest(companyJob.id, key, companyName);
  }

  const navItems = [
    { key: "companies", label: "Companies", sub: "Browse & send requests", icon: <Building2 className="h-4 w-4" /> },
    { key: "jobs", label: "Job Posts", sub: "All active openings", icon: <Briefcase className="h-4 w-4" /> },
    { key: "requests", label: "My Requests", sub: "Track sent applications", icon: <ClipboardList className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">CareerLinks</h1>
          <p className="text-xs text-gray-400 mt-1">Candidate Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setTab(item.key as typeof tab); setSearch(""); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                tab === item.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              data-testid={`nav-${item.key}`}
            >
              {item.icon}
              <div className="text-left">
                <div className="flex items-center gap-2">
                  {item.label}
                  {item.key === "requests" && (myRequests?.length ?? 0) > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold leading-none">
                      {myRequests!.length}
                    </span>
                  )}
                </div>
                <div className={`text-xs mt-0.5 ${tab === item.key ? "text-blue-200" : "text-gray-500"}`}>
                  {item.sub}
                </div>
              </div>
            </button>
          ))}
        </nav>

        {/* Profile snippet */}
        {myProfile && (
          <div className="mx-4 mb-4 bg-gray-800 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {myProfile.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{myProfile.fullName}</p>
                <p className="text-xs text-gray-400 truncate">{myProfile.qualification}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(myProfile.status)}`}>
                {myProfile.status}
              </span>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-700">
          <Link href="/">
            <div className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">← Logout</div>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">

        {/* ── COMPANIES TAB ── */}
        {tab === "companies" && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Browse Companies</h2>
              <p className="text-gray-500 text-sm mt-1">
                Explore verified companies and send them a direct request to consider your profile.
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-sm mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by company name or industry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-company-search"
              />
            </div>

            {companiesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-400">No companies found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCompanies.map((company) => {
                  const key = `company-${company.id}`;
                  const sent = sentIds.has(key);
                  const isSending = sendingId !== null && !sent;
                  const companyJobs = allJobs.filter((j) => j.companyId === company.id);

                  return (
                    <Card key={company.id} className="border-0 shadow-sm hover:shadow-md transition-shadow" data-testid={`card-company-${company.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-5">
                          {/* Logo placeholder */}
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {company.name.charAt(0)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-bold text-gray-900 text-base">{company.name}</h3>
                                <p className="text-sm text-emerald-600 font-medium mt-0.5">{company.industry}</p>
                              </div>
                              {sent ? (
                                <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 flex-shrink-0">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Request Sent
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg gap-1.5 flex-shrink-0"
                                  onClick={() => applyToCompany(company.id, company.name)}
                                  disabled={sendingId !== null}
                                  data-testid={`button-request-${company.id}`}
                                >
                                  <Send className="h-3.5 w-3.5" />
                                  {isSending && sendingId === company.id ? "Sending..." : "Send Request"}
                                </Button>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">{company.description}</p>

                            <div className="flex flex-wrap items-center gap-4 mt-3">
                              {company.website && (
                                <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                  <Globe className="h-3.5 w-3.5" />
                                  {company.website.replace(/https?:\/\//, "")}
                                </a>
                              )}
                              {companyJobs.length > 0 && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Briefcase className="h-3.5 w-3.5" />
                                  {companyJobs.length} open position{companyJobs.length !== 1 ? "s" : ""}
                                </span>
                              )}
                              <Badge variant="outline" className="text-xs font-medium text-emerald-700 border-emerald-200 bg-emerald-50">
                                Verified
                              </Badge>
                            </div>

                            {/* Active jobs from this company */}
                            {companyJobs.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Open Positions</p>
                                <div className="flex flex-wrap gap-2">
                                  {companyJobs.map((job) => {
                                    const jobKey = `job-${job.id}`;
                                    const jobSent = sentIds.has(jobKey);
                                    return (
                                      <div key={job.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                                        <span className="text-xs font-medium text-gray-700">{job.title}</span>
                                        {job.salary && <span className="text-xs text-gray-400">{job.salary}</span>}
                                        {jobSent ? (
                                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                                            <CheckCircle2 className="h-3 w-3" /> Applied
                                          </span>
                                        ) : (
                                          <button
                                            onClick={() => applyToJob(job.id, job.title)}
                                            disabled={sendingId !== null}
                                            className="text-xs text-blue-600 font-semibold hover:underline disabled:opacity-50"
                                            data-testid={`button-apply-job-${job.id}`}
                                          >
                                            Apply →
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── JOBS TAB ── */}
        {tab === "jobs" && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Job Posts</h2>
              <p className="text-gray-500 text-sm mt-1">
                Browse all active job openings and apply directly.
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-sm mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by title, skill, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-job-search"
              />
            </div>

            {jobsLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-5 space-y-3">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-8 w-28" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20">
                <Briefcase className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-400">No jobs found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredJobs.map((job) => {
                  const key = `job-${job.id}`;
                  const sent = sentIds.has(key);
                  return (
                    <Card key={job.id} className="border-0 shadow-sm hover:shadow-md transition-shadow" data-testid={`card-job-${job.id}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900">{job.title}</h3>
                            <p className="text-sm text-blue-600 font-medium mt-0.5">{job.companyName}</p>
                          </div>
                          <Badge variant={job.type === "IT" ? "default" : "secondary"} className="text-xs flex-shrink-0">
                            {job.type}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />{job.location}
                            </span>
                          )}
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />{job.salary}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {job.skills.split(",").slice(0, 4).map((s) => (
                            <span key={s} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-blue-100">
                              {s.trim()}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{job.description}</p>

                        {sent ? (
                          <div className="flex items-center gap-1.5 text-sm text-emerald-700 font-semibold bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="h-4 w-4" />
                            Application Sent
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm gap-2"
                            onClick={() => applyToJob(job.id, job.title)}
                            disabled={sendingId !== null}
                            data-testid={`button-apply-${job.id}`}
                          >
                            <Send className="h-3.5 w-3.5" />
                            {sendingId === job.id ? "Sending..." : "Apply Now"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── REQUESTS TAB ── */}
        {tab === "requests" && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Requests</h2>
              <p className="text-gray-500 text-sm mt-1">
                Track all the applications and requests you have sent to companies.
              </p>
            </div>

            {requestsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : !myRequests?.length ? (
              <div className="text-center py-20">
                <ClipboardList className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400">No requests yet</h3>
                <p className="text-gray-400 text-sm mt-1">Go to Companies or Jobs and send your first request</p>
                <div className="flex gap-3 justify-center mt-5">
                  <Button
                    variant="outline"
                    className="rounded-xl gap-2"
                    onClick={() => setTab("companies")}
                    data-testid="button-go-companies"
                  >
                    <Building2 className="h-4 w-4" /> Browse Companies
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2"
                    onClick={() => setTab("jobs")}
                    data-testid="button-go-jobs"
                  >
                    <Briefcase className="h-4 w-4" /> Browse Jobs
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.map((req) => (
                  <Card key={req.id} className="border-0 shadow-sm" data-testid={`card-request-${req.id}`}>
                    <CardContent className="p-5 flex items-center gap-5">
                      {/* Company avatar */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {(req.companyName ?? "C").charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{req.companyName ?? "Unknown Company"}</p>
                        <p className="text-sm text-gray-500 mt-0.5 truncate">
                          Position: <span className="text-gray-700 font-medium">{req.jobTitle ?? "General Request"}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Sent {new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <span className={`inline-block text-xs px-3 py-1.5 rounded-full font-semibold ${statusBadge(req.status)}`}>
                          {statusLabel(req.status)}
                        </span>
                        {req.status === "accepted" && (
                          <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1 justify-end font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> You've been invited!
                          </p>
                        )}
                        {req.status === "pending" && (
                          <p className="text-xs text-yellow-600 mt-1.5 flex items-center gap-1 justify-end">
                            <Clock className="h-3.5 w-3.5" /> Awaiting response
                          </p>
                        )}
                        {req.status === "rejected" && (
                          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 justify-end">
                            <XCircle className="h-3.5 w-3.5" /> Not shortlisted
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
