import { Router } from "express";
import mongooseSession from "#middleware/mongooseSession.js";
import createProductionLine from "#controllers/productionLine/createProductionLine.js";
import readProductionLine from "#controllers/productionLine/readProductionLine.js";
import updateProductionLine from "#controllers/productionLine/updateProductionLine.js";
import { checkId, checkName, validate } from "./validation.js";
import ProductionLine from "#models/productionLine.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  [checkName("lineName", ProductionLine), validate],
  mongooseSession(createProductionLine)
);

router.get("/:_id", [checkId(ProductionLine), validate], readProductionLine);
router.get("/", readProductionLine);

router.patch(
  "/:_id",
  [checkId(ProductionLine), checkName("lineName", ProductionLine)],
  mongooseSession(updateProductionLine)
);

router.delete("/", [checkId(ProductionLine)]);

export default router;
