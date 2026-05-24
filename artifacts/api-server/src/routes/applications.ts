import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, applicationsTable, candidatesTable, jobsTable } from "@workspace/db";
import {
  ListApplicationsQueryParams,
  CreateApplicationBody,
  UpdateApplicationParams,
  UpdateApplicationBody,
  UpdateApplicationResponse,
  ListApplicationsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/applications", async (req, res): Promise<void> => {
  const parsed = ListApplicationsQueryParams.safeParse(req.query);
  const rows = await db.select().from(applicationsTable);

  let filtered = rows;
  if (parsed.success) {
    if (parsed.data.candidateId) {
      filtered = filtered.filter((a) => a.candidateId === parsed.data.candidateId);
    }
    if (parsed.data.jobId) {
      filtered = filtered.filter((a) => a.jobId === parsed.data.jobId);
    }
    if (parsed.data.status) {
      filtered = filtered.filter((a) => a.status === parsed.data.status);
    }
  }

  res.json(ListApplicationsResponse.parse(
    filtered.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))
  ));
});

router.post("/applications", async (req, res): Promise<void> => {
  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { candidateId, jobId } = parsed.data;

  const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, candidateId));
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, jobId));

  const [application] = await db
    .insert(applicationsTable)
    .values({
      candidateId,
      jobId,
      candidateName: candidate?.fullName ?? null,
      jobTitle: job?.title ?? null,
      companyName: job?.companyName ?? null,
      status: "pending",
    })
    .returning();

  res.status(201).json({ ...application, createdAt: application.createdAt.toISOString() });
});

router.patch("/applications/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [application] = await db
    .update(applicationsTable)
    .set(parsed.data)
    .where(eq(applicationsTable.id, id))
    .returning();

  if (!application) { res.status(404).json({ error: "Application not found" }); return; }

  res.json(UpdateApplicationResponse.parse({ ...application, createdAt: application.createdAt.toISOString() }));
});

export default router;
