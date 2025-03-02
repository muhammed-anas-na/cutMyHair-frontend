'use client';
import React, { useEffect, useState } from 'react';
import { PlusCircle, Scissors, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GET_OWNER_SALON_FN } from '@/services/ownerService';

const SalonManagement = () => {
  const router = useRouter();
  const { user_id } = useAuth();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user_id) {
      console.log("No user_id available yet");
      return;
    }

    console.log("Fetching salons for user_id:", user_id);

    const fetchSalons = async () => {
      setLoading(true);
      try {
        const response = await GET_OWNER_SALON_FN(user_id);
        console.log("Salon API response:", response);
        // Assuming the response structure is { data: { data: [salons] } }
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
  }, [user_id]);

  const handleCreateNew = () => {
    router.push('/owner/registerSalon');
  };

  const handleSalonDetails = (salonId) => {
    router.push(`/owner/salonDetails/${salonId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      {/* Header */}
      <div className="bg-[#CE145B] rounded-xl p-6 mb-8 text-white">
        <h1 className="text-2xl font-semibold mb-2">Salon Management</h1>
        <p className="opacity-90">Manage your salon portfolio and create new locations</p>
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CE145B]"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 p-4 rounded-lg mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
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

          {/* Dynamically render salon cards */}
          {salons.map((salon) => (
            <div 
              key={salon.salon_id}
              onClick={() => handleSalonDetails(salon.salon_id)}
              className="h-96 bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={salon.images && salon.images.length > 0 ? salon.images[0] : "/api/placeholder/300/200"}
                  alt={salon.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/300/200";
                  }}
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="text-[#CE145B]">{salon.rating || "New"}</span>
                  {salon.rating > 0 && <span className="text-yellow-400">★</span>}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Scissors size={20} className="text-[#CE145B]" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {salon.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-4">{salon.location_text || salon.address}</p>
                
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

          {/* Show message if no salons */}
          {salons.length === 0 && (
            <div className="bg-yellow-50 p-6 rounded-lg col-span-1 flex flex-col items-center justify-center text-center">
              <Scissors className="w-12 h-12 text-[#CE145B] mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Salons Found</h2>
              <p className="text-gray-600 mb-4">You haven't added any salons yet. Use the "Add New Salon" option to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalonManagement;