import { Router } from "express";
import createDepartment from "#controllers/department/createDepartment.js";
import readDepartment from "#controllers/department/readDepartment.js";
import updateDepartment from "#controllers/department/updateDepartment.js";
import deleteDepartment from "#controllers/department/deleteDepartment.js";

const router = Router();

router.post("/create", createDepartment);
router.get("/read/:_id", readDepartment);
router.get("/read", readDepartment);
router.patch("/update/:_id", updateDepartment);
router.delete("/delete/:_id", readDepartment, deleteDepartment);

export default router;
