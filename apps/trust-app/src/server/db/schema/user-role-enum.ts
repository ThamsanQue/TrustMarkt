import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("UserRole", ["ADMIN", "USER"]);
