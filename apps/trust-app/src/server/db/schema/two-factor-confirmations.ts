import { text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./_table";
import { createId } from "@paralleldrive/cuid2";

export const twoFactorConfirmations = createTable("twoFactorConfirmation", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId").notNull(),
});
