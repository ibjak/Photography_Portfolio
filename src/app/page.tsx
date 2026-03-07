"use client";

import Link from "next/link";
import { useState } from "react";

const infoItems = ["About"];

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

export default function Home() {
  const [activeGallery, setActiveGallery] = useState<
    "protests" | "qatar-prix" | "paris-fashion-week-2025" | "ssd-neon" | null
  >("protests");
  const [isGridView, setIsGridView] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeGalleryTitle =
    activeGallery === "protests"
      ? "Protests"
      : activeGallery === "qatar-prix"
      ? "Qatar Prix De L'Arc De Triomphe 2025"
      : activeGallery === "paris-fashion-week-2025"
        ? "Paris Fashion Week 2025"
      : activeGallery === "ssd-neon"
        ? "SSD Neon"
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
      : [];

  const currentImage =
    activeGalleryImages.length > 0
      ? activeGalleryImages[
          ((currentSlideIndex % activeGalleryImages.length) +
            activeGalleryImages.length) %
            activeGalleryImages.length
        ]
      : null;
  const isSsdNeonGallery = activeGallery === "ssd-neon";

  const openGallery = (
    gallery: "protests" | "qatar-prix" | "paris-fashion-week-2025" | "ssd-neon",
  ) => {
    setActiveGallery(gallery);
    setCurrentSlideIndex(0);
  };

  return (
    <div className="page-shell">
      <div className="flex justify-end px-6 pt-6 md:px-10">
        <button
          type="button"
          onClick={() => setIsGridView((current) => !current)}
          className="border border-line px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
        >
          {isGridView ? "Slideshow View" : "Grid View"}
        </button>
      </div>
      <div className="flex w-full flex-1 flex-col gap-10 px-6 pb-10 pt-10 md:flex-row md:px-10 lg:gap-16">
        <aside className="w-full md:w-1/6 md:flex-none md:self-start md:sticky md:top-6 md:h-fit">
          <div className="mt-8 md:mt-0">
            <div className="mb-4 pt-2">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="font-display text-4xl leading-none font-bold text-ink md:text-5xl"
                >
                  Ivan Badanjak
                </Link>
              </div>
            </div>
            <div className="border-t border-line pt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Portfolio
              </p>
            </div>

            <nav className="mt-6 grid gap-2 text-sm">
              <button
                type="button"
                onClick={() => openGallery("protests")}
                className={`border-0 bg-transparent p-0 text-left text-sm transition-colors hover:text-ink ${
                  activeGallery === "protests" ? "text-ink" : "text-muted"
                }`}
              >
                Protests
              </button>
              <details className="group">
                <summary className="summary-clean text-sm text-muted transition-colors hover:text-ink">
                  Events
                </summary>
                <div className="mt-2 grid gap-2 pl-4">
                  <button
                    type="button"
                    onClick={() => openGallery("qatar-prix")}
                    className={`border-0 bg-transparent p-0 text-left text-sm transition-colors hover:text-ink ${
                      activeGallery === "qatar-prix" ? "text-ink" : "text-muted"
                    }`}
                  >
                    Qatar Prix De L&apos;Arc De Triomphe 2025
                  </button>
                  <button
                    type="button"
                    onClick={() => openGallery("paris-fashion-week-2025")}
                    className={`border-0 bg-transparent p-0 text-left text-sm transition-colors hover:text-ink ${
                      activeGallery === "paris-fashion-week-2025"
                        ? "text-ink"
                        : "text-muted"
                    }`}
                  >
                    Paris Fashion Week 2025
                  </button>
                </div>
              </details>
              <details className="group">
                <summary className="summary-clean text-sm text-muted transition-colors hover:text-ink">
                  Street Photography
                </summary>
                <div className="mt-2 grid gap-2 pl-4">
                  <button
                    type="button"
                    onClick={() => openGallery("ssd-neon")}
                    className={`border-0 bg-transparent p-0 text-left text-sm transition-colors hover:text-ink ${
                      activeGallery === "ssd-neon" ? "text-ink" : "text-muted"
                    }`}
                  >
                    SSD Neon
                  </button>
                </div>
              </details>
            </nav>

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Info
              </p>
              <div className="mt-4 grid gap-2 text-sm">
                {infoItems.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                {presences.map((presence) => (
                  <a
                    key={presence.name}
                    href={presence.href}
                    aria-label={presence.name}
                    className="flex h-8 w-8 items-center justify-center text-ink transition hover:text-accent"
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
              <div className="mt-4 grid gap-2 text-sm">
                <span className="text-sm text-muted">ivan.badanjak512@gmail.com</span>
                <span className="text-sm text-muted">+306943216408</span>
                <span className="text-sm text-muted">www.ivanbadanjak.com</span>
              </div>
            </div>

          </div>
        </aside>

        <main className="flex-1">
          {activeGallery ? (
            <section>
              <h3 className="font-display text-3xl text-ink">{activeGalleryTitle}</h3>
              {isGridView ? (
                <div
                  className={
                    isSsdNeonGallery
                      ? "mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                      : "mt-6 columns-1 gap-6 md:columns-2 xl:columns-3"
                  }
                >
                  {activeGalleryImages.map((image, index) => (
                    <figure
                      key={image.src}
                      className={
                        isSsdNeonGallery
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
                        />
                      </button>
                    </figure>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIndex((index) => index - 1)}
                    className="h-12 w-12 shrink-0 border border-line text-xl text-ink transition-colors hover:text-accent"
                    aria-label="Previous photo"
                  >
                    ←
                  </button>
                  <div className="flex flex-1 items-center justify-center">
                    {currentImage ? (
                      <img
                        src={currentImage.src}
                        alt={currentImage.alt}
                        className="h-[62vh] max-w-full border border-line bg-glass object-contain md:h-[64vh]"
                      />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIndex((index) => index + 1)}
                    className="h-12 w-12 shrink-0 border border-line text-xl text-ink transition-colors hover:text-accent"
                    aria-label="Next photo"
                  >
                    →
                  </button>
                </div>
              )}
            </section>
          ) : (
            <section className="rounded-[18px] border border-line p-6 text-muted">
              Select a subheading to load photos.
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
