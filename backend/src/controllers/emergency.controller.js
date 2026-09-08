
import { query } from "../config/database.js";
import { successResponse } from "../utils/response.js";

/*
|--------------------------------------------------------------------------
| GET emergency contacts
|--------------------------------------------------------------------------
*/

export async function getEmergencyContacts(req, res, next) {
  try {
    const result = await query(`
      SELECT
        id,
        name,
        service,
        phone,
        alternate_phone,
        description,
        is_active,
        display_order,
        created_at,
        updated_at
      FROM emergency_contacts
      WHERE is_active = true
      ORDER BY display_order ASC, name ASC
    `);

    return successResponse(
      res,
      {
        contacts: result.rows,
      },
      "Emergency contacts retrieved successfully."
    );
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| CREATE emergency contact
|--------------------------------------------------------------------------
*/

export async function createEmergencyContact(req, res, next) {
  try {
    const {
      name,
      service,
      phone,
      alternate_phone,
      description,
      is_active,
      display_order,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Contact name is required.",
      });
    }

    if (!service?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service is required.",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const order = Number(display_order);

    if (!Number.isInteger(order) || order < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Display order must be a non-negative whole number.",
      });
    }

    const result = await query(
      `
        INSERT INTO emergency_contacts
        (
          name,
          service,
          phone,
          alternate_phone,
          description,
          is_active,
          display_order
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7
        )
        RETURNING
          id,
          name,
          service,
          phone,
          alternate_phone,
          description,
          is_active,
          display_order,
          created_at,
          updated_at
      `,
      [
        name.trim(),
        service.trim(),
        phone.trim(),
        alternate_phone?.trim() || null,
        description?.trim() || null,
        is_active !== false,
        order,
      ]
    );

    return successResponse(
      res,
      {
        contact: result.rows[0],
      },
      "Emergency contact created successfully.",
      201
    );
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE emergency contact
|--------------------------------------------------------------------------
*/

export async function updateEmergencyContact(req, res, next) {
  try {
    const { id } = req.params;

    const {
      name,
      service,
      phone,
      alternate_phone,
      description,
      is_active,
      display_order,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Contact name is required.",
      });
    }

    if (!service?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service is required.",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const order = Number(display_order);

    if (!Number.isInteger(order) || order < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Display order must be a non-negative whole number.",
      });
    }

    const result = await query(
      `
        UPDATE emergency_contacts
        SET
          name = $1,
          service = $2,
          phone = $3,
          alternate_phone = $4,
          description = $5,
          is_active = $6,
          display_order = $7,
          updated_at = NOW()
        WHERE id = $8
        RETURNING
          id,
          name,
          service,
          phone,
          alternate_phone,
          description,
          is_active,
          display_order,
          created_at,
          updated_at
      `,
      [
        name.trim(),
        service.trim(),
        phone.trim(),
        alternate_phone?.trim() || null,
        description?.trim() || null,
        is_active !== false,
        order,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found.",
      });
    }

    return successResponse(
      res,
      {
        contact: result.rows[0],
      },
      "Emergency contact updated successfully."
    );
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| DELETE emergency contact
|--------------------------------------------------------------------------
*/

export async function deleteEmergencyContact(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `
        DELETE FROM emergency_contacts
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found.",
      });
    }

    return successResponse(
      res,
      {
        id: result.rows[0].id,
      },
      "Emergency contact deleted successfully."
    );
  } catch (error) {
    next(error);
  }
}

