import { Industry } from "@/types";

export const industries: Industry[] = [
  {
    slug: "construction-and-home-improvements",
    name: "Construction & Home Improvements",
    category: "construction",
    description: "From plastering to roofing, we generate leads for every construction trade. Get homeowners contacting you directly for quotes.",
    icon: "IconBuildingSkyscraper",
    services: [
      "plastering", "scaffolding", "house-extension", "loft-conversion",
      "kitchen-and-bathroom-fitters", "flooring", "garage-doors", "conservatory-roof",
      "insulation", "damp-proofing", "pointing", "masonry", "concrete-delivery",
      "dry-lining", "painter-and-decorator", "tiler", "driveways", "fencing-services",
      "guttering", "roof-repairs", "asbestos-removal", "demolitions", "artificial-grass",
      "landscaping", "property-maintenance", "architect", "chimneys",
    ],
  },
  {
    slug: "motortrade-home",
    name: "Motor Trade",
    category: "motortrade",
    description: "MOT bookings, servicing, bodywork, and specialist repairs. We bring car owners to your garage ready to book.",
    icon: "IconCar",
    services: [
      "mot-bookings", "servicing", "clutch-repairs-replacement",
      "suspension-repairs-replacement", "brakes-discs-repair-replacement",
      "cambelt-repair-replacement", "turbo-repair-replacement",
      "gearbox-repair-replacement", "engine-recon-rebuilds",
      "exhausts-repairs-replacements", "dpf-carbon-cleaning", "remapping",
      "tyres", "wheel-repair-alloys", "bodyshop-smart-repairs", "auto-electrician",
      "air-conditioning", "electric-hybrid-servicing", "towbar-supply-installation",
      "vehicle-immobiliser-installation", "detailing", "car-van-finance-prime-subprime",
      "vehicle-recovery", "differentials", "mobile-mechanic",
    ],
  },
  {
    slug: "trades-home",
    name: "Trades",
    category: "trades",
    description: "Electricians, plumbers, locksmiths, and more. We connect skilled tradespeople with customers who need them right now.",
    icon: "IconTool",
    services: [
      "electrician", "plumbing-heating", "boiler-repairs-and-servicing",
      "ev-charging", "pat-testing", "solar-panels", "locksmith", "alarms",
      "cctv", "chimney-sweep", "drain-clearance",
    ],
  },
  {
    slug: "cleaning-home",
    name: "Cleaning",
    category: "cleaning",
    description: "From carpet cleaning to exterior washing, we fill your diary with customers who want their property spotless.",
    icon: "IconSparkles",
    services: [
      "cleaning-services", "carpet-cleaning", "window-cleaning", "oven-cleaning",
      "gutter-cleaning", "exterior-cleaning", "roof-cleaning-moss-removal",
      "garden-services",
    ],
  },
  {
    slug: "other-industries-home",
    name: "Other Industries",
    category: "other",
    description: "Beauty, legal, driving, logistics, and beyond. Whatever your industry, we know how to get you leads.",
    icon: "IconCategory",
    services: [
      "beauty-therapy", "teeth-whitening", "tattoo-removals", "opticians",
      "solicitors", "driving-instructor", "taxi-and-airport-transfers",
      "line-marking", "skip-hire", "grab-hire", "waste-clearance",
      "house-and-garage-clearance", "removals", "plant-hire", "pest-control",
    ],
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export function getIndustryByCategory(category: string): Industry | undefined {
  return industries.find((i) => i.category === category);
}
