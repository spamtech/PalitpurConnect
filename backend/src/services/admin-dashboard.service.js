
import { query } from "../config/database.js";

export async function getAdminDashboardStats() {
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
        WHERE status NOT IN ('resolved', 'rejected', 'closed')
      ) AS "openGrievances",

      (
        SELECT COUNT(*)
        FROM emergency_contacts
        WHERE is_active = TRUE
      ) AS "emergencyContacts"
  `);

  const row = result.rows[0];

  return {
    announcements: Number(row.announcements),
    directory: Number(row.directory),
    openGrievances: Number(row.openGrievances),
    emergencyContacts: Number(row.emergencyContacts),
  };
}

