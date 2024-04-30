import { Router } from "express";
import departmentRoutes from "./department.routes.js";
import productionLineRoutes from "./productionLine.routes.js";
import workPositionRoutes from "./workPosition.routes.js";

const router = Router();

router.use("/departments", departmentRoutes);
router.use("/departments", productionLineRoutes);
router.use("/work-positions", workPositionRoutes);

export default router;
