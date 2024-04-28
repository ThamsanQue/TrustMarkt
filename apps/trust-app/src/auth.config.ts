import bcrypt from "bcryptjs";
import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import { env } from "@/env";
import { getUserByEmail } from "@/data/user";

export default {
  providers: [
    github({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
} as NextAuthConfig;
