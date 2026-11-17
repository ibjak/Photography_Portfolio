import Link from "next/link";

type PagerLink = {
  href: string;
  label: string;
};

const labelClass =
  "block font-sans text-[11px] leading-5 tracking-[0.14em] text-muted uppercase";
const nameClass =
  "font-sans text-[13px] leading-5 tracking-[0.015em] text-ink transition-colors group-hover:text-accent";

// A way onward at the end of a gallery, where the menu can be a long way up.
export default function GalleryPager({
  previous,
  next,
}: {
  previous: PagerLink;
  next: PagerLink;
}) {
  return (
    <nav
      className="mx-auto mt-16 flex max-w-5xl items-start justify-between gap-6 border-t border-line pt-6 lg:mt-20"
      aria-label="More galleries"
    >
      <Link href={previous.href} className="group block pointer-coarse:min-h-11">
        <span className={labelClass}>Previous</span>
        <span className={nameClass}>
          <span aria-hidden="true">← </span>
          {previous.label}
        </span>
      </Link>
      <Link
        href={next.href}
        className="group block text-right pointer-coarse:min-h-11"
      >
        <span className={labelClass}>Next</span>
        <span className={nameClass}>
          {next.label}
          <span aria-hidden="true"> →</span>
        </span>
      </Link>
    </nav>
  );
}
