'use client';
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plus, Check, Bell, Search, MoreVertical, Phone, ArrowLeft } from 'lucide-react';
import BookingModal from '@/components/BookingModal/page';

const SalonServices = () => {
  const salon = {
    name: "Seurie Beauty Salon",
    location: "Fort Kochi, Kochi",
    rating: 4.3,
    reviews: 82,
  };

  const services = {
    'Haircut': [
      { id: 1, name: 'Hair Cut - Senior Stylist', price: 600, duration: 45, description: 'Be a cut above the rest with our wide range of stylish haircuts.', type: ['men', 'women'] },
      { id: 2, name: 'Hair Cut - Stylist', price: 400, duration: 45, description: 'Be a cut above the rest with our wide range of stylish haircuts.', type: ['men', 'women'] },
      { id: 3, name: 'Hair Cut - Designer', price: 1300, duration: 90, description: 'Be a cut above the rest with our wide range of stylish haircuts.', type: ['men', 'women'] }
    ],
    'Hair Styling': [
      { id: 4, name: 'Hair Styling - Basic', price: 500, duration: 30, description: 'Get the perfect style for any occasion.', type: ['women'] },
      { id: 5, name: 'Hair Styling - Advanced', price: 800, duration: 60, description: 'Premium styling for special occasions.', type: ['women'] }
    ],
  };

  const [selectedServices, setSelectedServices] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({
    'Haircut': true,
    'Hair Styling': true,
  });
  const [filterType, setFilterType] = useState('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleService = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((sum, service) => sum + service.duration, 0);
  };

  const filteredServices = (category) => {
    return services[category].filter(service => 
      filterType === 'all' || service.type.includes(filterType)
    );
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-16">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
            <div>
              <h1 className="text-xl font-semibold">{salon.name}</h1>
              <p className="text-gray-600 text-sm">{salon.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-600" />
            <Search className="w-6 h-6 text-gray-600" />
            <MoreVertical className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map(star => (
            <svg key={star} className="w-5 h-5 fill-current text-yellow-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
          <svg className="w-5 h-5 fill-current text-yellow-400" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" />
          </svg>
          <span className="ml-1 text-gray-600">{salon.rating}</span>
          <span className="text-gray-600">({salon.reviews} reviews)</span>
          <a href="#" className="ml-4 text-pink-600 text-sm">Get Directions</a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${
            filterType === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setFilterType('all')}
        >
          All
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${
            filterType === 'men' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setFilterType('men')}
        >
          Men
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${
            filterType === 'women' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setFilterType('women')}
        >
          Women
        </button>
      </div>

      {/* Services */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Our Services</h2>

        {Object.keys(services).map((category) => (
          <div key={category} className="mb-4">
            <button
              className="w-full flex items-center justify-between py-2"
              onClick={() => toggleCategory(category)}
            >
              <span className="text-lg font-medium">{category}</span>
              {expandedCategories[category] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {expandedCategories[category] && (
              <div className="space-y-4 mt-2">
                {filteredServices(category).map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{service.name}</h3>
                      <div className="flex items-center gap-4 text-gray-600 text-sm mt-1">
                        <span>₹{service.price}</span>
                        <div className="flex items-center">
                          <span className="w-4 h-4 mr-1">⏱</span>
                          <span>Approx. {service.duration} Mins</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {service.description}
                      </p>
                    </div>
                    <button
                      className="p-2"
                      onClick={() => toggleService(service)}
                    >
                      {selectedServices.find(s => s.id === service.id) ? (
                        <Check className="w-6 h-6 text-pink-600" />
                      ) : (
                        <Plus className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <div className="text-gray-600">{selectedServices.length} Services Selected</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">₹{getTotalPrice()}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-600">
                  <span className="w-4 h-4 mr-1">⏱</span>
                  Approx. {getTotalDuration()} Mins
                </span>
              </div>
            </div>
            <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium">
              Book Appointment
            </button>
          </div>
        </div>
      )}

          {/* Booking Modal */}
          <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedServices={selectedServices}
        totalPrice={getTotalPrice()}
        totalDuration={getTotalDuration()}
      />
    </div>
  );
};

export default SalonServices;