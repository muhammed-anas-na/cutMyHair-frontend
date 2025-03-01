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

const Home = () => {
  const [isMapView, setIsMapView] = useState(false);
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
      
      {/* Pass location data to child components */}
      {isMapView ? (
        <SalonMap 
        />
      ) : (
        <ListOfSalon 
        />
      )}
      
      <Navigation currentPage={'home'} />
    </div>
    <LocationModal/>
    </>
  );
};

export default Home;