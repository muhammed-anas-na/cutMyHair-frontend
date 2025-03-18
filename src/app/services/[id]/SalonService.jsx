'use client';
import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Plus, Check, Bell, Search, MoreVertical, Phone, ArrowLeft } from 'lucide-react';
import BookingModal from '@/components/BookingModal/page';
import { FETCH_SALON_DETAILS_BY_ID_FN } from '@/services/ownerService';
import Link from 'next/link';
import Head from 'next/head';

const SalonServices = ({ params }) => {
  const [salonData, setSalonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [filterType, setFilterType] = useState('all'); // Gender filter
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all'); // Category filter
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [servicesByCategory, setServicesByCategory] = useState({});

  useEffect(() => {
    const fetchData = async (salon_id) => {
      setIsLoading(true);
      try {
        const response = await FETCH_SALON_DETAILS_BY_ID_FN(salon_id);
        if (response?.data?.data) {
          const salonInfo = response.data.data;
          setSalonData(salonInfo);

          const categories = salonInfo.categories || [];
          const services = salonInfo.services || [];
          const groupedServices = {};

          services.forEach(service => {
            if (service.category_id) {
              if (!groupedServices[service.category_id]) {
                groupedServices[service.category_id] = {
                  id: service.category_id,
                  name: getCategoryNameById(service.category_id, categories),
                  services: []
                };
              }
              groupedServices[service.category_id].services.push(service);
            }
          });

          const uncategorizedServices = services.filter(service => !service.category_id);
          if (uncategorizedServices.length > 0) {
            groupedServices['uncategorized'] = {
              id: 'uncategorized',
              name: 'Others',
              services: uncategorizedServices
            };
          }

          categories.forEach(category => {
            if (!groupedServices[category.category_id || category._id]) {
              groupedServices[category.category_id || category._id] = {
                id: category.category_id || category._id,
                name: category.name,
                services: []
              };
            }
          });

          setServicesByCategory(groupedServices);
          setExpandedCategories(
            Object.keys(groupedServices).reduce((acc, categoryId) => ({
              ...acc,
              [categoryId]: true
            }), {})
          );
        }
      } catch (err) {
        console.error("Error fetching salon data:", err);
        setError("Failed to load salon data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchData(params.id);
  }, [params.id]);

  const getCategoryNameById = (categoryId, categories) => {
    const category = categories.find(c => (c.category_id || c._id) === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleService = (service) => {
    if (service.status === 'unavailable') return;

    setSelectedServices(prev =>
      prev.find(s => s.service_id === service.service_id)
        ? prev.filter(s => s.service_id !== service.service_id)
        : [...prev, service]
    );
  };

  const getTotalPrice = () => selectedServices.reduce((sum, service) => sum + parseFloat(service.price), 0);
  const getTotalDuration = () => selectedServices.reduce((sum, service) => sum + (parseInt(service.duration) || 0), 0);

  const filterServicesByType = (services) => {
    if (filterType === 'all') return services;
    return services.filter(service => {
      const serviceType = service.category ? service.category.toLowerCase() : '';
      return serviceType === filterType || serviceType === 'unisex';
    });
  };

  const filterServicesByCategory = (services, categoryId) => {
    if (selectedCategoryFilter === 'all') return services;
    return services.filter(service => service.category_id === categoryId);
  };

  const getFilteredServices = (services) => {
    let filtered = filterServicesByType(services);
    if (selectedCategoryFilter !== 'all') {
      filtered = filterServicesByCategory(filtered, selectedCategoryFilter);
    }
    return filtered;
  };

  const getServiceCountInCategory = (categoryId) => {
    const category = servicesByCategory[categoryId];
    if (!category) return 0;
    return getFilteredServices(category.services).length;
  };

  if (isLoading) return (
    <div className="max-w-lg mx-auto p-8 flex justify-center items-center min-h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-10 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-60 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (error || !salonData) return (
    <div className="max-w-lg mx-auto p-8 text-center text-red-500">
      {error || "Could not load salon data"}
    </div>
  );

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": salonData.name,
            "address": { "@type": "PostalAddress", "streetAddress": salonData.location_text },
            "image": salonData.images?.[0] || "/default-salon.jpg",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": salonData.rating.toFixed(1),
              "reviewCount": salonData.reviews?.length || 0,
            },
          })}
        </script>
      </Head>

      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-20">
        {/* Header */}
        <header className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Link href="/home">
                <ArrowLeft className="w-6 h-6 text-gray-600" aria-label="Back to Home" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold">{salonData.name}</h1>
                <p className="text-gray-600 text-sm">{salonData.location_text}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href={`tel:${salonData.contact_phone}`} className="p-2 rounded-full hover:bg-gray-100" aria-label="Call salon">
                <Phone className="w-5 h-5 text-gray-600" />
              </a>
              <Bell className="w-5 h-5 text-gray-600" aria-label="Notifications" />
              <Search className="w-5 h-5 text-gray-600" aria-label="Search" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <svg
                key={star}
                className={`w-5 h-5 fill-current ${star <= Math.round(salonData.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                viewBox="0 0 24 24"
                aria-label={`Star ${star}`}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="ml-1 text-gray-600">{salonData.rating.toFixed(1)}</span>
            <span className="text-gray-600">({salonData.reviews?.length || 0} reviews)</span>
            <a
              href={`https://maps.google.com/?q=${salonData.location_text}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-pink-600 text-sm font-medium"
            >
              Get Directions
            </a>
          </div>
        </header>

        {/* Filter Tabs (All/Men/Women) */}
        <div className="flex border-b sticky top-0 bg-white z-10">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${filterType === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${filterType === 'male' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setFilterType('male')}
          >
            Men
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${filterType === 'female' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setFilterType('female')}
          >
            Women
          </button>
        </div>

        {/* Category Dropdown Filter */}


        {/* Services Section */}
        <section className="p-4">
          <h2 className="text-xl font-semibold mb-4">Our Services</h2>

          {Object.keys(servicesByCategory).length === 0 ? (
            <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
              No services available at this salon yet.
            </div>
          ) : (
            <div className="space-y-1">
              {Object.keys(servicesByCategory).map(categoryId => {
                const category = servicesByCategory[categoryId];
                const filteredServices = getFilteredServices(category.services);
                const serviceCount = filteredServices.length;

                if (serviceCount === 0) return null;

                return (
                  <div key={categoryId} className="border rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      onClick={() => toggleCategory(categoryId)}
                      aria-expanded={expandedCategories[categoryId]}
                    >
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">{category.name}</h3>
                        <span className="ml-2 text-gray-500">({serviceCount})</span>
                      </div>
                      {expandedCategories[categoryId] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedCategories[categoryId] && (
                      <div className="divide-y border-t">
                        {filteredServices.map(service => (
                          <div
                            key={service.service_id}
                            className="flex items-start justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1 pr-4">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{service.name}</h4>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    service.category === 'Female'
                                      ? 'bg-pink-100 text-pink-800'
                                      : service.category === 'Male'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}
                                >
                                  {service.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-gray-600 text-sm mt-1">
                                <span className="font-medium text-gray-900">₹{service.price}</span>
                                <div className="flex items-center">
                                  <span className="mr-1">⏱</span>
                                  <span>{service.duration} mins</span>
                                </div>
                              </div>
                              {service.description && (
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{service.description}</p>
                              )}
                            </div>

                            <button
                              className={`p-2 rounded-full ${
                                service.status === 'unavailable'
                                  ? 'bg-gray-100 cursor-not-allowed'
                                  : selectedServices.find(s => s.service_id === service.service_id)
                                  ? 'bg-pink-100'
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                              onClick={() => toggleService(service)}
                              disabled={service.status === 'unavailable'}
                              aria-label={`Select ${service.name}`}
                            >
                              {selectedServices.find(s => s.service_id === service.service_id) ? (
                                <Check className="w-5 h-5 text-pink-600" />
                              ) : (
                                <Plus className="w-5 h-5 text-gray-500" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Booking Bar */}
        {selectedServices.length > 0 && (
          <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
            <div className="max-w-lg mx-auto flex items-center justify-between">
              <div>
                <div className="text-gray-600 font-medium">
                  {selectedServices.length} {selectedServices.length === 1 ? 'Service' : 'Services'} Selected
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">₹{getTotalPrice()}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 flex items-center">
                    <span className="mr-1">⏱</span>
                    {getTotalDuration()} mins
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-pink-600 hover:bg-pink-700 transition-colors text-white px-6 py-3 rounded-lg font-medium"
              >
                Book Now
              </button>
            </div>
          </footer>
        )}

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
    </>
  );
};

export default SalonServices;