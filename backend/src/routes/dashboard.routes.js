
import { Router } from "express";

import {
  getAdminDashboardStats,
} from "../controllers/dashboard.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| GET /api/v1/admin/dashboard/stats
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  getAdminDashboardStats
);

export default router;

