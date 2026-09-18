
import { verifyAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

export function authenticate(req, res, next) {
  console.log("========== AUTH CHECK ==========");
  console.log("Session ID:", req.sessionID);
  console.log("Cookie:", req.headers.cookie);
  console.log("Authenticated:", req.isAuthenticated?.());
  console.log("User:", req.user);
  console.log("Session:", req.session);
  console.log("================================");

  try {
    // 1. Check if authenticated via Google OAuth (Passport Session)
    if (
      req.isAuthenticated &&
      req.isAuthenticated() &&
      req.user
    ) {
      console.log("✅ Authenticated via Passport session");
      return next();
    }

    // 2. Fall back to JWT Bearer Token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No valid session or Bearer token");
      return errorResponse(
        res,
        "Authentication required",
        401
      );
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyAccessToken(token);

    if (payload.type !== "access") {
      console.log("❌ Invalid access token type");
      return errorResponse(
        res,
        "Invalid access token",
        401
      );
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    console.log("✅ Authenticated via JWT");
    console.log("JWT User:", req.user);

    next();
  } catch (error) {
    console.error("❌ AUTH ERROR:", error);

    return errorResponse(
      res,
      "Invalid or expired authentication token",
      401
    );
  }
}

export function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return errorResponse(
    res,
    "Access denied. Admin rights required.",
    403
  );
}

