import { describe, expect, it } from "bun:test";
import { usersRoute } from "../src/routes/users-route";
import { Elysia } from "elysia";

describe("POST /api/auth/register validation test", () => {
  const app = new Elysia().use(usersRoute);

  it("should fail validation if payload is empty", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
    );

    expect(response.status).toBe(422); // Elysia default validation error status
  });

  it("should fail validation if email format is invalid", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "invalid-email",
          password: "password123",
        }),
      })
    );

    expect(response.status).toBe(422);
  });
});

describe("POST /api/auth/login validation test", () => {
  const app = new Elysia().use(usersRoute);

  it("should fail validation if payload is empty", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
    );

    expect(response.status).toBe(422);
  });

  it("should fail validation if email is invalid", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "not-an-email",
          password: "somepassword",
        }),
      })
    );

    expect(response.status).toBe(422);
  });
});
