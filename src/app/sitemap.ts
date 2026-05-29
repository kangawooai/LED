export default async function sitemap() {
  const baseUrl = "https://solaris-lilac-xi.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
