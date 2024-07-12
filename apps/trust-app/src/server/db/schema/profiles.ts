import { integer, json, text, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./_table";
import { users } from "./users";
import { createId } from "@paralleldrive/cuid2";

export const profiles = createTable("profile", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  faceId: json("faceId"),
  address: text("address"),
  listings: json("listings"),
  status: varchar("status").notNull().default("PENDING"),
  verificationVideo: text("verificationVideo"),
  ratings: integer("ratings").notNull().default(0),
});
