import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiRouter from "./ai";
import parseRouter from "./parse";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiRouter);
router.use(parseRouter);

export default router;
