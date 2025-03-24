import React, { useState, useEffect } from 'react';
import { Heart, Star, Clock } from 'lucide-react';
import { checkIfOpenToday } from '@/helpers';
import { ADD_TO_FAVORITES_FN, REMOVE_FROM_FAVORITES_FN } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast for notifications

const SalonCard = ({ favorites, salon, handleSalonSelect }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user_id } = useAuth();

  // Check if the salon is in user's favorites on component mount
  useEffect(() => {
    if (favorites && Array.isArray(favorites) && salon) {
      const isInFavorites = favorites.some(fav => fav.salon_id === salon.salon_id);
      setIsFavorite(isInFavorites);
    }
  }, [favorites, salon]);

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
  const getTodayHours = () => {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = daysOfWeek[new Date().getDay()];
    
    if (!salon.working_hours || !salon.working_hours[today]) {
      return 'Hours not available';
    }
    
    const hours = salon.working_hours[today];
    if (!hours.isOpen) return 'Closed today';
    
    return `${formatTime(hours.start)} - ${formatTime(hours.end)}`;
  };

  const isOpen = checkIfOpenToday(salon);
  const todayHours = getTodayHours();

  const handleFavoriteClick = async(e) => {
    e.stopPropagation(); // Stop the click from bubbling up to the salon card
    
    if (isProcessing || !user_id) return;
    
    try {
      setIsProcessing(true);
      setIsHeartAnimating(true);
      
      if (isFavorite) {
        // Remove from favorites
        await REMOVE_FROM_FAVORITES_FN(salon.salon_id, user_id);
        toast?.success('Removed from favorites');
      } else {
        // Add to favorites
        await ADD_TO_FAVORITES_FN(salon.salon_id, user_id);
        toast?.success('Added to favorites');
      }
      
      // Toggle the favorite state
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error while updating favorites:", err);
      toast?.error(isFavorite ? 'Failed to remove from favorites' : 'Failed to add to favorites');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setIsHeartAnimating(false), 300);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
         onClick={() => handleSalonSelect(salon)}>
      <div className="relative">
        {/* Main Salon Image */}
        <div className="w-full h-44">
          {salon.images && salon.images.length > 0 ? (
            <img
              src={salon.images[0]}
              alt={`${salon.name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/salon-fallback.jpg";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
          
          {/* Open Badge */}
          <div className="absolute top-2 left-2">
            <div className={`px-3 py-1 text-sm rounded-md font-medium ${isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {isOpen ? 'Open' : 'Closed'}
            </div>
          </div>
          
          {/* Favorite Button - with animation */}
          <div className="absolute top-2 right-2">
            <button 
              className={`bg-white p-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
              onClick={handleFavoriteClick}
              disabled={isProcessing}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isProcessing ? (
                <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-[#CE145B] rounded-full" />
              ) : (
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    isHeartAnimating ? 'scale-125' : ''
                  } ${
                    isFavorite 
                      ? 'fill-current text-[#CE145B]' 
                      : 'text-gray-400 hover:text-[#CE145B]'
                  }`} 
                />
              )}
            </button>
          </div>
        </div>
        
        {/* Salon Info */}
        <div className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {salon.name}
              </h3>
              <p className="text-base text-gray-500">
                {salon.location_name || ''}{salon.location_name && salon.address ? ', ' : ''}{salon.address}
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold mr-1">
                {salon.rating > 0 ? salon.rating.toFixed(1) : '4.6'}
              </span>
              <Star className="w-5 h-5 fill-current text-[#CE145B]" />
            </div>
          </div>
          
          {/* Services Preview */}
          <div className="mt-2 text-sm text-gray-600">
            <p className="truncate">
              {salon.services && salon.services.length > 0 
                ? salon.services.slice(0, 3).map(s => s.name).join(', ') + 
                  (salon.services.length > 3 ? ` +${salon.services.length - 3} more` : '')
                : 'No services available'}
            </p>
          </div>
          
          {/* Hours and Distance */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>{todayHours.toUpperCase()}</span>
            </div>
            <div className="text-sm text-gray-600">
              {salon.distance !== undefined ? 
                (salon.distance < 1 ? 
                  `${Math.round(salon.distance * 1000)} m away` : 
                  `${salon.distance.toFixed(1)} km away`) : 
                ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;