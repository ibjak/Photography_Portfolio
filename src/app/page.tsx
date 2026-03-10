"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const aboutParagraphs = [
  "Ivan Badanjak is a documentary photographer and researcher whose work explores themes of migration, identity, and cultural preservation. He holds a Master's degree in Migration, Mobility and Development from SOAS University of London, where he developed a strong interest in the everyday experiences of diaspora communities and the ways cultural identity is maintained far from home.",
  "Currently based in Paris, he is studying documentary photography while developing long-term visual projects that examine belonging, integration, and memory within migrant communities. Alongside his documentary work, he practices street photography as a way of exploring the city and its rhythms. He is also known for stopping to greet nearly every dog he encounters and take fabulous pictures of them. He attends protests to photograph and convey the intensity of collective movements.",
  "Ivan's work is informed by his background in humanitarian organizations and reflects an ongoing interest in the intersection of visual storytelling, social inquiry, and contemporary migration narratives.",
];

const qatarPrixImages = [
  {
    src: "/Photo%20Gallery/qatar%20GP%20longchamp/IAB_20251005_03756.jpg",
    alt: "Qatar Prix De L'Arc De Triomphe 2025 photo 1",
  },
  {
    src: "/Photo%20Gallery/qatar%20GP%20longchamp/IAB_20251005_03773.jpg",
    alt: "Qatar Prix De L'Arc De Triomphe 2025 photo 2",
  },
  {
    src: "/Photo%20Gallery/qatar%20GP%20longchamp/IAB_20251005_03787.jpg",
    alt: "Qatar Prix De L'Arc De Triomphe 2025 photo 3",
  },
  {
    src: "/Photo%20Gallery/qatar%20GP%20longchamp/IAB_20251005_03897.jpg",
    alt: "Qatar Prix De L'Arc De Triomphe 2025 photo 4",
  },
  {
    src: "/Photo%20Gallery/qatar%20GP%20longchamp/IAB_20251005_03918.jpg",
    alt: "Qatar Prix De L'Arc De Triomphe 2025 photo 5",
  },
  {
    src: "/Photo%20Gallery/qatar%20GP%20longchamp/IAB_20251005_03921.jpg",
    alt: "Qatar Prix De L'Arc De Triomphe 2025 photo 6",
  },
];

const bataclanImages = [
  {
    src: "/Photo%20Gallery/Bataclan%2010%20year%20anniversary/IAB_20251113_00055.jpg",
    alt: "Bataclan 10 Year Anniversary Commemoration photo 1",
  },
  {
    src: "/Photo%20Gallery/Bataclan%2010%20year%20anniversary/IAB_20251113_00058.jpg",
    alt: "Bataclan 10 Year Anniversary Commemoration photo 2",
  },
  {
    src: "/Photo%20Gallery/Bataclan%2010%20year%20anniversary/IAB_20251113_00063.jpg",
    alt: "Bataclan 10 Year Anniversary Commemoration photo 3",
  },
  {
    src: "/Photo%20Gallery/Bataclan%2010%20year%20anniversary/IAB_20251113_00078.jpg",
    alt: "Bataclan 10 Year Anniversary Commemoration photo 4",
  },
  {
    src: "/Photo%20Gallery/Bataclan%2010%20year%20anniversary/IAB_20251113_00106.jpg",
    alt: "Bataclan 10 Year Anniversary Commemoration photo 5",
  },
];

const internationalSolidarityPalestineImages = [
  {
    src: "/Photo%20Gallery/International%20Day%20of%20Solidarity%20with%20Palestine%20Nov%202025/IAB_20251129_00040.jpg",
    alt: "International Day of Solidarity with Palestine 2025 photo 1",
  },
  {
    src: "/Photo%20Gallery/International%20Day%20of%20Solidarity%20with%20Palestine%20Nov%202025/IAB_20251129_00085.jpg",
    alt: "International Day of Solidarity with Palestine 2025 photo 2",
  },
  {
    src: "/Photo%20Gallery/International%20Day%20of%20Solidarity%20with%20Palestine%20Nov%202025/IAB_20251129_00140.jpg",
    alt: "International Day of Solidarity with Palestine 2025 photo 3",
  },
  {
    src: "/Photo%20Gallery/International%20Day%20of%20Solidarity%20with%20Palestine%20Nov%202025/IAB_20251129_00156.jpg",
    alt: "International Day of Solidarity with Palestine 2025 photo 4",
  },
  {
    src: "/Photo%20Gallery/International%20Day%20of%20Solidarity%20with%20Palestine%20Nov%202025/IAB_20251129_00187.jpg",
    alt: "International Day of Solidarity with Palestine 2025 photo 5",
  },
];

