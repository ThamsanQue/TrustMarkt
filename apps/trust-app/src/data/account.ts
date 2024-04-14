import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.query.accounts.findFirst({
      where: (fields) => and(eq(fields.userId, userId)),
    });
    return account;
  } catch (error) {
    return null;
  }
};
