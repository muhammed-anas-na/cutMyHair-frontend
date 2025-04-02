'use client';
// components/Header.jsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  Calendar, 
  User, 
  ChevronDown 
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Primary color from palette - CE145B (pink/magenta)
  const primaryColor = '#CE145B';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsUserMenuOpen(false);
      setIsServicesMenuOpen(false);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleServicesMenu = () => {
    setIsServicesMenuOpen(!isServicesMenuOpen);
  };

  const salonServices = [
    { name: 'Hair', link: '/services/hair' },
    { name: 'Facial', link: '/services/facial' },
    { name: 'Makeup', link: '/services/makeup' },
    { name: 'Nails', link: '/services/nails' },
    { name: 'Spa', link: '/services/spa' },
    { name: 'Massage', link: '/services/massage' },
  ];

  return (
    <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'shadow-sm py-3'}`}>
      <div className="container mx-auto px-4 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img src='white-logo.png' className='w-28 lg:w-36' alt="Salon Logo" />
            </Link>
          </div>

          {/* Primary Navigation - Center */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={toggleServicesMenu}
                >
                  Services <ChevronDown size={16} className="ml-1 text-gray-400" />
                </button>
                
                {/* Services Dropdown */}
                <div className={`absolute top-full left-0 w-56 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-200 transform origin-top-left ${isServicesMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                  <div className="py-2">
                    {salonServices.map((service) => (
                      <Link
                        key={service.name}
                        href={service.link}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {service.name}
                      </Link>
                    ))}
                    <Link 
                      href="/services" 
                      className="block px-4 py-2 mt-1 text-xs font-medium pt-2 border-t border-gray-100"
                      style={{ color: primaryColor }}
                    >
                      View all services →
                    </Link>
                  </div>
                </div>
              </div>
              
              <Link href="/book" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Book Appointment
              </Link>
              
              <Link href="/stylists" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Our Stylists
              </Link>
              
              <Link href="/offers" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Offers
              </Link>
            </div>
          </nav>

          {/* Right section - Right */}
          <div className="flex items-center">
            {/* User Account - Desktop */}
            <div className="hidden sm:block relative">
              <button 
                onClick={toggleUserMenu} 
                className="flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="User account"
              >
                <User size={20} className="text-gray-700" />
              </button>
              
              {/* User Dropdown */}
              <div className={`absolute top-full right-0 w-56 mt-1 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-200 transform origin-top-right ${isUserMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <div className="py-2">
                  <Link href="/account/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <User size={16} className="mr-3 text-gray-500" />
                    My Profile
                  </Link>
                  <Link href="/account/appointments" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <Calendar size={16} className="mr-3 text-gray-500" />
                    My Appointments
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/logout" className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50">
                    Logout
                  </Link>
                </div>
              </div>
            </div>

            {/* Book Now Button - Desktop */}
            <Link 
              href="/book-now" 
              className="hidden md:flex ml-3 px-4 py-2 text-white font-medium text-sm rounded-md transition-colors"
              style={{ backgroundColor: primaryColor, ":hover": { backgroundColor: "#B01149" } }}
            >
              Book Now
            </Link>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden ml-2 p-2 rounded-md hover:bg-gray-100"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white pb-4 px-4 shadow-inner border-t border-gray-100 max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Quick Book Button - Mobile */}
          <Link 
            href="/book-now" 
            className="flex justify-center items-center mt-4 px-4 py-3 text-white font-medium text-sm rounded-md transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            <Calendar size={16} className="mr-2" />
            Book Appointment Now
          </Link>
          
          {/* Navigation - Mobile */}
          <nav className="flex flex-col mt-4">
            <div className="py-1 border-b border-gray-100">
              <button 
                onClick={toggleServicesMenu}
                className="flex items-center justify-between w-full px-1 py-3 text-sm font-medium text-gray-700"
              >
                <span>Services</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isServicesMenuOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {isServicesMenuOpen && (
                <div className="pl-4 pb-2">
                  {salonServices.map((service) => (
                    <Link
                      key={service.name}
                      href={service.link}
                      className="block py-2.5 text-sm text-gray-700"
                    >
                      {service.name}
                    </Link>
                  ))}
                  <Link 
                    href="/services" 
                    className="block py-2 text-xs font-medium"
                    style={{ color: primaryColor }}
                  >
                    View all services →
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/book" className="px-1 py-3 text-sm font-medium text-gray-700 border-b border-gray-100">
              Book Appointment
            </Link>
            
            <Link href="/stylists" className="px-1 py-3 text-sm font-medium text-gray-700 border-b border-gray-100">
              Our Stylists
            </Link>
            
            <Link href="/offers" className="px-1 py-3 text-sm font-medium text-gray-700 border-b border-gray-100">
              Special Offers & Deals
            </Link>
            
            <div className="mt-2 py-3 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase px-1">Your Account</span>
              <div className="mt-2 space-y-1">
                <Link href="/account/profile" className="flex items-center px-1 py-2 text-sm text-gray-700">
                  <User size={16} className="mr-3 text-gray-500" />
                  My Profile
                </Link>
                <Link href="/account/appointments" className="flex items-center px-1 py-2 text-sm text-gray-700">
                  <Calendar size={16} className="mr-3 text-gray-500" />
                  My Appointments
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;