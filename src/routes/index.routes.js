import { Router } from "express";

import departmentRoutes from "./department.routes.js";
import productionLineRoutes from "./productionLine.routes.js";
const router = Router();

router.use("/departments", departmentRoutes);
router.use("/departments/:departmentId/production-lines", productionLineRoutes);

export default router;
