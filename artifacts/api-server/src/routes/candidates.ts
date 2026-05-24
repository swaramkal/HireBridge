import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, candidatesTable } from "@workspace/db";
import {
  ListCandidatesQueryParams,
  CreateCandidateBody,
  GetCandidateParams,
  GetCandidateResponse,
  UpdateCandidateParams,
  UpdateCandidateBody,
  UpdateCandidateResponse,
  ListCandidatesResponse,
  GetCandidateStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/candidates/stats", async (req, res): Promise<void> => {
  const all = await db.select().from(candidatesTable);
  const total = all.length;
  const pending = all.filter((c) => c.status === "pending").length;
  const approved = all.filter((c) => c.status === "approved").length;
  const rejected = all.filter((c) => c.status === "rejected").length;
  res.json(GetCandidateStatsResponse.parse({ total, pending, approved, rejected }));
});

router.get("/candidates", async (req, res): Promise<void> => {
  const parsed = ListCandidatesQueryParams.safeParse(req.query);
  let query = db.select().from(candidatesTable);
  const rows = await query;

  let filtered = rows;
  if (parsed.success && parsed.data.status) {
    filtered = filtered.filter((c) => c.status === parsed.data.status);
  }
  if (parsed.success && parsed.data.skills) {
    const search = parsed.data.skills.toLowerCase();
    filtered = filtered.filter((c) => c.skills.toLowerCase().includes(search));
  }

  res.json(ListCandidatesResponse.parse(
    filtered.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))
  ));
});

router.post("/candidates", async (req, res): Promise<void> => {
  const parsed = CreateCandidateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [candidate] = await db
    .insert(candidatesTable)
    .values({ ...parsed.data, status: "pending" })
    .returning();

  res.status(201).json(GetCandidateResponse.parse({ ...candidate, createdAt: candidate.createdAt.toISOString() }));
});

router.get("/candidates/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, id));
  if (!candidate) { res.status(404).json({ error: "Candidate not found" }); return; }

  res.json(GetCandidateResponse.parse({ ...candidate, createdAt: candidate.createdAt.toISOString() }));
});

router.patch("/candidates/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateCandidateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [candidate] = await db
    .update(candidatesTable)
    .set(parsed.data)
    .where(eq(candidatesTable.id, id))
    .returning();

  if (!candidate) { res.status(404).json({ error: "Candidate not found" }); return; }

  res.json(UpdateCandidateResponse.parse({ ...candidate, createdAt: candidate.createdAt.toISOString() }));
});

export default router;
