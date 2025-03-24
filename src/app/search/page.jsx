// Server-side component
import SearchClient from './SearchClient';
import { FETCH_ALL_SALONS_FN } from '@/services/userService';

// Static trending searches for SEO
const trendingSearches = ['Haircut', 'Beard Trim', 'Facial', 'Hair Color', 'Manicure', 'Pedicure'];

// Generate dynamic metadata
export async function generateMetadata({ searchParams }) {
  // Await searchParams to satisfy Next.js's requirement
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = resolvedSearchParams?.q || '';
  const title = query
    ? `Search ${query} - Salons & Services | Cut My Hair`
    : 'Search Salons & Beauty Services | Cut My Hair';
  const description = query
    ? `Find the best salons offering ${query} near you. Book haircuts, facials, and more on Cut My Hair.`
    : 'Search for salons, haircuts, beard trims, and beauty services near you on Cut My Hair.';

  return {
    title,
    description,
    keywords: `salon, beauty, ${query || 'haircut, beard trim, facial'}, near me, Bangalore`,
    openGraph: {
      title,
      description,
      url: `https://cutmyhair.in/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
      type: 'website',
    },
  };
}

// Fetch initial popular salons for SEO content
async function fetchPopularSalons() {
  try {
    const response = await FETCH_ALL_SALONS_FN();
    return response?.data?.response.slice(0, 5) || [];
  } catch (error) {
    console.error('Error fetching popular salons:', error);
    return [];
  }
}

export default async function SearchPage({ searchParams }) {
  // Await searchParams to satisfy Next.js's requirement
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = resolvedSearchParams?.q || '';
  const popularSalons = await fetchPopularSalons();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': 'https://cutmyhair.in',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://cutmyhair.in/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div>
        {/* Static SEO content */}
        <header className="p-4">
          <h1 className="text-2xl font-bold">
            {query ? `Search Results for "${query}"` : 'Find Salons & Beauty Services Near You'}
          </h1>
          <p className="text-gray-600 mt-2">
            Explore top salons offering haircuts, beard trims, facials, and more in Bangalore and beyond.
          </p>
        </header>

        {/* Trending Searches for Crawlers */}
        {!query && (
          <section className="p-4">
            <h2 className="text-lg font-semibold mb-3">Trending Searches</h2>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((trend) => (
                <a
                  key={trend}
                  href={`/search?q=${encodeURIComponent(trend)}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-full text-sm"
                >
                  {trend}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Popular Salons for Crawlers */}
        {!query && popularSalons.length > 0 && (
          <section className="p-4">
            <h2 className="text-lg font-semibold mb-3">Popular Salons</h2>
            <div className="space-y-4">
              {popularSalons.map((salon) => (
                <a key={salon.salon_id} href={`/services/${salon.salon_id}`} className="block">
                  <div className="flex gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={salon.images?.[0] || '/default-salon.jpg'}
                        alt={`${salon.name} in ${salon.location_text}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#CE145B]">{salon.name}</h3>
                      <p className="text-gray-500 text-sm">{salon.location_text}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Client-side interactive search */}
        <SearchClient initialQuery={query} />
      </div>
    </>
  );
}