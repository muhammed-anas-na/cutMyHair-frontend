'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, MapPin, Star, Clock, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation/page';
import Header from '@/components/Header/page';
import { GET_ALL_FAVOURITES_FN, REMOVE_FROM_FAVORITES_FN } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { checkIfOpenToday } from '@/helpers';

const Favorites = () => {
  const { user_id } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchFavorites = async (userId) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await GET_ALL_FAVOURITES_FN(userId);
      
      if (response?.data?.data?.data) {
        // Extract salons from the nested response
        const { salons = [], favorites = [] } = response.data.data.data;
        
        // Add isFavorite flag to each salon
        const favoriteSalons = salons.map(salon => ({
          ...salon,
          isFavorite: true
        }));
        
        setFavorites(favoriteSalons);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(user_id);
  }, [user_id]);

  const handleRemoveFavorite = async (salon_id) => {
    try {
      await REMOVE_FROM_FAVORITES_FN(salon_id, user_id);
      
      // Update local state
      setFavorites(prev => prev.filter(salon => salon.salon_id !== salon_id));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const navigateToSalon = (salon_id) => {
    router.push(`/salon/${salon_id}`);
  };

  const navigateToExplore = () => {
    router.push('/explore');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true, 
    });
  };
  
  // Get today's working hours
  const getTodayHours = (salon) => {
    if (!salon) return 'Hours not available';
    
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = daysOfWeek[new Date().getDay()];
    
    if (!salon.working_hours || !salon.working_hours[today]) {
      return 'Hours not available';
    }
    
    const hours = salon.working_hours[today];
    if (!hours.isOpen) return 'Closed today';
    
    return `${formatTime(hours.start)} - ${formatTime(hours.end)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Content Container - Adding responsive padding and max-width */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Page Title */}
        <div className="mt-4 mb-2">
          <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
          <p className="text-gray-500">Salons you've saved</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 pb-16">
          {isLoading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading your favorites...</p>
            </div>
          ) : error ? (
            // Error state
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">{error}</h3>
              <p className="text-gray-500 mb-4">Please try again later</p>
              <button 
                onClick={() => fetchFavorites(user_id)} 
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Retry
              </button>
            </div>
          ) : favorites.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center mt-8">
              <div className="w-full max-w-[250px] mx-auto relative aspect-square mb-6">
                <Image
                  src="/fav-image.png"
                  alt="Empty favorites"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                No favorites yet
              </h2>
              <p className="text-gray-500 mb-6 text-center max-w-xs">
                Save your favorite salons by tapping the heart icon while browsing
              </p>
              <button 
                onClick={navigateToExplore}
                className="bg-pink-600 text-white px-8 py-3 rounded-lg font-medium w-full max-w-[300px] hover:bg-pink-700 transition-colors"
              >
                Explore Salons
              </button>
            </div>
          ) : (
            // Favorites list
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map(salon => {
                const isOpen = checkIfOpenToday(salon);
                return (
                  <div 
                    key={salon.salon_id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden relative"
                  >
                    {/* Salon Image */}
                    <div className="relative h-48 w-full cursor-pointer" onClick={() => navigateToSalon(salon.salon_id)}>
                      {salon.images && salon.images.length > 0 ? (
                        <img
                          src={salon.images[0]}
                          alt={salon.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      
                      {/* Open/Closed Badge */}
                      <div className="absolute top-3 left-3">
                        <div className={`px-3 py-1 text-sm rounded-md font-medium ${isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                          {isOpen ? 'Open' : 'Closed'}
                        </div>
                      </div>
                      
                      {/* Remove from favorites button */}
                      <button
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(salon.salon_id);
                        }}
                      >
                        <Heart className="h-5 w-5 fill-current text-[#CE145B]" />
                      </button>
                    </div>
                    
                    {/* Salon Info */}
                    <div className="p-4 cursor-pointer" onClick={() => navigateToSalon(salon.salon_id)}>
                      <div className="flex justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{salon.name}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="font-medium text-gray-800">
                            {salon.rating > 0 ? salon.rating.toFixed(1) : '4.6'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {salon.location_name || ''}{salon.location_name && salon.address ? ', ' : ''}{salon.address}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {salon.services && salon.services.slice(0, 3).map(service => (
                          <span 
                            key={service._id} 
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {service.name}
                          </span>
                        ))}
                        {salon.services && salon.services.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            +{salon.services.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{getTodayHours(salon)}</span>
                        </div>
                        <button 
                          className="text-pink-600 font-medium hover:text-pink-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToSalon(salon.salon_id);
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto">
        <Navigation currentPage={'favorites'} />
      </div>
    </div>
  );
};

export default Favorites;