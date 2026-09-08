
import { query } from "../config/database.js";

/*
|--------------------------------------------------------------------------
| Admin Dashboard Statistics
|--------------------------------------------------------------------------
*/

export async function getAdminDashboardStats(req, res, next) {
  try {
    const result = await query(`
      SELECT
        (
          SELECT COUNT(*)
          FROM announcements
          WHERE is_published = TRUE
        ) AS announcements,

        (
          SELECT COUNT(*)
          FROM directory_entries
          WHERE is_active = TRUE
        ) AS directory,

        (
          SELECT COUNT(*)
          FROM grievances
          WHERE status NOT IN (
            'resolved',
            'rejected',
            'closed'
          )
        ) AS "openGrievances",

        (
          SELECT COUNT(*)
          FROM emergency_contacts
          WHERE is_active = TRUE
        ) AS "emergencyContacts"
    `);

    const row = result.rows[0];

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        stats: {
          announcements: Number(row.announcements),
          directory: Number(row.directory),
          openGrievances: Number(row.openGrievances),
          emergencyContacts: Number(row.emergencyContacts),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

