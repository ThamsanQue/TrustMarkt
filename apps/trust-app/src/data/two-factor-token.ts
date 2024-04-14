import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: (fields) => and(eq(fields.token, token)),
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: (fields) => and(eq(fields.email, email)),
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};
