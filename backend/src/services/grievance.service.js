import { query } from "../config/database.js";
import { generateTicketNumber } from "../utils/ticket.js";

/* =========================================================
   CREATE GRIEVANCE
========================================================= */

export async function createGrievance({
  citizenId,
  name,
  mobile,
  category,
  description,
}) {
  const ticketNumber = generateTicketNumber();

  const result = await query(
    `
      INSERT INTO grievances
      (
        ticket_number,
        citizen_id,
        name,
        mobile,
        category,
        description,
        status
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, 'submitted')
      RETURNING *
    `,
    [
      ticketNumber,
      citizenId || null,
      name,
      mobile || null,
      category,
      description,
    ]
  );

  return result.rows[0];
}


/* =========================================================
   GET CITIZEN GRIEVANCES
========================================================= */

export async function getCitizenGrievances(
  citizenId
) {
  const result = await query(
    `
      SELECT
        id,
        ticket_number,
        citizen_id,
        name,
        mobile,
        email,
        category,
        subject,
        description,
        location,
        image_url,
        status,
        priority,
        assigned_to,
        submitted_at,
        acknowledged_at,
        resolved_at,
        closed_at,
        created_at,
        updated_at
      FROM grievances
      WHERE citizen_id = $1
      ORDER BY created_at DESC
    `,
    [citizenId]
  );

  return result.rows;
}


/* =========================================================
   GET SINGLE GRIEVANCE BY ID
========================================================= */

export async function getGrievanceById(id) {
  const result = await query(
    `
      SELECT
        id,
        ticket_number,
        citizen_id,
        name,
        mobile,
        email,
        category,
        subject,
        description,
        location,
        image_url,
        status,
        priority,
        assigned_to,
        submitted_at,
        acknowledged_at,
        resolved_at,
        closed_at,
        created_at,
        updated_at
      FROM grievances
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
}


/* =========================================================
   GET GRIEVANCE BY TICKET NUMBER (FOR PUBLIC TRACKING)
========================================================= */

export async function getGrievanceByTicketNumber(ticketNumber) {
  const result = await query(
    `
      SELECT
        id,
        ticket_number,
        citizen_id,
        name,
        mobile,
        email,
        category,
        subject,
        description,
        location,
        image_url,
        status,
        priority,
        assigned_to,
        submitted_at,
        acknowledged_at,
        resolved_at,
        closed_at,
        created_at,
        updated_at
      FROM grievances
      WHERE ticket_number = $1
      LIMIT 1
    `,
    [ticketNumber]
  );

  return result.rows[0] || null;
}


/* =========================================================
   GET ALL GRIEVANCES
========================================================= */

export async function getAllGrievances() {
  const result = await query(
    `
      SELECT
        g.id,
        g.ticket_number,
        g.citizen_id,
        g.name,
        g.mobile,
        g.email,
        g.category,
        g.subject,
        g.description,
        g.location,
        g.image_url,
        g.status,
        g.priority,
        g.assigned_to,
        g.submitted_at,
        g.acknowledged_at,
        g.resolved_at,
        g.closed_at,
        g.created_at,
        g.updated_at,

        u.full_name AS assigned_to_name

      FROM grievances g

      LEFT JOIN users u
        ON u.id = g.assigned_to

      ORDER BY g.created_at DESC
    `
  );

  return result.rows;
}


/* =========================================================
   UPDATE GRIEVANCE
========================================================= */

export async function updateGrievanceById(
  id,
  {
    status,
    priority,
    adminNotes,
    assignedTo,
  },
  updatedBy
) {
  /*
   * First get the existing grievance.
   */

  const existingResult = await query(
    `
      SELECT *
      FROM grievances
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  if (existingResult.rows.length === 0) {
    return null;
  }

  const existing = existingResult.rows[0];

  /*
   * Keep existing values when fields are not supplied.
   */

  const nextStatus =
    status ?? existing.status;

  const nextPriority =
    priority ?? existing.priority;

  const nextAssignedTo =
    assignedTo !== undefined
      ? assignedTo || null
      : existing.assigned_to;

  /*
   * Update timestamps according to status.
   */

  let acknowledgedAt =
    existing.acknowledged_at;

  let resolvedAt =
    existing.resolved_at;

  let closedAt =
    existing.closed_at;

  if (
    nextStatus === "acknowledged" &&
    !acknowledgedAt
  ) {
    acknowledgedAt = new Date();
  }

  if (
    nextStatus === "resolved" &&
    !resolvedAt
  ) {
    resolvedAt = new Date();
  }

  if (
    nextStatus === "closed" &&
    !closedAt
  ) {
    closedAt = new Date();
  }

  /*
   * Update main grievance record.
   */

  const result = await query(
    `
      UPDATE grievances
      SET
        status = $1,
        priority = $2,
        assigned_to = $3,
        acknowledged_at = $4,
        resolved_at = $5,
        closed_at = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7

      RETURNING
        id,
        ticket_number,
        citizen_id,
        name,
        mobile,
        email,
        category,
        subject,
        description,
        location,
        image_url,
        status,
        priority,
        assigned_to,
        submitted_at,
        acknowledged_at,
        resolved_at,
        closed_at,
        created_at,
        updated_at
    `,
    [
      nextStatus,
      nextPriority,
      nextAssignedTo,
      acknowledgedAt,
      resolvedAt,
      closedAt,
      id,
    ]
  );

  const updatedGrievance =
    result.rows[0];

  /*
   * Save admin comment in the existing
   * grievance_updates timeline table.
   */

  if (
    adminNotes &&
    adminNotes.trim()
  ) {
    await query(
      `
        INSERT INTO grievance_updates
        (
          grievance_id,
          updated_by,
          status,
          comment
        )
        VALUES
        ($1, $2, $3, $4)
      `,
      [
        id,
        updatedBy || null,
        nextStatus,
        adminNotes.trim(),
      ]
    );
  }

  /*
   * Also create a timeline entry when
   * the status itself changes.
   */

  if (
    status &&
    status !== existing.status &&
    (!adminNotes ||
      !adminNotes.trim())
  ) {
    await query(
      `
        INSERT INTO grievance_updates
        (
          grievance_id,
          updated_by,
          status,
          comment
        )
        VALUES
        ($1, $2, $3, $4)
      `,
      [
        id,
        updatedBy || null,
        nextStatus,
        `Grievance status changed from "${existing.status}" to "${nextStatus}".`,
      ]
    );
  }

  return updatedGrievance;
}


/* =========================================================
   DELETE GRIEVANCE
========================================================= */

export async function deleteGrievanceById(
  id
) {
  const result = await query(
    `
      DELETE FROM grievances
      WHERE id = $1
      RETURNING id, ticket_number
    `,
    [id]
  );

  return result.rows[0] || null;
}


/* =========================================================
   GET GRIEVANCE TIMELINE
========================================================= */

export async function getGrievanceUpdates(
  grievanceId
) {
  const result = await query(
    `
      SELECT
        gu.id,
        gu.grievance_id,
        gu.updated_by,
        gu.status,
        gu.comment,
        gu.created_at,
        u.full_name AS updated_by_name

      FROM grievance_updates gu

      LEFT JOIN users u
        ON u.id = gu.updated_by

      WHERE gu.grievance_id = $1

      ORDER BY gu.created_at ASC
    `,
    [grievanceId]
  );

  return result.rows;
}