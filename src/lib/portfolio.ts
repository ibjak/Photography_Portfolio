import {
  imageDimensions,
  type ImageFileName,
} from "./imageDimensions";

export type ImageItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  wallPlacement?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type GallerySectionKey = "projects" | "events" | "street-photography";

export type GalleryKey =
  | "jaima"
  | "protests"
  | "qatar-prix"
  | "paris-fashion-week-2025"
  | "uefa-champions-league-winners-2026-psg"
  | "ssd-neon"
  | "dogs";

export type Gallery = {
  key: GalleryKey;
  section: GallerySectionKey;
  slug: string;
  title: string;
  navLabel: string;
  introParagraphs?: readonly string[];
  images: readonly ImageItem[];
  layout?: "exhibition-wall";
};

export type HomeSlide = ImageItem & {
  gallery: GalleryKey;
  albumLabel: string;
};

type ImageAlt = string | ((position: number) => string);

const getImageDimensions = (fileName: string) => {
  const dimensions = imageDimensions[fileName as ImageFileName];

  if (!dimensions) {
    throw new Error(`Missing dimensions for portfolio image: ${fileName}`);
  }

  return dimensions;
};

const createImage = (
  folder: string,
  fileName: string,
  alt: string,
  wallPlacement?: ImageItem["wallPlacement"],
): ImageItem => {
  const [width, height] = getImageDimensions(fileName);

  return {
    src: `/Photo%20Gallery/${folder}/${fileName}`,
    alt,
    width,
    height,
    ...(wallPlacement ? { wallPlacement } : {}),
  };
};

const createImageSet = (
  folder: string,
  fileNames: readonly string[],
  alt: ImageAlt,
): ImageItem[] =>
  fileNames.map((fileName, index) =>
    createImage(
      folder,
      fileName,
      typeof alt === "function" ? alt(index + 1) : alt,
    ),
  );

export const aboutParagraphs = [
  "Ivan Badanjak is a documentary photographer and aspiring researcher whose work explores themes of migration, identity, and cultural preservation. He holds a Master's degree in Migration, Mobility and Development from SOAS University of London, where he developed a strong interest in the everyday experiences of diaspora communities and the ways cultural identity is maintained far from home.",
  "He is studying documentary photography while developing long-term visual projects that examine belonging, integration, and memory within migrant communities. Alongside his documentary work, he practices street photography as a way of exploring the city and its rhythms. He is also known for stopping to greet nearly every dog he encounters and take fabulous pictures of them. He attends protests to photograph and convey the intensity of collective movements.",
  "Ivan's work is informed by his background in humanitarian organizations and reflects an ongoing interest in the intersection of visual storytelling, social inquiry, and contemporary migration narratives.",
  "Currently based in Paris, moving between Zagreb, Florence, and Athens.",
];

const qatarPrixImages = createImageSet(
  "qatar%20GP%20longchamp",
  [
    "IAB_20251005_03756.jpg",
    "IAB_20251005_03773.jpg",
    "IAB_20251005_03787.jpg",
    "IAB_20251005_03897.jpg",
    "IAB_20251005_03918.jpg",
    "IAB_20251005_03921.jpg",
    "IAB_20251005_03801.jpg",
  ],
  (position) => `Qatar Prix De L'Arc De Triomphe 2025 photo ${position}`,
);

const bataclanImages = createImageSet(
  "Bataclan%2010%20year%20anniversary",
  [
    "IAB_20251113_00055-1.jpg",
    "IAB_20251113_00058-2.jpg",
    "IAB_20251113_00063.jpg",
    "IAB_20251113_00078-3.jpg",
    "IAB_20251113_00106-4.jpg",
  ],
  "Commemoration marking the 10th anniversary of the November 2015 Paris attacks, Place de la Republique, Paris, November 2025.",
);

