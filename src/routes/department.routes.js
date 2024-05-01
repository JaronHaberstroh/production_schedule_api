import { Router } from "express";
import createDepartment from "#controllers/department/createDepartment.js";
import readDepartment from "#controllers/department/readDepartment.js";
import updateDepartment from "#controllers/department/updateDepartment.js";
import deleteDepartment from "#controllers/department/deleteDepartment.js";
import { validate, checkId, checkName } from "./validation.js";
import Department from "#models/department.js";

const router = Router();

router.post(
  "/",
  [checkName("departmentName", Department), validate],
  createDepartment
);

router.get("/:_id", [checkId(Department), validate], readDepartment);
router.get("/", readDepartment);

router.patch(
  "/:_id",
  [checkId(Department), checkName("departmentName", Department), validate],
  updateDepartment
);

router.delete("/:_id", [checkId(Department), validate], deleteDepartment);

export default router;
