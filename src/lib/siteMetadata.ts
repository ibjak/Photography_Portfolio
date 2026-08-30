import type { Metadata } from "next";

export const siteName = "Ivan Badanjak";
export const siteTitle = `${siteName} | Photography`;
export const siteUrl = new URL("https://ivanbjak.com");
export const siteDescription =
  "Documentary photography exploring identity, diaspora, and everyday life.";

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

export function galleryDescription(title: string) {
  return `View ${title}, a photography gallery by Ivan Badanjak.`;
}

export function pageMetadata({
  title,
  description,
  pathname,
  isHome = false,
}: {
  title: string;
  description: string;
  pathname: string;
  isHome?: boolean;
}): Metadata {
  const fullTitle = isHome ? siteTitle : `${title} | ${siteName}`;

  return {
    title: isHome ? { absolute: fullTitle } : title,
    description,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pathname,
      siteName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
