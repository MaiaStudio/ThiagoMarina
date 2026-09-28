export type PrototypeImage = {
  src: string;
  alt: string;
  position: string;
};

export type EditorialCinematicData = {
  couple: { partnerOne: string; partnerTwo: string };
  date: string;
  location: string;
  theme: {
    ivory: string;
    paper: string;
    charcoal: string;
    black: string;
    olive: string;
    gold: string;
  };
  hero: PrototypeImage;
  editorialIntro: {
    eyebrow: string;
    title: string;
    titleLines: readonly string[];
    body: string;
    caption: string;
    primary: PrototypeImage;
    secondary: PrototypeImage;
  };
  detailsImages: readonly PrototypeImage[];
  ceremonyImages: readonly PrototypeImage[];
  coupleImages: readonly PrototypeImage[];
  portraitImages: readonly PrototypeImage[];
  celebrationImages: readonly PrototypeImage[];
  guests?: { headline: string; images: readonly PrototypeImage[] };
  guestbook: {
    messages: readonly {
      name: string;
      relationship: string;
      message: string;
    }[];
  };
  closing: { image: PrototypeImage; line: string; lines: readonly string[] };
  photographer: {
    name: string;
    monogram: string;
    instagram: string;
    website: string;
  } | null;
};
