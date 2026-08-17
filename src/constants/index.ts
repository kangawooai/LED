export const COMPANY = {
  name: "Leads Every Day",
  url: "https://www.leadseveryday.co.uk",
  description: "We help trade & home service businesses grow with a constant flow of high-quality, unique leads",
  phone: "",
  email: "",
  leadsDelivered: "25,000+",
  businessesGrown: "1,000+",
  averageRoi: "4.7x",
  clientRetention: "98%",
} as const;

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/leadseveryday.co.uk/",
  x: "https://x.com/LeadsEverydayUK",
  instagram: "https://www.instagram.com/leadseveryday/",
  youtube: "https://www.youtube.com/@LeadsEveryDayLtd",
  linkedin: "https://www.linkedin.com/company/8832153/",
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "FAQs", href: "/faqs" },
] as const;

export const STATS = [
  { value: "20,000+", label: "Campaigns Run", sublabel: "Across the UK" },
  { value: "1M+", label: "Unique Leads", sublabel: "To UK Businesses" },
  { value: "1,200+", label: "Reviews", sublabel: "Across all Platforms" },
  { value: "48hrs", label: "Average Time", sublabel: "To Get a Campaign Live" },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Discover",
    description: "We learn about your business, goals and ideal customers.",
  },
  {
    step: 2,
    title: "Build & Target",
    description: "We build targeted lists and craft compelling outreach.",
  },
  {
    step: 3,
    title: "Deliver Results",
    description: "You receive high-quality, ready-to-book leads that convert.",
  },
] as const;

export const SERVICES = [
  {
    title: "Targeted Lead Generation",
    description: "We find and target your ideal customers using proven data-driven methods.",
  },
  {
    title: "Multi-Channel Outreach",
    description: "Email, LinkedIn, SMS & more to maximise reach and engagement.",
  },
  {
    title: "Unique Leads",
    description: "Every lead is exclusive to you, we never sell the same lead to your competitors.",
  },
  {
    title: "Reporting & Insights",
    description: "Transparent reporting so you see exactly how many leads we deliver.",
  },
] as const;

export const TRUST_LOGOS = [
  "Checkatrade",
  "Trustist",
  "Google",
  "Rated People",
  "Bark",
  "MyBuilder.com",
] as const;

/** Returns the CRM-expected service name for a given service name */
export function getCrmServiceName(serviceName: string): string {
  return CRM_SERVICE_MAP[serviceName] ?? serviceName;
}

/** Grouped CRM service options for dropdowns (book-a-call) */
export type ServiceOption = { label: string; value: string; bespoke?: boolean };
export type ServiceGroup = { group: string; options: ServiceOption[] };

// Catch-all shown (in green) at the bottom of every industry's service list.
export const BESPOKE_OPTION: ServiceOption = {
  label: "I can't find my business service",
  value: "BESPOKE",
  bespoke: true,
};

