import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  outputFileTracingRoot: process.cwd(),

  async redirects() {
    return [
      {
        source: "/events/protests",
        destination: "/protests",
        permanent: true,
      },
      {
        source: "/events/qatar-prix-2025",
        destination: "/qatar-prix-2025",
        permanent: true,
      },
      {
        source: "/events/paris-fashion-week-2025",
        destination: "/paris-fashion-week-2025",
        permanent: true,
      },
      {
        source: "/street-photography/ssd-neon",
        destination: "/ssd-neon",
        permanent: true,
      },
      {
        source: "/street-photography/dogs",
        destination: "/dogs",
        permanent: true,
      },
      {
        source: "/uefa-champions-league-winners-2026-psg",
        destination: "/winners-in-paris",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
