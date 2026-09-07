export type IndustryCategory =
  | "construction"
  | "motortrade"
  | "trades"
  | "cleaning"
  | "other";

export interface Service {
  slug: string;
  name: string;
  category: IndustryCategory;
  headline: string;
  description: string;
  benefits: string[];
  metaTitle: string;
  metaDescription: string;
  mobileImagePosition?: string;
  youtubePlaylistId?: string;
}

export interface Industry {
  slug: string;
  name: string;
  category: IndustryCategory;
  description: string;
  icon: string;
  services: string[];
}

export interface StaffMember {
  slug: string;
  name: string;
  bio: string;
  image: string;
  videos?: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  business: string;
  industry: string;
  quote: string;
  avatar?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Light markup: "## " starts a heading, "- " starts a list item. */
  content: string;
  date: string;
  category?: string;
  readTime?: string;
  /** Card + hero image, site-relative (e.g. /electrician.webp). */
  image?: string;
}

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudySection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface CaseStudy {
  slug: string;
  business: string;
  industry: string;
  headline: string;
  summary: string;
  intro: string;
  metrics: CaseStudyMetric[];
  challenge: string;
  solution: string;
  results: string;
  keyResults: string[];
  sections: CaseStudySection[];
  quote?: { text: string; attribution: string };
  /** Card + hero image, site-relative (e.g. /mobile-mechanic.webp). */
  image?: string;
}
