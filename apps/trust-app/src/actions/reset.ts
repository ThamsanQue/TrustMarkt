"use server";

import { z } from "zod";
import { ResetSchema } from "@/schemas";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { getUserByEmail } from "@/data/user";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }
  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken?.email as string,
    passwordResetToken?.token as string,
  );
  return { success: "Reset email sent!" };
};
