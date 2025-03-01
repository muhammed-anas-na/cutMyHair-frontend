import React from 'react';
import { Heart, MapPin, Search } from 'lucide-react';

const SalonCard = ({ name, location, rating, imageUrl }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="relative">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white">
        <Heart className="w-5 h-5 text-gray-600" />
      </button>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-sm text-gray-600">{location}</p>
      <div className="flex items-center mt-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    </div>
  </div>
);

const salonData = [
  {
    name: 'Seurie Beauty Salon',
    location: 'Fort Kochi, Kochi',
    rating: 4.3,
    imageUrl: '/api/placeholder/400/300'
  },
  {
    name: 'Delies Unisex Salon',
    location: 'Fort Kochi, Kochi',
    rating: 4.1,
    imageUrl: '/api/placeholder/400/300'
  },
  {
    name: 'Lumier Beauty Salon',
    location: 'Vytilla, Kochi',
    rating: 4.3,
    imageUrl: '/api/placeholder/400/300'
  },
  {
    name: 'Matifs Salon',
    location: 'Kadavanthra, Kochi',
    rating: 3.9,
    imageUrl: '/api/placeholder/400/300'
  },
  {
    name: 'Boutur Unisex Salon',
    location: 'Vytilla, Kochi',
    rating: 4.2,
    imageUrl: '/api/placeholder/400/300'
  },
  {
    name: 'Marlor Beauty Salon',
    location: 'Fort Kochi, Kochi',
    rating: 4.1,
    imageUrl: '/api/placeholder/400/300'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif">Salone</h1>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Log In</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#F6D7D3]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-4xl font-semibold">Book an Appointment</h2>
              <p className="text-xl text-gray-600">with your favourite Salon.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <button className="w-full bg-white px-10 py-3 text-left rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      Fort Kochi
                      <div className="text-sm text-gray-500">Kochi, Kerala, India</div>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Search by Salon name or Location"
                      className="w-full px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-pink-500"
                    />
                    <button className="bg-[#CE145B] text-white px-6 py-3 rounded-r-lg hover:bg-[#B62B62] transition-colors">
                      Find Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <img
                src="register-image.png"
                alt="Salon Interior"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Salons Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8">Nearby Salons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salonData.map((salon, index) => (
              <SalonCard key={index} {...salon} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}