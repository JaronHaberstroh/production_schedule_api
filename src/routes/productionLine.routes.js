import { Router } from "express";
import createProductionLine from "#controllers/productionLines/createProductionLine.js";
import mongooseSession from "#middleware/mongooseSession.js";

const router = Router({ mergeParams: true });

router.post("/", mongooseSession(createProductionLine));

export default router;
