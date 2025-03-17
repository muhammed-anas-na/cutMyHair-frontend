import React, { useState } from 'react';
import { Heart, Star, Clock } from 'lucide-react';
import { checkIfOpenToday } from '@/helpers';

const SalonCard = ({ salon, handleSalonSelect }) => {
  const [isFavorite, setIsFavorite] = useState(salon.isFavorite || false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
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
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
                setIsHeartAnimating(true);
                setTimeout(() => setIsHeartAnimating(false), 300);
              }}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-300 ${
                  isHeartAnimating ? 'scale-125' : ''
                } ${
                  isFavorite 
                    ? 'fill-current text-[#CE145B]' 
                    : 'text-gray-400 hover:text-[#CE145B]'
                }`} 
              />
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