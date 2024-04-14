import { relations } from "drizzle-orm";
import { users } from "./users";
import { accounts } from "./accounts";
import { twoFactorConfirmations } from "./two-factor-confirmations";

export const usersRelations = relations(users, (helpers) => ({
  accounts: helpers.many(accounts, { relationName: "AccountToUser" }),
  twoFactorConfirmation: helpers.one(twoFactorConfirmations, {
    relationName: "TwoFactorConfirmationToUser",
    fields: [users.id],
    references: [twoFactorConfirmations.userId],
  }),
}));
