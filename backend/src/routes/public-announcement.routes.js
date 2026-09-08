
import { Router } from "express";

import {
  getPublishedAnnouncements,
  getPublishedAnnouncementById,
} from "../controllers/public-announcement.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Announcements
|--------------------------------------------------------------------------
*/

/*
 * GET /api/v1/announcements
 *
 * Returns only published announcements.
 */
router.get(
  "/",
  getPublishedAnnouncements
);

/*
 * GET /api/v1/announcements/:id
 *
 * Returns one published announcement.
 */
router.get(
  "/:id",
  getPublishedAnnouncementById
);

export default router;

