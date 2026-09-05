import GalleryViewer from "@/components/GalleryViewer";
import HomeSlideshow from "@/components/HomeSlideshow";
import PortfolioShell, {
  type NavigationGroupView,
} from "@/components/PortfolioShell";
import {
  aboutParagraphs,
  contact,
  galleries,
  getGalleryHref,
  homeSlideshowImages,
  navigationGroups,
  presences,
  type GalleryKey,
} from "@/lib/portfolio";

export type PortfolioView =
  | { type: "home" }
  | { type: "about" }
  | { type: "gallery"; galleryKey: GalleryKey };

type PortfolioSiteProps = {
  view: PortfolioView;
};

const navigation: readonly NavigationGroupView[] = navigationGroups.map(
  (group) => ({
    key: group.key,
    title: group.title,
    items: group.galleryKeys.map((galleryKey) => ({
      galleryKey,
      href: getGalleryHref(galleryKey),
      label: galleries[galleryKey].navLabel,
    })),
  }),
);

export default function PortfolioSite({ view }: PortfolioSiteProps) {
  const activeGalleryKey = view.type === "gallery" ? view.galleryKey : null;

  return (
    <PortfolioShell
      activeGalleryKey={activeGalleryKey}
      contact={contact}
      currentYear={new Date().getFullYear()}
      isAboutView={view.type === "about"}
      navigationGroups={navigation}
      presences={presences}
    >
      {view.type === "home" ? (
        <HomeSlideshow slides={homeSlideshowImages} />
      ) : view.type === "about" ? (
        <section
          className="mx-auto w-full max-w-[42rem]"
          aria-labelledby="about-title"
        >
          <h1
            id="about-title"
            className="font-sans text-3xl font-semibold text-black"
          >
            About
          </h1>
          <div className="mt-6 grid gap-5 text-left font-sans text-base leading-relaxed text-black md:[text-align:justify]">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : (
        <GalleryViewer key={view.galleryKey} gallery={galleries[view.galleryKey]} />
      )}
    </PortfolioShell>
  );
}
