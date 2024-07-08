import * as workPositionController from "#controllers/workPosition.controller";
import WorkPosition from "#models/workPosition";
import { checkId, checkName, validate } from "./validation";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  [checkName("positionName", WorkPosition), validate],
  workPositionController.createWorkPosition,
);
router.get(
  "/:_id",
  [checkId(WorkPosition), validate],
  workPositionController.readWorkPosition,
);
router.get("/", workPositionController.readWorkPosition);
router.patch(
  "/:_id",
  [checkId(WorkPosition), checkName("positionName", WorkPosition), validate],
  workPositionController.updateWorkPosition,
);
router.delete(
  "/:_id",
  [checkId(WorkPosition), validate],
  workPositionController.deleteWorkPosition,
);

export default router;
