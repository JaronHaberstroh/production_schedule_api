import { Router } from "express";
import { seedDB, dropDB } from "#controllers/testController.js";

const router = Router();

if (process.env.NODE_ENV === "test") {
  router.post("/seedDB", seedDB);
  router.delete("/dropDB", dropDB);
}

export default router;
