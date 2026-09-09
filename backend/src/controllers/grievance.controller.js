import {
  createGrievanceSchema,
} from "../validators/grievance.validator.js";

import {
  createGrievance,
  getCitizenGrievances,
  getGrievanceById,
  getGrievanceByTicketNumber,
  getAllGrievances,
  updateGrievanceById,
  deleteGrievanceById,
} from "../services/grievance.service.js";

import { successResponse } from "../utils/response.js";

/* =========================================================
   CITIZEN
========================================================= */

export async function submitGrievance(req, res, next) {
  try {
    const data = createGrievanceSchema.parse(req.body);

    const grievance = await createGrievance({
      ...data,
      citizenId: req.user.id,
    });

    return successResponse(
      res,
      grievance,
      "Grievance submitted successfully",
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function trackGrievance(req, res, next) {
  try {
    const { ticketNumber } = req.params;
    
    const grievance = await getGrievanceByTicketNumber(ticketNumber);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "No grievance found with this ticket number.",
      });
    }

    return successResponse(
      res,
      grievance,
      "Grievance status retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
}

export async function myGrievances(req, res, next) {
  try {
    const grievances = await getCitizenGrievances(
      req.user.id
    );

    return successResponse(
      res,
      grievances,
      "Grievances retrieved"
    );
  } catch (error) {
    next(error);
  }
}

export async function grievanceDetails(req, res, next) {
  try {
    const grievance = await getGrievanceById(
      req.params.id
    );

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    return successResponse(
      res,
      grievance,
      "Grievance retrieved"
    );
  } catch (error) {
    next(error);
  }
}

/* =========================================================
   ADMIN / STAFF
========================================================= */

export async function getGrievances(req, res, next) {
  try {
    const grievances = await getAllGrievances();

    return successResponse(
      res,
      {
        grievances,
      },
      "Grievances retrieved"
    );
  } catch (error) {
    next(error);
  }
}

export async function updateGrievance(req, res, next) {
  try {
    const {
      status,
      admin_notes,
      adminNotes,
    } = req.body;

    const grievance = await updateGrievanceById(
      req.params.id,
      {
        status,
        adminNotes:
          adminNotes ?? admin_notes,
      }
    );

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    return successResponse(
      res,
      {
        grievance,
      },
      "Grievance updated successfully"
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteGrievance(req, res, next) {
  try {
    const deleted = await deleteGrievanceById(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    return successResponse(
      res,
      deleted,
      "Grievance deleted successfully"
    );
  } catch (error) {
    next(error);
  }
}