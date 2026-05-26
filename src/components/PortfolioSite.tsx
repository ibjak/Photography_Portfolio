"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  aboutParagraphs,
  galleries,
  gallerySections,
  getGalleryHref,
  homeSlideshowImages,
  presences,
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

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(view.type === "gallery");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [homeSlideIndex, setHomeSlideIndex] = useState(0);
  const [isHomeSlideshowHovered, setIsHomeSlideshowHovered] = useState(false);
  const [previousHomeSlideIndex, setPreviousHomeSlideIndex] = useState<number | null>(null);

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
    `border-0 bg-transparent p-0 text-left font-sans text-sm leading-6 font-medium tracking-[0.01em] transition-colors hover:text-[#0B2A6F] ${
      active ? "text-accent underline underline-offset-4" : "text-[#534941]"
    }`;

  const navigationGalleryKeys = gallerySections.flatMap((section) => section.galleryKeys);

  return (
    <div className="page-shell" onContextMenu={(event) => event.preventDefault()}>
      <div className="flex w-full flex-1 flex-col gap-10 px-6 pb-10 pt-6 md:flex-row md:px-10 lg:gap-16">
        <aside className="w-full md:w-1/8 md:h-fit md:flex-none md:self-start md:sticky md:top-6">
          <div className="mt-4 md:mt-0">
            <div className="mb-4 flex items-center justify-between md:hidden">
              <Link
                href="/"
                className="font-display text-[1.75rem] leading-none font-bold tracking-[0.02em] text-ink"
                onClick={() => setIsMobileNavOpen(false)}
              >
                IVAN BADANJAK
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen((current) => !current)}
                className="inline-flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:text-[#0B2A6F]"
                aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
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
                  className="font-display text-[2.35rem] leading-[0.92] font-bold tracking-[0.02em] text-ink lg:text-[2.65rem]"
                >
                  IVAN BADANJAK
                </Link>
              </div>
            </div>
            <div className={!isMobileNavOpen ? "hidden md:block" : "md:block"}>
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
                  className={`mt-1 block border-0 bg-transparent p-0 text-left font-sans text-sm leading-6 font-medium tracking-[0.01em] transition-colors hover:text-[#0B2A6F] ${
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
                      className="group flex h-8 w-7 items-center justify-left"
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
                  <span className="text-sm text-black">ivanb.jpg@gmail.com</span>
                </div>
                <div className="mt-4 text-xs text-muted">
                  © {new Date().getFullYear()} Ivan Badanjak. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
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
                        className="border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent"
                      >
                        {homeCurrentImage.albumLabel}
                      </Link>
                      <div className="flex items-center gap-2 text-muted">
                        <button
                          type="button"
                          onClick={() => stepHomeSlide(-1)}
                          className="border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent"
                          aria-label="Previous homepage image"
                        >
                          Previous
                        </button>
                        <span aria-hidden="true">/</span>
                        <button
                          type="button"
                          onClick={() => stepHomeSlide(1)}
                          className="border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent"
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
              <div className="mt-6 grid gap-5 font-sans text-base leading-relaxed text-black [text-align:justify]">
                {aboutParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ) : activeGallery ? (
            <section>
              <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
                <h3 className="font-sans text-3xl font-semibold text-black">{activeGalleryTitle}</h3>
                <button
                  type="button"
                  onClick={() => setIsGridView((current) => !current)}
                  className="ml-auto bg-white p-1 text-gray-900 transition-colors hover:text-accent"
                >
                  {isGridView ? (
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                      <rect x="4" y="6" width="18" height="18" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                      <rect x="3" y="3" width="9" height="9" />
                      <rect x="14" y="3" width="9" height="9" />
                      <rect x="3" y="14" width="9" height="9" />
                      <rect x="14" y="14" width="9" height="9" />
                    </svg>
                  )}
                </button>
              </div>
              {isGridView ? (
                <div
                  className={
                    isStrictGridGallery
                      ? "mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2"
                      : "mx-auto mt-6 max-w-5xl columns-1 gap-6 md:columns-2"
                  }
                >
                  {activeGalleryImages.map((image, index) => (
                    <figure
                      key={image.src}
                      className={
                        isStrictGridGallery
                          ? "w-full overflow-hidden border border-line bg-glass"
                          : "mb-6 inline-block w-full overflow-hidden border border-line bg-glass [break-inside:avoid]"
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
                        className="border-0 bg-transparent p-0 text-sm text-muted transition-colors hover:text-accent"
                        aria-label="Previous photo"
                      >
                        Previous
                      </button>
                      <span aria-hidden="true">/</span>
                      <button
                        type="button"
                        onClick={() => setCurrentSlideIndex((index) => index + 1)}
                        className="border-0 bg-transparent p-0 text-sm text-muted transition-colors hover:text-accent"
                        aria-label="Next photo"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
