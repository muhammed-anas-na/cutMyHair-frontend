'use client';

import { useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/BlogComponents/HeroSectionComponent/page";
import TrendingTopics from "@/components/BlogComponents/TrendingComponent/page";

export default function ClientBlogListing({ blogs, categories }) {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter blogs by category
  const getFilteredBlogs = (category) => {
    if (category === 'all') {
      return blogs.slice(0, 8); // Show most recent 8 blogs for "all" category
    }
    
    return blogs
      .filter(blog => blog.category === category)
      .slice(0, 8); // Limit to 8 items
  };

  // Get category display name (format hyphenated strings)
  const getCategoryDisplayName = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get trending blogs (most recent ones)
  const trendingBlogs = blogs.slice(0, 8);
  
  // Special promotions and salon news (higher priority placement)
  const promotionsBlogs = getFilteredBlogs("promotions");
  const salonNewsBlogs = getFilteredBlogs("salon-news");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section with category filter */}
      <HeroSection />
      
      {/* Category navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav aria-label="Blog categories">
          <ul className="flex flex-wrap gap-2">
            <li>
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'all' 
                  ? 'bg-[#CE145B] text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                aria-current={activeCategory === 'all' ? 'page' : undefined}
              >
                All Posts
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category 
                    ? 'bg-[#CE145B] text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  aria-current={activeCategory === category ? 'page' : undefined}
                >
                  {getCategoryDisplayName(category)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Show trending blogs first if "all" is selected */}
      {activeCategory === 'all' && trendingBlogs.length > 0 && (
        <TrendingTopics title="Trending Now" trendingArticles={trendingBlogs} />
      )}
      
      {/* Show promotions if available and "all" or "promotions" is selected */}
      {(activeCategory === 'all' || activeCategory === 'promotions') && 
       promotionsBlogs.length > 0 && (
        <TrendingTopics 
          title="Special Promotions" 
          trendingArticles={promotionsBlogs} 
        />
      )}
      
      {/* Show salon news if available and "all" or "salon-news" is selected */}
      {(activeCategory === 'all' || activeCategory === 'salon-news') && 
       salonNewsBlogs.length > 0 && (
        <TrendingTopics 
          title="Salon News" 
          trendingArticles={salonNewsBlogs} 
        />
      )}
      
      {/* Show selected category or remaining categories in "all" mode */}
      {activeCategory !== 'all' ? (
        // Show only the selected category
        <TrendingTopics 
          title={getCategoryDisplayName(activeCategory)} 
          trendingArticles={getFilteredBlogs(activeCategory)} 
        />
      ) : (
        // Map through remaining categories in "all" mode
        categories
          .filter(category => !["promotions", "salon-news"].includes(category))
          .map(category => {
            const categoryBlogs = getFilteredBlogs(category);
            if (categoryBlogs.length === 0) return null;
            
            return (
              <TrendingTopics 
                key={category}
                title={getCategoryDisplayName(category)} 
                trendingArticles={categoryBlogs} 
              />
            );
          })
      )}
      
      {/* Show message if no blogs are available */}
      {blogs.length === 0 && (
        <div className="py-12 text-center">
          <h3 className="text-xl text-gray-600">No blog posts available at the moment.</h3>
        </div>
      )}
      
      {/* SEO optimization: Add links to all category pages */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100 mt-8">
        <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map(category => (
            <Link 
              key={category}
              href={`/blogs/category/${category}`}
              className="text-[#CE145B] hover:underline"
            >
              {getCategoryDisplayName(category)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}