'use client';
import React, { useEffect, useState } from 'react';
import { Bell, User, Calendar, CreditCard, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    appointments: true,
    promotions: false,
    reminders: true,
  });
  const {user_id} = useAuth();

  useEffect(()=>{
    async function fetchUserData(){
        const userData = await GET_OWNER_SETTINGS_DATA_FN(user_id);
        console.log(userData);
    }
    fetchUserData();
  },[])
  // Primary color from CE145B palette
  const primaryColor = '#CE145B';
  
  // Toggle notification settings
  const toggleNotification = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Profile Section */}
        <div className="mb-6 p-4 rounded-lg bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              JS
            </div>
            <div>
              <h2 className="text-lg font-semibold">Jane Smith</h2>
              <p className="text-sm text-gray-500">jane.smith@example.com</p>
            </div>
          </div>
          <button 
            className="mt-4 w-full py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: primaryColor }}
          >
            Edit Profile
          </button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Account Settings */}
          <div className="p-4 rounded-lg bg-white shadow-sm">
            <h3 className="text-md font-semibold mb-3" style={{ color: primaryColor }}>Account Settings</h3>
            
            <div className="space-y-2">
              <div className="p-3 rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <User size={18} className="text-gray-500" />
                  <span className="ml-3">Personal Information</span>
                </div>
                <ChevronRight size={18} className="text-gray-500" />
              </div>
              
              <div className="p-3 rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <CreditCard size={18} className="text-gray-500" />
                  <span className="ml-3">Payment Methods</span>
                </div>
                <ChevronRight size={18} className="text-gray-500" />
              </div>
              
              <div className="p-3 rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <Shield size={18} className="text-gray-500" />
                  <span className="ml-3">Privacy & Security</span>
                </div>
                <ChevronRight size={18} className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="p-4 rounded-lg bg-white shadow-sm">
            <h3 className="text-md font-semibold mb-3" style={{ color: primaryColor }}>Notification Settings</h3>
            
            <div className="space-y-2">
              <div className="p-3 rounded-md flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-500" />
                  <span className="ml-3">Appointment Reminders</span>
                </div>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="appointments" 
                    className="opacity-0 absolute block w-6 h-6 cursor-pointer" 
                    checked={notifications.appointments}
                    onChange={() => toggleNotification('appointments')}
                  />
                  <label 
                    htmlFor="appointments" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${notifications.appointments ? '' : 'bg-gray-300'}`}
                    style={{ backgroundColor: notifications.appointments ? primaryColor : '' }}
                  >
                    <span 
                      className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in bg-white ${notifications.appointments ? 'translate-x-4' : 'translate-x-0'}`} 
                    />
                  </label>
                </div>
              </div>
              
              <div className="p-3 rounded-md flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <Bell size={18} className="text-gray-500" />
                  <span className="ml-3">Promotions & Offers</span>
                </div>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="promotions" 
                    className="opacity-0 absolute block w-6 h-6 cursor-pointer" 
                    checked={notifications.promotions}
                    onChange={() => toggleNotification('promotions')}
                  />
                  <label 
                    htmlFor="promotions" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${notifications.promotions ? '' : 'bg-gray-300'}`}
                    style={{ backgroundColor: notifications.promotions ? primaryColor : '' }}
                  >
                    <span 
                      className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in bg-white ${notifications.promotions ? 'translate-x-4' : 'translate-x-0'}`} 
                    />
                  </label>
                </div>
              </div>
              
              <div className="p-3 rounded-md flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <Bell size={18} className="text-gray-500" />
                  <span className="ml-3">Service Reminders</span>
                </div>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="reminders" 
                    className="opacity-0 absolute block w-6 h-6 cursor-pointer" 
                    checked={notifications.reminders}
                    onChange={() => toggleNotification('reminders')}
                  />
                  <label 
                    htmlFor="reminders" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${notifications.reminders ? '' : 'bg-gray-300'}`}
                    style={{ backgroundColor: notifications.reminders ? primaryColor : '' }}
                  >
                    <span 
                      className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in bg-white ${notifications.reminders ? 'translate-x-4' : 'translate-x-0'}`} 
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Appointment Preferences */}
          <div className="p-4 rounded-lg bg-white shadow-sm">
            <h3 className="text-md font-semibold mb-3" style={{ color: primaryColor }}>Appointment Preferences</h3>
            
            <div className="space-y-2">
              <div className="p-3 rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-500" />
                  <span className="ml-3">Preferred Stylists</span>
                </div>
                <ChevronRight size={18} className="text-gray-500" />
              </div>
              
              <div className="p-3 rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-500" />
                  <span className="ml-3">Favorite Services</span>
                </div>
                <ChevronRight size={18} className="text-gray-500" />
              </div>
            </div>
          </div>
          
          {/* Support & Logout */}
          <div className="p-4 rounded-lg bg-white shadow-sm">
            <div className="space-y-2">
              <div className="p-3 rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <span className="text-sm">Help & Support</span>
                <ChevronRight size={18} className="text-gray-500" />
              </div>
              
              <div className="p-3 rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <span className="text-sm">Terms & Conditions</span>
                <ChevronRight size={18} className="text-gray-500" />
              </div>
              
              <div className="p-3 rounded-md flex items-center hover:bg-gray-50 cursor-pointer"
                style={{ color: primaryColor }}
              >
                <LogOut size={18} />
                <span className="ml-3 font-medium">Logout</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-8 text-gray-500">Salon App v2.0.1</p>
      </main>
    </div>
  );
};

export default SettingsPage;