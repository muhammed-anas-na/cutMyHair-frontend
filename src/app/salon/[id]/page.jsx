'use client';

import { useState, useEffect, use } from 'react';
import { Heart, ChevronLeft, Search, X, ChevronUp, ChevronDown, Clock, Share2, Info, Star, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import SalonGallery from '../Salongallery';
import SalonStylists from '../Stylish';
import SalonAbout from '../About';
import SalonReviews from '../Reviews';
import Service from '../Services';
import { OWNER_GET_SALON_DETAILS_BY_ID_FN } from '@/services/ownerService';
import { checkIfOpenToday } from '@/helpers';
import SalonImageSlider from '../ImageSlider';
import VerificationPopup from '@/components/VerificationPopUp/page';
import BookingModal from '../../../components/BookingModal/page'; // Make sure this import exists

const SalonDetailPage = ({ params }) => {
  const unwrappedParams = use(params);
  const [activeTab, setActiveTab] = useState('Services');
  const [expandedCategory, setExpandedCategory] = useState('Haircuts');
  const [selectedService, setSelectedService] = useState(null);
  const [salon, setSalon] = useState();
  const [selectedServices, setSelectedServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // Added state for booking modal
  const [isFavorite, setIsFavorite] = useState(false);
  const [isVerificationPopupOpen, setIsVerificationPopupOpen] = useState(false);
  // Tabs available in the salon detail page
  const tabs = ['Services', 'Gallery', 'Stylists', 'About', "Rating"];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await OWNER_GET_SALON_DETAILS_BY_ID_FN(unwrappedParams.id);
        console.log(response);
        setSalon(response.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

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

  // Function to calculate total price of selected services
  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  // Function to calculate total duration of selected services
  const getTotalDuration = () => {
    // Assuming duration is in format like "30 min"
    const totalMinutes = selectedServices.reduce((total, service) => {
      const durationStr = service.duration || "0 min";
      const minutes = parseInt(durationStr.split(' ')[0]) || 0;
      return total + minutes;
    }, 0);
    
    // Format the total duration
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours} hr ${minutes > 0 ? `${minutes} min` : ''}`;
    }
    return `${minutes} min`;
  };

  // Function to handle booking button click
  const handleBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  // Total price calculation for display
  const totalPrice = getTotalPrice();

  return (
    <div className="bg-white min-h-screen pb-24 max-w-6xl mx-auto w-full">
      {/* Header with back button and search */}
      <VerificationPopup 
        isOpen={isVerificationPopupOpen} 
        onClose={() => setIsVerificationPopupOpen(false)} 
      />
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
      <div className="relative max-h-60 overflow-hidden">
        <SalonImageSlider
          images={salon?.images || []}
          altText={salon?.name || "Salon image"}
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
          <h1 className="text-xl font-semibold text-gray-900">{salon?.name}</h1>
          <div className="flex items-center text-sm">
            {checkIfOpenToday(salon) === true ? (
              <span className="text-green-500 font-medium">Open Now</span>
            ) : (
              <span className="text-red-500 font-medium">Closed</span>
            )}
          </div>
        </div>

        <div className="flex items-center mt-1">
          <div className="flex items-center">
            <span className="text-lg font-medium">4.8</span>
            <Star className="w-4 h-4 text-yellow-500 ml-1 fill-yellow-500" />
          </div>
          <span className="text-gray-500 text-sm ml-1">(reviews {salon?.reviews?.length || 0})</span>
        </div>

        <p className="text-gray-600 text-sm mt-1">{salon?.address}</p>

        <div className="flex mt-3 gap-3">
          <motion.button
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 flex-1 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <a href={`tel:+91${salon?.contact_phone}`} className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-[#CE145B]" />
              <span className="text-sm font-medium">Call</span>
            </a>
          </motion.button>
          <motion.button
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 flex-1 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <a
              href={`http://localhost:3000/directions?latitude=${salon?.location?.coordinates?.[1]}&&longitude=${salon?.location?.coordinates?.[0]}&&name=${salon?.name}&&locationText=${salon?.location_text}`}
              className="flex items-center"
            >
              <MapPin className="w-4 h-4 mr-2 text-[#CE145B]" />
              <span className="text-sm font-medium">Direction</span>
            </a>
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
          <div className="ml-auto flex items-center bg-[#F3FCF7] px-3 py-1.5 rounded-full cursor-pointer" onClick={() => setIsVerificationPopupOpen(true)}>
            <div className="mr-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <Info className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs sm:text-sm text-green-600">Verified by Cut My Hair</span>
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
              className={`flex-1 py-3 text-center relative transition-colors ${activeTab === tab ? 'text-[#CE145B] font-medium' : 'text-gray-500'
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
      {activeTab === 'Services' && <Service
        salon={salon}
        expandedCategory={expandedCategory}
        isServiceSelected={isServiceSelected}
        addService={addService}
        removeService={removeService}
        toggleCategory={toggleCategory}
        handleServiceClick={handleServiceClick}
      />}
      {activeTab === 'Gallery' && <SalonGallery
        galleryImages={salon?.images}
      />}
      {activeTab === 'Stylists' && <SalonStylists stylist={salon?.stylist} />}
      {activeTab === 'About' && <SalonAbout salon={salon} />}
      {activeTab === 'Rating' && <SalonReviews reviews={salon?.reviews || []} />}
      
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
                  className={`w-full py-3.5 rounded-lg font-medium ${isServiceSelected(selectedService.id)
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
              onClick={handleBookingClick} // Add onClick handler for opening booking modal
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
        totalPrice={getTotalPrice()}
        totalDuration={getTotalDuration()}
        salonData={salon} // Pass the full salon data
      />
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