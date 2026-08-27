import { Elysia, t } from "elysia";
import { UsersService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/auth" })
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        const result = await UsersService.register(body);
        set.status = 200;
        return result;
      } catch (error: any) {
        if (error.message === "Email sudah terdaftar") {
          set.status = 400;
          return { error: "Email sudah terdaftar" };
        }
        set.status = 500;
        return { error: "Internal Server Error" };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, error: "Name is required" }),
        email: t.String({ format: "email", error: "Invalid email format" }),
        password: t.String({ minLength: 6, error: "Password must be at least 6 characters" }),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        const result = await UsersService.login(body);
        set.status = 200;
        return result;
      } catch (error: any) {
        if (error.message === "Email atau password salah") {
          set.status = 400;
          return { error: "Email atau password salah" };
        }
        set.status = 500;
        return { error: "Internal Server Error" };
      }
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        email: t.String({ format: "email", error: "Invalid email format" }),
        password: t.String({ minLength: 1, error: "Password is required" }),
      }),
    }
  );
