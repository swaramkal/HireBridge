import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, jobsTable, companiesTable } from "@workspace/db";
import {
  ListJobsQueryParams,
  CreateJobBody,
  GetJobParams,
  GetJobResponse,
  UpdateJobParams,
  UpdateJobBody,
  UpdateJobResponse,
  DeleteJobParams,
  ListJobsResponse,
} from "@workspace/api-zod";
import { emit } from "../lib/socket";

const router: IRouter = Router();

router.get("/jobs", async (req, res): Promise<void> => {
  const parsed = ListJobsQueryParams.safeParse(req.query);
  const rows = await db.select().from(jobsTable);

  let filtered = rows;
  if (parsed.success) {
    if (parsed.data.companyId) {
      filtered = filtered.filter((j) => j.companyId === parsed.data.companyId);
    }
    if (parsed.data.type) {
      filtered = filtered.filter((j) => j.type === parsed.data.type);
    }
    if (parsed.data.skills) {
      const search = parsed.data.skills.toLowerCase();
      filtered = filtered.filter((j) => j.skills.toLowerCase().includes(search));
    }
  }

  res.json(ListJobsResponse.parse(
    filtered.map((j) => ({ ...j, createdAt: j.createdAt.toISOString() }))
  ));
});

router.post("/jobs", async (req, res): Promise<void> => {
  const parsed = CreateJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let companyName = "Unknown Company";
  if (parsed.data.companyId) {
    const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, parsed.data.companyId));
    if (company) companyName = company.name;
  }

  const [job] = await db
    .insert(jobsTable)
    .values({ ...parsed.data, companyName })
    .returning();

  const serialized = { ...job, createdAt: job.createdAt.toISOString() };
  emit("job:created", serialized);

  res.status(201).json(GetJobResponse.parse(serialized));
});

router.get("/jobs/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id));
  if (!job) { res.status(404).json({ error: "Job not found" }); return; }

  res.json(GetJobResponse.parse({ ...job, createdAt: job.createdAt.toISOString() }));
});

router.patch("/jobs/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [job] = await db
    .update(jobsTable)
    .set(parsed.data)
    .where(eq(jobsTable.id, id))
    .returning();

  if (!job) { res.status(404).json({ error: "Job not found" }); return; }

  const serialized = { ...job, createdAt: job.createdAt.toISOString() };
  emit("job:updated", serialized);

  res.json(UpdateJobResponse.parse(serialized));
});

router.delete("/jobs/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [job] = await db.delete(jobsTable).where(eq(jobsTable.id, id)).returning();
  if (!job) { res.status(404).json({ error: "Job not found" }); return; }

  emit("job:deleted", { id });

  res.sendStatus(204);
});

export default router;
