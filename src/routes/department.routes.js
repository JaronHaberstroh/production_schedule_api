import { Router } from "express";
import createDepartment from "#controllers/department/createDepartment.js";
import readDepartment from "#controllers/department/readDepartment.js";
import updateDepartment from "#controllers/department/updateDepartment.js";
import deleteDepartment from "#controllers/department/deleteDepartment.js";
import validate, {
  departmentIdValidator,
  departmentNameValidator,
} from "#controllers/department/validation.js";

const router = Router();

router.post("/create", departmentNameValidator(), validate, createDepartment);

router.get("/read/:_id", departmentIdValidator(), validate, readDepartment);

router.get("/read", departmentNameValidator(), readDepartment);

router.patch(
  "/update/:_id",
  departmentNameValidator(),
  departmentIdValidator(),
  validate,
  updateDepartment
);

router.delete(
  "/delete/:_id",
  departmentIdValidator(),
  validate,
  deleteDepartment
);

export default router;
