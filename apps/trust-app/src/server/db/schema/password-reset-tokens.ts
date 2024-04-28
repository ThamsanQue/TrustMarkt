import { text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./_table";
import { createId } from "@paralleldrive/cuid2";

export const passwordResetTokens = createTable("passwordResetToken", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date", precision: 3 }).notNull(),
});
