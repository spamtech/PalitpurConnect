import { Router } from "express";

import authRoutes from "./auth.routes.js";
import announcementRoutes from "./announcement.routes.js";
import directoryRoutes from "./directory.routes.js";
import emergencyRoutes from "./emergency.routes.js";
import grievanceRoutes from "./grievance.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import publicAnnouncementRoutes from "./public-announcement.routes.js";
import landingRoutes from "./landing.routes.js";

const router = Router();

/* =========================================================
   AUTH
========================================================= */

router.use("/auth", authRoutes);

/* =========================================================
   PUBLIC / CITIZEN ROUTES
========================================================= */

router.use("/announcements", publicAnnouncementRoutes);
router.use("/directory", directoryRoutes);
router.use("/emergency", emergencyRoutes);
router.use("/grievances", grievanceRoutes);
router.use("/landing", landingRoutes);

/* =========================================================
   ADMIN ROUTES
========================================================= */

router.use("/admin/dashboard", dashboardRoutes);
router.use("/admin/announcements", announcementRoutes);
router.use("/admin/directory", directoryRoutes);
router.use("/admin/emergency", emergencyRoutes);
router.use("/admin/grievances", grievanceRoutes);

export default router;