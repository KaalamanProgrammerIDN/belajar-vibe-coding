import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/users";

export interface RegisterUserInput {
  name: string;
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
}
