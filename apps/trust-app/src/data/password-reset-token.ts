import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: (fields) => and(eq(fields.token, token)),
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: (fields) => and(eq(fields.email, email)),
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
