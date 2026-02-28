import { createMiddleware } from "hono/factory";
import type { Env } from "../types";

/**
 * Global error handler middleware.
 * Catches unhandled errors and returns a standard error response.
 */
export const errorHandler = createMiddleware<{ Bindings: Env }>(
  async (c, next) => {
    try {
      await next();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Internal Server Error";
      console.error("[API Error]", message, e);
      return c.json({ success: false, error: message }, 500);
    }
  },
);
