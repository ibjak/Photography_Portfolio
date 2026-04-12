import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  reactCompiler: true,

  // Fix turbopack root warning
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;