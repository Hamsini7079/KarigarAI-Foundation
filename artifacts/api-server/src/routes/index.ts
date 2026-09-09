import { Router, type IRouter } from "express";
import catalogRouter from "./catalog";
import demoRouter from "./demo";
import foundationRouter from "./foundation";
import healthRouter from "./health";
import pricingRouter from "./pricing";
import notificationsRouter from "./notifications"; // <-- add
import productsRouter from "./products";           // <-- add
import inquiriesRouter from "./inquiries";         // <-- add

const router: IRouter = Router();

router.use(healthRouter);
router.use(foundationRouter);
router.use(catalogRouter);
router.use(pricingRouter);
router.use(demoRouter);
router.use(notificationsRouter); // <-- add
router.use(productsRouter);      // <-- add
router.use(inquiriesRouter);     // <-- add

export default router;