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
    // The photographs are exported 2000-2500px wide, so nothing larger than
    // 2560 is ever useful (the default list goes up to 3840).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
    // Photographs never change once published, so resized copies can be kept
    // for a month instead of being regenerated every week.
    minimumCacheTTL: 2678400,
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
