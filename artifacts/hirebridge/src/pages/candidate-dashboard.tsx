import { Link } from "wouter";
import {
  useGetCandidateStats,
  useListCandidates,
  useListApplications,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle2, XCircle, FileText, Briefcase } from "lucide-react";

function StatCard({ label, value, icon, color }: { label: string; value?: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {value === undefined ? (
            <Skeleton className="h-7 w-12 mt-1" />
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
    pending: "bg-yellow-100 text-yellow-700",
    reviewed: "bg-blue-100 text-blue-700",
    accepted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

export default function CandidateDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetCandidateStats();
  const { data: candidates, isLoading: candidatesLoading } = useListCandidates();
  const { data: applications, isLoading: appsLoading } = useListApplications({ candidateId: 1 });

  const myProfile = candidates?.[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar layout */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-60 bg-gray-900 text-white flex flex-col hidden md:flex">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-xl font-bold text-blue-400">HireBridge</h1>
            <p className="text-xs text-gray-400 mt-1">Candidate Portal</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {[
              { label: "Dashboard", icon: <FileText className="h-4 w-4" />, href: "/candidate/dashboard" },
              { label: "Browse Jobs", icon: <Briefcase className="h-4 w-4" />, href: "/jobs" },
              { label: "My Profile", icon: <Users className="h-4 w-4" />, href: "/candidate/register" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm text-gray-300 hover:text-white cursor-pointer">
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <Link href="/">
              <div className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">Logout</div>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back{myProfile ? `, ${myProfile.fullName.split(" ")[0]}` : ""}
              </h2>
              <p className="text-gray-500 mt-1 text-sm">Here's what's happening with your profile</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Candidates"
                value={stats?.total}
                icon={<Users className="h-5 w-5 text-blue-600" />}
                color="bg-blue-50"
              />
              <StatCard
                label="Pending Review"
                value={stats?.pending}
                icon={<Clock className="h-5 w-5 text-yellow-600" />}
                color="bg-yellow-50"
              />
              <StatCard
                label="Approved"
                value={stats?.approved}
                icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                color="bg-emerald-50"
              />
              <StatCard
                label="Rejected"
                value={stats?.rejected}
                icon={<XCircle className="h-5 w-5 text-red-500" />}
                color="bg-red-50"
              />
            </div>

            {/* Profile card */}
            {candidatesLoading ? (
              <Card className="border-0 shadow-sm mb-6">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ) : myProfile ? (
              <Card className="border-0 shadow-sm mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">My Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                      {myProfile.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>{" "}
                        <span className="font-medium text-gray-900">{myProfile.fullName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>{" "}
                        <span className="font-medium text-gray-900">{myProfile.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>{" "}
                        <span className="font-medium text-gray-900">{myProfile.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Qualification:</span>{" "}
                        <span className="font-medium text-gray-900">{myProfile.qualification}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-500">Skills:</span>{" "}
                        <span className="font-medium text-gray-900">{myProfile.skills}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>{" "}
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(myProfile.status)}`}>
                          {myProfile.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm mb-6">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-600">No profile yet</h3>
                  <p className="text-gray-400 text-sm mt-1">Create your candidate profile to get discovered</p>
                  <Link href="/candidate/register">
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl" data-testid="button-create-profile">
                      Create Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Applications */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Applications</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                {appsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : !applications?.length ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No applications yet</p>
                    <Link href="/jobs">
                      <Button variant="outline" size="sm" className="mt-3" data-testid="button-browse-jobs">Browse Jobs</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0" data-testid={`row-application-${app.id}`}>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{app.jobTitle ?? "Untitled Job"}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{app.companyName ?? "Unknown Company"}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
