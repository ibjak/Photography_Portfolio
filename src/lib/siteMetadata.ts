import type { Metadata } from "next";
import {
  galleries,
  galleryKeys,
  homeSlideshowImages,
  type Gallery,
  type ImageItem,
} from "@/lib/portfolio";

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

// Link previews are 1200×630 images served from /share/<name>.jpg and built by
// src/app/share/[name]/route.ts. Each shows the photograph named here, whole.
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const HOME_SHARE_IMAGE = "home";

export const shareImageSources: Readonly<Record<string, ImageItem>> = {
  [HOME_SHARE_IMAGE]: homeSlideshowImages[0],
  ...Object.fromEntries(
    galleryKeys.map((key) => [galleries[key].slug, galleries[key].images[0]]),
  ),
};

export function pageMetadata({
  title,
  description,
  pathname,
  isHome = false,
  shareImage = HOME_SHARE_IMAGE,
}: {
  title: string;
  description: string;
  pathname: string;
  isHome?: boolean;
  shareImage?: string;
}): Metadata {
  const fullTitle = isHome ? siteTitle : `${title} | ${siteName}`;
  const image = {
    url: `/share/${shareImage}.jpg`,
    alt: shareImageSources[shareImage].alt,
    ...SHARE_IMAGE_SIZE,
  };

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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

// Structured data telling search engines who the site belongs to.
export function personJsonLd(profiles: readonly { href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteName,
    url: siteUrl.origin,
    jobTitle: "Documentary photographer",
    sameAs: profiles.map((profile) => profile.href),
  };
}
