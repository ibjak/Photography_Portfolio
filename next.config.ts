import type { NextConfig } from "next";

const imageCacheControl = "public, max-age=604800, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        source: "/Photo%20Gallery/:path*",
        headers: [{ key: "Cache-Control", value: imageCacheControl }],
      },
      {
        source: "/social-icons/:path*",
        headers: [{ key: "Cache-Control", value: imageCacheControl }],
      },
    ];
  },
};

export default nextConfig;
