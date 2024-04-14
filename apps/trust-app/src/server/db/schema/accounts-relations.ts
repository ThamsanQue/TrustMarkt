import { relations } from "drizzle-orm";
import { accounts } from "./accounts";
import { users } from "./users";

export const accountsRelations = relations(accounts, (helpers) => ({
  user: helpers.one(users, {
    relationName: "AccountToUser",
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
