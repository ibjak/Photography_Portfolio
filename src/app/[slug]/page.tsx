import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioSite from "../../components/PortfolioSite";
import { galleries, galleryKeys, getGalleryBySlug, getGalleryHref } from "../../lib/portfolio";

type RoutePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return galleryKeys.map((galleryKey) => {
    const gallery = galleries[galleryKey];

    return {
      slug: gallery.slug,
    };
  });
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const gallery = getGalleryBySlug(resolvedParams.slug);

  if (!gallery) {
    return {};
  }

  return {
    title: gallery.title,
    alternates: {
      canonical: getGalleryHref(gallery.key),
    },
  };
}

export default async function GalleryPage({ params }: RoutePageProps) {
  const resolvedParams = await params;
  const gallery = getGalleryBySlug(resolvedParams.slug);

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
