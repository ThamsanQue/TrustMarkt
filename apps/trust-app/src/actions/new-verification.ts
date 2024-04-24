"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { currentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { verificationTokens } from "@/server/db/schema/verification-tokens";
import { eq } from "drizzle-orm";

export const newVerfication = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      error: "Token does not exist!",
    };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error: "Token has expired",
    };
  }

  const user = await currentUser();
  const dbUser = await getUserById(user?.id as string);
  const existingUser = await getUserByEmail(dbUser?.email as string);

  if (!existingUser) {
    return {
      error: "Email does not exist!",
    };
  }

  await db
    .update(users)
    .set({ emailVerified: new Date(), email: existingToken.email })
    .where(eq(users.id, existingUser.id as string));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, existingToken.id as string));
  return { success: "Email verified!" };
};
