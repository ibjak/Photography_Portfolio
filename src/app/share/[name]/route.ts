import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { SHARE_IMAGE_SIZE, shareImageSources } from "@/lib/siteMetadata";

// Link-preview images, built once per deploy (never at request time). Each
// shows its photograph whole on the site's white background: the apps that
// display link previews crop anything that isn't this 1200×630 shape, and a
// documentary photograph should not be cropped. The source file is only read.

const MARGIN = 40;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(shareImageSources).map((key) => ({ name: `${key}.jpg` }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const source = shareImageSources[name.replace(/\.jpg$/, "")];

  if (!source) {
    return new Response("Not found", { status: 404 });
  }

  const file = path.join(process.cwd(), "public", decodeURIComponent(source.src));
  const photo = await sharp(await readFile(file))
    .rotate()
    .resize({
      width: SHARE_IMAGE_SIZE.width - 2 * MARGIN,
      height: SHARE_IMAGE_SIZE.height - 2 * MARGIN,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer();
  const card = await sharp({
    create: { ...SHARE_IMAGE_SIZE, channels: 3, background: "#ffffff" },
  })
    .composite([{ input: photo }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(card), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
