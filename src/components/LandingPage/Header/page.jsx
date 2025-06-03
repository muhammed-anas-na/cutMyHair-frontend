'use client';
// components/Header.jsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  Calendar, 
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronRight,
  Clock,
  Star,
  Heart,
  Instagram
} from 'lucide-react';
import AnnouncementBanner from '../../AnnouncementBanner/AnnouncementBanner'
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsServicesMenuOpen(false);
      setIsMobileServicesOpen(false);
    }
  };

  const toggleServicesMenu = () => {
    setIsServicesMenuOpen(!isServicesMenuOpen);
  };

  const salonServices = [
    { name: 'Hair', link: '/services/hair', icon: '✂️', description: 'Cuts, Color & Styling' },
    { name: 'Facial', link: '/services/facial', icon: '🧴', description: 'Deep Cleansing & Care' },
    { name: 'Makeup', link: '/services/makeup', icon: '💄', description: 'Professional Looks' },
    { name: 'Nails', link: '/services/nails', icon: '💅', description: 'Manicure & Pedicure' },
    { name: 'Spa', link: '/services/spa', icon: '🧖‍♀️', description: 'Relaxation & Wellness' },
    { name: 'Massage', link: '/services/massage', icon: '💆‍♀️', description: 'Therapeutic Treatment' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-lg py-3' : 'shadow-sm py-4'}`}>
        <div className="container mx-auto px-4 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img src='white-logo.png' className='w-32 lg:w-40' alt="Salon Logo" />
              </Link>
            </div>

            {/* Primary Navigation - Center */}
            <nav className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-8">
                <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-800 hover:text-pink-600 transition-colors">
                  Home
                </Link>
                
                <div className="relative">
                  <button 
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:text-pink-600 transition-colors"
                    onClick={toggleServicesMenu}
                    onMouseEnter={() => setIsServicesMenuOpen(true)}
                  >
                    Services <ChevronDown size={16} className="ml-1 text-gray-400" />
                  </button>
                  
                  {/* Services Dropdown */}
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-200 transform origin-top ${isServicesMenuOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}
                    onMouseLeave={() => setIsServicesMenuOpen(false)}
                  >
                    <div className="py-3">
                      {salonServices.map((service) => (
                        <Link
                          key={service.name}
                          href={service.link}
                          className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-gray-900 transition-colors"
                        >
                          <span className="text-xl mr-3 mt-0.5">{service.icon}</span>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs text-gray-500">{service.description}</div>
                          </div>
                        </Link>
                      ))}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <Link 
                          href="/home" 
                          className="block px-4 py-2 text-sm font-medium text-center hover:bg-pink-50"
                          style={{ color: primaryColor }}
                        >
                          View All Services →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link href="/about-us" className="px-3 py-2 text-sm font-medium text-gray-800 hover:text-pink-600 transition-colors">
                  About Us
                </Link>
                
                <Link href="/blogs" className="px-3 py-2 text-sm font-medium text-gray-800 hover:text-pink-600 transition-colors">
                  Blogs
                </Link>
                
                <Link href="/contact-us" className="px-3 py-2 text-sm font-medium text-gray-800 hover:text-pink-600 transition-colors">
                  Contact
                </Link>
              </div>
            </nav>

            {/* Right section - CTA Buttons */}
            <div className="flex items-center space-x-3">
              {/* Contact Number - Desktop */}
              {/* <a 
                href="tel:+1234567890" 
                className="hidden md:flex items-center px-3 py-2 text-sm text-gray-700 hover:text-pink-600 transition-colors"
              >
                <Phone size={18} className="mr-2" />
                <span className="font-medium">+1 234 567 890</span>
              </a> */}

              {/* Book Now Button - Desktop */}
              <Link 
                href="/home" 
                className="hidden md:flex items-center px-5 py-2.5 text-white font-medium text-sm rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                <Calendar size={18} className="mr-2" />
                Book Appointment
              </Link>

              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <p className="text-xs text-gray-600 mt-0.5">Welcome to CutMyHair</p>
          </div>
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-white/80 transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col h-[calc(100%-80px)] overflow-y-auto">
          {/* Quick Actions */}
          <div className="p-4 bg-gradient-to-b from-pink-50 to-white">
            <Link 
              href="/home" 
              className="flex items-center justify-center px-4 py-3.5 text-white font-medium text-base rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              style={{ backgroundColor: primaryColor }}
              onClick={toggleMenu}
            >
              <Calendar size={20} className="mr-2" />
              Book Appointments Now
            </Link>
            
            {/* <div className="mt-3 flex items-center justify-center text-sm text-gray-600">
              <Clock size={16} className="mr-1.5" />
              <span>Open: Mon-Sat 9AM-8PM</span>
            </div> */}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-2">
            <Link 
              href="/home" 
              className="flex items-center px-5 py-3.5 text-base font-medium text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>

            {/* Services Section with Accordion */}
            <div className="px-5 py-1">
              <button 
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className="flex items-center justify-between w-full py-3 text-base font-medium text-gray-800 hover:text-pink-600"
              >
                <span>Our Services</span>
                <ChevronRight 
                  size={20} 
                  className={`text-gray-400 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-90' : ''}`}
                />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${isMobileServicesOpen ? 'max-h-[400px]' : 'max-h-0'}`}>
                <div className="py-2 space-y-1">
                  {salonServices.map((service) => (
                    <Link
                      key={service.name}
                      href={service.link}
                      className="flex items-start py-2.5 text-sm text-gray-600 hover:text-pink-600 transition-colors rounded-md hover:bg-pink-50 px-2"
                      onClick={toggleMenu}
                    >
                      <span className="text-xl mr-3">{service.icon}</span>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-xs text-gray-500">{service.description}</div>
                      </div>
                    </Link>
                  ))}
                  <Link 
                    href="/home" 
                    className="block py-2.5 px-2 text-sm font-medium mt-2"
                    style={{ color: primaryColor }}
                    onClick={toggleMenu}
                  >
                    View All Services →
                  </Link>
                </div>
              </div>
            </div>
            
            <Link 
              href="/about-us" 
              className="flex items-center px-5 py-3.5 text-base font-medium text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link 
              href="/blogs" 
              className="flex items-center px-5 py-3.5 text-base font-medium text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              onClick={toggleMenu}
            >
             
              Blogs
            </Link>
            
            <Link 
              href="/contact-us" 
              className="flex items-center px-5 py-3.5 text-base font-medium text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              onClick={toggleMenu}
            >
              Contact Us
            </Link>
          </nav>

          {/* Footer Section */}
          <div className="p-5 bg-gray-50 border-t border-gray-100">
            <div className="space-y-3">
              <a href="mailto:info@beautysalon.com" className="flex items-center text-gray-700 hover:text-pink-600 transition-colors">
                <Mail size={18} className="mr-3 text-pink-500" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-sm text-gray-600">info@cutmyhair.in</p>
                </div>
              </a>
            </div>
            
            {/* Social Media Links */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Follow Us</p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors">
                  <span className="text-pink-600">
                    <Instagram/>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnnouncementBanner/>
    </>
  );
};

export default Header;