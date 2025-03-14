import React from 'react';
import { Heart, Star, Clock } from 'lucide-react';
import { checkIfOpenToday } from '@/helpers';
const SalonCard = ({ salon, handleSalonSelect }) => {
 



const formatTime = (timeString) => {
    console.log(timeString);
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={()=>handleSalonSelect(salon)}>
      <div className="flex items-start p-4 gap-4">
        {/* Salon Image */}
        <div className="w-16 h-16 flex-shrink-0">
          {salon.images && salon.images.length > 0 ? (
            <img
              src={salon.images[0]}
              alt={`${salon.name} thumbnail`}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/salon-fallback.jpg"; // Fallback image
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start w-full">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {salon.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {salon.location_name}, {salon.address}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-500 flex-shrink-0">
              <Heart className="w-6 h-6" />
            </button>
          </div>
          
          {/* Rating */}
          <div className="flex items-center mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => {
                // Handle rating properly - if salon rating is 0, show empty stars
                const rating = salon.rating || 0;
                const isFilled = i < Math.floor(rating);
                const isHalfFilled = !isFilled && i < Math.ceil(rating) && rating % 1 !== 0;
                
                return (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      isFilled ? 'fill-current' : 
                      isHalfFilled ? 'fill-current opacity-75' : 
                      'fill-current opacity-30'
                    } text-[#CE145B]`}
                  />
                );
              })}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600">
              {salon.rating > 0 ? salon.rating.toFixed(1) : 'New'}
            </span>
            
            {/* Distance */}
            <span className="ml-auto text-sm text-gray-500">
              {salon.distance !== undefined ? 
                (salon.distanceInKm < 1 ? 
                  `${Math.round(salon.distance * 1000)} m` : 
                  `${salon.distanceInKm.toFixed(1)} km`) : 
                ''}
            </span>
          </div>
          
          {/* Open/Closed status */}
          <div className="flex items-center mt-2 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span className={isOpen ? 'text-green-600' : 'text-red-500'}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
            <span className="mx-1">•</span>
            <span className="text-gray-500">{todayHours.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;