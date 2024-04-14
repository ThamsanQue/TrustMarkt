import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: (fields) => and(eq(fields.token, token)),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: (fields) => and(eq(fields.email, email)),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};
