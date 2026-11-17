import type { Metadata } from "next";
import Link from "next/link";
import { galleries, galleryKeys, getGalleryHref } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Page not found",
};

const linkClass =
  "text-ink underline-offset-4 transition-colors hover:text-accent hover:underline";

// Shown inside the site's layout, so the menu is still there.
export default function NotFound() {
  return (
    <section
      className="mx-auto w-full max-w-[35rem] text-center"
      aria-labelledby="not-found-title"
    >
      <h1
        id="not-found-title"
        className="font-display text-[1.75rem] leading-tight tracking-[-0.01em] sm:text-[2rem]"
      >
        Page not found
      </h1>
      <p className="mt-6 font-sans text-base leading-relaxed">
        There is nothing at this address. It may have moved, or the link may be
        mistyped.
      </p>
      <ul className="mt-8 grid gap-2 font-sans text-[13px] leading-5 tracking-[0.015em] pointer-coarse:gap-0">
        <li>
          <Link
            href="/"
            className={`inline-flex items-center pointer-coarse:min-h-11 ${linkClass}`}
          >
            Home
          </Link>
        </li>
        {galleryKeys.map((key) => (
          <li key={key}>
            <Link
              href={getGalleryHref(key)}
              className={`inline-flex items-center pointer-coarse:min-h-11 ${linkClass}`}
            >
              {galleries[key].title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
