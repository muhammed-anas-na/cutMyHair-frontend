'use client';
import React, { useEffect, useState } from 'react';
import { PlusCircle, Scissors, ArrowRight, ImageOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GET_OWNER_SALON_FN } from '@/services/ownerService';
import {useOwnerAuth} from "@/context/OwnerContext"
const SalonManagement = () => {
  const router = useRouter();
  const { owner_id } = useOwnerAuth();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      try {
        const response = await GET_OWNER_SALON_FN(owner_id);
        if (response?.data?.data) {
          setSalons(response.data.data);
        } else {
          setSalons([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching salons:", err);
        setError("Failed to load your salons. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [owner_id]);

  const handleCreateNew = () => {
    router.push('/owner/registerSalon');
  };

  const handleSalonDetails = (salonId) => {
    router.push(`/owner/salonDetails/${salonId}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 pb-12 mb-8">
      <div className="bg-[#CE145B] rounded-lg sm:rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 text-white shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Salon Management</h1>
        <p className="text-sm sm:text-base opacity-90">Manage your salon portfolio and create new locations</p>
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#CE145B]"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 p-4 rounded-lg mb-6 shadow-sm">
          <p className="text-red-700 text-sm sm:text-base">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Add New Salon Card - Improved visibility and touch targets */}
          <div 
            onClick={handleCreateNew}
            className="min-h-48 sm:min-h-64 md:h-80 border-2 border-dashed border-gray-300 rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#CE145B] hover:bg-pink-50 transition-colors group shadow-sm hover:shadow-md"
          >
            <PlusCircle size={40} className="text-gray-400 group-hover:text-[#CE145B] mb-4" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-600 group-hover:text-[#CE145B] mb-2 text-center">
              Add New Salon
            </h2>
            <p className="text-sm sm:text-base text-gray-500 text-center max-w-xs">
              Create a new salon location and start managing appointments
            </p>
          </div>

          {/* Dynamically render salon cards - Improved for mobile usability */}
          {salons.map((salon) => (
            <div 
              key={salon.salon_id}
              onClick={() => handleSalonDetails(salon.salon_id)}
              className="min-h-48 sm:min-h-64 md:h-80 bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative h-40 sm:h-44 md:h-48 bg-gray-100">
                {salon.images && salon.images.length > 0 ? (
                  <img
                    src={salon.images[0]}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                    <ImageOff size={32} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No image available</p>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
                  <span className="text-[#CE145B] font-medium">{salon.rating || "New"}</span>
                  {salon.rating > 0 && <span className="text-yellow-400">★</span>}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Scissors size={18} className="text-[#CE145B]" />
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {salon.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{salon.location_text || salon.address}</p>
                
                <div className="flex items-center text-[#CE145B] group">
                  <span className="font-medium">View Details</span>
                  <ArrowRight 
                    size={16} 
                    className="ml-2 transform group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Show message if no salons - Enhanced visibility */}
          {salons.length === 0 && (
            <div className="bg-yellow-50 p-5 sm:p-6 rounded-xl col-span-1 flex flex-col items-center justify-center text-center shadow-sm min-h-48 sm:min-h-64">
              <Scissors className="w-12 h-12 text-[#CE145B] mb-4" />
              <h2 className="text-lg sm:text-xl font-bold mb-2">No Salons Found</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">You haven't added any salons yet. Use the "Add New Salon" option to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalonManagement;