"use server";

import { z } from "zod";
import { NewPasswordSchema } from "@/schemas";
import bcrypt from "bcryptjs";

import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { eq } from "drizzle-orm";
import { passwordResetTokens } from "@/server/db/schema/password-reset-tokens";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null,
) => {
  if (!token) {
    return { error: "Missing token" };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: " Invalid fields" };
  }
  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, existingUser.id as string));
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, existingToken.id as string));
  return { success: "Password updated!" };
};
