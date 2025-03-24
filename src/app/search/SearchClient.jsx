'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, X, Search as SearchIcon, MapPin, Scissors, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { SEARCH_SALON_FN } from '@/services/userService';

const trendingSearches = ['Haircut', 'Beard Trim', 'Facial', 'Hair Color', 'Manicure', 'Pedicure'];
const commonServices = ['haircut', 'beard', 'trim', 'shave', 'facial', 'massage', 'spa', 'hair', 'color', 'styling', 'manicure', 'pedicure'];

const getSuggestions = (query) => {
  if (!query || query.trim() === '') return { salons: [], services: [], locations: [] };
  const searchRegex = new RegExp(query, 'i');
  return {
    services: [
      'Haircut', 'Beard Trim', 'Facial', 'Hair Color', 'Manicure', 'Pedicure',
      'Hair Spa', 'Shave', 'Waxing', 'Threading', 'Hair Styling', 'Keratin',
    ].filter((service) => searchRegex.test(service)),
    locations: [
      'Koramangala, Bangalore', 'Indiranagar, Bangalore', 'HSR Layout, Bangalore',
      'Jayanagar, Bangalore', 'Whitefield, Bangalore',
    ].filter((location) => searchRegex.test(location)),
  };
};

export default function SearchClient({ initialQuery = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
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

  useEffect(() => {
    const savedSearches = localStorage.getItem('popularSearches');
    if (savedSearches) {
      try {
        const parsed = JSON.parse(savedSearches);
        if (Array.isArray(parsed)) setPopularSearches(parsed);
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
    setAnimation(true);
    if (initialQuery) handleSearch(initialQuery);
  }, [initialQuery]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const determineSearchType = (term) => {
    if (!term) return 'all';
    const termLower = term.toLowerCase();
    const serviceExactMatch = commonServices.some((service) =>
      termLower === service ||
      termLower === service + 's' ||
      termLower === service + 'ing' ||
      service === termLower + 's' ||
      (Math.abs(service.length - termLower.length) <= 2 && (service.includes(termLower) || termLower.includes(service)))
    );
    return serviceExactMatch || commonServices.some((service) => termLower.includes(service)) ? 'service' : 'location';
  };

  const handleSearch = useCallback(
    debounce(async (term) => {
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
        const searchParams = {
          query: term,
          searchType,
          limit: 20,
          skip: 0,
          ...(latitude && longitude && {
            userLocation: { latitude, longitude, radius: 10 },
          }),
        };
        const result = await SEARCH_SALON_FN({ searchParams });
        if (!result?.data) throw new Error('Search failed');
        const salonsData = result.data.salons || [];
        const count = result.data.totalCount || 0;
        setResultsCount(count);
        const processedResults = salonsData.map((salon) => ({
          ...salon,
          services: Array.isArray(salon.services)
            ? salon.services
            : typeof salon.services === 'object'
            ? Object.values(salon.services)
            : [],
        }));
        setSearchResults(processedResults);
        if (processedResults.length == 0) {
      
          const suggestionResults = getSuggestions(term);
          setSuggestions(suggestionResults);
          setShowSuggestions(
            suggestionResults.salons.length > 0 ||
            suggestionResults.services.length > 0 ||
            suggestionResults.locations.length > 0
          );
        } else {
          setSuggestions(null);
          setShowSuggestions(false);
        }
        router.push(`/search?q=${encodeURIComponent(term)}`, { shallow: true });
      } catch (error) {
        setError(error.message || 'An error occurred while searching');
        setSearchResults([]);
        setResultsCount(0);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [latitude, longitude]
  );

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }
    if (term.length >= 2) {
      const suggestionResults = getSuggestions(term);
      setSuggestions(suggestionResults);
      setShowSuggestions(
        suggestionResults.salons.length > 0 ||
        suggestionResults.services.length > 0 ||
        suggestionResults.locations.length > 0
      );
    }
    handleSearch(term);
  };

  const handleSearchItemClick = (term) => {
    if (!term) return;
    setSearchTerm(term);
    handleSearch(term);
    if (!popularSearches.includes(term)) {
      const updatedSearches = [term, ...popularSearches.slice(0, 4)];
      setPopularSearches(updatedSearches);
      try {
        localStorage.setItem('popularSearches', JSON.stringify(updatedSearches));
      } catch (error) {
        console.error('Error saving searches:', error);
      }
    }
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setError('');
    setSearchTerm('');
    setSearchResults([]);
    setShowSuggestions(false);
    router.push('/search', { shallow: true });
  };

  const handleBack = () => {
    setAnimation(false);
    setTimeout(() => router.push('/home'), 300);
  };

  const formatServices = (services) =>
    Array.isArray(services) ? services.map((s) => (typeof s === 'object' ? s.name : s)).filter(Boolean) : [];

  const formatDistance = (distance) => (distance ? `${distance} km` : '');

  return (
    <div
      className={`fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out transform ${
        animation ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Go back">
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
        {showSuggestions && suggestions && (
          <div className="absolute inset-x-0 top-[72px] z-20 bg-white border-b shadow-md">
            <div className="p-4">
              {suggestions.salons.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Salons</h3>
                  {suggestions.salons.map((salon) => (
                    <div
                      key={salon.id}
                      className="p-2 hover:bg-gray-50 rounded cursor-pointer flex items-center gap-2"
                      onClick={() => handleSearchItemClick(salon.name)}
                    >
                      <SearchIcon className="w-4 h-4 text-gray-400" />
                      <span>{salon.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {suggestions.services.length > 0 && (
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
              {suggestions.locations.length > 0 && (
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

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CE145B]"></div>
          </div>
        )}

        {error && !isLoading && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg mx-4 my-4">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

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
                      const updatedSearches = popularSearches.filter((item) => item !== search);
                      setPopularSearches(updatedSearches);
                      localStorage.setItem('popularSearches', JSON.stringify(updatedSearches));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
                        src={salon.images?.[0] || '/default-salon.jpg'}
                        alt={`${salon.name} salon`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-[#CE145B]">{salon.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                          ★ {salon.rating ? parseFloat(salon.rating).toFixed(1) : 'New'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {salon.reviews?.length ? `(${salon.reviews.length} reviews)` : '(0 reviews)'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {salon.address || salon.location_text || 'Location unavailable'} {formatDistance(salon.distance)}
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
                        {salon.services?.length > 3 && (
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
              {['Haircut', 'Beard Trim', 'HSR Layout'].map((suggestion) => (
                <div
                  key={suggestion}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSearchItemClick(suggestion)}
                >
                  <span>{suggestion === 'HSR Layout' ? 'Salons in HSR Layout' : suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}