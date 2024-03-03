import { env } from "./src/env.js";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  rewrites: async () => {
    return [
      {
        source: "/deepface/:path*",
        destination:
          env.NODE_ENV === "production"
            ? `${env.NEXTAUTH_URL}/deepface/:path*`
            : "/deepface/:path*",
      },
    ];
  },
};

export default config;
