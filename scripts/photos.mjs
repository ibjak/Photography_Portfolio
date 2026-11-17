// Reads every JPEG in public/Photo Gallery and writes src/lib/photoManifest.ts
// with its pixel size and, when Lightroom embedded one, its caption.
//
//   npm run photos           regenerate the manifest
//   npm run photos -- --check   fail if the manifest is out of date
//
// It only reads the photographs; it never changes them. No dependencies.

import {
  closeSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDir = path.join(root, "public", "Photo Gallery");
const manifestPath = path.join(root, "src", "lib", "photoManifest.ts");
const portfolioPath = path.join(root, "src", "lib", "portfolio.ts");

const XMP_HEADER = "http://ns.adobe.com/xap/1.0/\0";
const EXIF_HEADER = "Exif\0\0";

function readBytes(fd, position, length) {
  const buffer = Buffer.alloc(length);
  const bytesRead = readSync(fd, buffer, 0, length, position);
  return buffer.subarray(0, bytesRead);
}

// EXIF orientations 5-8 mean the pixels are stored rotated a quarter turn.
function readExifOrientation(exif) {
  const tiff = exif.subarray(EXIF_HEADER.length);
  if (tiff.length < 8) return 1;

  const littleEndian = tiff.toString("latin1", 0, 2) === "II";
  const u16 = (offset) =>
    littleEndian ? tiff.readUInt16LE(offset) : tiff.readUInt16BE(offset);
  const u32 = (offset) =>
    littleEndian ? tiff.readUInt32LE(offset) : tiff.readUInt32BE(offset);
  const ifd = u32(4);
  if (ifd + 2 > tiff.length) return 1;

  const entries = u16(ifd);
  for (let index = 0; index < entries; index += 1) {
    const entry = ifd + 2 + index * 12;
    if (entry + 12 > tiff.length) break;
    if (u16(entry) === 0x0112) return u16(entry + 8);
  }
  return 1;
}

function decodeXml(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

// Some captions carry a Greek translation after a slash. The site is in
// English, so keep the text before the slash that introduces the Greek.
function englishPart(caption) {
  const firstGreek = caption.search(/[Ͱ-Ͽἀ-῿]/);
  if (firstGreek === -1) return caption;

  const slash = caption.lastIndexOf("/", firstGreek);
  return slash === -1 ? caption : caption.slice(0, slash);
}

function readCaption(xmp) {
  const match =
    /<dc:description>[\s\S]*?<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/.exec(xmp);
  if (!match) return null;

  const caption = englishPart(decodeXml(match[1])).replace(/\s+/g, " ").trim();
  return caption || null;
}

function readPhoto(file) {
  const fd = openSync(file, "r");
  try {
    if (readBytes(fd, 0, 2).readUInt16BE(0) !== 0xffd8) {
      throw new Error("not a JPEG file");
    }

    let position = 2;
    let orientation = 1;
    let caption = null;

    for (;;) {
      const header = readBytes(fd, position, 4);
      if (header.length < 4 || header[0] !== 0xff) {
        throw new Error("could not find the image size");
      }

      const marker = header[1];
      const length = header.readUInt16BE(2);
      const isFrameHeader =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;

      if (isFrameHeader) {
        const frame = readBytes(fd, position + 4, 5);
        const height = frame.readUInt16BE(1);
        const width = frame.readUInt16BE(3);
        const rotated = orientation >= 5;
        return {
          width: rotated ? height : width,
          height: rotated ? width : height,
          caption,
        };
      }

      if (marker === 0xda) throw new Error("could not find the image size");

      if (marker === 0xe1) {
        const payload = readBytes(fd, position + 4, length - 2);
        if (payload.toString("latin1", 0, EXIF_HEADER.length) === EXIF_HEADER) {
          orientation = readExifOrientation(payload);
        } else if (
          payload.toString("latin1", 0, XMP_HEADER.length) === XMP_HEADER
        ) {
          caption ??= readCaption(payload.toString("utf8", XMP_HEADER.length));
        }
      }

      position += 2 + length;
    }
  } finally {
    closeSync(fd);
  }
}

function listPhotos() {
  const photos = [];
  for (const folder of readdirSync(galleryDir, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    for (const name of readdirSync(path.join(galleryDir, folder.name))) {
      if (/\.jpe?g$/i.test(name)) photos.push({ folder: folder.name, name });
    }
  }
  const key = (photo) => `${photo.folder}/${photo.name}`;
  return photos.sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
}

const photos = listPhotos().map((photo) => {
  try {
    return { ...photo, ...readPhoto(path.join(galleryDir, photo.folder, photo.name)) };
  } catch (error) {
    throw new Error(`${photo.folder}/${photo.name}: ${error.message}`);
  }
});

const lines = photos.map((photo) => {
  const fields = [`width: ${photo.width}`, `height: ${photo.height}`];
  if (photo.caption) fields.push(`caption: ${JSON.stringify(photo.caption)}`);
  return `  ${JSON.stringify(`${photo.folder}/${photo.name}`)}: { ${fields.join(", ")} },`;
});

const manifest = `// Generated by \`npm run photos\` (scripts/photos.mjs) from the files in
// public/Photo Gallery. Do not edit by hand: the sizes and captions come from
// the photographs themselves. To change a caption, edit it in Lightroom,
// export the photo again and re-run the script.

export type PhotoInfo = {
  width: number;
  height: number;
  caption?: string;
};

export const photoManifest: Record<string, PhotoInfo> = {
${lines.join("\n")}
};
`;

let current = "";
try {
  current = readFileSync(manifestPath, "utf8");
} catch {
  // First run: the manifest does not exist yet.
}

const captions = photos.filter((photo) => photo.caption).length;
const portfolio = readFileSync(portfolioPath, "utf8");
const unused = photos.filter((photo) => !portfolio.includes(`"${photo.name}"`));

if (process.argv.includes("--check")) {
  if (current !== manifest) {
    console.error("photoManifest.ts is out of date. Run: npm run photos");
    process.exit(1);
  }
} else if (current !== manifest) {
  writeFileSync(manifestPath, manifest);
}

console.log(
  `Photos: ${photos.length} files, ${captions} with an embedded caption` +
    (current === manifest ? " (manifest unchanged)." : " (manifest updated)."),
);
if (unused.length > 0) {
  console.log(`Not used on the site (${unused.length}):`);
  for (const photo of unused) console.log(`  ${photo.folder}/${photo.name}`);
}
