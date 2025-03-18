'use client';

import { useState, useEffect } from 'react';
import { Heart, ChevronLeft, Search, X, ChevronUp, ChevronDown, Clock, Share2, Info, Star, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import SalonGallery from '../Salongallery';
import SalonStylists from '../Stylish';
import SalonAbout from '../About';
import SalonReviews from '../Reviews';

const SalonDetailPage = () => {
  const [activeTab, setActiveTab] = useState('Services');
  const [expandedCategory, setExpandedCategory] = useState('Haircuts');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Tabs available in the salon detail page
  const tabs = ['Services', 'Gallery', 'Stylists', 'About', "Rating"];

  // Service categories with their details
  const serviceCategories = [
    {
      name: 'Haircuts',
      count: 8,
      services: [
        {
          id: 1,
          name: 'Buzz hair cut',
          image: '/haircut-buzz.jpg',
          rating: 4.6,
          reviews: 1200,
          price: 140,
          duration: '30 min',
          description: 'While easy to manage and therefore endlessly appealing to men, a proper buzz cut has taken on a new dimension in recent years. If you have healthy growing hair, avoid the military buzz cut and consider an outgrown buzz cut instead. The latter requires a little more maintenance and often some hair product, but what you get in return is more room to flaunt these follicles and demonstrate personal style. Grow out the cut just a tad more and you can play with texture or volume and achieve a desirable balance between precision and messiness.'
        },
        {
          id: 2,
          name: 'Fade hair cut',
          image: '/haircut-fade.jpg',
          rating: 4.0,
          reviews: 500,
          price: 180,
          duration: '30-35 min',
          description: 'The fade haircut is a popular short haircut for men that features hair that gradually gets shorter as it goes down the sides and back of the head.'
        },
        {
          id: 3,
          name: 'Short hair cut',
          image: '/haircut-short.jpg',
          rating: 4.6,
          reviews: 510,
          price: 140,
          duration: '25-30 min',
          description: 'A classic short haircut that works well with most face shapes and hair types. Easy to maintain and style.'
        }
      ]
    },
    {
      name: 'Hair treatments',
      count: 5,
      services: [
        {
          id: 4,
          name: 'Deep conditioning',
          image: '/treatment-deep.jpg',
          rating: 4.8,
          reviews: 320,
          price: 250,
          duration: '45 min',
          description: 'A deep conditioning treatment that nourishes and hydrates hair, improving its texture and appearance.'
        }
      ]
    },
    {
      name: 'Skin care',
      count: 10,
      services: [
        {
          id: 5,
          name: 'Facial cleansing',
          image: '/skincare-facial.jpg',
          rating: 4.7,
          reviews: 430,
          price: 350,
          duration: '60 min',
          description: 'Deep cleansing facial that removes impurities and leaves your skin refreshed and rejuvenated.'
        }
      ]
    },
    {
      name: 'Beard grooming',
      count: 10,
      services: [
        {
          id: 6,
          name: 'Beard trim',
          image: '/beard-trim.jpg',
          rating: 4.5,
          reviews: 280,
          price: 120,
          duration: '20 min',
          description: 'Professional beard trimming service to keep your facial hair neat and well-groomed.'
        }
      ]
    },
    {
      name: 'Hair colour',
      count: 10,
      services: [
        {
          id: 7,
          name: 'Root touch-up',
          image: '/color-roots.jpg',
          rating: 4.3,
          reviews: 190,
          price: 350,
          duration: '45 min',
          description: 'Touch up your roots to maintain your hair color between full coloring sessions.'
        }
      ]
    }
  ];

  // Function to toggle category expansion
  const toggleCategory = (categoryName) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };

  // Function to handle service selection
  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // Function to add service to cart
  const addService = (service) => {
    if (!selectedServices.some(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Function to remove service from cart
  const removeService = (serviceId) => {
    setSelectedServices(selectedServices.filter(service => service.id !== serviceId));
  };

  // Check if a service is already selected
  const isServiceSelected = (serviceId) => {
    return selectedServices.some(service => service.id === serviceId);
  };

  // Total price calculation
  const totalPrice = selectedServices.reduce((total, service) => total + service.price, 0);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header with back button and search */}
      <div className="sticky top-0 z-20 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Link href="/home">
          <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </div>
        </Link>
        <div className="flex-1 mx-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for services"
              className="w-full py-2 pl-9 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:ring-opacity-50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Salon Image */}
      <div className="relative aspect-[3/2] max-h-60 overflow-hidden">
        <img
          src="/salon-image.jpg"
          alt="Signate unisex salon"
          className="w-full h-full object-cover"
        />
        <motion.button 
          className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-md"
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'text-[#CE145B] fill-[#CE145B]' : 'text-gray-500'}`} />
        </motion.button>
      </div>

      {/* Salon Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Signate unisex salon</h1>
          <div className="flex items-center text-sm">
            <span className="text-green-500 font-medium">open</span>
            <span className="mx-1">·</span>
            <span className="text-gray-500">closes 11:30 pm</span>
          </div>
        </div>

        <div className="flex items-center mt-1">
          <div className="flex items-center">
            <span className="text-lg font-medium">4.8</span>
            <Star className="w-4 h-4 text-yellow-500 ml-1 fill-yellow-500" />
          </div>
          <span className="text-gray-500 text-sm ml-1">(reviews 250)</span>
        </div>

        <p className="text-gray-600 text-sm mt-1">Lmd square bavdhan pune</p>

        <div className="flex mt-3 gap-3">
          <motion.button 
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 flex-1 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <Phone className="w-4 h-4 mr-2 text-[#CE145B]" />
            <span className="text-sm font-medium">Call</span>
          </motion.button>
          <motion.button 
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 flex-1 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <MapPin className="w-4 h-4 mr-2 text-[#CE145B]" />
            <span className="text-sm font-medium">Direction</span>
          </motion.button>
        </div>

        {/* Gender Selection */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <label className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
            <input type="radio" name="gender" defaultChecked className="mr-2 accent-[#CE145B]" />
            <span className="text-sm">Male</span>
          </label>
          <label className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
            <input type="radio" name="gender" className="mr-2 accent-[#CE145B]" />
            <span className="text-sm">Female</span>
          </label>
          <div className="ml-auto flex items-center bg-[#F3FCF7] px-3 py-1.5 rounded-full">
            <div className="mr-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <Info className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs sm:text-sm text-green-600">Health and safety</span>
            <ChevronRight className="w-4 h-4 text-green-600 ml-1" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b sticky top-16 z-10 bg-white">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`flex-1 py-3 text-center relative transition-colors ${
                activeTab === tab ? 'text-[#CE145B] font-medium' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CE145B]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Services Section */}
      {activeTab === 'Services' && (
        <div className="p-4">
          {serviceCategories.map((category) => (
            <div key={category.name} className="mb-4">
              <motion.button
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
                onClick={() => toggleCategory(category.name)}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
              >
                <div className="font-medium text-gray-800">
                  {category.name} <span className="text-gray-500">({category.count})</span>
                </div>
                <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                  expandedCategory === category.name ? 'bg-[#FEE7EF] text-[#CE145B]' : 'bg-gray-200 text-gray-600'
                }`}>
                  {expandedCategory === category.name ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </motion.button>

              <AnimatePresence>
                {expandedCategory === category.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-3">
                      {category.services.map((service) => (
                        <motion.div 
                          key={service.id} 
                          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                          whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-3 flex items-center">
                            <div 
                              className="flex-1 flex items-start cursor-pointer" 
                              onClick={() => handleServiceClick(service)}
                            >
                              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                                <img
                                  src={service.image || 'https://via.placeholder.com/60'}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-3 flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">{service.name}</h3>
                                <div className="flex items-center text-sm">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  <span className="ml-1 font-medium">{service.rating}</span>
                                  <span className="text-gray-500 ml-1 text-xs">(reviews {service.reviews})</span>
                                </div>
                                <div className="flex items-center mt-1 text-sm">
                                  <span className="font-medium text-gray-900">₹ {service.price}</span>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <span className="flex items-center text-gray-500 text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {service.duration}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <motion.button
                              className={`px-4 py-1.5 rounded-md text-sm font-medium ml-2 flex-shrink-0 ${
                                isServiceSelected(service.id)
                                  ? "bg-[#FEE7EF] text-[#CE145B]"
                                  : "bg-[#CE145B] text-white hover:bg-[#B01050]"
                              }`}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (isServiceSelected(service.id)) {
                                  removeService(service.id);
                                } else {
                                  addService(service);
                                }
                              }}
                            >
                              {isServiceSelected(service.id) ? "Added" : "Add"}
                            </motion.button>
                          </div>
                          <div 
                            className="px-3 py-2 border-t border-gray-100 text-xs text-[#CE145B] font-medium cursor-pointer hover:bg-[#FEF0F5] transition-colors"
                            onClick={() => handleServiceClick(service)}
                          >
                            view details &gt;
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}


        </div>
      )}

      {activeTab == 'Gallery' && <SalonGallery/>}
    
    {activeTab == 'Stylists' && <SalonStylists/>}
    {activeTab == 'About' && <SalonAbout/>}
    {activeTab == 'Rating' && <SalonReviews/>}
      {/* Service Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto pt-0 sm:pt-8"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white w-full sm:w-[95%] max-w-md rounded-t-2xl sm:rounded-2xl mt-auto sm:mt-0 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedService.image || 'https://via.placeholder.com/400x300'}
                  alt={selectedService.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-2 backdrop-blur-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="absolute top-3 left-0 right-0 flex justify-center">
                  <div className="w-12 h-1 bg-white rounded-full opacity-60"></div>
                </div>
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <motion.button 
                    className="bg-white rounded-full p-2 shadow-md"
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFavorite(!isFavorite);
                    }}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'text-[#CE145B] fill-[#CE145B]' : 'text-gray-600'}`} />
                  </motion.button>
                  <motion.button 
                    className="bg-white rounded-full p-2 shadow-md"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-900">{selectedService.name}</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="font-medium text-lg">₹ {selectedService.price}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedService.duration}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium">{selectedService.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">(Reviews {selectedService.reviews})</span>
                  </div>
                </div>

                <h3 className="font-medium text-lg mb-2 text-gray-900">About {selectedService.name}</h3>
                <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                  {selectedService.description}
                </p>

                <motion.button
                  className={`w-full py-3.5 rounded-lg font-medium ${
                    isServiceSelected(selectedService.id)
                      ? "bg-[#FEE7EF] text-[#CE145B] border border-[#CE145B]"
                      : "bg-[#CE145B] text-white hover:bg-[#B01050]"
                  }`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isServiceSelected(selectedService.id)) {
                      removeService(selectedService.id);
                    } else {
                      addService(selectedService);
                    }
                    setIsModalOpen(false);
                  }}
                >
                  {isServiceSelected(selectedService.id) ? "Remove from cart" : "Add to cart"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar with selected services */}
      <AnimatePresence>
        {selectedServices.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between shadow-lg z-40"
          >
            <div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-[#CE145B] rounded-full flex items-center justify-center mr-2 text-xs font-bold">
                  {selectedServices.length}
                </div>
                <span className="text-sm">
                  service for <span className="font-semibold">₹ {totalPrice}</span>
                </span>
              </div>
            </div>
            <motion.button 
              className="bg-white text-gray-900 px-5 py-2 rounded-md font-medium flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper component for the right chevron icon
const ChevronRight = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default SalonDetailPage;