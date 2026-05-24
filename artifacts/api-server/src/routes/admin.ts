import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, candidatesTable, companiesTable, jobsTable, applicationsTable } from "@workspace/db";
import {
  UpdateCandidateStatusParams,
  UpdateCandidateStatusBody,
  UpdateCandidateStatusResponse,
  UpdateCompanyStatusParams,
  UpdateCompanyStatusBody,
  UpdateCompanyStatusResponse,
  GetAdminStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [candidates, companies, jobs, applications] = await Promise.all([
    db.select().from(candidatesTable),
    db.select().from(companiesTable),
    db.select().from(jobsTable),
    db.select().from(applicationsTable),
  ]);

  res.json(GetAdminStatsResponse.parse({
    totalCandidates: candidates.length,
    pendingCandidates: candidates.filter((c) => c.status === "pending").length,
    totalCompanies: companies.length,
    pendingCompanies: companies.filter((c) => c.status === "pending").length,
    totalJobs: jobs.length,
    totalApplications: applications.length,
  }));
});

router.patch("/admin/candidates/:id/status", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateCandidateStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [candidate] = await db
    .update(candidatesTable)
    .set({ status: parsed.data.status })
    .where(eq(candidatesTable.id, id))
    .returning();

  if (!candidate) { res.status(404).json({ error: "Candidate not found" }); return; }

  res.json(UpdateCandidateStatusResponse.parse({ ...candidate, createdAt: candidate.createdAt.toISOString() }));
});

router.patch("/admin/companies/:id/status", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateCompanyStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [company] = await db
    .update(companiesTable)
    .set({ status: parsed.data.status })
    .where(eq(companiesTable.id, id))
    .returning();

  if (!company) { res.status(404).json({ error: "Company not found" }); return; }

  res.json(UpdateCompanyStatusResponse.parse({ ...company, createdAt: company.createdAt.toISOString() }));
});

export default router;
