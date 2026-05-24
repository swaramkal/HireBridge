import { Router, type IRouter } from "express";
import healthRouter from "./health";
import candidatesRouter from "./candidates";
import companiesRouter from "./companies";
import jobsRouter from "./jobs";
import applicationsRouter from "./applications";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(candidatesRouter);
router.use(companiesRouter);
router.use(jobsRouter);
router.use(applicationsRouter);
router.use(adminRouter);

export default router;