const RAW_SERVICE_OPTIONS: ServiceGroup[] = [
  {
    group: "Construction & Home Improvements",
    options: [
      { label: "Plastering", value: "Plastering" },
      { label: "Scaffolding", value: "Scaffolding" },
      { label: "House Extensions", value: "House Extensions" },
      { label: "Loft Conversions", value: "Loft conversion" },
      { label: "Kitchen & Bathroom Fitters", value: "Kitchen Fitter" },
      { label: "Flooring", value: "Flooring" },
      { label: "Garage Doors", value: "Garage Doors" },
      { label: "Conservatory Roofs", value: "Roofing" },
      { label: "Insulation", value: "Builders" },
      { label: "Damp Proofing", value: "Damp proofing" },
      { label: "Pointing", value: "Builders" },
      { label: "Masonry", value: "Builders" },
      { label: "Concrete Delivery", value: "Builders" },
      { label: "Dry Lining", value: "Builders" },
      { label: "Painter & Decorator", value: "Painter and Decorator" },
      { label: "Tiling", value: "Bathroom Fitters" },
      { label: "Driveways", value: "Driveways" },
      { label: "Fencing", value: "Fencing" },
      { label: "Guttering", value: "Roofing" },
      { label: "Roof Repairs", value: "Roofing" },
      { label: "Asbestos Removal", value: "Builders" },
      { label: "Demolitions", value: "Builders" },
      { label: "Artificial Grass", value: "Landscaping" },
      { label: "Landscaping", value: "Landscaping" },
      { label: "Property Maintenance", value: "Property maintenance" },
      { label: "Architects", value: "Architect" },
      { label: "Chimney Services", value: "Chimney" },
    ],
  },
  {
    group: "Motor Trade",
    options: [
      { label: "MOT Bookings", value: "MoT" },
      { label: "Servicing", value: "Car Servicing" },
      { label: "Clutch Repairs & Replacement", value: "Clutch" },
      { label: "Suspension Repairs & Replacement", value: "Suspensions" },
      { label: "Brakes & Discs", value: "Brakes & Discs" },
      { label: "Cambelt Repairs & Replacement", value: "Cambelt" },
      { label: "Turbo Repairs & Replacement", value: "Turbo solutions" },
      { label: "Gearbox Repairs & Replacement", value: "Gearbox" },
      { label: "Engine Recon & Rebuilds", value: "Engine Rebuilds" },
      { label: "Exhausts", value: "Exhausts" },
      { label: "DPF & Carbon Cleaning", value: "DPF Cleaning" },
      { label: "Remapping", value: "Remapping" },
      { label: "Tyres", value: "Tyres" },
      { label: "Wheel Repair & Alloys", value: "Alloy Wheels" },
      { label: "Bodyshop & Smart Repairs", value: "Bodyshop" },
      { label: "Auto Electrician", value: "Auto Electrician" },
      { label: "Air Conditioning", value: "Aircon" },
      { label: "Electric & Hybrid Servicing", value: "Motor Trade (Garage Services)" },
      { label: "Towbar Supply & Installation", value: "Tow Bars" },
      { label: "Vehicle Immobiliser Installation", value: "Motor Trade (Garage Services)" },
      { label: "Detailing", value: "Car Detailing" },
      { label: "Car & Van Finance", value: "Car Credit" },
      { label: "Vehicle Recovery", value: "Vehicle Recovery" },
      { label: "Differentials", value: "Differentials" },
      { label: "Mobile Mechanic", value: "Mobile Mechanic" },
    ],
  },
  {
    group: "Trades",
    options: [
      { label: "Electrician", value: "Electrician" },
      { label: "Plumbing & Heating", value: "Plumbing heating" },
      { label: "Boiler Repairs & Servicing", value: "Boilers" },
      { label: "EV Charging", value: "EV Chargers" },
      { label: "PAT Testing", value: "Pat Testing" },
      { label: "Solar Panels", value: "Solar" },
      { label: "Locksmith", value: "Locksmith" },
      { label: "Alarms", value: "Alarms" },
      { label: "CCTV", value: "CCTV" },
      { label: "Chimney Sweep", value: "Chimney Sweep" },
      { label: "Drain Clearance", value: "Drains clearance" },
    ],
  },
  {
    group: "Cleaning",
    options: [
      { label: "Cleaning Services", value: "Cleaning Services" },
      { label: "Carpet Cleaning", value: "Carpet Cleaning" },
      { label: "Window Cleaning", value: "Window Cleaning" },
      { label: "Oven Cleaning", value: "Oven Cleaning" },
      { label: "Gutter Cleaning", value: "Exterior Cleaning" },
      { label: "Exterior Cleaning", value: "Exterior Cleaning" },
      { label: "Roof Cleaning & Moss Removal", value: "Exterior Cleaning" },
      { label: "Garden Services", value: "Landscaping" },
    ],
  },
  {
    group: "Other Industries",
    options: [
      { label: "Beauty Therapy", value: "Microblading" },
      { label: "Teeth Whitening", value: "Tattoo Removal" },
      { label: "Tattoo Removals", value: "Tattoo Removal" },
      { label: "Opticians", value: "BESPOKE" },
      { label: "Solicitors", value: "BESPOKE" },
      { label: "Driving Instructor", value: "Driving Instructor" },
      { label: "Taxi & Airport Transfers", value: "Taxi" },
      { label: "Line Marking", value: "Line Marking" },
      { label: "Skip Hire", value: "Skip Hire" },
      { label: "Grab Hire", value: "Grab Hire" },
      { label: "Waste Clearance", value: "Waste Clearance" },
      { label: "House & Garage Clearance", value: "House Clearance" },
      { label: "Removals", value: "Removals" },
      { label: "Plant Hire", value: "Plant Hire" },
      { label: "Pest Control", value: "Pest Control" },
      { label: "Tree Surgeon", value: "Tree Surgeon" },
    ],
  },
];

// Industries A–Z; services A–Z within each, with the "can't find" catch-all pinned last.
export const CRM_SERVICE_OPTIONS: ServiceGroup[] = RAW_SERVICE_OPTIONS.map((g) => ({
  group: g.group,
  options: [
    ...g.options.slice().sort((a, b) => a.label.localeCompare(b.label)),
    BESPOKE_OPTION,
  ],
})).sort((a, b) => a.group.localeCompare(b.group));

