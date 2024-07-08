import Department from "#models/department";
import * as departmentController from "#controllers/department.controller";
import { validate, checkId, checkName } from "./validation";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  [checkName("departmentName", Department), validate],
  departmentController.createDepartment,
);

router.get(
  "/:_id",
  [checkId(Department), validate],
  departmentController.readDepartment,
);
router.get("/", departmentController.readDepartment);

router.patch(
  "/:_id",
  [checkId(Department), checkName("departmentName", Department), validate],
  departmentController.updateDepartment,
);

router.delete(
  "/:_id",
  [checkId(Department), validate],
  departmentController.deleteDepartment,
);

export default router;
