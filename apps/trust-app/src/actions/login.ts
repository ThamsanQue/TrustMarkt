"use server";

import { LoginSchema } from "@/schemas";
import { z } from "zod";
import { AuthError } from "next-auth";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "routes";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { twoFactorConfirmations } from "@/server/db/schema/two-factor-confirmations";
import { twoFactorTokens } from "@/server/db/schema/two-factor-tokens";
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { profiles } from "@/server/db/schema/profiles";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }
  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: "Email does not exist!",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );
    if (!verificationToken) {
      return {
        error: "Failed to generate verification token",
      };
    }
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return {
          error: "Code does not exist!",
        };
      }
      if (twoFactorToken.token !== code) {
        return {
          error: "Invalid code!",
        };
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return {
          error: "Code has expired!",
        };
      }
      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, twoFactorToken.id as string));
      const existingTwoFactorConfirmation =
        await getTwoFactorConfirmationByUserId(existingUser.id as string);
      if (existingTwoFactorConfirmation) {
        await db
          .delete(twoFactorConfirmations)
          .where(
            eq(
              twoFactorConfirmations.id,
              existingTwoFactorConfirmation.id as string,
            ),
          );
      }
      await db
        .insert(twoFactorConfirmations)
        .values({ userId: existingUser.id as string });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      if (!twoFactorToken) {
        return {
          error: "Failed to generate two factor token",
        };
      }
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return {
        twoFactor: true,
      };
    }
  }

  try {
    const status = await db
      .select({ status: profiles.status })
      .from(profiles)
      .where(eq(profiles.userId, existingUser.id as string))
      .limit(1);

    const redirect =
      status[0]?.status === "Verified" ? "/settings" : DEFAULT_LOGIN_REDIRECT;
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirect,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials!",
          };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
