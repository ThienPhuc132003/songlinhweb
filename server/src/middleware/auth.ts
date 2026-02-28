import { createMiddleware } from "hono/factory";
import type { Env } from "../types";

/**
 * Admin authentication middleware.
 * Validates the API key from the `X-API-Key` header.
 */
export const requireAuth = createMiddleware<{ Bindings: Env }>(
  async (c, next) => {
    const apiKey = c.req.header("X-API-Key");

    if (!apiKey || apiKey !== c.env.ADMIN_API_KEY) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    await next();
  },
);
