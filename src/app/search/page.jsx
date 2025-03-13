'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, X, Search as SearchIcon, MapPin, Scissors, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { SEARCH_SALON_FN } from '@/services/userService';

// Trending searches data
const trendingSearches = ['Haircut', 'Beard Trim', 'Facial', 'Hair Color', 'Manicure', 'Pedicure'];

// Common services and location keywords for search optimization
const commonServices = ['haircut', 'beard', 'trim', 'shave', 'facial', 'massage', 'spa', 'hair', 'color', 'styling', 'manicure', 'pedicure'];
//const locationKeywords = ['layout', 'road', 'nagar', 'colony', 'area', 'hsr', 'koramangala', 'indiranagar', 'jayanagar', 'whitefield', 'bangalore'];

// Get suggestions based on input query
const getSuggestions = (query) => {
  if (!query || query.trim() === '') return { salons: [], services: [], locations: [] };
  
  const searchRegex = new RegExp(query, 'i');
  
  return {
    salons: [
      { id: 's1', name: 'Glam & Glow Salon' },
      { id: 's2', name: 'Style Hub' },
      { id: 's3', name: 'Elegance Beauty Parlour' }
    ].filter(salon => searchRegex.test(salon.name)),
    
    services: [
      'Haircut', 'Beard Trim', 'Facial', 'Hair Color', 'Manicure', 'Pedicure', 
      'Hair Spa', 'Shave', 'Waxing', 'Threading', 'Hair Styling', 'Keratin'
    ].filter(service => searchRegex.test(service)),
    
    locations: [
      'Koramangala, Bangalore', 'Indiranagar, Bangalore', 'HSR Layout, Bangalore', 
      'Jayanagar, Bangalore', 'Whitefield, Bangalore'
    ].filter(location => searchRegex.test(location))
  };
};

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularSearches, setPopularSearches] = useState(['Haircut', 'Beard Trim', 'Salon near me']);
  const [suggestions, setSuggestions] = useState(null);
  const [animation, setAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { latitude, longitude } = useLocation() || {};
  
  // Load saved searches on mount
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem('popularSearches');
      if (savedSearches) {
        const parsed = JSON.parse(savedSearches);
        if (Array.isArray(parsed)) {
          setPopularSearches(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
    
    setAnimation(true);
  }, []);
  
  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };
  
  // Determine search type and priority
  const determineSearchType = (term) => {
    if (!term) return 'all';
    
    const termLower = term.toLowerCase();
    
    // Direct matches for common services
    const serviceExactMatch = commonServices.some(service => 
      termLower === service || 
      termLower === service + 's' || 
      termLower === service + 'ing' || 
      service === termLower + 's' || 
      Math.abs(service.length - termLower.length) <= 2 && (service.includes(termLower) || termLower.includes(service))
    );
    
    if (serviceExactMatch) {
      return 'service';
    }
    // Check if it's a service-related search but not an exact match
    const isServiceRelated = commonServices.some(service => termLower.includes(service));
    if (isServiceRelated) return 'service';
    return 'location';
  };
  
  // Search function
  const handleSearch = useCallback(
    debounce(async (term) => {
      // Reset previous results
      setError(null);
      
      if (!term || term.trim() === '') {
        setSearchResults([]);
        setShowSuggestions(false);
        setResultsCount(0);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const searchType = determineSearchType(term);
        console.log("Search type determined:", searchType);
        
        const searchParams = {
          query: term,
          searchType,
          limit: 20,
          skip: 0,
        };
        
        // Include location when available
        if (latitude && longitude) {
          searchParams.userLocation = {
            latitude,
            longitude,
            radius: 10 // km
          };
        }
        
        console.log("Search params:", searchParams);
        
        const result = await SEARCH_SALON_FN({ searchParams });
        console.log("Search Results ==>", result);
        
        if (!result || !result.data) {
          throw new Error('Search failed or returned invalid data');
        }
        
        // Extract data from the response structure that matches our updated backend
        const salonsData = result.data.salons || [];
        const count = result.data.totalCount || 0;
        setResultsCount(count);
        
        // Format and post-process results consistently
        const processedResults = salonsData.map(salon => ({
          ...salon,
          services: Array.isArray(salon.services) 
            ? salon.services 
            : (typeof salon.services === 'object' ? Object.values(salon.services) : [])
        }));
        console.log(processedResults);
        setSearchResults(processedResults);
        
        // Show suggestions if few results
        if (processedResults.length < 3) {
          const suggestionResults = getSuggestions(term);
          setSuggestions(suggestionResults);
          // Only show suggestions if there are any
          const hasSuggestions = 
            suggestionResults.salons.length > 0 || 
            suggestionResults.services.length > 0 || 
            suggestionResults.locations.length > 0;
          setShowSuggestions(false);
        } else {
          setSuggestions(null);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Search error:', error);
        setError(error.message || 'An error occurred while searching');
        setSearchResults([]);
        setResultsCount(0);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [latitude, longitude]
  );
  
  // Handle input change
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }
    
    // Show suggestions immediately for longer queries
    if (term.length >= 2) {
      const suggestionResults = getSuggestions(term);
      setSuggestions(suggestionResults);
      
      const hasSuggestions = 
        suggestionResults.salons.length > 0 || 
        suggestionResults.services.length > 0 || 
        suggestionResults.locations.length > 0;
      
      setShowSuggestions(hasSuggestions);
    }
    
    handleSearch(term);
  };
  
  // Handle search item click
  const handleSearchItemClick = (term) => {
    if (!term) return;
    
    setSearchTerm(term);
    handleSearch(term);
    
    // Update popular searches
    if (!popularSearches.includes(term)) {
      const updatedSearches = [term, ...popularSearches.slice(0, 4)];
      setPopularSearches(updatedSearches);
      
      // Save to localStorage
      try {
        localStorage.setItem('popularSearches', JSON.stringify(updatedSearches));
      } catch (error) {
        console.error('Error saving searches:', error);
      }
    }
    
    setShowSuggestions(false);
  };
  
  // Clear search
  const handleClearSearch = () => {
    setError('')
    setSearchTerm('');
    setSearchResults([]);
    setShowSuggestions(false);
  };
  
  // Back navigation
  const handleBack = () => {
    setAnimation(false);
    setTimeout(() => router.back(), 300);
  };
  
  // Format services
  const formatServices = (services) => {
    if (!services || !Array.isArray(services)) return [];
    return services.map(service => typeof service === 'object' ? service.name : service)
      .filter(Boolean); // Remove any undefined or empty values
  };
  
  // Format distance
  const formatDistance = (distance) => {
    if (distance === undefined || distance === null) return '';
    return `${distance} km`;
  };
  
  return (
    <div className={`fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out transform ${animation ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Header with Search Bar */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search for Locations, services..."
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE145B]"
              autoFocus
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-72px)]">
        {/* Search Suggestions */}
        {showSuggestions && suggestions && (
          <div className="absolute inset-x-0 top-[72px] z-20 bg-white border-b shadow-md">
            <div className="p-4">
              {suggestions.salons && suggestions.salons.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Salons</h3>
                  {suggestions.salons.map((salon, index) => (
                    <div 
                      key={`salon-${salon.id || index}`}
                      className="p-2 hover:bg-gray-50 rounded cursor-pointer flex items-center gap-2"
                      onClick={() => handleSearchItemClick(salon.name)}
                    >
                      <SearchIcon className="w-4 h-4 text-gray-400" />
                      <span>{salon.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {suggestions.services && suggestions.services.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.services.map((service, index) => (
                      <div 
                        key={`service-${index}`}
                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSearchItemClick(service)}
                      >
                        <Scissors className="w-3 h-3" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {suggestions.locations && suggestions.locations.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Locations</h3>
                  {suggestions.locations.map((location, index) => (
                    <div 
                      key={`location-${index}`}
                      className="p-2 hover:bg-gray-50 rounded cursor-pointer flex items-center gap-2"
                      onClick={() => handleSearchItemClick(location)}
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{location}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CE145B]"></div>
          </div>
        )}

        {/* Error Display */}
        {error && !isLoading && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg mx-4 my-4">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Popular Searches Section */}
        {searchTerm === '' && !isLoading && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Popular Searches</h2>
            <div className="space-y-3">
              {popularSearches.map((search, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSearchItemClick(search)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>{search}</span>
                  </div>
                  <X 
                    className="w-4 h-4 text-gray-400 hover:text-gray-600" 
                    onClick={(e) => {
                      e.stopPropagation();
                      const updatedSearches = popularSearches.filter(item => item !== search);
                      setPopularSearches(updatedSearches);
                      
                      // Update localStorage
                      try {
                        localStorage.setItem('popularSearches', JSON.stringify(updatedSearches));
                      } catch (error) {
                        console.error('Error saving searches:', error);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Trending Searches */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Trending Searches</h2>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((trend, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-full text-sm transition-colors"
                    onClick={() => handleSearchItemClick(trend)}
                  >
                    {trend}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchTerm !== '' && !isLoading && !error && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">
              {searchResults.length > 0 
                ? `Found ${resultsCount} result${resultsCount !== 1 ? 's' : ''}` 
                : 'No results found'}
            </h2>
            
            <div className="space-y-4">
              {searchResults.map((salon) => (
                <Link href={`/services/${salon.salon_id || salon._id}`} key={salon.salon_id || salon._id}>
                  <div className="flex gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                      <img 
                        src={salon.images?.[0]} 
                        alt={salon.name} 
                        className="w-full h-full object-cover"
                        // onError={(e) => {
                        //   e.target.onerror = null;
                        //   e.target.src = "/assets/salon-placeholder.jpg";
                        // }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-[#CE145B]">{salon.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                          ★ {salon.rating ? parseFloat(salon.rating).toFixed(1) : "New"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {salon.reviews?.length ? `(${salon.reviews.length} reviews)` : "(0 reviews)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {salon.address || salon.location_text || "Location information unavailable"} 
                          {salon.distance ? ` • ${formatDistance(salon.distance)}` : ""}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formatServices(salon.services).slice(0, 3).map((service, idx) => (
                          <span 
                            key={idx} 
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                          >
                            <Scissors className="w-3 h-3" />
                            <span>{service}</span>
                          </span>
                        ))}
                        {salon.services && salon.services.length > 3 && (
                          <span className="text-xs text-gray-500">+{salon.services.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {searchTerm !== '' && !isLoading && searchResults.length === 0 && !error && !suggestions && (
          <div className="p-4 mt-4">
            <h3 className="font-medium mb-2">Try searching for:</h3>
            <div className="space-y-2">
              <div 
                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => handleSearchItemClick('Haircut')}
              >
                <span>Haircut</span>
              </div>
              <div 
                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => handleSearchItemClick('Beard Trim')}
              >
                <span>Beard Trim</span>
              </div>
              <div 
                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => handleSearchItemClick('HSR Layout')}
              >
                <span>Salons in HSR Layout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}