/**
 * Maps our service names to the exact CRM/Zapier values.
 * If a service name is not in this map, it is sent as-is.
 */
export const CRM_SERVICE_MAP: Record<string, string> = {
  // Motor Trade
  "MOT Bookings": "MoT",
  "Servicing": "Car Servicing",
  "Clutch Repairs & Replacement": "Clutch",
  "Suspension Repairs & Replacement": "Suspensions",
  "Brakes & Discs": "Brakes & Discs",
  "Cambelt Repairs & Replacement": "Cambelt",
  "Turbo Repairs & Replacement": "Turbo solutions",
  "Gearbox Repairs & Replacement": "Gearbox",
  "Engine Recon & Rebuilds": "Engine Rebuilds",
  "Exhausts": "Exhausts",
  "DPF & Carbon Cleaning": "DPF Cleaning",
  "Remapping": "Remapping",
  "Tyres": "Tyres",
  "Wheel Repair & Alloys": "Alloy Wheels",
  "Bodyshop & Smart Repairs": "Bodyshop",
  "Auto Electrician": "Auto Electrician",
  "Air Conditioning": "Aircon",
  "Electric & Hybrid Servicing": "Motor Trade (Garage Services)",
  "Towbar Supply & Installation": "Tow Bars",
  "Vehicle Immobiliser Installation": "Motor Trade (Garage Services)",
  "Detailing": "Car Detailing",
  "Car & Van Finance": "Car Credit",
  "Vehicle Recovery": "Vehicle Recovery",
  "Differentials": "Differentials",
  "Mobile Mechanic": "Mobile Mechanic",

  // Construction
  "Plastering": "Plastering",
  "Scaffolding": "Scaffolding",
  "House Extensions": "House Extensions",
  "Loft Conversions": "Loft conversion",
  "Kitchen & Bathroom Fitters": "Kitchen Fitter",
  "Flooring": "Flooring",
  "Garage Doors": "Garage Doors",
  "Conservatory Roofs": "Roofing",
  "Insulation": "Builders",
  "Damp Proofing": "Damp proofing",
  "Pointing": "Builders",
  "Masonry": "Builders",
  "Concrete Delivery": "Builders",
  "Dry Lining": "Builders",
  "Painter & Decorator": "Painter and Decorator",
  "Tiling": "Bathroom Fitters",
  "Driveways": "Driveways",
  "Fencing": "Fencing",
  "Guttering": "Roofing",
  "Roof Repairs": "Roofing",
  "Asbestos Removal": "Builders",
  "Demolitions": "Builders",
  "Artificial Grass": "Landscaping",
  "Landscaping": "Landscaping",
  "Property Maintenance": "Property maintenance",
  "Architects": "Architect",
  "Chimney Services": "Chimney",

  // Trades
  "Electrician": "Electrician",
  "Plumbing & Heating": "Plumbing heating",
  "Boiler Repairs & Servicing": "Boilers",
  "EV Charging": "EV Chargers",
  "PAT Testing": "Pat Testing",
  "Solar Panels": "Solar",
  "Locksmith": "Locksmith",
  "Alarms": "Alarms",
  "CCTV": "CCTV",
  "Chimney Sweep": "Chimney Sweep",
  "Drain Clearance": "Drains clearance",

  // Cleaning
  "Cleaning Services": "Cleaning Services",
  "Carpet Cleaning": "Carpet Cleaning",
  "Window Cleaning": "Window Cleaning",
  "Oven Cleaning": "Oven Cleaning",
  "Gutter Cleaning": "Exterior Cleaning",
  "Exterior Cleaning": "Exterior Cleaning",
  "Roof Cleaning & Moss Removal": "Exterior Cleaning",
  "Garden Services": "Landscaping",

  // Other
  "Beauty Therapy": "Microblading",
  "Teeth Whitening": "Tattoo Removal",
  "Tattoo Removals": "Tattoo Removal",
  "Opticians": "BESPOKE",
  "Solicitors": "BESPOKE",
  "Driving Instructor": "Driving Instructor",
  "Taxi & Airport Transfers": "Taxi",
  "Line Marking": "Line Marking",
  "Skip Hire": "Skip Hire",
  "Grab Hire": "Grab Hire",
  "Waste Clearance": "Waste Clearance",
  "House & Garage Clearance": "House Clearance",
  "Removals": "Removals",
  "Plant Hire": "Plant Hire",
  "Pest Control": "Pest Control",
};
