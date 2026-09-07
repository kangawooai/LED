import { services } from "@/data/services";
import { staff } from "@/data/staff";
import { blogPosts } from "@/data/blog-posts";
import { caseStudies } from "@/data/case-studies";

const baseUrl = "https://leadseveryday.co.uk";

export default async function sitemap() {
  const staticPages = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/faqs`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/book-a-call`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/meet-the-team`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/careers`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/resources`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/case-studies`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/cleaning`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/construction-and-home-improvements`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/motor-trade`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/trades`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/other-industries`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, changeFrequency: "yearly" as const, priority: 0.3 },
  ].map((page) => ({ ...page, lastModified: new Date() }));

  const servicePages = services.map((service) => ({
    url: `${baseUrl}/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const staffPages = staff.map((member) => ({
    url: `${baseUrl}/${member.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const caseStudyPages = caseStudies.map((study) => ({
    url: `${baseUrl}/case-studies/${study.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...staffPages, ...blogPages, ...caseStudyPages];
}
