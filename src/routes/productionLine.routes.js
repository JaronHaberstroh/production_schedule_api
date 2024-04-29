import { Router } from "express";
import createProductionLine from "#controllers/productionLines/createProductionLine.js";
import mongooseSession from "#middleware/mongooseSession.js";

const router = Router();

const controller = mongooseSession(createProductionLine);
router.post("/:departmentId/production-lines/", controller);

export default router;
