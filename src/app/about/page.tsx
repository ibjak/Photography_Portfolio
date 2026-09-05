import PortfolioSite from "@/components/PortfolioSite";
import { pageMetadata } from "@/lib/siteMetadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Ivan Badanjak is a documentary photographer and aspiring researcher whose work explores themes of migration, identity, and cultural preservation.",
  pathname: "/about",
});

export default function AboutPage() {
  return <PortfolioSite view={{ type: "about" }} />;
}
