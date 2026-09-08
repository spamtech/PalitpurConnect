
import { Router } from "express";

import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// GET ALL ANNOUNCEMENTS
// Admin sees every announcement until it is deleted.
router.get(
  "/",
  authenticate,
  authorize("admin", "staff"),
  getAnnouncements
);

// GET ONE ANNOUNCEMENT
router.get(
  "/:id",
  authenticate,
  authorize("admin", "staff"),
  getAnnouncementById
);

// CREATE
router.post(
  "/",
  authenticate,
  authorize("admin", "staff"),
  createAnnouncement
);

// UPDATE
// IMPORTANT: Frontend sends PUT
router.put(
  "/:id",
  authenticate,
  authorize("admin", "staff"),
  updateAnnouncement
);

// DELETE
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "staff"),
  deleteAnnouncement
);

export default router;

