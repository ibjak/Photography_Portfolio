import type { Metadata } from "next";
import PortfolioSite from "../../components/PortfolioSite";

export const metadata: Metadata = {
  title: "About",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <PortfolioSite key="about" view={{ type: "about" }} />;
}
