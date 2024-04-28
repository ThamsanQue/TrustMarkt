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
          env.NODE_ENV === "development"
            ? `${env.DEEPFACE_URL}/deepface/:path*`
            : "/deepface/",
      },
    ];
  },
};

export default config;
