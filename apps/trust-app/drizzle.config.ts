import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  out: "./src/server/db",
  tablesFilter: ["trustmarkt1_*"],
} satisfies Config;
