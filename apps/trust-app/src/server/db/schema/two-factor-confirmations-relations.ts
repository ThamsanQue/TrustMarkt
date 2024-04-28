import { relations } from "drizzle-orm";
import { twoFactorConfirmations } from "./two-factor-confirmations";
import { users } from "./users";

export const twoFactorConfirmationsRelations = relations(
  twoFactorConfirmations,
  (helpers) => ({
    user: helpers.one(users, {
      relationName: "TwoFactorConfirmationToUser",
      fields: [twoFactorConfirmations.userId],
      references: [users.id],
    }),
  }),
);
