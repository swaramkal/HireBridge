import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListJobs,
  useCreateJob,
  useListCandidates,
  useCreateApplication,
  getListJobsQueryKey,
  getListApplicationsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Briefcase,
  Users,
  PlusCircle,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Code2,
  FileUser,
  CalendarCheck,
  Search,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const jobSchema = z.object({
  title: z.string().min(2, "Job title required"),
  skills: z.string().min(2, "Skills required"),
  type: z.enum(["IT", "NonIT"]),
  description: z.string().min(10, "Description required"),
  location: z.string().optional(),
  salary: z.string().optional(),
});
type JobFormValues = z.infer<typeof jobSchema>;

type Candidate = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  qualification: string;
  skills: string;
  objective?: string | null;
  status: string;
};

function ResumeCard({
  candidate,
  onInvite,
  inviting,
  invited,
}: {
  candidate: Candidate;
  onInvite: (c: Candidate) => void;
  inviting: boolean;
  invited: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow" data-testid={`card-resume-${candidate.id}`}>
      <CardContent className="p-0">
        {/* Header strip */}
        <div className="flex items-start gap-4 p-5">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {candidate.fullName.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{candidate.fullName}</h3>
                <p className="text-sm text-blue-600 font-medium mt-0.5">{candidate.qualification}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 rounded-lg"
                  onClick={() => setExpanded(!expanded)}
                  data-testid={`button-view-resume-${candidate.id}`}
                >
                  <FileUser className="h-3.5 w-3.5 mr-1" />
                  {expanded ? "Hide Resume" : "View Resume"}
                </Button>
                {invited ? (
                  <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Invited
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg gap-1.5"
                    onClick={() => onInvite(candidate)}
                    disabled={inviting}
                    data-testid={`button-invite-${candidate.id}`}
                  >
                    <CalendarCheck className="h-3.5 w-3.5" />
                    {inviting ? "Sending..." : "Call to Interview"}
                  </Button>
                )}
              </div>
            </div>

            {/* Quick info row */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {candidate.location}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {candidate.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {candidate.email}
              </span>
            </div>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {candidate.skills.split(",").map((s) => (
                <span
                  key={s}
                  className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-blue-100"
                >
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded resume */}
        {expanded && (
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 rounded-b-xl">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Personal Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-500 w-24">Full Name</span>
                      <span className="font-semibold text-gray-800">{candidate.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-500 w-24">Mobile</span>
                      <a href={`tel:${candidate.phone}`} className="font-semibold text-blue-600 hover:underline">
                        {candidate.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-500 w-24">Email</span>
                      <a href={`mailto:${candidate.email}`} className="font-semibold text-blue-600 hover:underline truncate">
                        {candidate.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-500 w-24">Location</span>
                      <span className="font-semibold text-gray-800">{candidate.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-500 w-24">Qualification</span>
                      <span className="font-semibold text-gray-800">{candidate.qualification}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    <span className="flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" />Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.split(",").map((s) => (
                      <span
                        key={s}
                        className="bg-white border border-blue-200 text-blue-700 text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {candidate.objective && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Career Objective</h4>
                    <p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                      {candidate.objective}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action footer */}
            <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Contact directly: <a href={`tel:${candidate.phone}`} className="text-blue-600 font-medium hover:underline">{candidate.phone}</a>
              </p>
              {!invited && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm gap-2"
                  onClick={() => onInvite(candidate)}
                  disabled={inviting}
                  data-testid={`button-invite-expanded-${candidate.id}`}
                >
                  <CalendarCheck className="h-4 w-4" />
                  {inviting ? "Sending Interview Invite..." : "Call to Interview"}
                </Button>
              )}
              {invited && (
                <div className="flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-700 font-semibold px-4 py-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Interview Invitation Sent
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CompanyDashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"resumes" | "post-job">("resumes");
  const [skillSearch, setSkillSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "IT" | "NonIT">("");
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [invitingId, setInvitingId] = useState<number | null>(null);
  const [invitedIds, setInvitedIds] = useState<Set<number>>(new Set());

  const { data: allCandidates, isLoading: candidatesLoading } = useListCandidates();
  const { data: jobs, isLoading: jobsLoading } = useListJobs({ companyId: 1 });
  const createJob = useCreateJob();
  const createApplication = useCreateApplication();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: { title: "", skills: "", type: "IT", description: "", location: "", salary: "" },
  });

  const approvedCandidates = (allCandidates ?? [])
    .filter((c) => c.status === "approved")
    .filter((c) => {
      const q = skillSearch.toLowerCase();
      if (!q) return true;
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.skills.toLowerCase().includes(q) ||
        c.qualification.toLowerCase().includes(q)
      );
    });

  function handleInvite(candidate: Candidate) {
    setInvitingId(candidate.id);
    createApplication.mutate(
      { data: { candidateId: candidate.id, jobId: jobs?.[0]?.id ?? 1 } },
      {
        onSuccess: () => {
          setInvitedIds((prev) => new Set(prev).add(candidate.id));
          queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
          toast({
            title: "Interview invitation sent!",
            description: `${candidate.fullName} has been called for an interview. Their contact: ${candidate.phone}`,
          });
        },
        onError: () => {
          toast({
            title: "Already invited",
            description: `${candidate.fullName} may already have an application. Contact them directly at ${candidate.phone}`,
          });
          setInvitedIds((prev) => new Set(prev).add(candidate.id));
        },
        onSettled: () => setInvitingId(null),
      }
    );
  }

  function onSubmitJob(values: JobFormValues) {
    createJob.mutate(
      { data: { ...values, companyId: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
          toast({ title: "Job posted successfully!" });
          setJobDialogOpen(false);
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Could not post job.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">HireBridge</h1>
          <p className="text-xs text-gray-400 mt-1">Company Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setTab("resumes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
              tab === "resumes"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            data-testid="nav-resumes"
          >
            <Users className="h-4 w-4" />
            <div className="text-left">
              <div>Candidate Resumes</div>
              <div className={`text-xs mt-0.5 ${tab === "resumes" ? "text-blue-200" : "text-gray-500"}`}>
                Browse &amp; invite to interview
              </div>
            </div>
          </button>
          <button
            onClick={() => setTab("post-job")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
              tab === "post-job"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            data-testid="nav-post-job"
          >
            <Briefcase className="h-4 w-4" />
            <div className="text-left">
              <div>Post a Job</div>
              <div className={`text-xs mt-0.5 ${tab === "post-job" ? "text-blue-200" : "text-gray-500"}`}>
                Publish job openings
              </div>
            </div>
          </button>
        </nav>

        {/* Stats pill in sidebar */}
        <div className="p-4 space-y-2">
          <div className="bg-gray-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{approvedCandidates.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Available Candidates</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{jobs?.length ?? 0}</p>
            <p className="text-xs text-gray-400 mt-0.5">Active Job Posts</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <Link href="/">
            <div className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">← Logout</div>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* ─── RESUMES TAB ─── */}
        {tab === "resumes" && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Candidate Resumes</h2>
              <p className="text-gray-500 text-sm mt-1">
                Browse verified candidate profiles, view their full resume, and call them for an interview.
              </p>
            </div>

            {/* Search + filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, skill, or qualification..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="pl-9"
                  data-testid="input-resume-search"
                />
              </div>
            </div>

            {/* Candidate list */}
            {candidatesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : approvedCandidates.length === 0 ? (
              <div className="text-center py-20">
                <Users className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500">No candidates found</h3>
                <p className="text-gray-400 text-sm mt-1">Try changing your search</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedCandidates.map((candidate) => (
                  <ResumeCard
                    key={candidate.id}
                    candidate={candidate}
                    onInvite={handleInvite}
                    inviting={invitingId === candidate.id}
                    invited={invitedIds.has(candidate.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── POST JOB TAB ─── */}
        {tab === "post-job" && (
          <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
                <p className="text-gray-500 text-sm mt-1">Publish job openings for candidates to apply</p>
              </div>
              <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2"
                    data-testid="button-post-job"
                  >
                    <PlusCircle className="h-4 w-4" />
                    New Job Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Post a New Job</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitJob)} className="space-y-4 mt-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Senior React Developer" {...field} data-testid="input-job-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Required Skills</FormLabel>
                              <FormControl>
                                <Input placeholder="React, TypeScript" {...field} data-testid="input-job-skills" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-job-type">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="IT">IT</SelectItem>
                                  <SelectItem value="NonIT">NonIT</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location (optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Bangalore, India" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="salary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salary (optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="8-12 LPA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the role, responsibilities, and requirements..."
                                className="h-28 resize-none"
                                {...field}
                                data-testid="textarea-job-desc"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-semibold"
                        disabled={createJob.isPending}
                        data-testid="button-submit-job"
                      >
                        {createJob.isPending ? "Posting..." : "Publish Job Post"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Existing job posts */}
            {jobsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
              </div>
            ) : !jobs?.length ? (
              <div className="text-center py-20">
                <Briefcase className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500">No jobs posted yet</h3>
                <p className="text-gray-400 text-sm mt-2">Click "New Job Post" to publish your first opening</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="border-0 shadow-sm" data-testid={`card-job-${job.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-gray-900 text-base">{job.title}</h3>
                            <Badge
                              variant={job.type === "IT" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {job.type}
                            </Badge>
                          </div>
                          <div className="flex items-center flex-wrap gap-4 mt-2 text-sm text-gray-500">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location}
                              </span>
                            )}
                            {job.salary && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5" />
                                {job.salary}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {job.skills.split(",").map((s) => (
                              <span
                                key={s}
                                className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium border border-blue-100"
                              >
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-3 leading-relaxed">{job.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
                          <span className="inline-block mt-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
                            Live
                          </span>
                        </div>
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