const internationalSolidarityPalestineImages = createImageSet(
  "International%20Day%20of%20Solidarity%20with%20Palestine%20Nov%202025",
  [
    "IAB_20251129_00040.jpg",
    "IAB_20251129_00085.jpg",
    "IAB_20251129_00140.jpg",
    "IAB_20251129_00156.jpg",
    "IAB_20251129_00187.jpg",
  ],
  "Demonstration marking the International Day of Solidarity with the Palestinian people, Paris, November 29, 2025.",
);

const eliminationViolenceWomenImages = createImageSet(
  "Elimination%20of%20Violence%20against%20Women%20Day%202025",
  [
    "IAB_20251122_00014.jpg",
    "IAB_20251122_00209.jpg",
    "IAB_20251122_00285.jpg",
    "IAB_20251122_00342.jpg",
    "IAB_20251122_00384.jpg",
    "IAB_20251122_00387.jpg",
  ],
  "Demonstration marking the International Day for the Elimination of Violence against Women, Paris, November 2025.",
);

const frenchDelegationReturnsImages = createImageSet(
  "French%20Delegation%20returns%20-%20Global%20Sumud%20Flotilla%20(October%202025)",
  [
    "IAB_20251008_00037.jpg",
    "IAB_20251008_00041.jpg",
    "IAB_20251008_00058.jpg",
    "IAB_20251008_00064-1.jpg",
    "IAB_20251008_00069-1.jpg",
    "IAB_20251008_00106.jpg",
  ],
  "Return of the French delegation from the Global Sumud Flotilla, Paris, October 2025.",
);

const prisonerSolidarityProtestImages = createImageSet(
  "prisoner%20solidarity%20protest",
  ["IAB_20260321_00237-1.jpg", "IAB_20260321_00243-2.jpg"],
  "Prisoner solidarity protest at Place de la Republique, Paris, March 2026.",
);

const protestsImages: ImageItem[] = [
  ...frenchDelegationReturnsImages,
  ...bataclanImages,
  ...internationalSolidarityPalestineImages,
  ...eliminationViolenceWomenImages,
  ...prisonerSolidarityProtestImages,
];
const createJaimaImage = (
  fileName: string,
  alt: string,
  wallPlacement: NonNullable<ImageItem["wallPlacement"]>,
): ImageItem => createImage("Jaima%20Photos", fileName, alt, wallPlacement);

const jaimaImages: ImageItem[] = [
  createJaimaImage("website.jaima-2.jpg", "Residential street in a housing estate.", {
    x: 109,
    y: 24,
    width: 53,
    height: 36,
  }),
  createJaimaImage("website.jaima-3.jpg", "Portrait beside a stone wall in dappled light.", {
    x: 164,
    y: 24,
    width: 53,
    height: 36,
  }),
  createJaimaImage("website.jaima-8.jpg", "People seated on outdoor steps in sunlight.", {
    x: 0,
    y: 55,
    width: 53,
    height: 36,
  }),
  createJaimaImage("website.jaima-9.jpg", "Window with laundry drying in the foreground.", {
    x: 55,
    y: 62,
    width: 40,
    height: 28,
  }),
  createJaimaImage("website.jaima-10.jpg", "Hands preparing food at a kitchen counter.", {
    x: 97,
    y: 62,
    width: 40,
    height: 28,
  }),
  createJaimaImage("website.jaima-11.jpg", "Person washing dishes beside an open window.", {
    x: 139,
    y: 62,
    width: 40,
    height: 28,
  }),
  createJaimaImage("website.jaima-4.jpg", "Interior detail with refreshments beneath a screen.", {
    x: 42,
    y: 96,
    width: 40,
    height: 28,
  }),
  createJaimaImage("website.jaima-5.jpg", "Two paintings displayed on a wall.", {
    x: 84,
    y: 96,
    width: 40,
    height: 28,
  }),
  createJaimaImage("website.jaima-7.jpg", "Women and children gathered on a sofa.", {
    x: 126,
    y: 96,
    width: 53,
    height: 36,
  }),
  createJaimaImage("website.jaima-6.jpg", "Musical instrument and wooden sticks on a carpet.", {
    x: 139,
    y: 134,
    width: 40,
    height: 28,
  }),
  createJaimaImage("website.jaima-1.jpg", "Audience gathered inside an auditorium.", {
    x: 199,
    y: 62,
    width: 40,
    height: 28,
  }),
  createJaimaImage("website.jaima-12.jpg", "Hand placing a Sahrawi solidarity sticker on glass.", {
    x: 199,
    y: 92,
    width: 40,
    height: 28,
  }),
  createJaimaImage("website.jaima-14.jpg", "People seated with a Western Sahara flag indoors.", {
    x: 199,
    y: 122,
    width: 40,
    height: 28,
  }),
  createJaimaImage("website.jaima-13.jpg", "Protester holding a lit flare in a smoky street.", {
    x: 244,
    y: 76,
    width: 36,
    height: 53,
  }),
];

