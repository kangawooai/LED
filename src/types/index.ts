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
  content: string;
  date: string;
}
