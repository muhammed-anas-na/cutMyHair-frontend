import { FETCH_ALL_SALONS_FN } from "@/services/userService";

// Popular search queries for SEO
const popularSearchQueries = ['haircut', 'beard trim', 'facial', 'hair color', 'manicure', 'pedicure'];

// Static pages for consistent indexing
const staticPages = [
  { url: 'https://cutmyhair.in', changeFrequency: 'daily', priority: 1.0 },
  { url: 'https://cutmyhair.in/search', changeFrequency: 'daily', priority: 0.9 },
  { url: 'https://cutmyhair.in/about', changeFrequency: 'monthly', priority: 0.7 },
  { url: 'https://cutmyhair.in/contact', changeFrequency: 'monthly', priority: 0.7 },
];

// Generate all URLs (used by both sitemap and paginated logic)
async function generateAllUrls() {
  const response = await FETCH_ALL_SALONS_FN();
  const salons = response?.data?.response || [];

  // Log for debugging (remove in production)
  console.log("All salons=>", salons);

  const salonUrls = salons.map((salon) => {
    const serviceUpdateTimes = salon.services.map((service) =>
      service.updated_at ? new Date(service.updated_at) : new Date()
    );
    const lastModified = serviceUpdateTimes.length
      ? new Date(Math.max(...serviceUpdateTimes))
      : new Date();

    return {
      url: `https://cutmyhair.in/services/${salon.salon_id}`,
      lastModified,
      changeFrequency: salon.status === 'active' ? 'weekly' : 'monthly',
      priority: salon.rating > 4 ? 0.9 : 0.8,
    };
  });

  const serviceUrls = salons.flatMap((salon) =>
    salon.services.map((service) => ({
      url: `https://cutmyhair.in/services/${salon.salon_id}/${service.service_id}`,
      lastModified: service.updated_at ? new Date(service.updated_at) : new Date(),
      changeFrequency: service.status === 'available' ? 'weekly' : 'monthly',
      priority: 0.7,
    }))
  );

  const searchQueryUrls = popularSearchQueries.map((query) => ({
    url: `https://cutmyhair.in/search?q=${encodeURIComponent(query)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const staticUrls = staticPages.map((page) => ({
    ...page,
    lastModified: new Date(),
  }));

  return [...staticUrls, ...searchQueryUrls, ...salonUrls, ...serviceUrls];
}

// Default sitemap export
export default async function sitemap() {
  try {
    const allUrls = await generateAllUrls();
    const maxUrlsPerSitemap = 50000; // Sitemap spec limit

    if (allUrls.length > maxUrlsPerSitemap) {
      const sitemapIndex = [];
      for (let i = 0; i < allUrls.length; i += maxUrlsPerSitemap) {
        sitemapIndex.push({
          url: `https://cutmyhair.in/sitemap-${Math.floor(i / maxUrlsPerSitemap)}.xml`,
          lastModified: new Date(),
        });
      }
      return sitemapIndex; // Return sitemap index if too many URLs
    }

    return allUrls;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages.map((page) => ({
      ...page,
      lastModified: new Date(),
    }));
  }
}

// Optional: Dynamic sitemap for pagination (no duplicate 'sitemap' declaration)
export async function dynamicSitemap({ id }) {
  try {
    const allUrls = await generateAllUrls();
    const maxUrlsPerSitemap = 50000;
    const chunk = allUrls.slice(id * maxUrlsPerSitemap, (id + 1) * maxUrlsPerSitemap);
    return chunk;
  } catch (error) {
    console.error(`Error generating sitemap chunk ${id}:`, error);
    return [];
  }
}