const eliminationViolenceWomenImages = [
  {
    src: "/Photo%20Gallery/Elimination%20of%20Violence%20against%20Women%20Day%202025/IAB_20251122_00014.jpg",
    alt: "Elimination of Violence against Women Day 2025 photo 1",
  },
  {
    src: "/Photo%20Gallery/Elimination%20of%20Violence%20against%20Women%20Day%202025/IAB_20251122_00209.jpg",
    alt: "Elimination of Violence against Women Day 2025 photo 2",
  },
  {
    src: "/Photo%20Gallery/Elimination%20of%20Violence%20against%20Women%20Day%202025/IAB_20251122_00285.jpg",
    alt: "Elimination of Violence against Women Day 2025 photo 3",
  },
  {
    src: "/Photo%20Gallery/Elimination%20of%20Violence%20against%20Women%20Day%202025/IAB_20251122_00342.jpg",
    alt: "Elimination of Violence against Women Day 2025 photo 4",
  },
  {
    src: "/Photo%20Gallery/Elimination%20of%20Violence%20against%20Women%20Day%202025/IAB_20251122_00384.jpg",
    alt: "Elimination of Violence against Women Day 2025 photo 5",
  },
  {
    src: "/Photo%20Gallery/Elimination%20of%20Violence%20against%20Women%20Day%202025/IAB_20251122_00387.jpg",
    alt: "Elimination of Violence against Women Day 2025 photo 6",
  },
];

const protestsImages = [
  ...bataclanImages,
  ...internationalSolidarityPalestineImages,
  ...eliminationViolenceWomenImages,
];

const parisFashionWeekImages = [
  {
    src: "/Photo%20Gallery/Paris%20Fashion%20Week%20(October%202025)/IAB_20251003_02197.jpg",
    alt: "Paris Fashion Week 2025 photo 1",
  },
  {
    src: "/Photo%20Gallery/Paris%20Fashion%20Week%20(October%202025)/IAB_20251003_02317.jpg",
    alt: "Paris Fashion Week 2025 photo 2",
  },
  {
    src: "/Photo%20Gallery/Paris%20Fashion%20Week%20(October%202025)/IAB_20251003_02365.jpg",
    alt: "Paris Fashion Week 2025 photo 3",
  },
  {
    src: "/Photo%20Gallery/Paris%20Fashion%20Week%20(October%202025)/IAB_20251003_02379.jpg",
    alt: "Paris Fashion Week 2025 photo 4",
  },
  {
    src: "/Photo%20Gallery/Paris%20Fashion%20Week%20(October%202025)/IAB_20251003_02394.jpg",
    alt: "Paris Fashion Week 2025 photo 5",
  },
  {
    src: "/Photo%20Gallery/Paris%20Fashion%20Week%20(October%202025)/IAB_20251003_02411.jpg",
    alt: "Paris Fashion Week 2025 photo 6",
  },
  {
    src: "/Photo%20Gallery/Paris%20Fashion%20Week%20(October%202025)/IAB_20251003_02422.jpg",
    alt: "Paris Fashion Week 2025 photo 7",
  },
  {
    src: "/Photo%20Gallery/Paris%20Fashion%20Week%20(October%202025)/IAB_20251003_02443.jpg",
    alt: "Paris Fashion Week 2025 photo 8",
  },
  {
    src: "/Photo%20Gallery/Paris%20Fashion%20Week%20(October%202025)/IAB_20251003_02461.jpg",
    alt: "Paris Fashion Week 2025 photo 9",
  },
];

const ssdNeonImages = [
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251119_00063.jpg",
    alt: "SSD Neon photo 1",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251119_00079.jpg",
    alt: "SSD Neon photo 2",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251119_00113.jpg",
    alt: "SSD Neon photo 3",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251119_00132.jpg",
    alt: "SSD Neon photo 5",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251119_00173.jpg",
    alt: "SSD Neon photo 6",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251119_00196.jpg",
    alt: "SSD Neon photo 7",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251119_00206.jpg",
    alt: "SSD Neon photo 8",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251119_00213.jpg",
    alt: "SSD Neon photo 9",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251119_00221.jpg",
    alt: "SSD Neon photo 10",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251119_00288.jpg",
    alt: "SSD Neon photo 11",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251122_00013-2.jpg",
    alt: "SSD Neon photo 12",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251123_00004.jpg",
    alt: "SSD Neon photo 13",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251123_00016.jpg",
    alt: "SSD Neon photo 14",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251124_00060.jpg",
    alt: "SSD Neon photo 15",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251202_00068.jpg",
    alt: "SSD Neon photo 16",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251202_00146.jpg",
    alt: "SSD Neon photo 17",
  },
  {
    src: "/Photo%20Gallery/SSD%20Neon%20/IAB_20251202_00151.jpg",
    alt: "SSD Neon photo 18",
  },
];

