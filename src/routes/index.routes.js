import { Router } from "express";
import departmentRoutes from "./department.routes.js";
import productionLineRoutes from "./productionLine.routes.js";
import workPositionRoutes from "./workPosition.routes.js";
import testRoutes from "./test.routes.js";

const router = Router();

router.use("/departments", departmentRoutes);
router.use("/departments/:departmentId/production-lines", productionLineRoutes);
router.use("/work-positions", workPositionRoutes);

if (process.env.NODE_ENV === "test") {
  router.use("/test", testRoutes);
}

export default router;
