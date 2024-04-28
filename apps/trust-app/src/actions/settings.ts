"use server";

import { z } from "zod";
import { SettingsSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema/users";
import { getUserByEmail, getUserById } from "@/data/user";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "User not found" };
  }
  const dbUser = await getUserById(user.id as string);
  if (!dbUser) {
    return { error: "User not found" };
  }
  if (user.isOAuth) {
    (values.email = undefined),
      (values.password = undefined),
      (values.newPassword = undefined),
      (values.isTwoFactorEnabled = undefined);
  }

  if (values.email && values.email !== user.email) {
    const existingUser = dbUser;
    // await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use" };
    }
    const old_email = dbUser.email;
    const verificationToken = await generateVerificationToken(
      values.email,
      old_email!,
    );
    if (!verificationToken) {
      return { error: "Failed to generate verification token" };
    }
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return { success: "Verification email sent!" };
  }
  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );
    if (!passwordMatch) {
      return { error: "Incorrect password" };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db
    .update(users)
    .set(values)
    .where(eq(users.id, dbUser.id as string));
  return { success: "Settings updated" };
};