const parisFashionWeekImages = createImageSet(
  "Paris%20Fashion%20Week%20(October%202025)",
  [
    "IAB_20251003_02197.jpg",
    "IAB_20251003_02317.jpg",
    "IAB_20251003_02365.jpg",
    "IAB_20251003_02379.jpg",
    "IAB_20251003_02394.jpg",
    "IAB_20251003_02411.jpg",
    "IAB_20251003_02422.jpg",
    "IAB_20251003_02443.jpg",
    "IAB_20251003_02461.jpg",
  ],
  (position) => `Paris Fashion Week 2025 photo ${position}`,
);

const winnersInParisImages = createImageSet(
  "UEFA%20CHAMPS%20PSG%20CELEBRATIONS%202026",
  [
    "IAB-PSG_Celebration_Paris_Republique-1.jpg",
    "IAB-PSG_Celebration_Paris_Republique-2.jpg",
    "IAB-PSG_Celebration_Paris_Republique-3.jpg",
    "IAB-PSG_Celebration_Paris_Republique-4.jpg",
    "IAB-PSG_Celebration_Paris_Republique-12.jpg",
    "IAB-PSG_Celebration_Paris_Republique-13.jpg",
    "IAB-PSG_Celebration_Paris_Republique-14.jpg",
    "IAB-PSG_Celebration_Paris_Republique-15.jpg",
  ],
  "PSG supporters celebrating the UEFA Champions League win in Paris, June 2026.",
);

const ssdNeonPhotoNumbers = [
  1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
] as const;

const ssdNeonImages = createImageSet(
  "SSD%20Neon%20",
  [
    "IAB_20251119_00063.jpg",
    "IAB_20251119_00079.jpg",
    "IAB_20251119_00113.jpg",
    "IAB_20251119_00132.jpg",
    "IAB_20251119_00173.jpg",
    "IAB_20251119_00196.jpg",
    "IAB_20251119_00206-1.jpg",
    "IAB_20251119_00061-1.jpg",
    "IAB_20251119_00221.jpg",
    "IAB_20251119_00288.jpg",
    "IAB_20251122_00013-2.jpg",
    "IAB_20251123_00004.jpg",
    "IAB_20251123_00016.jpg",
    "IAB_20251124_00060.jpg",
    "IAB_20251202_00068.jpg",
    "IAB_20251202_00146.jpg",
    "IAB_20251202_00151.jpg",
  ],
  (position) => `SSD Neon photo ${ssdNeonPhotoNumbers[position - 1]}`,
);

const dogsImages = createImageSet(
  "Doggos",
  [
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
  ],
  (position) => `Dogs photo ${position}`,
);

export const presences = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ivan.jpg111/",
    iconSrc: "/social-icons/instagram.png",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ivan-alexios-badanjak/",
    iconSrc: "/social-icons/linkedin.png",
  },
  {
    name: "The_Dographer",
    href: "https://www.instagram.com/the.dographer111/",
    iconSrc: "/social-icons/dographer.png",
  },
] as const;

