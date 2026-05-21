export interface Project {
  id: string;
  slug: string;
  client: string;
  title: string;
  category: string;
  videoSrc: string;
  poster: string;
  index: string; // e.g. "01/10"
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "mukund-realty-kedar",
    client: "Mukund Realty",
    title: "Kedar",
    category: "Ad Films",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/megamind-carrers.firebasestorage.app/o/MM%20WEB%20TEST%2001.mp4?alt=media&token=e62aba7e-54a2-4c29-99c8-0216a73c6ed2",
    poster:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=85",
    index: "01/10",
  },
  {
    id: "2",
    slug: "luminary-brand-film",
    client: "Luminary Studio",
    title: "Unseen Light",
    category: "Brand Films",
    videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80",
    index: "02/10",
  },
  {
    id: "3",
    slug: "arcana-corporate",
    client: "Arcana Group",
    title: "Foundations",
    category: "Testimonial and Corporate Videos",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/megamind-carrers.firebasestorage.app/o/MM%20WEB%20TEST%2001.mp4?alt=media&token=e62aba7e-54a2-4c29-99c8-0216a73c6ed2",
    poster:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    index: "03/10",
  },
  {
    id: "4",
    slug: "vertex-social",
    client: "Vertex Solutions",
    title: "The Thread",
    category: "Performance Marketing Videos",
    videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&q=80",
    index: "04/10",
  },
  {
    id: "5",
    slug: "prism-testimonial",
    client: "Prism Analytics",
    title: "Voices",
    category: "Testimonial and Corporate Videos",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/megamind-carrers.firebasestorage.app/o/MM%20WEB%20TEST%2001.mp4?alt=media&token=e62aba7e-54a2-4c29-99c8-0216a73c6ed2",
    poster:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    index: "05/10",
  },
  {
    id: "6",
    slug: "zenith-podcast",
    client: "Zenith Media",
    title: "After Hours",
    category: "Podcast Production",
    videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    index: "06/10",
  },
  {
    id: "7",
    slug: "nova-photography",
    client: "Nova Hospitality",
    title: "Still Life",
    category: "Photography",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/megamind-carrers.firebasestorage.app/o/MM%20WEB%20TEST%2001.mp4?alt=media&token=e62aba7e-54a2-4c29-99c8-0216a73c6ed2",
    poster:
      "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=1200&q=85",
    index: "07/10",
  },
  {
    id: "8",
    slug: "axis-ad-film",
    client: "Axis Realty",
    title: "Home",
    category: "Ad Films",
    videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    index: "08/10",
  },
  {
    id: "9",
    slug: "crescent-brand",
    client: "Crescent Labs",
    title: "Momentum",
    category: "Brand Films",
    videoSrc:
      "https://firebasestorage.googleapis.com/v0/b/megamind-carrers.firebasestorage.app/o/MM%20WEB%20TEST%2001.mp4?alt=media&token=e62aba7e-54a2-4c29-99c8-0216a73c6ed2",
    poster:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80",
    index: "09/10",
  },
  {
    id: "10",
    slug: "echo-corporate",
    client: "Echo Ventures",
    title: "Origin",
    category: "Testimonial and Corporate Videos",
    videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80",
    index: "10/10",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
