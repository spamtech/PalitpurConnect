import { Router } from "express";

import {
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../controllers/emergency.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", getEmergencyContacts);

router.post(
  "/",
  authenticate,
  authorize("admin", "staff"),
  createEmergencyContact
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "staff"),
  updateEmergencyContact
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "staff"),
  deleteEmergencyContact
);

export default router;