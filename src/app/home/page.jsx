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
  const { latitude, longitude, locationText } = useLocation();

  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (latitude && longitude) {
          console.log("Finding nearest salons from Home component");
          const response = await GET_NEAREST_SALON_FN(latitude, longitude);
          console.log("API Response:", response);
          
          if (response?.data?.data?.salons && Array.isArray(response.data.data.salons)) {
            console.log("Salons found:", response.data.data.salons.length);
            setSalons(response.data.data.salons);
          } else {
            console.error("Unexpected API response structure:", response);
            setError('Invalid data format received from server.');
          }
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

  return (
    <>
    <div>
      <Header />
      <div className="flex justify-between p-7">
        <div className="flex flex-col">
          <h1 className="font-bold text-xl">Nearest Salon</h1>
        </div>
        <div className="flex gap-2 items-center">
          <h3 className="text-xs">Map View</h3>
          <ToggleSwitch isOn={isMapView} setIsOn={setIsMapView} />
        </div>
      </div>
      
      {/* Pass shared data to child components */}
      {isMapView ? (
        <SalonMap 
          salons={salons}
          loading={loading}
          error={error}
        />
      ) : (
        <ListOfSalon 
          salons={salons}
          loading={loading}
          error={error}
        />
      )}
      
      <Navigation currentPage={'home'} />
    </div>
    <LocationModal/>
    </>
  );
};

export default Home;