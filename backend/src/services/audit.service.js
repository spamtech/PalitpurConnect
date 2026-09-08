import { query } from "../config/database.js";

export async function createAuditLog({
  userId,
  action,
  entity,
  entityId,
  metadata = null,
  ipAddress = null,
  userAgent = null,
}) {
  await query(
    `
      INSERT INTO audit_logs
      (
        user_id,
        action,
        entity,
        entity_id,
        metadata,
        ip_address,
        user_agent
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
    `,
    [
      userId,
      action,
      entity,
      entityId,
      metadata,
      ipAddress,
      userAgent,
    ]
  );
}