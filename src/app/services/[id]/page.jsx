'use client';
import React, { use, useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Plus, Check, Bell, Search, MoreVertical, Phone, ArrowLeft } from 'lucide-react';
import BookingModal from '@/components/BookingModal/page';
import { FETCH_SALON_DETAILS_BY_ID_FN } from '@/services/ownerService';
import Link from 'next/link';

const SalonServices = ({ params }) => {
  const unwrappedParams = use(params);
  const [salonData, setSalonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [filterType, setFilterType] = useState('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [categorizedServices, setCategorizedServices] = useState({});

  useEffect(() => {
    const fetchData = async (salon_id) => {
      setIsLoading(true);
      try {
        const response = await FETCH_SALON_DETAILS_BY_ID_FN(salon_id);
        if (response?.data?.data) {
          setSalonData(response.data.data);
          
          // Categorize services by their category
          const services = response.data.data.services || [];
          const categorized = {};
          
          services.forEach(service => {
            // Group services by their category
            const category = service.category || "Other";
            
            if (!categorized[category]) {
              categorized[category] = [];
            }
            
            categorized[category].push(service);
          });
          
          setCategorizedServices(categorized);
          
          // Initialize expanded state for all categories
          const expanded = {};
          Object.keys(categorized).forEach(category => {
            expanded[category] = true;
          });
          setExpandedCategories(expanded);
        }
      } catch (err) {
        console.error("Error fetching salon data:", err);
        setError("Failed to load salon data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (unwrappedParams.id) {
      fetchData(unwrappedParams.id);
    }
  }, [unwrappedParams.id]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleService = (service) => {
    // Skip if service is unavailable
    if (service.status === 'unavailable') return;
    
    setSelectedServices(prev => {
      const exists = prev.find(s => s.service_id === service.service_id);
      if (exists) {
        return prev.filter(s => s.service_id !== service.service_id);
      }
      return [...prev, service];
    });
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((sum, service) => sum + parseFloat(service.price), 0);
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((sum, service) => {
      // Extract numeric part from duration
      const duration = parseInt(service.duration);
      return sum + (isNaN(duration) ? 0 : duration);
    }, 0);
  };

  const filteredServices = (category) => {
    return (categorizedServices[category] || []).filter(service => {
      // Skip showing unavailable services
      if (service.status === 'unavailable') return false;
      
      // Filter by type
      return filterType === 'all' || 
        service.category.toLowerCase() === filterType || 
        service.category === 'Unisex';
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-pink-600 border-r-2 border-b-2 border-l-2 border-transparent"></div>
          <p className="mt-2 text-gray-600">Loading salon details...</p>
        </div>
      </div>
    );
  }

  if (error || !salonData) {
    return (
      <div className="max-w-lg mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error || "Could not load salon data"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-16">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Link href={'/home'}><ArrowLeft className="w-6 h-6 text-gray-600" /></Link>
            <div>
              <h1 className="text-xl font-semibold">{salonData.name}</h1>
              <p className="text-gray-600 text-sm">{salonData.location_text}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-600" />
            <Search className="w-6 h-6 text-gray-600" />
            <MoreVertical className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <svg 
              key={star} 
              className={`w-5 h-5 fill-current ${star <= Math.round(salonData.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
          <span className="ml-1 text-gray-600">{salonData.rating.toFixed(1)}</span>
          <span className="text-gray-600">({salonData.reviews?.length || 0} reviews)</span>
          <a href={`https://maps.google.com/?q=${salonData.location_text}`} target="_blank" rel="noopener noreferrer" className="ml-4 text-pink-600 text-sm">Get Directions</a>
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
            filterType === 'male' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setFilterType('male')}
        >
          Men
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${
            filterType === 'female' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setFilterType('female')}
        >
          Women
        </button>
      </div>

      {/* Services */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Our Services</h2>

        {Object.keys(categorizedServices).length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No services available at this salon yet.
          </div>
        ) : (
          Object.keys(categorizedServices).map((category) => {
            const services = filteredServices(category);
            if (services.length === 0) return null;
            
            return (
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
                    {services.map((service) => (
                      <div key={service.service_id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{service.name}</h3>
                          <div className="flex items-center gap-4 text-gray-600 text-sm mt-1">
                            <span>₹{service.price}</span>
                            <div className="flex items-center">
                              <span className="w-4 h-4 mr-1">⏱</span>
                              <span>Approx. {service.duration} mins</span>
                            </div>
                          </div>
                          {service.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <button
                          className="p-2"
                          onClick={() => toggleService(service)}
                        >
                          {selectedServices.find(s => s.service_id === service.service_id) ? (
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
            );
          })
        )}
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
                  Approx. {getTotalDuration()} mins
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium"
            >
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
        setSelectedServices={setSelectedServices}
        totalPrice={getTotalPrice()}
        totalDuration={getTotalDuration()}
        salonData={salonData}
      />
    </div>
  );
};

export default SalonServices;