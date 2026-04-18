/**
 * Shared query-building utilities for Hono/D1 routes.
 *
 * Why? The "dynamic SET builder" pattern is repeated across 5+ route files
 * (products, projects, posts, brands, solutions). This helper centralizes it.
 */

/**
 * Build dynamic UPDATE SET clauses from a partial body object.
 *
 * Only includes fields whose value is `!== undefined` in the body.
 * Returns `sets` (SQL fragments) and `values` (bind params).
 *
 * @example
 * ```ts
 * const { sets, values } = buildDynamicUpdate(body, [
 *   "name", "slug", "description", "is_active",
 * ]);
 * if (sets.length === 0) return err("Nothing to update", 400);
 * sets.push("updated_at = datetime('now')");
 * values.push(id);
 * await db.prepare(`UPDATE products SET ${sets.join(", ")} WHERE id = ?`).bind(...values).run();
 * ```
 */
export function buildDynamicUpdate(
  body: Record<string, unknown>,
  allowedFields: string[],
): { sets: string[]; values: unknown[] } {
  const sets: string[] = [];
  const values: unknown[] = [];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      sets.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  return { sets, values };
}
