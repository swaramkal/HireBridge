import { useState } from "react";
import { Link } from "wouter";
import { useListJobs, useCreateApplication } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, DollarSign, Search, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "IT" | "NonIT">("");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [appliedJobId, setAppliedJobId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: jobs, isLoading } = useListJobs({ skills: search || undefined, type: typeFilter || undefined });
  const applyMutation = useCreateApplication();

  function handleApply(jobId: number) {
    setAppliedJobId(jobId);
    setApplyDialogOpen(true);
  }

  function confirmApply() {
    if (!appliedJobId) return;
    applyMutation.mutate(
      { data: { candidateId: 1, jobId: appliedJobId } },
      {
        onSuccess: () => {
          toast({ title: "Applied!", description: "Your application has been submitted." });
          setApplyDialogOpen(false);
        },
        onError: () => {
          toast({ title: "Error", description: "Could not apply. Try again.", variant: "destructive" });
        },
      }
    );
  }

  const filteredJobs = jobs?.filter((j) =>
    search ? j.skills.toLowerCase().includes(search.toLowerCase()) || j.title.toLowerCase().includes(search.toLowerCase()) : true
  ) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-700 tracking-tight">CareerLinks</Link>
          <div className="flex items-center gap-3">
            <Link href="/candidate/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/candidate/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Register</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
            <p className="text-gray-500 mt-1 text-sm">{isLoading ? "Loading..." : `${filteredJobs.length} jobs available`}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by skill or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64"
                data-testid="input-search"
              />
            </div>
            <div className="flex gap-2">
              {(["", "IT", "NonIT"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === t
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400"
                  }`}
                  data-testid={`filter-type-${t || "all"}`}
                >
                  {t === "" ? "All" : t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">No jobs found</h3>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className={`border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                  selectedJobId === job.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
                data-testid={`card-job-${job.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <p className="text-blue-600 text-sm font-medium mt-0.5">{job.companyName}</p>
                    </div>
                    <Badge variant={job.type === "IT" ? "default" : "secondary"} className="text-xs">
                      {job.type}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {job.location && (
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <DollarSign className="h-3.5 w-3.5" />
                        {job.salary}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skills.split(",").slice(0, 3).map((skill) => (
                      <span key={skill} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>

                  {selectedJobId === job.id && (
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{job.description}</p>
                  )}

                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    onClick={(e) => { e.stopPropagation(); handleApply(job.id); }}
                    data-testid={`button-apply-${job.id}`}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Application</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm">
            You're applying for this position as a candidate. Make sure your profile is complete to improve your chances.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={confirmApply}
              disabled={applyMutation.isPending}
              data-testid="button-confirm-apply"
            >
              {applyMutation.isPending ? "Applying..." : "Confirm Apply"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setApplyDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