export const contact = {
  phoneHref: "tel:+306943216408",
  phoneLabel: "+30 694 321 6408",
  email: "ivanb.jpg@gmail.com",
} as const;

export const galleries: Record<GalleryKey, Gallery> = {
  jaima: {
    key: "jaima",
    section: "projects",
    slug: "jaima",
    title: "Jaima",
    navLabel: "Jaima",
    introParagraphs: [
      `Jaima chronicles the experiences of the Western Saharan Diaspora living in
France. Following Spain's incomplete decolonization of the territory in 1975
and the unfulfilled promise of a UN referendum in 1991, many Sahrawis were
displaced, fleeing conflict and the Moroccan occupation of their territory.
France has become home to a sizable number of the diaspora community.
Today, the struggle for self determination for many Sahrawis continues from afar
over a territory they call home, but Morocco administratively controls.
The project explores how cultural identity is sustained and reshaped in
displacement, and how a sense of home persists across distance. Developed
over sustained access to families and community gatherings, the photographs
move between interior and exterior spaces.
At home, the photographs attend to intimate moments, routines and gatherings.
Outside, portraits situate Sahrawi subjects in French public places, tracing a
physical presence of home, while holding another one elsewhere. Community
images anchor these personal narratives within an ongoing political reality,
where identity is not only lived, but continually asserted as a shared
responsibility.
At the centre of the project is a question that is perhaps most acute for the
younger generation — those who grew up here, for whom France is simply home,
and yet who carry another place inside them that they have never, or barely,
lived in. Jaima is an attempt to honour that tension: to sit with what we carry
when we cannot go back, and what we become when we stay.`,
    ],
    images: jaimaImages,
    layout: "exhibition-wall",
  },
  protests: {
    key: "protests",
    section: "events",
    slug: "protests",
    title: "Place de la Republique",
    navLabel: "Place de la Republique",
    introParagraphs: [
      "Place de la République has become a regular site for public assembly in Paris, where protests, vigils, and demonstrations reflect the city's social fault lines. Five metro lines intersect beneath the square, and eight avenues converge on it. Its scale and central position make it a lasting gathering place for collective expression. This album is a diary of protests that have helped shape French society's collective consciousness.",
    ],
    images: protestsImages,
  },
  "qatar-prix": {
    key: "qatar-prix",
    section: "events",
    slug: "qatar-prix-2025",
    title: "Qatar Longchamp Prix 2025",
    navLabel: "Qatar Longchamp Prix",
    introParagraphs: [
      "The Qatar Longchamp Prix is defined by the moments before the race begins. Horses circle the track, jockeys focused, crowds suspended in expectation. This series concentrates on moments of pause, relaxation before the crescendo of a race unfolds, ending in seconds.",
    ],
    images: qatarPrixImages,
  },
  "paris-fashion-week-2025": {
    key: "paris-fashion-week-2025",
    section: "events",
    slug: "paris-fashion-week-2025",
    title: "Paris Fashion Week 2025",
    navLabel: "Paris Fashion Week",
    images: parisFashionWeekImages,
  },
  "uefa-champions-league-winners-2026-psg": {
    key: "uefa-champions-league-winners-2026-psg",
    section: "events",
    slug: "winners-in-paris",
    title: "Winners in Paris",
    navLabel: "Winners in Paris",
    introParagraphs: [
      "On May 30th 2026, a grueling UEFA Champions League final took place at Puskas Arena in Budapest, Hungary between Paris Saint-Germain and Arsenal. PSG successfully defended their title, winning 4-3 on penalties after 120 minutes of regulation time failed to separate the sides at 1-1. After the final whistle, crowds formed at various public squares in Paris. The following is an album documenting those celebrations at Place de la Republique.",
    ],
    images: winnersInParisImages,
  },
  "ssd-neon": {
    key: "ssd-neon",
    section: "street-photography",
    slug: "ssd-neon",
    title: "SSD Neon",
    navLabel: "SSD Neon",
    images: ssdNeonImages,
  },
  dogs: {
    key: "dogs",
    section: "street-photography",
    slug: "dogs",
    title: "Dogs",
    navLabel: "Dogs",
    images: dogsImages,
  },
};

