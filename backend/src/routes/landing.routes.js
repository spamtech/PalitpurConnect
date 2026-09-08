import { Router } from "express";
import { 
  getLandingContent, 
  getAllLandingContent, 
  upsertLandingContent, 
  deleteLandingContent 
} from "../controllers/landing.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Forbidden: Administrator access required.",
  });
};

router.get("/", getLandingContent);
router.get("/admin/all", authenticate, requireAdmin, getAllLandingContent);

// Use upload.any() so it catches files sent under ANY field name ("images", "image", "file", etc.)
router.post("/update", authenticate, requireAdmin, upload.any(), upsertLandingContent);

router.delete("/:key", authenticate, requireAdmin, deleteLandingContent);

export default router;