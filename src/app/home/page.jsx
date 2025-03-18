'use client';

import React, { useState, useEffect } from 'react';
import BookingModal from '@/components/BookingModal/page';
import SalonCard from "@/components/SalonCard/page";
import Navigation from "@/components/Navigation/page";
import Header from "@/components/Header/page";
import ToggleSwitch from "@/components/ToggleSwitch/page";
import ListOfSalon from "@/components/ListofSalon/page";
import SalonMap from "@/components/SalonMap/page";
import { useLocation } from '@/context/LocationContext';
import LocationModal from '@/components/LocationModal/page';
import { GET_NEAREST_SALON_FN } from '@/services/userService';

const Home = () => {
  const [isMapView, setIsMapView] = useState(false);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { latitude, longitude, locationText } = useLocation();

  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (latitude && longitude) {
          const response = await GET_NEAREST_SALON_FN(latitude, longitude);
          
          if (response?.data?.data?.salons && Array.isArray(response.data.data.salons)) {
            setSalons(response.data.data.salons);
          } else {
            console.error("Unexpected API response structure:", response);
            setError('Invalid data format received from server.');
          }
        } else {
          // Show location modal if no location is set
          setIsLocationModalOpen(true);
        }
      } catch (err) {
        console.error('Failed to fetch salons:', err);
        setError('Failed to load salons. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSalons();
  }, [latitude, longitude]);

  const handleRetry = () => {
    if (!latitude || !longitude) {
      setIsLocationModalOpen(true);
    } else {
      setLoading(true);
      setError('');
      // Re-fetch salons
      fetchSalons();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="flex-grow">
        <div className="flex justify-between p-4 sm:p-7 max-w-6xl mx-auto">
          <div className="flex flex-col">
            {/* <h1 className="font-bold text-xl">Nearest Salon</h1> */}
          </div>
          <div className="flex gap-2 items-center">
            <h3 className="text-xs md:text-sm font-medium">Map View</h3>
            <ToggleSwitch isOn={isMapView} setIsOn={setIsMapView} />
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto w-full">
          {isMapView ? (
            <SalonMap 
              salons={salons}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
          ) : (
            <ListOfSalon 
              salons={salons}
              loading={loading}
              error={error}
              onRetry={handleRetry}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
            />
          )}
        </div>
      </div>
      
      <Navigation currentPage={'home'} />
      
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
      />
    </div>
  );
};

export default Home;