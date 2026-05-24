import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, companiesTable } from "@workspace/db";
import {
  ListCompaniesQueryParams,
  CreateCompanyBody,
  GetCompanyParams,
  GetCompanyResponse,
  UpdateCompanyParams,
  UpdateCompanyBody,
  UpdateCompanyResponse,
  ListCompaniesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/companies", async (req, res): Promise<void> => {
  const parsed = ListCompaniesQueryParams.safeParse(req.query);
  const rows = await db.select().from(companiesTable);

  let filtered = rows;
  if (parsed.success && parsed.data.status) {
    filtered = filtered.filter((c) => c.status === parsed.data.status);
  }

  res.json(ListCompaniesResponse.parse(
    filtered.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))
  ));
});

router.post("/companies", async (req, res): Promise<void> => {
  const parsed = CreateCompanyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [company] = await db
    .insert(companiesTable)
    .values({ ...parsed.data, status: "pending" })
    .returning();

  res.status(201).json(GetCompanyResponse.parse({ ...company, createdAt: company.createdAt.toISOString() }));
});

router.get("/companies/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
  if (!company) { res.status(404).json({ error: "Company not found" }); return; }

  res.json(GetCompanyResponse.parse({ ...company, createdAt: company.createdAt.toISOString() }));
});

router.patch("/companies/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateCompanyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [company] = await db
    .update(companiesTable)
    .set(parsed.data)
    .where(eq(companiesTable.id, id))
    .returning();

  if (!company) { res.status(404).json({ error: "Company not found" }); return; }

  res.json(UpdateCompanyResponse.parse({ ...company, createdAt: company.createdAt.toISOString() }));
});

export default router;
