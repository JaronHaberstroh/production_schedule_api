import { Router } from "express";

import departmentRoutes from "./department.routes.js";

const router = Router();

router.use("/department", departmentRoutes);

export default router;
