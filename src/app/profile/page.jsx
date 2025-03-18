'use client';
import React from 'react';
import Image from 'next/image';
import { Calendar, Settings, Palette, Info, Mail, Star, LogOut, ChevronRight, Sun, Moon } from 'lucide-react';
import Navigation from '@/components/Navigation/page';
import Header from '@/components/Header/page';
import { useTheme } from '@/context/ThemeContext';

const Profile = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const menuItems = [
    {
      icon: <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Your Bookings History',
      href: '/bookings'
    },
    {
      icon: <Settings className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Settings',
      href: '/settings'
    },
    {
      icon: <Palette className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Theme',
      value: isDarkMode ? 'Dark' : 'Light',
      onClick: toggleDarkMode
    },
    {
      icon: <Info className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'About Us',
      href: '/about'
    },
    {
      icon: <Mail className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Contact Us',
      href: '/contact'
    },
    {
      icon: <Star className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Rate Us',
      href: '/rate'
    },
    {
      icon: <LogOut className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
      label: 'Log Out',
      href: '/logout',
      className: 'text-red-500'
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} mb-16`}>
      <Header />

      {/* Profile Info */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-4 py-8 flex flex-col items-center border-b`}>
        <div className="relative w-24 h-24 mb-4">
          <div className={`w-full h-full rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
            <svg 
              className={`w-16 h-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
        <h1 className={`text-xl font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>John Doe</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>johndoe@mail.com</p>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border`}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between p-4 
                ${index !== menuItems.length - 1 ? `border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}` : ''} 
                ${item.className || (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && (
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.value}</span>
                )}
                <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navigation currentPage={'profile'}/>
    </div>
  );
};

export default Profile;