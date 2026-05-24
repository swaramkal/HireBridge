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
  useListApplications,
  getListJobsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Users, ClipboardList, PlusCircle, MapPin } from "lucide-react";
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

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    reviewed: "bg-blue-100 text-blue-700",
    accepted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    approved: "bg-emerald-100 text-emerald-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

export default function CompanyDashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"jobs" | "candidates" | "applications">("jobs");
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");

  const { data: jobs, isLoading: jobsLoading } = useListJobs({ companyId: 1 });
  const { data: allCandidates, isLoading: candidatesLoading } = useListCandidates({ skills: skillSearch || undefined });
  const { data: applications, isLoading: appsLoading } = useListApplications();
  const createJob = useCreateJob();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: { title: "", skills: "", type: "IT", description: "", location: "", salary: "" },
  });

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
      <aside className="w-60 bg-gray-900 text-white flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">HireBridge</h1>
          <p className="text-xs text-gray-400 mt-1">Company Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: "Jobs", icon: <Briefcase className="h-4 w-4" />, key: "jobs" },
            { label: "Candidates", icon: <Users className="h-4 w-4" />, key: "candidates" },
            { label: "Applications", icon: <ClipboardList className="h-4 w-4" />, key: "applications" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as typeof tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                tab === item.key ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              data-testid={`nav-${item.key}`}
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Company Dashboard</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your postings and find the best candidates</p>
            </div>
            {tab === "jobs" && (
              <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2" data-testid="button-post-job">
                    <PlusCircle className="h-4 w-4" />
                    Post a Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Post a New Job</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitJob)} className="space-y-4 mt-2">
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl><Input placeholder="Senior React Developer" {...field} data-testid="input-job-title" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="skills" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Required Skills</FormLabel>
                            <FormControl><Input placeholder="React, TypeScript" {...field} data-testid="input-job-skills" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="type" render={({ field }) => (
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
                        )} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="location" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location (optional)</FormLabel>
                            <FormControl><Input placeholder="Bangalore, India" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="salary" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Salary (optional)</FormLabel>
                            <FormControl><Input placeholder="8-12 LPA" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe the role, responsibilities, and requirements..." className="h-24 resize-none" {...field} data-testid="textarea-job-desc" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl" disabled={createJob.isPending} data-testid="button-submit-job">
                        {createJob.isPending ? "Posting..." : "Post Job"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Jobs tab */}
          {tab === "jobs" && (
            <div className="space-y-4">
              {jobsLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
              ) : !jobs?.length ? (
                <div className="text-center py-16">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No jobs posted yet</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <Card key={job.id} className="border-0 shadow-sm" data-testid={`card-job-${job.id}`}>
                    <CardContent className="p-5 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{job.title}</h3>
                          <Badge variant={job.type === "IT" ? "default" : "secondary"} className="text-xs">{job.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                          {job.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>}
                          {job.salary && <span>{job.salary}</span>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.skills.split(",").slice(0, 4).map((s) => (
                            <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s.trim()}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Candidates tab */}
          {tab === "candidates" && (
            <div>
              <div className="mb-4">
                <Input
                  placeholder="Search candidates by skill..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="max-w-sm"
                  data-testid="input-candidate-search"
                />
              </div>
              {candidatesLoading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : !allCandidates?.length ? (
                <div className="text-center py-16">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No candidates found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allCandidates.filter(c => c.status === "approved").map((candidate) => (
                    <Card key={candidate.id} className="border-0 shadow-sm" data-testid={`card-candidate-${candidate.id}`}>
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {candidate.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{candidate.fullName}</p>
                            <p className="text-sm text-gray-500">{candidate.location} • {candidate.qualification}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {candidate.skills.split(",").slice(0, 3).map((s) => (
                                <span key={s} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{s.trim()}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Applications tab */}
          {tab === "applications" && (
            <div className="space-y-3">
              {appsLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              ) : !applications?.length ? (
                <div className="text-center py-16">
                  <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No applications yet</p>
                </div>
              ) : (
                applications.map((app) => (
                  <Card key={app.id} className="border-0 shadow-sm" data-testid={`card-application-${app.id}`}>
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{app.candidateName ?? "Candidate"}</p>
                        <p className="text-sm text-gray-500">Applied for: {app.jobTitle ?? "Job"}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(app.status)}`}>
                        {app.status}
                      </span>
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
