import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db";
import { type userRoleEnum } from "@/server/db/schema/user-role-enum";
import { eq } from "drizzle-orm";
import { createTable } from "@/server/db/schema/_table";
import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";
import { users } from "@/server/db/schema/users";
import { twoFactorConfirmations } from "@/server/db/schema/two-factor-confirmations";
import { type Adapter } from "next-auth/adapters";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
export type ExtendedUser = DefaultSession["user"] & {
  role: typeof userRoleEnum;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({
          emailVerified: new Date(),
        })
        .where(eq(users.id, user.id as string));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without verification
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id as string);

      // Prevent sign In without email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id as string,
        );
        if (!twoFactorConfirmation) {
          return false;
        }
        await db
          .delete(twoFactorConfirmations)
          .where(eq(twoFactorConfirmations.userId, existingUser.id as string));
      }
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as typeof userRoleEnum;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(
        existingUser.id as string,
      );
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  session: { strategy: "jwt" },
  debug: false,
  ...authConfig,
});

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
