import { Elysia } from "elysia";

export const healthRoutes = new Elysia({ prefix: "/health" }).get("/", () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "belajar-vibe-coding-api",
  };
});
