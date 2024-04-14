import { text, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./user-role-enum";
import { createTable } from "./_table";
import { createId } from "@paralleldrive/cuid2";

export const users = createTable("user", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name"),
  email: text("email"),
  emailVerified: timestamp("emailVerified", { mode: "date", precision: 3 }),
  image: text("image"),
  password: text("password"),
  role: userRoleEnum("role").default("USER").notNull(),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(true).notNull(),
});
