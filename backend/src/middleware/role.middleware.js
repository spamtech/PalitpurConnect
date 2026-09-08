import { errorResponse } from "../utils/response.js";

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(
        res,
        "Authentication required",
        401
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        "You do not have permission to perform this action",
        403
      );
    }

    next();
  };
}