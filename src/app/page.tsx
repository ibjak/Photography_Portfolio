import HomeSlideshow from "@/components/HomeSlideshow";
import { homeSlideshowImages } from "@/lib/portfolio";
import { pageMetadata, siteDescription, siteTitle } from "@/lib/siteMetadata";

export const metadata = pageMetadata({
  title: siteTitle,
  description: siteDescription,
  pathname: "/",
  isHome: true,
});

export default function HomePage() {
  return <HomeSlideshow slides={homeSlideshowImages} />;
}
