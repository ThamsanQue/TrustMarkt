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
          process.env.NODE_ENV === "production"
            ? `${process.env.NEXTAUTH_URL}/deepface/:path*`
            : "/deepface/:path*",
      },
    ];
  },
};

export default config;
