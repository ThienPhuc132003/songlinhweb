/** Audit log helper — fire-and-forget logging of entity changes */

export async function logAudit(
  db: D1Database,
  entityType: string,
  entityId: number,
  action: 'create' | 'update' | 'delete' | 'restore' | 'bulk-update' | 'bulk-delete',
  changes: Record<string, unknown> = {},
) {
  try {
    await db.prepare(
      `INSERT INTO audit_logs (entity_type, entity_id, action, changes, performed_by)
       VALUES (?, ?, ?, ?, 'admin')`,
    )
      .bind(entityType, entityId, action, JSON.stringify(changes))
      .run();
  } catch (e) {
    // Non-blocking — don't fail the main operation
    console.error("Audit log write failed:", e);
  }
}
