import PortfolioSite from "@/components/PortfolioSite";
import { homeSlideshowImages } from "@/lib/portfolio";
import { pageMetadata, siteDescription, siteTitle } from "@/lib/siteMetadata";

export const metadata = pageMetadata({
  title: siteTitle,
  description: siteDescription,
  pathname: "/",
  isHome: true,
  image: homeSlideshowImages[0],
});

export default function HomePage() {
  return <PortfolioSite view={{ type: "home" }} />;
}
