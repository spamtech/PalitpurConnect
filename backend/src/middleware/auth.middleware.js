import { verifyAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(
        res,
        "Authentication required",
        401
      );
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyAccessToken(token);

    if (payload.type !== "access") {
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

    next();
  } catch (error) {
    return errorResponse(
      res,
      "Invalid or expired authentication token",
      401
    );
  }
}