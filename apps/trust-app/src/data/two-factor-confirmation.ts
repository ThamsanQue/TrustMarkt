import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation =
      await db.query.twoFactorConfirmations.findFirst({
        where: (fields) => and(eq(fields.userId, userId)),
      });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
