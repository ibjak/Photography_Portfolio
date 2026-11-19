// Paragraph text shared by the gallery statements and the About page, so
// both read the same: justified, hyphenated, the last line left as it falls.
export default function BodyText({
  paragraphs,
}: {
  paragraphs: readonly string[];
}) {
  return (
    <div className="grid gap-4 font-sans text-[14px] leading-6 text-justify text-pretty hyphens-auto md:text-[15px] md:leading-7">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
