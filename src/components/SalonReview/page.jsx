import React from 'react';
import { Phone, X } from 'lucide-react';
import Link from 'next/link';

const SalonFeedback = ({ salon, onClose, onViewServices }) => {
  // Sample images if salon.images is empty (for development/testing
  const sampleImages = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
        alt: "Modern salon interior with styling stations"
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250",
        alt: "Salon washing area"
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f",
        alt: "Elegant salon mirrors and chairs"
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1633681926035-ec1ac984418a",
        alt: "Salon product display"
    }
  ];

  // Format rating stars based on salon's actual rating
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const emptyStars = 5 - fullStars;
    return (
      <>
        {"★".repeat(fullStars)}
        {"☆".repeat(emptyStars)}
      </>
    );
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
  // Use salon.images if available, otherwise use sample images
  const imagesToDisplay = salon.images && salon.images.length > 0 
    ? salon.images 
    : sampleImages;

  return (
    <div className="bg-white w-full max-w-md mx-auto h-[80vh] flex flex-col rounded-t-lg overflow-hidden mb-16">
      {/* Fixed Header */}
      <div className="flex-none p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{salon.name}</h1>
            <p className="text-gray-500 text-sm">{salon.location_text || salon.address || "Unknown Location"}</p>
          </div>
          <div className="flex gap-4">
            <button className="p-2">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={onClose} className="p-2">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-gray-800">{renderRating(salon.rating)}</span>
            <span className="ml-1 text-gray-700">{salon.rating || "New"}</span>
          </div>
          <button className="text-pink-600 font-medium">
            <Link href={`/directions?latitude=${salon.location.coordinates[1]}&&longitude=${salon.location.coordinates[0]}&&name=${salon.name}&&locationText=${salon.location_text}&&rating=${salon.rating}`}>Get Directions</Link>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Salon Images */}
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {imagesToDisplay.map((image, index) => (
              <div 
                key={image.id || index} 
                className="flex-none w-40 h-32 bg-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={image.url || image}
                  alt={image.alt || `${salon.name} image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/160/128";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Salon Information */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-2">Salon Information</h2>
          <p className="text-gray-700"><strong>Address:</strong> {salon.address}</p>
          <p className="text-gray-700"><strong>Contact:</strong> {salon.contact_phone}</p>
          <p className="text-gray-700"><strong>Distance:</strong> {salon.distanceInKm ? `${salon.distanceInKm.toFixed(1)} km` : 'Not available'}</p>
        </div>
        
        {/* Working Hours */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-2">Working Hours</h2>
          {salon.working_hours ? (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(salon.working_hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-xs">
                  <p className="capitalize text-gray-700">{day}</p>
                  <p className="text-gray-700">
                  {hours.isOpen ? 
                    `${formatTime(hours.start).toUpperCase()} - ${formatTime(hours.end).toUpperCase()}` 
                    : 'Closed'}
                </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Working hours not available</p>
          )}
        </div>

        {/* Reviews Section */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
          {salon.reviews && salon.reviews.length > 0 ? (
            <div className="space-y-4">
              {salon.reviews.map((review, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {review.user_name ? review.user_name.charAt(0) : 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user_name || "Anonymous"}</span>
                        <div className="flex">
                          {renderRating(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">{review.comment || "No comment provided"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="flex-none p-4 border-t bg-white">
        <button 
          onClick={onViewServices}
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
        >
          View Services
        </button>
      </div>
    </div>
  );
};

export default SalonFeedback;