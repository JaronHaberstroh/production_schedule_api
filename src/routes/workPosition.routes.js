import { Router } from "express";
import createWorkPosition from "#controllers/workPosition/createWorkPosition.js";
import readWorkPosition from "#controllers/workPosition/readWorkPosition.js";
import updateWorkPosition from "#controllers/workPosition/updateWorkPositions.js";
import deleteWorkPosition from "#controllers/workPosition/deleteWorkPosition.js";
import { checkId, checkName, validate } from "./validation.js";
import WorkPosition from "#models/workPosition.js";

const router = Router();

router.post(
  "/",
  [checkName("positionName", WorkPosition), validate],
  createWorkPosition
);

router.get("/:_id", [checkId(WorkPosition), validate], readWorkPosition);
router.get("/", readWorkPosition);

router.patch(
  "/:_id",
  [checkId(WorkPosition), checkName("positionName", WorkPosition), validate],
  updateWorkPosition
);

router.delete("/:_id", [checkId(WorkPosition), validate], deleteWorkPosition);

export default router;
