'use client';

import { useState, useEffect } from 'react';
import SalonCard from "../SalonCard/page";
import { useLocation } from '@/context/LocationContext';
import { GET_NEAREST_SALON_FN } from '@/services/userService';
// import { GET_NEARBY_SALONS_FN } from '@/services/salonService';

export default function ListOfSalon() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { latitude, longitude, locationText } = useLocation();

  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      setError('');
      console.log(latitude, longitude)
      try {
        let response;
  
        if (latitude && longitude) {
          console.log("Finding nearest salon")
          response = await GET_NEAREST_SALON_FN(latitude,longitude);
          setSalons(response.data.data.salons);
        } else {
          // response = await GET_TOP_RATED_SALON_FN();
        }
        console.log(response);
  
        // setSalons(response?.data?.salons || []);
      } catch (err) {
        console.error('Failed to fetch salons:', err);
        setError('Failed to load salons. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSalons();
  }, [latitude, longitude]);
  

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

  if (salons.length === 0) {
    return (
      <div className="p-5 text-center">
        <p>No salons found near {locationText}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {salons.map((salon) => (
        <SalonCard key={salon.salon_id} salon={salon} />
      ))}
    </div>
  );
}