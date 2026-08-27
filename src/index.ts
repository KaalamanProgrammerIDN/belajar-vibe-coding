import { Elysia } from "elysia";
import { healthRoutes } from "./routes/health";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .get("/", () => ({ message: "Welcome to ElysiaJS + Drizzle + MySQL API" }))
  .use(healthRoutes)
  .listen(port);

console.log(`🦊 Server ElysiaJS berjalan di ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