const dogsImages = [
  "IAB_20240404_00045.jpg",
  "IAB_20250224_00093.jpg",
  "IAB_20250322_00203.jpg",
  "IAB_20250916_00085.jpg",
  "IAB_20251001_01645.jpg",
  "IAB_20251011_00091.jpg",
  "IAB_20251011_00094.jpg",
  "IAB_20251012_00003.jpg",
  "IAB_20251012_00035.jpg",
  "IAB_20251012_00088.jpg",
  "IAB_20251024_00157.jpg",
  "IAB_20251024_00203.jpg",
  "IAB_20251101_00144.jpg",
  "IAB_20251101_00157.jpg",
  "IAB_20251101_00208.jpg",
  "IAB_20251101_00227.jpg",
  "IAB_20251101_00237.jpg",
  "IAB_20251101_00241.jpg",
  "IAB_20251103_00005.jpg",
  "IAB_20251111_00028.jpg",
  "IAB_20251111_00140.jpg",
  "IAB_20251111_00146.jpg",
  "IAB_20251210_00185.jpg",
  "IAB_20251223_00074.jpg",
  "IAB_20251226_00099.jpg",
  "IAB_20260104_00030.jpg",
  "IAB_20260115_00044.jpg",
].map((fileName, index) => ({
  src: `/Photo%20Gallery/Doggos/${fileName}`,
  alt: `Dogs photo ${index + 1}`,
}));

const presences = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ivan.jpg111/",
    iconSrc: "/social-icons/instagram.png",
  },
  {
    name: "Behance",
    href: "https://www.behance.net/ivanbadanjak",
    iconSrc: "/social-icons/behance.png",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ivan-alexios-badanjak/",
    iconSrc: "/social-icons/linkedin.png",
  },
];

type GalleryKey =
  | "protests"
  | "qatar-prix"
  | "paris-fashion-week-2025"
  | "ssd-neon"
  | "dogs";

type PersistedViewState = {
  activeGallery: GalleryKey | null;
  isHomeView: boolean;
  isAboutView: boolean;
  isGridView: boolean;
  currentSlideIndex: number;
};

const GALLERY_KEYS: GalleryKey[] = [
  "protests",
  "qatar-prix",
  "paris-fashion-week-2025",
  "ssd-neon",
  "dogs",
];
const VIEW_STATE_STORAGE_KEY = "ivan-portfolio-view-state-v1";

