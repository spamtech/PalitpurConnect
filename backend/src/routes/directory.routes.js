
import { Router } from "express";

import {
  getDirectory,
  getDirectoryById,
  createDirectoryEntry,
  updateDirectoryEntry,
  deleteDirectoryEntry,
} from "../controllers/directory.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

router.get("/", getDirectory);

router.get("/:id", getDirectoryById);

/*
|--------------------------------------------------------------------------
| Admin / Staff routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize("admin", "staff"),
  createDirectoryEntry
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "staff"),
  updateDirectoryEntry
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "staff"),
  deleteDirectoryEntry
);

export default router;

