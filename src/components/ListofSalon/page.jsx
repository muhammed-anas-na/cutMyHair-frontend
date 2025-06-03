'use client';

import { useLocation } from '@/context/LocationContext';
import SalonCard from "../SalonCard/page";
import SalonFeedback from '../SalonReview/page';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { MapPin, Scissors, RotateCcw, Search, Star, ChevronRight, Gift, Clock, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from "next/navigation";

export default function ListOfSalon({favorites, salons, loading, error, onRetry, onOpenLocationModal }) {
  const { latitude, longitude, locationText } = useLocation();
  const [selectedSalon, setSelectedSalon] = useState();
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredSalons, setFilteredSalons] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if there's a selected_category in the URL query parameters
    const categoryFromUrl = searchParams.get('selected_category');
    if (categoryFromUrl) {
      // Decode the URL parameter and set it as active category
      setActiveCategory(decodeURIComponent(categoryFromUrl));
    }
  }, [searchParams]);

  useEffect(() => {
    // Filter salons based on the selected category
    if (activeCategory === 'All') {
      setFilteredSalons(salons);
    } else {
      // Filter salons that have the selected category
      const filtered = salons.filter(salon => {
        // Check if salon has categories array
        if (!salon.categories || salon.categories.length === 0) {
          return false;
        }
        
        // Check if salon has the selected category
        return salon.categories.some(category => 
          category.name.toLowerCase() === activeCategory.toLowerCase()
        );
      });
      
      // If no salons match the category, also check services
      if (filtered.length === 0) {
        const filteredByService = salons.filter(salon => {
          // Check if salon has services array
          if (!salon.services || salon.services.length === 0) {
            return false;
          }
          
          // Check if any service matches the selected category
          return salon.services.some(service => 
            service.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
            (service.category_id && service.category_id.toLowerCase().includes(activeCategory.toLowerCase()))
          );
        });
        
        setFilteredSalons(filteredByService);
      } else {
        setFilteredSalons(filtered);
      }
    }
  }, [activeCategory, salons]);
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-10 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CE145B]"></div>
        <p className="mt-4 text-gray-500">Finding the best salons near you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-center max-w-md mx-auto"
      >
        <div className="mb-6 flex justify-center">
          <div className="p-3 bg-red-50 rounded-full">
            <Scissors size={32} className="text-red-500" />
          </div>
        </div>
        <h3 className="font-medium text-xl mb-2 text-gray-800">Something went wrong</h3>
        <p className="text-red-500 mb-5">{error}</p>
        <div className="space-y-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-[#CE145B] rounded-md py-3 px-4 text-white hover:bg-[#B01050] transition-colors"
            onClick={() => onRetry ? onRetry() : window.location.reload()}
          >
            <RotateCcw size={16} />
            Try again
          </motion.button>
          
          <p className="text-sm text-gray-500 mt-2">
            If the problem persists, please try again later.
          </p>
        </div>
      </motion.div>
    );
  }

  if (latitude == null) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-center max-w-md mx-auto"
      >
        <div className="mb-6 flex justify-center">
          <div className="p-3 bg-blue-50 rounded-full">
            <MapPin size={32} className="text-[#CE145B]" />
          </div>
        </div>
        <h3 className="font-medium text-xl mb-2 text-gray-800">Location needed</h3>
        <p className="text-gray-600 mb-5">
          Please set your location to find salons near you
        </p>
        {/* <div className="space-y-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-[#CE145B] rounded-md py-3 px-4 text-white hover:bg-[#B01050] transition-colors"
            onClick={onOpenLocationModal}
          >
            <MapPin size={16} />
            Set your location
          </motion.button>
        </div> */}
      </motion.div>
    );
  }

  const handleSalonSelect = (value) => {
    router.push(`/salon/${value.salon_id}`)
  };
  
  const handleViewServices = () => {
    router.push(`/services/${selectedSalon.salon_id}`);
  };
  
  const handleClose = () => {
    setSelectedSalon();
  };

  // Promotional banners data
  const promotionalBanners = [
    {
      id: 1,
      title: "15% Off First Booking",
      description: "Use code: NEWUSER15",
      bgColor: "from-pink-500 to-[#CE145B]",
      icon: <Percent size={24} className="text-white" />,
      buttonText: "Book Now"
    },
    {
      id: 2,
      title: "Refer a Friend",
      description: "Get 10% off your next booking",
      bgColor: "from-purple-500 to-indigo-600",
      icon: <Clock size={24} className="text-white" />,
      buttonText: "Schedule"
    },
    {
      id: 3,
      title: "Book 3 Services, Get 1 Free",
      description: "Book 3 services and get 1 free",
      bgColor: "from-blue-400 to-blue-600",
      icon: <Gift size={24} className="text-white" />,
      buttonText: "Get Card"
    }
  ];
  return (
    <div className="px-4 sm:px-6 pb-24">
      {/* Horizontally Scrollable Promotional Banners - with hidden scrollbar */}
      <div className="mb-6 -mx-2 px-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Special Offers</h2>
          <Link href="/offers" className="text-sm text-[#CE145B] flex items-center">
            see all <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="overflow-x-auto -mx-2 px-2 flex space-x-4 pb-2 scrollbar-hide">
          {promotionalBanners.map((banner) => (
            <motion.div 
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`relative rounded-xl overflow-hidden h-32 bg-gradient-to-r ${banner.bgColor} flex-shrink-0 w-72 sm:w-80`}
            >
              <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                <div className="flex items-center space-x-1 bg-white bg-opacity-90 px-3 py-1 rounded-full self-start">
                  <Star size={12} className="text-yellow-500" />
                  <span className="text-xs font-medium">Limited Time</span>
                </div>
                
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-1">{banner.title}</h3>
                  <p className="text-xs text-white text-opacity-90 mb-2">{banner.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-[#CE145B] px-3 py-1.5 rounded-md text-xs font-medium"
                  >
                    {banner.buttonText}
                  </motion.button>
                </div>
              </div>
              
              {/* Visual elements for the banner */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="relative h-12 w-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white bg-opacity-20"></div>
                  <div className="relative z-10">
                    {banner.icon}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Categories Section - Horizontally scrollable with hidden scrollbar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Categories</h2>
          <Link href="/categories" className="text-sm text-[#CE145B] flex items-center">
            see all <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="overflow-x-auto -mx-1 px-1 flex space-x-3 pb-2 scrollbar-hide">
          <CategoryItem label="All" src='/service-icons/all-services.png' isActive={activeCategory === 'All'} onClick={() => setActiveCategory('All')} />
          <CategoryItem label="Haircut" src='/service-icons/men-hair.png' isActive={activeCategory === 'Haircut'} onClick={() => setActiveCategory('Haircut')} />
          <CategoryItem label="Haircolour" src='/service-icons/hair-coloring.png' isActive={activeCategory === 'Haircolour'} onClick={() => setActiveCategory('Haircolour')} />
          <CategoryItem label="Shaving" src='/service-icons/shaving-icon.png' isActive={activeCategory === 'Shaving'} onClick={() => setActiveCategory('Shaving')} />
          <CategoryItem label="Facials" src='/service-icons/facial-treatment.png' isActive={activeCategory === 'Facials'} onClick={() => setActiveCategory('Facials')} />
          <CategoryItem label="Trimming" src='/service-icons/shaving-icon.png' isActive={activeCategory === 'Trimming'} onClick={() => setActiveCategory('Trimming')} />
          <CategoryItem label="Beard" src='/service-icons/shaving-icon.png' isActive={activeCategory === 'Beard'} onClick={() => setActiveCategory('Beard')} />
          <CategoryItem label="Massage" src='/service-icons/massage.png' isActive={activeCategory === 'Massage'} onClick={() => setActiveCategory('Massage')} />
          <CategoryItem label="Makeup" src='/service-icons/makeup.png' isActive={activeCategory === 'Makeup'} onClick={() => setActiveCategory('Makeup')} />
        </div>
      </div>
      
      {/* Quick Filters - Horizontally scrollable with hidden scrollbar */}
      {/* <div className="mb-4 overflow-x-auto -mx-1 px-1 flex space-x-2 pb-2 scrollbar-hide">
        <button className="flex-shrink-0 flex items-center gap-1 text-xs bg-[#FEF0F5] text-[#CE145B] px-3 py-1.5 rounded-full font-medium">
          <Star size={12} />
          Top Rated
        </button>
        <button className="flex-shrink-0 flex items-center gap-1 text-xs bg-[#FEF0F5] text-[#CE145B] px-3 py-1.5 rounded-full font-medium">
          <Clock size={12} />
          Open Now
        </button>
        <button className="flex-shrink-0 flex items-center gap-1 text-xs bg-[#FEF0F5] text-[#CE145B] px-3 py-1.5 rounded-full font-medium">
          <MapPin size={12} />
          Nearest
        </button>
        <button className="flex-shrink-0 flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
          Price: Low to High
        </button>
        <button className="flex-shrink-0 flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
          Most Popular
        </button>
      </div> */}
      
      {/* Best Salons Section with improved layout */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-1">
            {activeCategory === 'All' ? (
              <span>Best salons near you</span>
            ) : (
              <span>Salons offering {activeCategory}</span>
            )}
            <div className="text-xs bg-[#FEF0F5] text-[#CE145B] px-2 py-0.5 rounded-full ml-2">
              {filteredSalons.length}
            </div>
          </h2>
          <Link href="/all-salons" className="text-sm text-[#CE145B] flex items-center">
            see all <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSalons.map((salon, index) => (
            <motion.div
              key={salon.salon_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <SalonCard favorites={favorites} salon={salon} handleSalonSelect={handleSalonSelect} />
            </motion.div>
          ))}
        </div>
      </div>
            {/* Style to hide scrollbar */}
            <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Custom rotation class */
        .rotate-270 {
          transform: rotate(270deg);
        }
      `}</style>
    </div> 
  );
}

// Enhanced Categories Item Component
const CategoryItem = ({ label, src='', isActive, onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center w-16 cursor-pointer flex-shrink-0" onClick={onClick}>
      <div className={`h-12 w-12 rounded-lg mb-1 p-1.5 flex items-center justify-center transition-all duration-200 ${
        isActive 
          ? 'bg-[#FEF0F5] shadow-sm border border-pink-200' 
          : 'bg-gray-100 hover:bg-gray-200'
      }`}>
        {src ? (
          <img 
            src={src} 
            alt={label} 
            className="h-8 w-8 object-contain" 
          />
        ) : (
          <Scissors className={`h-5 w-5 ${isActive ? 'text-[#CE145B]' : 'text-gray-600'}`} />
        )}
      </div>
      <span className={`text-xs text-center font-medium ${isActive ? 'text-[#CE145B]' : 'text-gray-700'}`}>
        {label}
      </span>
      {isActive && (
        <motion.div 
          layoutId="categoryIndicator"
          className="h-1 w-5 bg-[#CE145B] rounded-full mt-0.5"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
};