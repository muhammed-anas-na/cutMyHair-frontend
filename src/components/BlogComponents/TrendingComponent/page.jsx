'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TrendingTopics({
  title,
  trendingArticles = []
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle responsive scroll amount
  const getScrollAmount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 300; // mobile
      if (window.innerWidth < 1024) return 400; // tablet
      return 600; // desktop
    }
    return 400; // default
  };

  // Check if we can scroll left or right
  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Handle scroll action
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = getScrollAmount();
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount 
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Update button states after scrolling
      setTimeout(checkScrollButtons, 400);
    }
  };

  // Init and add resize listener
  useEffect(() => {
    setIsLoaded(true);
    checkScrollButtons();
    
    // Debounce function to limit how often the resize event fires
    const debounce = (func, delay) => {
      let timer;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
      };
    };

    const handleResize = debounce(() => {
      checkScrollButtons();
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check scroll buttons whenever trendingArticles change
  useEffect(() => {
    checkScrollButtons();
  }, [trendingArticles]);

  // Handle keyboard navigation
  const handleKeyDown = (e, direction) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scroll(direction);
    }
  };

  if (trendingArticles.length === 0) {
    return null; // Don't render anything if no articles
  }

  // Format category name
  const formatCategoryName = (category) => {
    return category
      ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : '';
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {title}
            </h2>
            <div className="ml-3 h-1 w-16 sm:w-24 md:w-32 rounded bg-[#CE145B]"></div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              onKeyDown={(e) => handleKeyDown(e, 'left')}
              className={`p-2 rounded-full border transition-all ${
                canScrollLeft 
                  ? 'border-gray-300 hover:bg-gray-100 hover:border-[#CE145B] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:ring-opacity-50' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              onKeyDown={(e) => handleKeyDown(e, 'right')}
              className={`p-2 rounded-full border transition-all ${
                canScrollRight 
                  ? 'border-gray-300 hover:bg-gray-100 hover:border-[#CE145B] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:ring-opacity-50' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className={`flex overflow-x-auto scrollbar-hide gap-4 sm:gap-6 pb-6 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={checkScrollButtons}
          aria-label={`${title} articles carousel`}
        >
          {trendingArticles.map((article) => (
            <div 
              key={article.id} 
              className="flex-none w-[80vw] xs:w-[70vw] sm:w-[325px] md:w-[300px] lg:w-[320px] xl:w-[300px]"
            >
              <Link 
                href={`/blogs/${article.slug}`} 
                className="block group h-full"
                aria-label={`Read article: ${article.title}`}
              >
                <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col transform group-hover:translate-y-[-5px]">
                  <div className="relative w-full h-0 pb-[60%] overflow-hidden bg-gray-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 80vw, (max-width: 768px) 325px, (max-width: 1024px) 300px, 320px"
                    />
                    {article.category && (
                      <div className="absolute top-0 left-0 m-3">
                        <span className="inline-block bg-[#CE145B] text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm">
                          {formatCategoryName(article.category)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#CE145B] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-2 border-t border-gray-100">
                      <span className="inline-flex items-center text-sm font-medium text-[#CE145B] group-hover:translate-x-1 transition-transform">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Mobile swipe indicator - now with active states */}
        <div className="flex justify-center mt-2 md:hidden">
          <div className="flex space-x-2">
            <span className={`w-6 h-1 rounded-full ${canScrollLeft ? 'bg-gray-300' : 'bg-[#CE145B]'}`}></span>
            <span className="w-6 h-1 bg-gray-300 rounded-full"></span>
            <span className={`w-6 h-1 rounded-full ${canScrollRight ? 'bg-gray-300' : 'bg-[#CE145B]'}`}></span>
          </div>
        </div>
        
        {/* View all articles link */}
        <div className="mt-6 text-center">
          <Link 
            href={`/category/${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center text-sm font-medium text-[#CE145B] hover:underline"
          >
            View all {title} articles
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}