"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import {
  aboutParagraphs,
  galleries,
  gallerySections,
  getGalleryHref,
  homeSlideshowImages,
  presences,
  type ImageItem,
  type GalleryKey,
} from "../lib/portfolio";

type PortfolioView =
  | { type: "home" }
  | { type: "about" }
  | { type: "gallery"; galleryKey: GalleryKey };

type PortfolioSiteProps = {
  view: PortfolioView;
};

export default function PortfolioSite({ view }: PortfolioSiteProps) {
  const isHomeView = view.type === "home";
  const isAboutView = view.type === "about";
  const activeGallery = view.type === "gallery" ? galleries[view.galleryKey] : null;
  const activeGalleryImages = activeGallery?.images ?? [];
  const activeGalleryTitle = activeGallery?.title ?? null;
  const isStrictGridGallery = activeGallery?.isStrictGrid ?? false;
  const isExhibitionWallGallery = activeGallery?.layout === "exhibition-wall";

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(view.type === "gallery");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [homeSlideIndex, setHomeSlideIndex] = useState(0);
  const [isHomeSlideshowHovered, setIsHomeSlideshowHovered] = useState(false);
  const [previousHomeSlideIndex, setPreviousHomeSlideIndex] = useState<number | null>(null);
  const galleryToggleLabel = isGridView ? "Switch to slideshow view" : "Switch to grid view";

  const currentImage =
    activeGalleryImages.length > 0
      ? activeGalleryImages[
          ((currentSlideIndex % activeGalleryImages.length) +
            activeGalleryImages.length) %
            activeGalleryImages.length
        ]
      : null;

  const homeCurrentImage =
    homeSlideshowImages.length > 0
      ? homeSlideshowImages[
          ((homeSlideIndex % homeSlideshowImages.length) +
            homeSlideshowImages.length) %
            homeSlideshowImages.length
        ]
      : null;

  const previousHomeImage =
    previousHomeSlideIndex !== null && homeSlideshowImages.length > 0
      ? homeSlideshowImages[
          ((previousHomeSlideIndex % homeSlideshowImages.length) +
            homeSlideshowImages.length) %
            homeSlideshowImages.length
        ]
      : null;

  const stepHomeSlide = useCallback((delta: number) => {
    setHomeSlideIndex((index) => {
      setPreviousHomeSlideIndex(index);
      return index + delta;
    });
  }, []);

  useEffect(() => {
    const canUseGalleryArrowNavigation =
      view.type === "gallery" && !isGridView && activeGalleryImages.length > 0;
    const canUseHomeArrowNavigation = isHomeView && homeSlideshowImages.length > 1;

    if (!canUseGalleryArrowNavigation && !canUseHomeArrowNavigation) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTypingTarget) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (canUseHomeArrowNavigation) {
          stepHomeSlide(-1);
        } else {
          setCurrentSlideIndex((index) => index - 1);
        }
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (canUseHomeArrowNavigation) {
          stepHomeSlide(1);
        } else {
          setCurrentSlideIndex((index) => index + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGalleryImages.length, isGridView, isHomeView, stepHomeSlide, view.type]);

  useEffect(() => {
    if (!isHomeView || isHomeSlideshowHovered || homeSlideshowImages.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      stepHomeSlide(1);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [isHomeSlideshowHovered, isHomeView, stepHomeSlide]);

  useEffect(() => {
    if (previousHomeSlideIndex === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousHomeSlideIndex(null);
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [previousHomeSlideIndex]);

  const navLinkClass = (active: boolean) =>
    `flex min-h-11 items-center border-0 bg-transparent p-0 text-left font-sans text-sm leading-6 font-medium tracking-[0.01em] transition-colors hover:text-[#0B2A6F] lg:block lg:min-h-0 ${
      active ? "text-accent underline underline-offset-4" : "text-[#534941]"
    }`;

  const navigationGalleryKeys = gallerySections.flatMap((section) => section.galleryKeys);

  return (
    <div className="page-shell" onContextMenu={(event) => event.preventDefault()}>
      <div className="flex w-full flex-1 flex-col gap-10 px-6 pb-10 pt-6 md:flex-row md:gap-10 md:px-10 lg:gap-16">
        <aside className="w-full md:sticky md:top-6 md:h-fit md:w-40 md:flex-none md:self-start lg:w-48">
          <div className="mt-4 md:mt-0">
            <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
              <Link
                href="/"
                className="font-display whitespace-nowrap text-[clamp(1.4rem,7vw,1.75rem)] leading-none font-bold tracking-[0.02em] text-ink"
                onClick={() => setIsMobileNavOpen(false)}
              >
                IVAN BADANJAK
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen((current) => !current)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-line text-ink transition-colors hover:text-[#0B2A6F]"
                aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileNavOpen}
                aria-controls="portfolio-navigation"
              >
                {isMobileNavOpen ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mb-4 hidden pt-2 md:block">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="font-display text-[1.75rem] leading-[0.92] font-bold tracking-[0.02em] text-ink lg:text-[2.15rem]"
                >
                  IVAN BADANJAK
                </Link>
              </div>
            </div>
            <div
              id="portfolio-navigation"
              className={!isMobileNavOpen ? "hidden md:block" : "md:block"}
            >
              <nav className="mt-7 text-sm">
                <div className="grid gap-1">
                  {navigationGalleryKeys.map((galleryKey) => {
                    const gallery = galleries[galleryKey];
                    const isActive = activeGallery?.key === galleryKey;

                    return (
                      <Link
                        key={gallery.key}
                        href={getGalleryHref(gallery.key)}
                        className={navLinkClass(isActive)}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setIsMobileNavOpen(false)}
                      >
                        {gallery.navLabel}
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href="/about"
                  className={`flex min-h-11 items-center border-0 bg-transparent p-0 text-left font-sans text-sm leading-6 font-medium tracking-[0.01em] transition-colors hover:text-[#0B2A6F] md:mt-1 lg:block lg:min-h-0 ${
                    isAboutView ? "text-accent underline underline-offset-4" : "text-[#534941]"
                  }`}
                  aria-current={isAboutView ? "page" : undefined}
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  About
                </Link>
              </nav>

              <div className="mt-10">
                <div className="flex items-center gap-3">
                  {presences.map((presence) => (
                    <a
                      key={presence.name}
                      href={presence.href}
                      aria-label={presence.name}
                      className="group flex h-11 w-11 items-center justify-start lg:h-8 lg:w-7"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="sr-only">{presence.name}</span>
                      <img
                        src={presence.iconSrc}
                        alt={presence.name}
                        className="h-5 w-5 object-contain"
                      />
                    </a>
                  ))}
                </div>
                <div className="mt-1 grid gap-1 text-sm">
                  <a
                    href="tel:+306943216408"
                    className="inline-flex min-h-11 items-center text-sm text-black transition-colors hover:text-accent lg:min-h-0"
                  >
                    +306943216408
                  </a>
                  <span className="text-sm text-black">ivanb.jpg@gmail.com</span>
                </div>
                <div className="mt-4 text-xs text-muted">
                  © {new Date().getFullYear()} Ivan Badanjak. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {isHomeView ? (
            <section className="flex h-full items-center justify-center">
              <div
                className="flex w-full flex-col items-center gap-4"
                onMouseEnter={() => setIsHomeSlideshowHovered(true)}
                onMouseLeave={() => setIsHomeSlideshowHovered(false)}
              >
                {homeCurrentImage ? (
                  <div className="inline-flex max-w-full flex-col gap-4">
                    <div className="relative inline-block max-w-full overflow-hidden">
                      <img
                        src={homeCurrentImage.src}
                        alt=""
                        aria-hidden="true"
                        className="invisible block h-auto w-auto max-h-[74vh] max-w-full border border-line bg-paper object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                      {previousHomeImage ? (
                        <div className="home-slide-layer home-slide-exit absolute inset-0 flex items-center justify-center">
                          <img
                            src={previousHomeImage.src}
                            alt={previousHomeImage.alt}
                            className="h-auto w-auto max-h-[74vh] max-w-full border border-line bg-paper object-contain"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : null}
                      <div
                        className={`home-slide-layer absolute inset-0 flex items-center justify-center ${
                          previousHomeImage ? "home-slide-enter" : ""
                        }`}
                      >
                        <img
                          src={homeCurrentImage.src}
                          alt={homeCurrentImage.alt}
                          className="h-auto w-auto max-h-[74vh] max-w-full border border-line bg-paper object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <div className="flex w-full flex-wrap items-center justify-between gap-4 text-sm">
                      <Link
                        href={getGalleryHref(homeCurrentImage.gallery)}
                        className="inline-flex min-h-11 items-center border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent lg:min-h-0"
                      >
                        {homeCurrentImage.albumLabel}
                      </Link>
                      <div className="flex items-center gap-2 text-muted">
                        <button
                          type="button"
                          onClick={() => stepHomeSlide(-1)}
                          className="min-h-11 min-w-11 border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
                          aria-label="Previous homepage image"
                        >
                          Previous
                        </button>
                        <span aria-hidden="true">/</span>
                        <button
                          type="button"
                          onClick={() => stepHomeSlide(1)}
                          className="min-h-11 min-w-11 border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
                          aria-label="Next homepage image"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          ) : isAboutView ? (
            <section className="mx-auto w-full max-w-[42rem]">
              <h3 className="font-sans text-3xl font-semibold text-black">About</h3>
              <div className="mt-6 grid gap-5 text-left font-sans text-base leading-relaxed text-black md:[text-align:justify]">
                {aboutParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ) : activeGallery ? (
            <section>
              <div className="mx-auto flex max-w-5xl items-start gap-3">
                <h3 className="min-w-0 flex-1 font-sans text-[1.75rem] leading-tight font-semibold text-black sm:text-3xl">
                  {activeGalleryTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsGridView((current) => !current)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-white p-0 text-gray-900 transition-colors hover:text-accent lg:h-8 lg:w-8"
                  aria-label={galleryToggleLabel}
                  title={galleryToggleLabel}
                >
                  {isGridView ? (
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                      <rect x="3" y="3" width="8" height="8" />
                      <rect x="13" y="3" width="8" height="8" />
                      <rect x="3" y="13" width="8" height="8" />
                      <rect x="13" y="13" width="8" height="8" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                      <rect x="4" y="4" width="16" height="16" />
                    </svg>
                  )}
                </button>
              </div>
              {isGridView ? (
                isExhibitionWallGallery ? (
                  <ExhibitionWallGrid
                    images={activeGalleryImages}
                    onSelect={(index) => {
                      setCurrentSlideIndex(index);
                      setIsGridView(false);
                    }}
                  />
                ) : (
                  <div
                    className={
                      isStrictGridGallery
                        ? "mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3"
                        : "mx-auto mt-6 max-w-5xl columns-1 gap-2 md:columns-2 xl:columns-3"
                    }
                  >
                    {activeGalleryImages.map((image, index) => (
                      <figure
                        key={image.src}
                        className={
                          isStrictGridGallery
                            ? "w-full overflow-hidden border border-line bg-glass"
                            : "mb-2 inline-block w-full overflow-hidden border border-line bg-glass [break-inside:avoid]"
                        }
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentSlideIndex(index);
                            setIsGridView(false);
                          }}
                          className="block w-full border-0 bg-transparent p-0"
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="h-auto w-full"
                            loading="lazy"
                            decoding="async"
                          />
                        </button>
                      </figure>
                    ))}
                  </div>
                )
              ) : (
                <div className="mt-6 flex justify-center">
                  <div className="inline-flex max-w-full flex-col items-end gap-3">
                    {currentImage ? (
                      <img
                        src={currentImage.src}
                        alt={currentImage.alt}
                        className="h-auto w-auto max-h-[68vh] max-w-full border border-line bg-paper"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <button
                        type="button"
                        onClick={() => setCurrentSlideIndex((index) => index - 1)}
                        className="min-h-11 min-w-11 border-0 bg-transparent p-0 text-sm text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
                        aria-label="Previous photo"
                      >
                        Previous
                      </button>
                      <span aria-hidden="true">/</span>
                      <button
                        type="button"
                        onClick={() => setCurrentSlideIndex((index) => index + 1)}
                        className="min-h-11 min-w-11 border-0 bg-transparent p-0 text-sm text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
                        aria-label="Next photo"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeGallery.introParagraphs?.length ? (
                <div className="mx-auto mt-6 w-full max-w-5xl bg-glass p-5 md:p-7">
                  <div className="grid gap-4 text-left font-sans text-[15px] leading-7 text-black md:text-base md:[text-align:justify]">
                    {activeGallery.introParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

const EXHIBITION_WALL_WIDTH = 320;
const EXHIBITION_WALL_HEIGHT = 170;

function ExhibitionWallGrid({
  images,
  onSelect,
}: {
  images: ImageItem[];
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="exhibition-wall-scroll mx-auto mt-6 max-w-[82rem] overflow-x-auto pb-4"
      aria-label="Scrollable Jaima exhibition wall"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          event.currentTarget.scrollBy({
            left: event.key === "ArrowLeft" ? -96 : 96,
          });
        }
      }}
    >
      <div className="exhibition-wall" aria-label="Jaima exhibition wall layout">
        {images.map((image, index) => {
          if (!image.wallPlacement) {
            return null;
          }

          const { x, y, width, height } = image.wallPlacement;
          const style = {
            "--x": `${(x / EXHIBITION_WALL_WIDTH) * 100}%`,
            "--y": `${(y / EXHIBITION_WALL_HEIGHT) * 100}%`,
            "--w": `${(width / EXHIBITION_WALL_WIDTH) * 100}%`,
            "--h": `${(height / EXHIBITION_WALL_HEIGHT) * 100}%`,
          } as CSSProperties;

          return (
            <figure key={image.src} className="exhibition-wall-print" style={style}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                className="block h-full w-full border-0 bg-transparent p-0"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </button>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
