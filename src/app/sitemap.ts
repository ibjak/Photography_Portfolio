import type { MetadataRoute } from "next";
import {
  galleryKeys,
  getGalleryHref,
} from "../lib/portfolio";
import { absoluteUrl } from "../lib/siteMetadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      priority: 0.6,
    },
    ...galleryKeys.map((galleryKey) => ({
      url: absoluteUrl(getGalleryHref(galleryKey)),
      priority: 0.8,
    })),
  ];
}
