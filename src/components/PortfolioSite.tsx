"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import {
  aboutParagraphs,
  galleries,
  getGalleryHref,
  homeSlideshowImages,
  navigationGroups,
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

type GalleryViewMode = "wall" | "grid" | "slideshow";

export default function PortfolioSite({ view }: PortfolioSiteProps) {
  const isHomeView = view.type === "home";
  const isAboutView = view.type === "about";
  const activeGallery = view.type === "gallery" ? galleries[view.galleryKey] : null;
  const activeGalleryImages = activeGallery?.images ?? [];
  const activeGalleryTitle = activeGallery?.title ?? null;
  const isJaimaMultiViewGallery = activeGallery?.layout === "exhibition-wall";

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [galleryViewMode, setGalleryViewMode] = useState<GalleryViewMode>(
    isJaimaMultiViewGallery ? "wall" : "grid",
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [homeSlideIndex, setHomeSlideIndex] = useState(0);
  const [isHomeSlideshowHovered, setIsHomeSlideshowHovered] = useState(false);
  const [previousHomeSlideIndex, setPreviousHomeSlideIndex] = useState<number | null>(null);
  const normalizedCurrentSlideIndex =
    activeGalleryImages.length > 0
      ? ((currentSlideIndex % activeGalleryImages.length) +
          activeGalleryImages.length) %
        activeGalleryImages.length
      : 0;
  const currentImage = activeGalleryImages[normalizedCurrentSlideIndex] ?? null;

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
      view.type === "gallery" &&
      galleryViewMode === "slideshow" &&
      activeGalleryImages.length > 0;
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
  }, [activeGalleryImages.length, galleryViewMode, isHomeView, stepHomeSlide, view.type]);

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
    `flex min-h-11 items-center border-0 bg-transparent p-0 text-left font-sans text-[13px] leading-5 font-normal tracking-[0.015em] transition-colors hover:text-[#0B2A6F] lg:block lg:min-h-0 ${
      active ? "text-accent underline underline-offset-4" : "text-[#534941]"
    }`;

  const longTermProjects = navigationGroups.find(
    (group) => group.key === "long-term-project",
  );
  const shortTermProjects = navigationGroups.find(
    (group) => group.key === "short-term-projects",
  );
  const isShortTermProjectActive =
    activeGallery !== null &&
    shortTermProjects?.galleryKeys.includes(activeGallery.key);

  return (
    <div className="page-shell" onContextMenu={(event) => event.preventDefault()}>
      <div className="flex w-full flex-1 flex-col gap-12 px-6 pb-12 pt-6 md:flex-row md:gap-12 md:px-10 lg:gap-16 lg:pb-16">
        <aside className="w-full md:sticky md:top-6 md:h-fit md:w-40 md:flex-none md:self-start lg:w-48">
          <div className="mt-4 md:mt-0">
            <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
              <Link
                href="/"
                className="font-display whitespace-nowrap text-[clamp(1.55rem,7vw,1.9rem)] leading-none font-semibold tracking-[-0.01em] text-ink"
                onClick={() => setIsMobileNavOpen(false)}
              >
                Ivan Badanjak
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
                  className="font-display text-[1.9rem] leading-[0.95] font-semibold tracking-[-0.015em] text-ink lg:text-[2.2rem]"
                >
                  Ivan Badanjak
                </Link>
              </div>
            </div>
            <div
              id="portfolio-navigation"
              className={!isMobileNavOpen ? "hidden md:block" : "md:block"}
            >
              <nav className="mt-7">
                <details
                  className="group"
                  open={activeGallery?.key === "jaima" || undefined}
                >
                  <summary className="summary-clean flex min-h-11 items-center justify-between gap-3 font-sans text-[13px] leading-5 font-normal tracking-[0.015em] text-[#534941] transition-colors hover:text-[#0B2A6F] lg:min-h-0">
                    <span>{longTermProjects?.title}</span>
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3 shrink-0 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      aria-hidden="true"
                    >
                      <path d="m2.5 4.25 3.5 3.5 3.5-3.5" />
                    </svg>
                  </summary>
                  <div className="mt-2 grid gap-2 border-l border-line pl-4">
                    {longTermProjects?.galleryKeys.map((galleryKey) => {
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
                </details>

                <details
                  className="group mt-4"
                  open={isShortTermProjectActive || undefined}
                >
                  <summary className="summary-clean flex min-h-11 items-center justify-between gap-3 font-sans text-[13px] leading-5 font-normal tracking-[0.015em] text-[#534941] transition-colors hover:text-[#0B2A6F] lg:min-h-0">
                    <span>{shortTermProjects?.title}</span>
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3 shrink-0 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      aria-hidden="true"
                    >
                      <path d="m2.5 4.25 3.5 3.5 3.5-3.5" />
                    </svg>
                  </summary>
                  <div className="mt-3 grid gap-2 border-l border-line pl-4">
                    {shortTermProjects?.galleryKeys.map((galleryKey) => {
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
                </details>
                <Link
                  href="/about"
                  className={`mt-4 flex min-h-11 items-center border-0 bg-transparent p-0 text-left font-sans text-[13px] leading-5 font-normal tracking-[0.015em] transition-colors hover:text-[#0B2A6F] lg:block lg:min-h-0 ${
                    isAboutView ? "text-accent underline underline-offset-4" : "text-[#534941]"
                  }`}
                  aria-current={isAboutView ? "page" : undefined}
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  About
                </Link>
              </nav>

              <div className="mt-14">
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
                <div className="mt-2 grid gap-1 font-sans text-[12px] leading-[1.45]">
                  <a
                    href="tel:+306943216408"
                    className="inline-flex min-h-11 items-center text-black transition-colors hover:text-accent lg:min-h-0"
                  >
                    +306943216408
                  </a>
                  <span className="text-black">ivanb.jpg@gmail.com</span>
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
                          aria-keyshortcuts="ArrowLeft"
                        >
                          <span aria-hidden="true">←</span> Previous
                        </button>
                        <span aria-hidden="true">/</span>
                        <button
                          type="button"
                          onClick={() => stepHomeSlide(1)}
                          className="min-h-11 min-w-11 border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
                          aria-label="Next homepage image"
                          aria-keyshortcuts="ArrowRight"
                        >
                          Next <span aria-hidden="true">→</span>
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
              <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-start">
                <h3 className="min-w-0 flex-1 font-sans text-[1.75rem] leading-tight font-semibold text-black sm:text-3xl">
                  {activeGalleryTitle}
                </h3>
                <div className="inline-flex shrink-0 self-end sm:self-auto">
                  <div className="inline-flex border border-line bg-white" role="group" aria-label="Gallery view">
                    {isJaimaMultiViewGallery ? (
                      <button
                        type="button"
                        onClick={() => setGalleryViewMode("wall")}
                        className={`inline-flex min-h-14 min-w-[4.75rem] flex-col items-center justify-center gap-1 px-2 py-1.5 text-[11px] leading-none transition-colors ${
                          galleryViewMode === "wall"
                            ? "bg-[#1d1a16] text-white"
                            : "bg-white text-muted hover:text-accent"
                        }`}
                        aria-pressed={galleryViewMode === "wall"}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <rect x="2.5" y="5" width="7" height="6" />
                          <rect x="13" y="3" width="8.5" height="8" />
                          <rect x="6" y="14" width="10" height="7" />
                        </svg>
                        <span>Wall</span>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setGalleryViewMode("grid")}
                      className={`inline-flex min-h-14 min-w-[4.75rem] flex-col items-center justify-center gap-1 px-2 py-1.5 text-[11px] leading-none transition-colors ${
                        isJaimaMultiViewGallery ? "border-l border-line" : ""
                      } ${
                        galleryViewMode === "grid"
                          ? "bg-[#1d1a16] text-white"
                          : "bg-white text-muted hover:text-accent"
                      }`}
                      aria-pressed={galleryViewMode === "grid"}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="8" height="6" />
                        <rect x="13" y="3" width="8" height="10" />
                        <rect x="3" y="11" width="8" height="10" />
                        <rect x="13" y="15" width="8" height="6" />
                      </svg>
                      <span>{isJaimaMultiViewGallery ? "Grid" : "Sequence"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryViewMode("slideshow")}
                      className={`inline-flex min-h-14 min-w-[4.75rem] flex-col items-center justify-center gap-1 border-l border-line px-2 py-1.5 text-[11px] leading-none transition-colors ${
                        galleryViewMode === "slideshow"
                          ? "bg-[#1d1a16] text-white"
                          : "bg-white text-muted hover:text-accent"
                      }`}
                      aria-pressed={galleryViewMode === "slideshow"}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        aria-hidden="true"
                      >
                        <rect x="3.5" y="5" width="17" height="14" />
                        <path d="m6.5 16 4-4 3 3 2-2 2 2" />
                      </svg>
                      <span>Slideshow</span>
                    </button>
                  </div>
                </div>
              </div>
              {!isJaimaMultiViewGallery && activeGallery.introParagraphs?.length ? (
                <div className="mx-auto mt-8 w-full max-w-5xl">
                  <div className="max-w-[44rem] border-t border-line pt-5">
                    <div className="grid gap-4 text-left font-sans text-[14px] leading-6 text-black md:text-[15px] md:leading-7">
                      {activeGallery.introParagraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
              {galleryViewMode !== "slideshow" ? (
                isJaimaMultiViewGallery && galleryViewMode === "wall" ? (
                  <ExhibitionWallGrid
                    images={activeGalleryImages}
                    onSelect={(index) => {
                      setCurrentSlideIndex(index);
                      setGalleryViewMode("slideshow");
                    }}
                  />
                ) : isJaimaMultiViewGallery ? (
                  <JaimaEditorialGrid
                    images={activeGalleryImages}
                    onSelect={(index) => {
                      setCurrentSlideIndex(index);
                      setGalleryViewMode("slideshow");
                    }}
                  />
                ) : (
                  <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
                    {activeGalleryImages.map((image, index) => (
                      <figure
                        key={image.src}
                        className={`w-full overflow-hidden border border-line bg-glass ${
                          index === 0 ? "md:col-span-2 md:mx-auto md:max-w-[78%]" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentSlideIndex(index);
                            setGalleryViewMode("slideshow");
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
                    <div className="w-full text-sm text-muted">
                      <div className="flex w-full items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => setCurrentSlideIndex((index) => index - 1)}
                          className="inline-flex min-h-11 min-w-11 items-center gap-1 border-0 bg-transparent p-0 text-sm text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
                          aria-label="Previous photo"
                          aria-keyshortcuts="ArrowLeft"
                        >
                          <span aria-hidden="true">←</span> Previous
                        </button>
                        <span className="text-xs tabular-nums" aria-live="polite">
                          <span className="sr-only">Photo </span>
                          {normalizedCurrentSlideIndex + 1} / {activeGalleryImages.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentSlideIndex((index) => index + 1)}
                          className="inline-flex min-h-11 min-w-11 items-center justify-end gap-1 border-0 bg-transparent p-0 text-sm text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
                          aria-label="Next photo"
                          aria-keyshortcuts="ArrowRight"
                        >
                          Next <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isJaimaMultiViewGallery && activeGallery.introParagraphs?.length ? (
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

const JAIMA_EDITORIAL_PLACEMENTS = [
  "md:col-span-10 md:col-start-2",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6 md:col-start-4",
] as const;

function JaimaEditorialGrid({
  images,
  onSelect,
}: {
  images: ImageItem[];
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-12 md:gap-x-10 md:gap-y-16"
      aria-label="Jaima editorial photo sequence"
    >
      {images.map((image, index) => (
        <figure
          key={image.src}
          className={`m-0 self-start ${JAIMA_EDITORIAL_PLACEMENTS[index] ?? "md:col-span-6"}`}
        >
          <button
            type="button"
            onClick={() => onSelect(index)}
            className="block w-full border-0 bg-transparent p-0"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-auto w-full border border-line bg-paper"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </button>
        </figure>
      ))}
    </div>
  );
}
