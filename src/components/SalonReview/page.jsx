import React from 'react';
import { Phone, X } from 'lucide-react';

const SalonFeedback = ({ salon, onClose, onViewServices }) => {
  // Mock reviews data - replace with actual data
  const reviews = [
    {
        id: 1,
        user: "Emily Chen",
        rating: 5,
        comment: "Absolutely loved my haircut! The stylist really understood what I wanted and the atmosphere was so welcoming.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        date: "2 days ago"
    },
    {
        id: 2,
        user: "Michael Rodriguez",
        rating: 4,
        comment: "Great beard trim, very precise work. The hot towel service was an unexpected bonus.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        date: "1 week ago"
    },
    {
        id: 3,
        user: "Sophia Patel",
        rating: 5,
        comment: "Best salon experience in months! The head massage during hair wash was so relaxing.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        date: "2 weeks ago"
    },
    {
        id: 4,
        user: "David Kim",
        rating: 3,
        comment: "Decent haircut, but had to wait a bit despite having an appointment. Good final result though.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        date: "3 weeks ago"
    },
    {
        id: 5,
        user: "Aisha Thompson",
        rating: 5,
        comment: "The stylist gave me exactly what I wanted! Love how they took time to understand my hair texture.",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
        date: "1 month ago"
    },
    {
        id: 6,
        user: "James Wilson",
        rating: 4,
        comment: "Very professional service. Clean space and great attention to detail with the styling.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        date: "1 month ago"
    },
    {
        id: 7,
        user: "Nina Martinez",
        rating: 5,
        comment: "Amazing color work! They really know how to handle highlights and the price was reasonable.",
        image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb",
        date: "2 months ago"
    },
    {
        id: 8,
        user: "Tom Anderson",
        rating: 4,
        comment: "Solid haircut and beard trim combo. The place has a great vibe and friendly staff.",
        image: "https://images.unsplash.com/photo-1463453091185-61582044d556",
        date: "2 months ago"
    }
];
const salonImages = [
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

  return (
    <div className="bg-white w-full max-w-md mx-auto h-[80vh] flex flex-col rounded-t-lg overflow-hidden mb-16">
      {/* Fixed Header */}
      <div className="flex-none p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{salon.name}</h1>
            <p className="text-gray-500 text-sm">{salon.location || "Fort Kochi, Kochi"}</p>
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
            {"★★★★☆".split('').map((star, i) => (
              <span key={i} className="text-gray-800">{star}</span>
            ))}
            <span className="ml-1 text-gray-700">4.3</span>
          </div>
          <button className="text-pink-600 font-medium">Get Directions</button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Salon Images */}
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto">
          {salonImages.map((image) => (
          <div key={image.id} className="flex-none w-40 h-32 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-start gap-3">
                  <img
                    src={review.image}
                    alt={review.user}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user}</span>
                      <div className="flex">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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