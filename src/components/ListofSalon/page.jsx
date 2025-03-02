'use client';

import { useLocation } from '@/context/LocationContext';
import SalonCard from "../SalonCard/page";
import SalonFeedback from '../SalonReview/page';
import { useState } from 'react';
import { useRouter } from "next/navigation";
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
      <div className="p-5 text-center">
        <p>No salons found near {locationText}.</p>
      </div>
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