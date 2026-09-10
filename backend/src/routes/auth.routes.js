import { Router } from "express";

import {
  register,
  verifyEmail,
  login,
  me,
  logout,
  getAllUsersAdmin,
  googleAuthRedirect,
  googleAuthCallback,
} from "../controllers/auth.controller.js";

import { authenticate, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Registration
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  register
);

/*
|--------------------------------------------------------------------------
| Email Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/verify-email",
  verifyEmail
);

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  login
);

/*
|--------------------------------------------------------------------------
| Google OAuth Authentication
|--------------------------------------------------------------------------
*/

router.get(
  "/google",
  googleAuthRedirect
);

router.get(
  "/google/callback",
  googleAuthCallback
);

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  authenticate,
  me
);

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

router.post(
  "/logout",
  authenticate,
  logout
);

/*
|--------------------------------------------------------------------------
| Admin: Get All Users
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/users",
  authenticate,
  isAdmin,
  getAllUsersAdmin
);

export default router;