import type { NextConfig } from "next";

const imageCacheControl = "public, max-age=604800, stale-while-revalidate=86400";
const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingRoot: process.cwd(),
  images: {
    qualities: [75],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
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
