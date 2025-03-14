'use client';

import { useLocation } from '@/context/LocationContext';
import SalonCard from "../SalonCard/page";
import SalonFeedback from '../SalonReview/page';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { MapPin, Scissors, RotateCcw, Search } from 'lucide-react';
import { motion } from 'framer-motion';
export default function ListOfSalon({ salons, loading, error }) {
  const { latitude, longitude, locationText } = useLocation();
  const [selectedSalon, setSelectedSalon] = useState()
  const router = useRouter();
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CE145B]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-2 bg-[#CE145B] text-white px-4 py-2 rounded-lg"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (latitude == null) {
    return (
      <div className="p-5 text-center">
        <p>Please set your location to see nearby salons.</p>
      </div>
    );
  }

  if (salons.length === 0 && !loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="p-6 text-center rounded-lg border border-gray-100 shadow-sm my-4 mx-auto"
      >
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ 
            duration: 0.5,
            type: "spring"
          }}
          className="mb-5 flex justify-center"
        >
          <div className="p-3 bg-pink-50 rounded-full">
            <Scissors size={32} className="text-[#CE145B]" />
          </div>
        </motion.div>
        
        <h3 className="font-medium text-lg mb-2 text-[#CE145B]">
          No available salons
        </h3>
        
        <p className="text-gray-600 mb-5 flex items-center justify-center gap-1">
          <MapPin size={16} className="text-[#CE145B]" />
          We couldn't find any salons near {locationText}
        </p>
        
        <div className="space-y-3 max-w-xs mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-[#CE145B] rounded-md py-3 px-4 text-white hover:bg-[#B01050] transition-colors"
            onClick={() => onRetry && onRetry()}
          >
            <RotateCcw size={16} />
            Refresh search
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-white border border-[#CE145B] rounded-md py-3 px-4 text-[#CE145B] hover:bg-pink-50 transition-colors"
          >
            <Search size={16} />
            Try different location
          </motion.button>
          
          <p className="text-sm text-gray-500 mt-4 px-2">
            Popular nearby areas may have more salon options available
          </p>
        </div>
      </motion.div>
    );
  }

  const handleSalonSelect = (value)=>{
    setSelectedSalon(value)
  }
  const handleViewServices = ()=>{
    router.push(`/services/${selectedSalon.salon_id}`)
  }
  const handleClose=()=>{
    setSelectedSalon()
  }

  return (
    <div className="space-y-4 pb-20">
      {salons.map((salon) => (
        <SalonCard key={salon.salon_id} salon={salon} handleSalonSelect={handleSalonSelect} />
      ))}
      {selectedSalon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute bottom-0 left-0 right-0 z-50">
            <SalonFeedback 
              salon={selectedSalon} 
              onClose={handleClose}
              onViewServices={() => handleViewServices(selectedSalon.salon_id)}
            />
          </div>
        </div>
      )}
    </div> 
  );
}