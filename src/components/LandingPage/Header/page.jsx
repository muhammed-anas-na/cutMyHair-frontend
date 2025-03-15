'use client';
// components/Header.jsx
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, ShoppingCart, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useState('Jakkasandra Cross Rd, ...');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-6 md:px-52">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
            <img src='white-logo.png' className='w-28 lg:w-36'/>
          {/* </div> */}
          

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex ml-10 space-x-10">
            <Link href="/beauty" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Beauty
            </Link>
            <Link href="/panels" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Panels
            </Link>
            <Link href="/native" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Native
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Location */}
            <div className="hidden md:flex items-center cursor-pointer border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors">
              <MapPin size={16} className="text-gray-500" />
              <span className="ml-2 text-sm truncate max-w-[150px] text-gray-700">{location}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            {/* Search */}
            <div className="hidden sm:flex items-center border border-gray-200 rounded-md bg-gray-50 px-4 py-2.5 w-64 hover:border-gray-300 transition-colors">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search for 'Facial'"
                className="bg-transparent border-none outline-none ml-3 text-sm w-full text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Cart */}
            <div className="relative ml-2">
              <ShoppingCart size={22} className="text-gray-700" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                1
              </span>
            </div>

            {/* User */}
            <div className="hidden sm:block ml-4">
              <User size={22} className="text-gray-700" />
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden ml-2 p-1 rounded-md hover:bg-gray-100"
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
        <div className="md:hidden bg-white pb-6 px-6 shadow-md">
          <nav className="flex flex-col space-y-5 mt-3">
            <Link href="/beauty" className="text-sm font-medium py-2.5 border-b border-gray-100">
              Beauty
            </Link>
            <Link href="/panels" className="text-sm font-medium py-2.5 border-b border-gray-100">
              Panels
            </Link>
            <Link href="/native" className="text-sm font-medium py-2.5 border-b border-gray-100">
              Native
            </Link>
            <div className="flex items-center py-2.5 border rounded-md px-3 mt-2">
              <MapPin size={16} className="text-gray-500" />
              <span className="ml-2 text-sm text-gray-700">{location}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div className="flex items-center border rounded-md bg-gray-50 px-4 py-3 mt-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search for 'Facial'"
                className="bg-transparent border-none outline-none ml-3 text-sm w-full text-gray-700 placeholder-gray-400"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;