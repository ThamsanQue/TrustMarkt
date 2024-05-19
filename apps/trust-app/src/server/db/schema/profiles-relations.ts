import { relations } from "drizzle-orm";
import { profiles } from "./profiles";
import { users } from "./users";

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));
