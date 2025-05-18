'use client';

import { 
  Bell, 
  Search, 
  MoreVertical, 
  MapPin, 
  Menu, 
  ChevronDown, 
  X, 
  Calendar, 
  Heart, 
  Settings, 
  HelpCircle, 
  LogOut,
  Star,
  Home,
  Clock
} from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { locationName, locationText, setShowLocationModal } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Primary color from palette
  const primaryColor = '#CE145B';

  // Track scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSidebar]);

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

  // Toggle sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Navigation links for sidebar
  const navLinks = [
    { name: 'Home', icon: <Home size={20} />, href: '/' },
    { name: 'Search Salons', icon: <Search size={20} />, href: '/search' },
  ];

  // Setting links for sidebar
  const settingLinks = [
    { name: 'Settings', icon: <Settings size={20} />, href: '/profile' },
    { name: 'Contact', icon: <HelpCircle size={20} />, href: '/contact-us' },
  ];

  return (
    <>
      <header className={`bg-white sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'shadow-md py-3' : 'py-4'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between gap-3">
            {/* Logo (for medium screens and up) */}
            <div className="hidden md:flex items-center mr-4">
              <Link href="/" className="block">     
                <img src="white-logo.png" alt="Logo" className="w-28 h-auto"/>
              </Link>
            </div>
            
            {/* Location Button with better spacing and feedback */}
            <motion.div 
              className="flex items-center gap-2.5 cursor-pointer bg-white rounded-full pl-2 pr-3.5 py-1.5 border border-gray-200 shadow-sm flex-grow md:flex-grow-0 hover:bg-gray-50 transition-colors"
              onClick={handleLocationClick}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-[#FEF0F5] p-2 rounded-full flex-shrink-0">
                <MapPin className="w-4 h-4 text-[#CE145B]" />
              </div>
              <div className="flex-1 min-w-0 ml-0.5">
                <div className="flex items-center">
                  <p className="font-medium text-sm truncate">{displayLocationText}</p>
                  <ChevronDown size={14} className="ml-1.5 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xs truncate mt-0.5">{displayLocationName}</p>
              </div>
            </motion.div>
            
            {/* Actions with improved spacing */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search button with enhanced style */}
              <Link href={'/search'}>
                <motion.div 
                  className="p-2.5 bg-[#FEF0F5] rounded-full flex items-center justify-center shadow-sm"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5 text-[#CE145B]" />
                </motion.div>
              </Link>
              
              {/* Notification button with indicator and improved hover effect */}
              <motion.div 
                className="p-2.5 rounded-full flex items-center justify-center relative hover:bg-gray-100 border border-gray-100"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1.5 right-1.5 bg-[#CE145B] ring-2 ring-white rounded-full w-2 h-2"></span>
              </motion.div>
              
              {/* Menu button - transforms to More options on larger screens */}
              <motion.button
                className="p-2.5 rounded-full flex items-center justify-center hover:bg-gray-100 border border-gray-100 md:hidden"
                onClick={toggleSidebar}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </motion.button>
              
              {/* More options button - visible only on medium screens and up */}
              <motion.div 
                className="hidden md:flex p-2.5 rounded-full items-center justify-center hover:bg-gray-100 border border-gray-100"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreVertical className="w-5 h-5 text-gray-700" />
              </motion.div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Sidebar - Right to Left Animation */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-xl overflow-hidden"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <img src="white-logo.png" alt="Logo" className="w-24 h-auto"/>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={22} className="text-gray-700" />
              </motion.button>
            </div>
            
            
            {/* Location Section */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Current Location</p>
              <div 
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm cursor-pointer"
                onClick={() => {
                  setShowLocationModal(true);
                  toggleSidebar();
                }}
              >
                <div className="bg-[#FEF0F5] p-2 rounded-full">
                  <MapPin className="w-4 h-4 text-[#CE145B]" />
                </div>
                <div>
                  <p className="font-medium text-sm">{displayLocationText}</p>
                  <p className="text-xs text-gray-500">{displayLocationName}</p>
                </div>
              </div>
            </div>
            
            {/* Main Navigation */}
            <div className="px-5 py-4 flex-1 overflow-y-auto">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Navigation</p>
              <nav className="space-y-1.5">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={toggleSidebar}
                  >
                    <div className="text-gray-500">{link.icon}</div>
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Settings & Support */}
            <div className="px-5 py-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Settings</p>
              <nav className="space-y-1.5">
                {settingLinks.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={toggleSidebar}
                  >
                    <div className="text-gray-500">{link.icon}</div>
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* App Version */}
            <div className="px-5 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">App Version 2.0.4</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;