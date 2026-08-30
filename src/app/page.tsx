import PortfolioSite from "../components/PortfolioSite";
import {
  pageMetadata,
  siteDescription,
  siteTitle,
} from "../lib/siteMetadata";

export const metadata = pageMetadata({
  title: siteTitle,
  description: siteDescription,
  pathname: "/",
  isHome: true,
});

export default function HomePage() {
  return <PortfolioSite key="home" view={{ type: "home" }} />;
}
