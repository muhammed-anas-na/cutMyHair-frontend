import { FETCH_ALL_SALONS_FN } from "@/services/userService";
import { GET_BLOGS_FN } from "@/services/userService";

// Popular search queries for SEO
const popularSearchQueries = ['haircut', 'beard trim', 'facial', 'hair color', 'manicure', 'pedicure'];

// Static pages for consistent indexing
const staticPages = [
  { url: 'https://cutmyhair.in', changeFrequency: 'daily', priority: 1.0 },
  { url: 'https://cutmyhair.in/search', changeFrequency: 'daily', priority: 0.9 },
  { url: 'https://cutmyhair.in/blogs', changeFrequency: 'daily', priority: 0.9 }, // Blog index
  { url: 'https://cutmyhair.in/about', changeFrequency: 'monthly', priority: 0.7 },
  { url: 'https://cutmyhair.in/contact', changeFrequency: 'monthly', priority: 0.7 },
  { url: 'https://cutmyhair.in/privacy-policy', changeFrequency: 'monthly', priority: 0.5 },
  { url: 'https://cutmyhair.in/terms', changeFrequency: 'monthly', priority: 0.5 },
];

// Generate all URLs
async function generateAllUrls() {
  try {
    // Parallel fetching to improve performance
    const [salonResponse, blogResponse] = await Promise.all([
      FETCH_ALL_SALONS_FN(),
      GET_BLOGS_FN()
    ]);
    
    const salons = salonResponse?.data?.response || [];
    const blogs = blogResponse?.data?.blogs || [];

    // Salon URLs
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

    // Service URLs
    const serviceUrls = salons.flatMap((salon) =>
      salon.services.map((service) => ({
        url: `https://cutmyhair.in/services/${salon.salon_id}/${service.service_id}`,
        lastModified: service.updated_at ? new Date(service.updated_at) : new Date(),
        changeFrequency: service.status === 'available' ? 'weekly' : 'monthly',
        priority: 0.7,
      }))
    );

    // Blog URLs with proper prioritization by recency
    const blogUrls = blogs.map((blog, index) => {
      // Higher priority for more recent blogs (first 10)
      const priority = index < 10 ? 0.9 : 0.7;
      
      return {
        url: `https://cutmyhair.in/blogs/${blog.slug}`,
        lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(blog.createdAt),
        changeFrequency: 'weekly',
        priority,
      };
    });

    // Extract unique categories and create category URLs
    const categories = [...new Set(blogs.map(blog => blog.category))].filter(Boolean);
    
    const categoryUrls = categories.map(category => ({
      url: `https://cutmyhair.in/blogs/category/${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Search query URLs
    const searchQueryUrls = popularSearchQueries.map((query) => ({
      url: `https://cutmyhair.in/search?q=${encodeURIComponent(query)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    // Static URLs
    const staticUrls = staticPages.map((page) => ({
      ...page,
      lastModified: new Date(),
    }));

    // Combine all URLs, prioritizing the most important ones first
    return [
      ...staticUrls,
      ...blogUrls,
      ...categoryUrls,
      ...searchQueryUrls,
      ...salonUrls,
      ...serviceUrls
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages.map((page) => ({
      ...page,
      lastModified: new Date(),
    }));
  }
}

// Default sitemap export
export default async function sitemap() {
  try {
    const allUrls = await generateAllUrls();
    const maxUrlsPerSitemap = 50000; // Sitemap spec limit

    if (allUrls.length > maxUrlsPerSitemap) {
      // Create sitemap index if too many URLs
      const sitemapIndex = [];
      for (let i = 0; i < allUrls.length; i += maxUrlsPerSitemap) {
        sitemapIndex.push({
          url: `https://cutmyhair.in/sitemap-${Math.floor(i / maxUrlsPerSitemap)}.xml`,
          lastModified: new Date(),
        });
      }
      return sitemapIndex;
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

// Dynamic sitemap for pagination
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

// Optional but helpful: specialized blog sitemap for Google News
// If you want your content to be considered for Google News
export async function newsSitemap() {
  try {
    const blogResponse = await GET_BLOGS_FN();
    const blogs = blogResponse?.data?.blogs || [];
    
    // Only include blogs published in the last 2 days (Google News requirement)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const recentBlogs = blogs.filter(blog => {
      const publishDate = new Date(blog.createdAt);
      return publishDate > twoDaysAgo;
    });
    
    return recentBlogs.map(blog => ({
      url: `https://cutmyhair.in/blogs/${blog.slug}`,
      lastModified: new Date(blog.createdAt),
      // Google News specific properties
      news: {
        publication: {
          name: "CutMyHair.in",
          language: "en"
        },
        publicationDate: new Date(blog.createdAt).toISOString(),
        title: blog.title
      }
    }));
  } catch (error) {
    console.error("Error generating news sitemap:", error);
    return [];
  }
}