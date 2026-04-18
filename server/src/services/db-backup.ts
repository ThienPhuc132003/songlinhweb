import type { Env } from "../types";

export async function backupD1ToR2(env: Env): Promise<void> {
  console.log("[Backup] Starting D1 to R2 Backup mechanism...");
  
  // We need CF_ACCOUNT_ID and CF_API_TOKEN in env to call Cloudflare API
  if (!env.CF_ACCOUNT_ID || !env.CF_API_TOKEN || !env.D1_DATABASE_ID) {
    console.error("[Backup] Missing CF_ACCOUNT_ID, CF_API_TOKEN, or D1_DATABASE_ID in environment variables.");
    return;
  }

  try {
    // 1. Trigger export via Cloudflare API
    const exportRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/d1/database/${env.D1_DATABASE_ID}/export`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.CF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        output_format: "sqlite"
      })
    });

    if (!exportRes.ok) {
      const errorText = await exportRes.text();
      console.error("[Backup] Failed to trigger D1 export:", errorText);
      return;
    }

    const exportData = await exportRes.json() as any;
    const downloadUrl = exportData?.result?.result_url;

    if (!downloadUrl) {
      console.error("[Backup] Export response did not contain a download URL");
      return;
    }

    // 2. Fetch the exported SQL/Dump
    const dumpRes = await fetch(downloadUrl);
    if (!dumpRes.ok) throw new Error("Failed to download D1 export file");

    const dumpBuffer = await dumpRes.arrayBuffer();

    // 3. Upload to R2 Bucket
    const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const objectKey = `backups/sltech_db_${dateStr}.sqlite`;

    await env.IMAGES.put(objectKey, dumpBuffer, {
      httpMetadata: { contentType: "application/vnd.sqlite3" }
    });

    console.log(`[Backup] Successfully backed up D1 to R2: ${objectKey}`);
  } catch (error) {
    console.error("[Backup] Backup process encountered critical error:", error);
  }
}
