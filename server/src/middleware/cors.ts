import { Hono } from "hono";
import type { Env } from "../types";

const cors = new Hono<{ Bindings: Env }>();

cors.use("*", async (c, next) => {
  const origin = c.env.CORS_ORIGIN || "*";
  c.header("Access-Control-Allow-Origin", origin);
  c.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-API-Key",
  );
  c.header("Access-Control-Max-Age", "86400");

  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  await next();
});

export default cors;
