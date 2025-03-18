'use client';

import { Bell, Search, MoreVertical, MapPin, Menu, ChevronDown } from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '@/context/ThemeContext';

function Header() {
  const { locationName, locationText, setShowLocationModal } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { isDarkMode } = useTheme();

  // Track scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to truncate text with ellipsis if longer than 15 characters
  const truncateText = (text) => {
    if (!text) return "";
    return text.length > 15 ? `${text.substring(0, 15)}...` : text;
  };
  
  const displayLocationText = locationText ? truncateText(locationText) : "Find My Location";
  const displayLocationName = locationName ? truncateText(locationName) : "Set your location";
 
  // Handle click on the location area
  const handleLocationClick = () => {
    setShowLocationModal(true);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between p-4">
          {/* Logo (for medium screens and up) */}
          <div className="hidden md:flex items-center mr-4">
            <Link href="/">     
                <img src="white-logo.png" alt="" className="w-28"/>
            </Link>
          </div>
          
          {/* Location Button */}
          <motion.div 
            className="flex items-center gap-2 cursor-pointer bg-white rounded-full pl-1 pr-3 py-1 border border-gray-100 flex-grow md:flex-grow-0 hover:bg-gray-50 transition-colors"
            onClick={handleLocationClick}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-[#FEF0F5] p-2 rounded-full">
              <MapPin className="w-4 h-4 text-[#CE145B]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <p className="font-medium text-sm truncate">{displayLocationText}</p>
                <ChevronDown size={14} className="ml-1 text-gray-400" />
              </div>
              <p className="text-gray-500 text-xs truncate">{displayLocationName}</p>
            </div>
          </motion.div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search button - more prominent */}
            <Link href={'/search'}>
              <motion.div 
                className={`p-2 sm:p-2.5 ${isDarkMode ? 'bg-gray-800' : 'bg-[#FEF0F5]'} rounded-full flex items-center justify-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5 text-[#CE145B]" />
              </motion.div>
            </Link>
            
            {/* Notification button with indicator */}
            <motion.div 
              className={`p-2 sm:p-2.5 rounded-full flex items-center justify-center relative ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              <span className="absolute top-1 right-1 bg-[#CE145B] rounded-full w-2 h-2"></span>
            </motion.div>
            
            {/* Menu button - transforms to More options on larger screens */}
            <motion.div 
              className={`p-2 sm:p-2.5 rounded-full flex items-center justify-center md:hidden ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={toggleMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            </motion.div>
            
            {/* More options button - visible only on medium screens and up */}
            <motion.div 
              className={`hidden md:flex p-2.5 rounded-full items-center justify-center ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MoreVertical className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t`}
          >
            <div className="px-4 py-2">
              <Link href="/profile" className={`block py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Profile
              </Link>
              <Link href="/settings" className={`block py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Settings
              </Link>
              <button className={`block w-full text-left py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;