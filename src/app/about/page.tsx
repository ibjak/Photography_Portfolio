import { aboutParagraphs } from "@/lib/portfolio";
import { pageMetadata } from "@/lib/siteMetadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Ivan Badanjak is a documentary photographer and aspiring researcher whose work explores themes of migration, identity, and cultural preservation.",
  pathname: "/about",
});

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-[35rem]" aria-labelledby="about-title">
      <h1
        id="about-title"
        className="text-center font-display text-[1.75rem] leading-tight tracking-[-0.01em] sm:text-[2rem]"
      >
        About
      </h1>
      <div className="mt-6 grid gap-5 font-sans text-base leading-relaxed text-justify text-pretty hyphens-auto [text-align-last:center]">
        {aboutParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
