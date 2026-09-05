import type { Metadata } from "next";
import type { Gallery, ImageItem } from "@/lib/portfolio";

export const siteName = "Ivan Badanjak";
export const siteTitle = `${siteName} | Photography`;
export const siteUrl = new URL("https://ivanbjak.com");
export const siteDescription =
  "Documentary photography exploring identity, diaspora, and everyday life.";

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

const META_DESCRIPTION_MAX_LENGTH = 160;

function conciseDescription(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= META_DESCRIPTION_MAX_LENGTH) {
    return normalized;
  }

  const shortened = normalized.slice(0, META_DESCRIPTION_MAX_LENGTH - 1);
  return `${shortened.replace(/\s+\S*$/, "")}…`;
}

export function galleryDescription(
  gallery: Pick<Gallery, "title" | "introParagraphs">,
) {
  const introduction = gallery.introParagraphs?.[0];
  return introduction
    ? conciseDescription(introduction)
    : `View ${gallery.title}, a photography gallery by Ivan Badanjak.`;
}

export function pageMetadata({
  title,
  description,
  pathname,
  isHome = false,
  image,
}: {
  title: string;
  description: string;
  pathname: string;
  isHome?: boolean;
  image?: Pick<ImageItem, "src" | "alt" | "width" | "height">;
}): Metadata {
  const fullTitle = isHome ? siteTitle : `${title} | ${siteName}`;
  const socialImages = image
    ? [
        {
          url: image.src,
          alt: image.alt,
          width: image.width,
          height: image.height,
        },
      ]
    : undefined;

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
      images: socialImages,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      images: image ? [image.src] : undefined,
    },
  };
}
