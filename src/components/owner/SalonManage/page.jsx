'use client';
import React from 'react';
import { PlusCircle, Scissors, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SalonManagement = () => {
  const router = useRouter();

  const registeredSalon = {
    name: "Elegant Cuts",
    image: "/api/placeholder/300/200",
    location: "123 Style Street",
    rating: 4.8
  };

  const handleCreateNew = () => {
    router.push('/owner/registerSalon');
  };

  const handleSalonDetails = () => {
    router.push('/owner/salonDetails');
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      {/* Header */}
      <div className="bg-[#CE145B] rounded-xl p-6 mb-8 text-white">
        <h1 className="text-2xl font-semibold mb-2">Salon Management</h1>
        <p className="opacity-90">Manage your salon portfolio and create new locations</p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add New Salon Card */}
        <div 
          onClick={handleCreateNew}
          className="h-96 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#CE145B] hover:bg-pink-50 transition-colors group"
        >
          <PlusCircle size={48} className="text-gray-400 group-hover:text-[#CE145B] mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 group-hover:text-[#CE145B] mb-2">
            Add New Salon
          </h2>
          <p className="text-gray-500 text-center max-w-sm">
            Create a new salon location and start managing appointments
          </p>
        </div>

        {/* Registered Salon Card */}
        <div 
          onClick={handleSalonDetails}
          className="h-96 bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48">
            <img
              src={registeredSalon.image}
              alt={registeredSalon.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
              <span className="text-[#CE145B]">{registeredSalon.rating}</span>
              <span className="text-yellow-400">★</span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Scissors size={20} className="text-[#CE145B]" />
              <h3 className="text-xl font-semibold text-gray-800">
                {registeredSalon.name}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">{registeredSalon.location}</p>
            
            <div className="flex items-center text-[#CE145B] group">
              <span className="font-medium">View Details</span>
              <ArrowRight 
                size={16} 
                className="ml-2 transform group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonManagement;