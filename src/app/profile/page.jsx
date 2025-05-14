'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Calendar, Settings, Palette, Info, Mail, Star, LogOut, ChevronRight } from 'lucide-react';
import Navigation from '@/components/Navigation/page';
import Header from '@/components/Header/page';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { FETCH_USER_DETAILS_FN } from '@/services/userService';

const Profile = () => {
  const {logout,user_id} = useAuth();
  const [userDetails, setUserDetails] = useState();
  const router = useRouter();
  const menuItems = [
    {
      icon: <Calendar className="w-6 h-6 text-gray-500" />,
      label: 'Your Bookings History',
      onClick: ()=>{
        router.push('/bookings')
      },
      href: '/bookings'
    },
    {
      icon: <Settings className="w-6 h-6 text-gray-500" />,
      label: 'Settings',
      href: '/settings'
    },
    {
      icon: <Palette className="w-6 h-6 text-gray-500" />,
      label: 'Theme',
      value: 'Light',
      href: '/theme'
    },
    {
      icon: <Info className="w-6 h-6 text-gray-500" />,
      label: 'About Us',
      onClick: ()=>{
        router.push('/about-us')
      },
      href: '/about'
    },
    {
      icon: <Mail className="w-6 h-6 text-gray-500" />,
      label: 'Contact Us',
      onClick: ()=>{
        router.push('/contact-us')
      },
      href: '/contact'
    },
    {
      icon: <Star className="w-6 h-6 text-gray-500" />,
      label: 'Rate Us',
      href: '/rate'
    },
    {
      icon: <LogOut className="w-6 h-6 text-gray-500" />,
      label: 'Log Out',
      href: '/logout',
      onClick: ()=>{
        handleLogout()
      },
      className: 'text-red-500'
    }
  ];

  function handleLogout(){
    logout();
  }

  useEffect(()=>{
    async function fetchData(){
      try{
        const response = await FETCH_USER_DETAILS_FN(user_id);
        console.log("Response ==>",response.data.data);
        if(response.data.data == null){
          logout();
          router.replace('/login')
        }
        setUserDetails(response.data.data);
      }catch(err){
        console.log("Error" , err);
      }
    }fetchData()
  },[user_id])

  return (
    <div className="min-h-screen bg-gray-50 mb-16">
      <Header />

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Info */}
        <div className="bg-white px-4 py-8 flex flex-col items-center border-b rounded-t-lg mt-4">
          <div className="relative w-24 h-24 mb-4">
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
              <svg 
                className="w-16 h-16 text-gray-400" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-semibold mb-1">{userDetails?.name}</h1>
          <p className="text-gray-500">{userDetails?.phone_number}</p>
        </div>
        <div className="py-4">
          <div className="bg-white rounded-lg shadow-sm">
            {menuItems.map((item, index) => (
              <button
                onClick={item?.onClick}
                key={index}
                className={`w-full flex items-center justify-between p-4 
                  ${index !== menuItems.length - 1 ? 'border-b' : ''} 
                  ${item.className || 'text-gray-700'}`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && (
                    <span className="text-gray-500 text-sm">{item.value}</span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Navigation currentPage={'profile'}/>
    </div>
  );
};

export default Profile;



