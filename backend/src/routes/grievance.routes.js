import { Router } from "express";

import {
  submitGrievance,
  trackGrievance,
  myGrievances,
  grievanceDetails,
  getGrievances,
  updateGrievance,
  deleteGrievance,
} from "../controllers/grievance.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

/* =========================================================
   CITIZEN ROUTES
========================================================= */

// Submit a new grievance
router.post(
  "/",
  authenticate,
  submitGrievance
);

// Track grievance by ticket number (IMPORTANT: Place this BEFORE /:id so Express doesn't treat "track" as an ID)
router.get(
  "/track/:ticketNumber",
  trackGrievance
);

// Get logged-in citizen's grievances
router.get(
  "/my",
  authenticate,
  myGrievances
);

// Get a single grievance
router.get(
  "/:id",
  authenticate,
  grievanceDetails
);

/* =========================================================
   ADMIN / STAFF ROUTES
========================================================= */

// Get all grievances
router.get(
  "/",
  authenticate,
  authorize("admin", "staff"),
  getGrievances
);

// Update grievance
router.put(
  "/:id",
  authenticate,
  authorize("admin", "staff"),
  updateGrievance
);

// Delete grievance
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "staff"),
  deleteGrievance
);

export default router;