export const COMPANY = {
  name: "Leads Every Day",
  url: "https://www.leadseveryday.co.uk",
  description: "We help trade & home service businesses grow with a constant flow of high-quality, unique leads",
  phone: "",
  email: "",
  leadsDelivered: "25,000+",
  businessesGrown: "200+",
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
    title: "Engage & Qualify",
    description: "We start conversations and qualify the best prospects.",
  },
  {
    step: 4,
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
export const CRM_SERVICE_OPTIONS = [
  {
    group: "Automotive",
    options: [
      "Alloy Wheels", "Auto Electrician", "Bodyshop", "Brakes & Discs",
      "Cambelt", "Car Credit", "Car Detailing", "Car Servicing", "Clutch",
      "Differentials", "DPF Cleaning", "Engine Rebuilds", "Exhausts",
      "Gearbox", "Mobile Mechanic", "Motor Trade (Garage Services)", "MoT",
      "Remapping", "Suspensions", "Turbo solutions", "Tyres",
      "Vehicle Recovery",
    ],
  },
  {
    group: "Construction & Trades",
    options: [
      "Architect", "Bathroom Fitters", "Builders", "Damp proofing",
      "Driveways", "Electrician", "Fencing", "Flooring", "Garage Doors",
      "House Extensions", "Kitchen Fitter", "Loft conversion",
      "Painter and Decorator", "Plastering", "Plumbing heating",
      "Property maintenance", "Roofing", "Scaffolding",
    ],
  },
  {
    group: "Home Services",
    options: [
      "Aircon", "Boilers", "Chimney", "Chimney Sweep", "EV Chargers",
      "Landscaping", "Log Burners", "Solar", "Tree Surgeon",
    ],
  },
  {
    group: "Cleaning",
    options: [
      "Carpet Cleaning", "Cleaning Services", "Exterior Cleaning",
      "Oven Cleaning", "Window Cleaning",
    ],
  },
  {
    group: "Security",
    options: ["Alarms", "CCTV", "Locksmith"],
  },
  {
    group: "Waste & Clearance",
    options: [
      "Drains clearance", "Garage Clearance", "Grab Hire",
      "House Clearance", "Skip Hire", "Waste Clearance",
    ],
  },
  {
    group: "Health & Beauty",
    options: [
      "Microblading", "Tattoo Removal",
    ],
  },
  {
    group: "Transport",
    options: [
      "Driving Instructor", "Removals", "Taxi", "Tow Bars",
    ],
  },
  {
    group: "Professional Services",
    options: ["Bookkeeping", "Pat Testing", "Pest Control"],
  },
  {
    group: "Other",
    options: [
      "BESPOKE", "Line Marking", "Plant Hire",
    ],
  },
] as const;

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
