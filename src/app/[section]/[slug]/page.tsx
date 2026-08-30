import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioSite from "../../../components/PortfolioSite";
import {
  galleries,
  galleryKeys,
  getGalleryByRoute,
  getGalleryHref,
} from "../../../lib/portfolio";
import {
  galleryDescription,
  pageMetadata,
} from "../../../lib/siteMetadata";

type RoutePageProps = {
  params: Promise<{
    section: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return galleryKeys.map((galleryKey) => {
    const gallery = galleries[galleryKey];

    return {
      section: gallery.section,
      slug: gallery.slug,
    };
  });
}

export async function generateMetadata({
  params,
}: RoutePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const gallery = getGalleryByRoute(
    resolvedParams.section,
    resolvedParams.slug,
  );

  if (!gallery) {
    return {};
  }

  const pathname = getGalleryHref(gallery.key);

  return pageMetadata({
    title: gallery.title,
    description: galleryDescription(gallery.title),
    pathname,
  });
}

export default async function GalleryPage({ params }: RoutePageProps) {
  const resolvedParams = await params;
  const gallery = getGalleryByRoute(
    resolvedParams.section,
    resolvedParams.slug,
  );

  if (!gallery) {
    notFound();
  }

  return (
    <PortfolioSite
      key={gallery.key}
      view={{ type: "gallery", galleryKey: gallery.key }}
    />
  );
}
