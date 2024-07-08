import ProductionLine from "#models/productionLine";
import * as productionLineController from "#controllers/productionLine.controller";
import mongooseSession from "#middleware/mongooseSession";
import { checkId, checkName, validate } from "./validation";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.post(
  "/",
  [checkName("lineName", ProductionLine), validate],
  mongooseSession(productionLineController.createProductionLine),
);

router.get(
  "/:_id",
  [checkId(ProductionLine), validate],
  productionLineController.readProductionLine,
);
router.get("/", productionLineController.readProductionLine);

router.patch(
  "/:_id",
  [checkId(ProductionLine), checkName("lineName", ProductionLine), validate],
  mongooseSession(productionLineController.updateProductionLine),
);

router.delete(
  "/:_id",
  [checkId(ProductionLine), validate],
  mongooseSession(productionLineController.deleteProductionLine),
);

export default router;
