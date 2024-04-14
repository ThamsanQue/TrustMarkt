import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: (fields) => and(eq(fields.email, email)),
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: (fields) => and(eq(fields.id, id)),
    });

    return user;
  } catch {
    return null;
  }
};
