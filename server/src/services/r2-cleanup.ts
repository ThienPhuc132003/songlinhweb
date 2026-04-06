import type { Env } from "../types";

const CLEANUP_PREFIX = "rfq/";
const RETENTION_DAYS = 180; // 6 months

/**
 * Delete XLSX files from R2 that are older than RETENTION_DAYS.
 * Also nullifies the `excel_url` column in D1 for cleaned-up records.
 *
 * Designed to run as a Cloudflare Cron Trigger (daily at 3 AM UTC).
 */
export async function cleanupOldXlsxFiles(env: Env): Promise<void> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  let cursor: string | undefined;
  let totalDeleted = 0;
  const deletedKeys: string[] = [];

  console.log(
    `[R2 Cleanup] Starting cleanup for files older than ${RETENTION_DAYS} days (before ${cutoff.toISOString()})`,
  );

  // Paginate through R2 objects with prefix "rfq/"
  do {
    const listed = await env.IMAGES.list({
      prefix: CLEANUP_PREFIX,
      limit: 100,
      cursor,
    });

    for (const obj of listed.objects) {
      // R2 object has `uploaded` timestamp
      if (obj.uploaded < cutoff) {
        try {
          await env.IMAGES.delete(obj.key);
          deletedKeys.push(obj.key);
          totalDeleted++;
        } catch (e) {
          console.error(`[R2 Cleanup] Failed to delete ${obj.key}:`, e);
        }
      }
    }

    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  // Nullify excel_url in D1 for deleted R2 keys
  if (deletedKeys.length > 0) {
    // Batch in groups of 50 to avoid query size limits
    const BATCH_SIZE = 50;
    for (let i = 0; i < deletedKeys.length; i += BATCH_SIZE) {
      const batch = deletedKeys.slice(i, i + BATCH_SIZE);
      const placeholders = batch.map(() => "?").join(",");
      try {
        await env.DB.prepare(
          `UPDATE quotation_requests SET excel_url = NULL WHERE excel_url IN (${placeholders})`,
        )
          .bind(...batch)
          .run();
      } catch (e) {
        console.error("[R2 Cleanup] Failed to nullify excel_url:", e);
      }
    }
  }

  console.log(
    `[R2 Cleanup] Completed. Deleted ${totalDeleted} files from R2.`,
  );
}
