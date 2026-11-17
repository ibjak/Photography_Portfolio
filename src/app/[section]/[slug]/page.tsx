import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GalleryPager from "@/components/GalleryPager";
import GalleryViewer from "@/components/GalleryViewer";
import {
  galleries,
  galleryKeys,
  getAdjacentGalleries,
  getGalleryByRoute,
  getGalleryHref,
} from "@/lib/portfolio";
import { galleryDescription, pageMetadata } from "@/lib/siteMetadata";

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
  const gallery = getGalleryByRoute(resolvedParams.section, resolvedParams.slug);

  if (!gallery) {
    return {};
  }

  return pageMetadata({
    title: gallery.title,
    description: galleryDescription(gallery),
    pathname: getGalleryHref(gallery.key),
    shareImage: gallery.slug,
  });
}

export default async function GalleryPage({ params }: RoutePageProps) {
  const resolvedParams = await params;
  const gallery = getGalleryByRoute(resolvedParams.section, resolvedParams.slug);

  if (!gallery) {
    notFound();
  }

  const { previous, next } = getAdjacentGalleries(gallery.key);
  const pagerLink = (key: typeof gallery.key) => ({
    href: getGalleryHref(key),
    label: galleries[key].navLabel,
  });

  return (
    <>
      <GalleryViewer key={gallery.key} gallery={gallery} />
      <GalleryPager previous={pagerLink(previous)} next={pagerLink(next)} />
    </>
  );
}