export default function Home() {
  const [activeGallery, setActiveGallery] = useState<GalleryKey | null>(null);
  const [isHomeView, setIsHomeView] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAboutView, setIsAboutView] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [hasRestoredView, setHasRestoredView] = useState(false);

  const activeGalleryTitle =
    activeGallery === "protests"
      ? "Protests"
      : activeGallery === "qatar-prix"
      ? "Qatar Prix De L'Arc De Triomphe 2025"
      : activeGallery === "paris-fashion-week-2025"
        ? "Paris Fashion Week 2025"
      : activeGallery === "ssd-neon"
        ? "SSD Neon"
      : activeGallery === "dogs"
        ? "Dogs"
      : null;

  const activeGalleryImages =
    activeGallery === "protests"
      ? protestsImages
      : activeGallery === "qatar-prix"
      ? qatarPrixImages
      : activeGallery === "paris-fashion-week-2025"
        ? parisFashionWeekImages
      : activeGallery === "ssd-neon"
        ? ssdNeonImages
      : activeGallery === "dogs"
        ? dogsImages
      : [];

  const currentImage =
    activeGalleryImages.length > 0
      ? activeGalleryImages[
          ((currentSlideIndex % activeGalleryImages.length) +
            activeGalleryImages.length) %
            activeGalleryImages.length
        ]
      : null;
  const isStrictGridGallery =
    activeGallery === "ssd-neon" || activeGallery === "protests";

  const openGallery = (gallery: GalleryKey) => {
    setActiveGallery(gallery);
    setIsHomeView(false);
    setIsMobileNavOpen(false);
    setIsAboutView(false);
    setIsGridView(true);
    setCurrentSlideIndex(0);
  };

  const openAbout = () => {
    setIsHomeView(false);
    setIsMobileNavOpen(false);
    setIsAboutView(true);
    setActiveGallery(null);
  };

  const openHome = () => {
    setIsHomeView(true);
    setIsMobileNavOpen(false);
    setIsAboutView(false);
    setActiveGallery(null);
    setIsGridView(false);
    setCurrentSlideIndex(0);
  };

  useEffect(() => {
    try {
      const rawState = window.localStorage.getItem(VIEW_STATE_STORAGE_KEY);
      if (!rawState) {
        return;
      }

      const parsedState = JSON.parse(rawState) as Partial<PersistedViewState>;
      const parsedGallery = parsedState.activeGallery;
      const isValidGallery =
        typeof parsedGallery === "string" &&
        GALLERY_KEYS.includes(parsedGallery as GalleryKey);

      let nextGallery: GalleryKey | null = isValidGallery
        ? (parsedGallery as GalleryKey)
        : null;
      let nextIsHome = parsedState.isHomeView === true;
      let nextIsAbout = parsedState.isAboutView === true;
      const nextIsGrid = parsedState.isGridView === true;
      const nextSlide =
        typeof parsedState.currentSlideIndex === "number" &&
        Number.isFinite(parsedState.currentSlideIndex)
          ? parsedState.currentSlideIndex
          : 0;

      if (nextIsHome) {
        nextGallery = null;
        nextIsAbout = false;
      } else if (nextIsAbout) {
        nextGallery = null;
      } else if (!nextGallery) {
        nextIsHome = true;
      }

      setActiveGallery(nextGallery);
      setIsHomeView(nextIsHome);
      setIsAboutView(nextIsAbout);
      setIsGridView(nextIsGrid);
      setCurrentSlideIndex(nextSlide);
    } catch {
      // Ignore malformed persisted state and keep defaults.
    } finally {
      setHasRestoredView(true);
    }
  }, []);

  useEffect(() => {
    if (!hasRestoredView) {
      return;
    }

    const nextState: PersistedViewState = {
      activeGallery,
      isHomeView,
      isAboutView,
      isGridView,
      currentSlideIndex,
    };

    try {
      window.localStorage.setItem(
        VIEW_STATE_STORAGE_KEY,
        JSON.stringify(nextState),
      );
    } catch {
      // Ignore localStorage write failures.
    }
  }, [
    activeGallery,
    currentSlideIndex,
    hasRestoredView,
    isAboutView,
    isGridView,
    isHomeView,
  ]);

  const canUseArrowNavigation =
    !isHomeView && !isAboutView && !isGridView && activeGalleryImages.length > 0;

  useEffect(() => {
    if (!canUseArrowNavigation) {
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
        setCurrentSlideIndex((index) => index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setCurrentSlideIndex((index) => index + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUseArrowNavigation]);

  return (
    <div className="page-shell">
      <div
        className={
          isHomeView
            ? "flex w-full flex-1 items-center justify-center px-6 pb-10 pt-6 md:px-10"
            : "flex w-full flex-1 flex-col gap-10 px-6 pb-10 pt-6 md:flex-row md:px-10 lg:gap-16"
        }
      >
        <aside
          className={
            isHomeView
              ? "w-full max-w-md"
              : "w-full md:w-1/6 md:flex-none md:self-start md:sticky md:top-6 md:h-fit"
          }
        >
          <div className={isHomeView ? "mt-0" : "mt-4 md:mt-0"}>
            {!isHomeView ? (
              <div className="mb-4 flex items-center justify-between md:hidden">
                <Link
                  href="/"
                  onClick={openHome}
                  className="font-display text-3xl leading-none font-bold text-ink"
                >
                  Ivan Badanjak
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
            ) : null}
            <div className={`mb-4 pt-2 ${!isHomeView ? "hidden md:block" : ""}`}>
              <div className="flex items-center">
                <Link
                  href="/"
                  onClick={openHome}
                  className="font-display text-4xl leading-none font-bold text-ink md:text-5xl"
                >
                  Ivan Badanjak
                </Link>
              </div>
            </div>
            <div
              className={
                !isHomeView && !isMobileNavOpen ? "hidden md:block" : ""
              }
            >
            <div className="border-t border-line pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                Portfolio
              </p>
            </div>

            <nav className="mt-6 grid gap-2 text-sm">
              <button
                type="button"
                onClick={() => openGallery("protests")}
                className={`border-0 bg-transparent p-0 text-left text-sm transition-colors hover:text-[#0B2A6F] ${
                  activeGallery === "protests"
                    ? "text-accent"
                    : "text-muted"
                }`}
              >
                Protests
              </button>
              <button
                type="button"
                onClick={() => openGallery("dogs")}
                className={`border-0 bg-transparent p-0 text-left text-sm transition-colors hover:text-[#0B2A6F] ${
                  activeGallery === "dogs"
                    ? "text-accent"
                    : "text-muted"
                }`}
              >
                Dogs
              </button>
              <details className="group">
                <summary className="summary-clean text-sm text-muted transition-colors hover:text-[#0B2A6F] group-open:text-accent">
                  Events
                </summary>
                <div className="mt-2 grid gap-2 pl-4">
                  <button
                    type="button"
                    onClick={() => openGallery("qatar-prix")}
                    className={`border-0 bg-transparent p-0 text-left text-sm transition-colors hover:text-[#0B2A6F] ${
                      activeGallery === "qatar-prix"
                        ? "text-accent"
                        : "text-muted"
                    }`}
                  >
                    Qatar Prix De L&apos;Arc De Triomphe 2025
                  </button>
                  <button
                    type="button"
                    onClick={() => openGallery("paris-fashion-week-2025")}
                    className={`border-0 bg-transparent p-0 text-left text-sm transition-colors hover:text-[#0B2A6F] ${
                      activeGallery === "paris-fashion-week-2025"
                        ? "text-accent"
                        : "text-muted"
                    }`}
                  >
                    Paris Fashion Week 2025
                  </button>
                </div>
              </details>
              <details className="group">
                <summary className="summary-clean text-sm text-muted transition-colors hover:text-[#0B2A6F] group-open:text-accent">
                  Street Photography
                </summary>
                <div className="mt-2 grid gap-2 pl-4">
                  <button
                    type="button"
                    onClick={() => openGallery("ssd-neon")}
                    className={`border-0 bg-transparent p-0 text-left text-sm transition-colors hover:text-[#0B2A6F] ${
                      activeGallery === "ssd-neon"
                        ? "text-accent"
                        : "text-muted"
                    }`}
                  >
                    SSD Neon
                  </button>
                </div>
              </details>
            </nav>

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                Info
              </p>
              <div className="mt-4 grid gap-2 text-sm">
                <button
                  type="button"
                  onClick={openAbout}
                  className={`border-0 bg-transparent p-0 text-left text-sm transition-colors hover:text-[#0B2A6F] ${
                    isAboutView
                      ? "text-accent"
                      : "text-muted"
                  }`}
                >
                  About
                </button>
              </div>
              <div className="mt-4 border-t border-line" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                Contact
              </p>
              <div className="mt-3 flex items-center gap-3">
                {presences.map((presence) => (
                  <a
                    key={presence.name}
                    href={presence.href}
                    aria-label={presence.name}
                    className="group flex h-8 w-8 items-center justify-center"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="sr-only">{presence.name}</span>
                    <img
                      src={presence.iconSrc}
                      alt={presence.name}
                      className="h-5 w-5 object-contain transition-[filter] duration-200 group-hover:[filter:sepia(1)_saturate(6)_hue-rotate(346deg)_brightness(0.9)]"
                    />
                  </a>
                ))}
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <span className="text-sm text-muted">ivanb.jpg@gmail.com</span>
              </div>
            </div>
            </div>

          </div>
        </aside>

        {!isHomeView ? <main className="flex-1">
          {isAboutView ? (
            <section className="max-w-4xl">
              <h3 className="font-display text-3xl text-ink">About</h3>
              <div className="mt-6 grid gap-5 text-base leading-relaxed text-muted">
                {aboutParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ) : activeGallery ? (
            <section>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-3xl text-ink">{activeGalleryTitle}</h3>
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
                      ? "mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                      : "mt-6 columns-1 gap-6 md:columns-2 xl:columns-3"
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
                  <div className="inline-flex max-w-full flex-col items-start gap-3">
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
                    {currentImage ? (
                      <img
                        src={currentImage.src}
                        alt={currentImage.alt}
                        className="h-auto w-auto max-h-[68vh] max-w-full border border-line bg-paper"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                  </div>
                </div>
              )}
            </section>
          ) : (
            <section className="rounded-[18px] border border-line p-6 text-muted">
              Select a subheading to load photos.
            </section>
          )}
        </main> : null}
      </div>
    </div>
  );
}