export const galleryKeys = Object.keys(galleries) as readonly GalleryKey[];

export type NavigationGroup = {
  key: string;
  title: string;
  galleryKeys: readonly GalleryKey[];
};

export const navigationGroups = [
  {
    key: "projects",
    title: "Projects",
    galleryKeys: ["jaima"],
  },
  {
    key: "photographs",
    title: "Photographs",
    galleryKeys: [
      "protests",
      "qatar-prix",
      "paris-fashion-week-2025",
      "uefa-champions-league-winners-2026-psg",
      "dogs",
      "ssd-neon",
    ],
  },
] as const satisfies readonly NavigationGroup[];

const findImageByFileName = (images: readonly ImageItem[], fileName: string) =>
  images.find((image) => image.src.endsWith(`/${fileName}`));

const createHomeSlide = (
  gallery: GalleryKey,
  fileName: string,
): HomeSlide => {
  const sourceGallery = galleries[gallery];
  const image = findImageByFileName(sourceGallery.images, fileName);

  if (!image) {
    throw new Error(`Missing homepage slideshow image: ${fileName}`);
  }

  return {
    ...image,
    gallery,
    albumLabel: sourceGallery.title,
  };
};

export const homeSlideshowImages: readonly HomeSlide[] = [
  createHomeSlide(
    "uefa-champions-league-winners-2026-psg",
    "IAB-PSG_Celebration_Paris_Republique-1.jpg",
  ),
  createHomeSlide(
    "uefa-champions-league-winners-2026-psg",
    "IAB-PSG_Celebration_Paris_Republique-2.jpg",
  ),
  createHomeSlide(
    "uefa-champions-league-winners-2026-psg",
    "IAB-PSG_Celebration_Paris_Republique-3.jpg",
  ),
  createHomeSlide("protests", "IAB_20251113_00058-2.jpg"),
  createHomeSlide("protests", "IAB_20251122_00285.jpg"),
  createHomeSlide("protests", "IAB_20251122_00384.jpg"),
  createHomeSlide("paris-fashion-week-2025", "IAB_20251003_02394.jpg"),
  createHomeSlide("paris-fashion-week-2025", "IAB_20251003_02422.jpg"),
  createHomeSlide("paris-fashion-week-2025", "IAB_20251003_02365.jpg"),
  createHomeSlide("dogs", "IAB_20250322_00203.jpg"),
  createHomeSlide("dogs", "IAB_20260104_00030.jpg"),
  createHomeSlide("qatar-prix", "IAB_20251005_03918.jpg"),
  createHomeSlide("qatar-prix", "IAB_20251005_03773.jpg"),
  createHomeSlide("protests", "IAB_20251129_00085.jpg"),
  createHomeSlide("protests", "IAB_20251008_00106.jpg"),
  createHomeSlide("protests", "IAB_20251008_00037.jpg"),
  createHomeSlide("ssd-neon", "IAB_20251119_00206-1.jpg"),
  createHomeSlide("ssd-neon", "IAB_20251119_00132.jpg"),
];

export function getGalleryHref(galleryKey: GalleryKey) {
  const gallery = galleries[galleryKey];
  return `/${gallery.section}/${gallery.slug}`;
}

const galleriesByRoute = new Map<string, Gallery>(
  galleryKeys.map((key) => {
    const gallery = galleries[key];
    return [`${gallery.section}/${gallery.slug}`, gallery] as const;
  }),
);

export function getGalleryByRoute(section: string, slug: string) {
  return galleriesByRoute.get(`${section}/${slug}`) ?? null;
}
