import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { twoFactorTokens } from "@/server/db/schema/two-factor-tokens";
import { passwordResetTokens } from "@/server/db/schema/password-reset-tokens";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { verificationTokens } from "@/server/db/schema/verification-tokens";

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id as string));
  }

  const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({ email, token, expires })
    .returning({
      id: passwordResetTokens.id,
      email: passwordResetTokens.email,
      token: passwordResetTokens.token,
      expires: passwordResetTokens.expires,
    });

  return passwordResetToken[0];
};

export const generateVerificationToken = async (
  email: string,
  old_email?: string,
) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(old_email!);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id as string));
  }
  const verificationToken = await db
    .insert(verificationTokens)
    .values({ email, token, expires })
    .returning({
      id: verificationTokens.id,
      email: verificationTokens.email,
      token: verificationTokens.token,
      expires: verificationTokens.expires,
    });

  return verificationToken[0];
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100000, 1000000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(twoFactorTokens)
      .where(eq(twoFactorTokens.id, existingToken.id as string));
  }

  const twoFactorToken = await db
    .insert(twoFactorTokens)
    .values({ email, token, expires })
    .returning({
      id: twoFactorTokens.id,
      email: twoFactorTokens.email,
      token: twoFactorTokens.token,
      expires: twoFactorTokens.expires,
    });
  return twoFactorToken[0];
};
