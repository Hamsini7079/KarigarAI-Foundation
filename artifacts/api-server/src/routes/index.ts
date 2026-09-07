import { Router, type IRouter } from "express";
import catalogRouter from "./catalog";
import demoRouter from "./demo";
import foundationRouter from "./foundation";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(foundationRouter);
router.use(catalogRouter);
router.use(demoRouter);

export default router;
