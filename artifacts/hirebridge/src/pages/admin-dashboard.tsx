import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAdminStats,
  useListCandidates,
  useListCompanies,
  useListJobs,
  useUpdateCandidateStatus,
  useUpdateCompanyStatus,
  getListCandidatesQueryKey,
  getListCompaniesQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Building2,
  Briefcase,
  ClipboardList,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function StatTile({ label, value, icon, color }: { label: string; value?: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
          {value === undefined ? (
            <Skeleton className="h-7 w-10 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    rejected: "bg-red-100 text-red-700 border border-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"overview" | "candidates" | "companies" | "jobs">("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: candidates, isLoading: candidatesLoading } = useListCandidates();
  const { data: companies, isLoading: companiesLoading } = useListCompanies();
  const { data: jobs, isLoading: jobsLoading } = useListJobs();

  const updateCandidateStatus = useUpdateCandidateStatus();
  const updateCompanyStatus = useUpdateCompanyStatus();

  function handleCandidateStatus(id: number, status: "approved" | "rejected") {
    updateCandidateStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCandidatesQueryKey() });
          toast({ title: `Candidate ${status}` });
        },
      }
    );
  }

  function handleCompanyStatus(id: number, status: "approved" | "rejected") {
    updateCompanyStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
          toast({ title: `Company ${status}` });
        },
      }
    );
  }

  const navItems = [
    { key: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: "candidates", label: "Candidates", icon: <Users className="h-4 w-4" /> },
    { key: "companies", label: "Companies", icon: <Building2 className="h-4 w-4" /> },
    { key: "jobs", label: "Jobs", icon: <Briefcase className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white">CareerLinks</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as typeof tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                tab === item.key ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              data-testid={`nav-admin-${item.key}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link href="/">
            <div className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Logout</div>
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">Review and manage all platform activity</p>
          </div>

          {/* Overview */}
          {tab === "overview" && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <StatTile label="Total Candidates" value={stats?.totalCandidates} icon={<Users className="h-5 w-5 text-blue-600" />} color="bg-blue-50" />
                <StatTile label="Pending Candidates" value={stats?.pendingCandidates} icon={<ClipboardList className="h-5 w-5 text-yellow-600" />} color="bg-yellow-50" />
                <StatTile label="Total Companies" value={stats?.totalCompanies} icon={<Building2 className="h-5 w-5 text-emerald-600" />} color="bg-emerald-50" />
                <StatTile label="Pending Companies" value={stats?.pendingCompanies} icon={<ClipboardList className="h-5 w-5 text-orange-500" />} color="bg-orange-50" />
                <StatTile label="Total Jobs" value={stats?.totalJobs} icon={<Briefcase className="h-5 w-5 text-indigo-600" />} color="bg-indigo-50" />
                <StatTile label="Total Applications" value={stats?.totalApplications} icon={<ClipboardList className="h-5 w-5 text-purple-600" />} color="bg-purple-50" />
              </div>

              {/* Pending quick-review */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pending Candidates</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    {candidatesLoading ? (
                      <Skeleton className="h-12 w-full" />
                    ) : (
                      candidates?.filter(c => c.status === "pending").slice(0, 3).map((c) => (
                        <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{c.fullName}</p>
                            <p className="text-xs text-gray-500">{c.skills.split(",")[0]?.trim()}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleCandidateStatus(c.id, "approved")}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                              data-testid={`button-approve-candidate-${c.id}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCandidateStatus(c.id, "rejected")}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                              data-testid={`button-reject-candidate-${c.id}`}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                    <button onClick={() => setTab("candidates")} className="text-xs text-blue-600 hover:underline mt-2">
                      View all candidates
                    </button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pending Companies</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    {companiesLoading ? (
                      <Skeleton className="h-12 w-full" />
                    ) : (
                      companies?.filter(c => c.status === "pending").slice(0, 3).map((c) => (
                        <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.industry}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleCompanyStatus(c.id, "approved")}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                              data-testid={`button-approve-company-${c.id}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCompanyStatus(c.id, "rejected")}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                              data-testid={`button-reject-company-${c.id}`}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                    <button onClick={() => setTab("companies")} className="text-xs text-blue-600 hover:underline mt-2">
                      View all companies
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Candidates tab */}
          {tab === "candidates" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">{candidates?.length ?? 0} total candidates</p>
              {candidatesLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
              ) : (
                candidates?.map((c) => (
                  <Card key={c.id} className="border-0 shadow-sm" data-testid={`card-admin-candidate-${c.id}`}>
                    <CardContent className="p-5 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {c.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{c.fullName}</p>
                          <p className="text-sm text-gray-500">{c.email} • {c.location}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{c.qualification} | {c.skills}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(c.status)}`}>
                          {c.status}
                        </span>
                        {c.status === "pending" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleCandidateStatus(c.id, "approved")}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                              data-testid={`button-approve-candidate-${c.id}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCandidateStatus(c.id, "rejected")}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500"
                              data-testid={`button-reject-candidate-${c.id}`}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Companies tab */}
          {tab === "companies" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">{companies?.length ?? 0} total companies</p>
              {companiesLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
              ) : (
                companies?.map((c) => (
                  <Card key={c.id} className="border-0 shadow-sm" data-testid={`card-admin-company-${c.id}`}>
                    <CardContent className="p-5 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{c.name}</p>
                        <p className="text-sm text-gray-500">{c.email} • {c.industry}</p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-md truncate">{c.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(c.status)}`}>
                          {c.status}
                        </span>
                        {c.status === "pending" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleCompanyStatus(c.id, "approved")}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                              data-testid={`button-approve-company-${c.id}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCompanyStatus(c.id, "rejected")}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500"
                              data-testid={`button-reject-company-${c.id}`}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Jobs tab */}
          {tab === "jobs" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">{jobs?.length ?? 0} total jobs</p>
              {jobsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              ) : (
                jobs?.map((j) => (
                  <Card key={j.id} className="border-0 shadow-sm" data-testid={`card-admin-job-${j.id}`}>
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{j.title}</p>
                          <Badge variant={j.type === "IT" ? "default" : "secondary"} className="text-xs">{j.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{j.companyName} {j.location ? `• ${j.location}` : ""}</p>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(j.createdAt).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
