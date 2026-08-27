import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/users";
import { sessions } from "../db/schema/sessions";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  name?: string;
  email: string;
  password: string;
}

export class UsersService {
  static async register(input: RegisterUserInput) {
    // 1. Cek duplikasi email
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    // 2. Hash password dengan bcrypt menggunakan Bun.password
    const hashedPassword = await Bun.password.hash(input.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // 3. Simpan user baru ke database
    await db.insert(users).values({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    return { data: "OK" };
  }

  static async login(input: LoginUserInput) {
    // 1. Cari user berdasarkan email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (!user) {
      throw new Error("Email atau password salah");
    }

    // 2. Verifikasi hash password dengan bcrypt
    const isPasswordValid = await Bun.password.verify(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email atau password salah");
    }

    // 3. Generate token UID/UUID
    const token = crypto.randomUUID();

    // 4. Simpan session baru ke database
    await db.insert(sessions).values({
      token: token,
      userId: user.id,
    });

    return { data: token };
  }

  static async getCurrentUser(token: string) {
    if (!token) {
      throw new Error("Unauthorized");
    }

    const [result] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1);

    if (!result) {
      throw new Error("Unauthorized");
    }

    return {
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        created_at: result.createdAt,
      },
    };
  }
}
