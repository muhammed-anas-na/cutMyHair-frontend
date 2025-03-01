"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocationState] = useState({
    latitude: null,
    longitude: null,
    locationName: "",
    locationText: "",
    isLoading: true,
    isLocationSet: false
  });
  
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    const initializeLocation = () => {
      if (typeof window !== "undefined") {
        const latitude = localStorage.getItem("latitude");
        const longitude = localStorage.getItem("longitude");
        const locationName = localStorage.getItem("locationName");
        const locationText = localStorage.getItem("locationText");
        if (latitude && longitude && locationName) {
          setLocationState({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            locationName,
            locationText,
            isLoading: false,
            isLocationSet: true
          });
        } else {
          setLocationState(prev => ({
            ...prev,
            isLoading: false,
            isLocationSet: false
          }));
          setShowLocationModal(true);
        }
      }
    };

    initializeLocation();
  }, []);

  const setLocation = ({ latitude, longitude, locationName, locationText }) => {
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    localStorage.setItem("locationName", locationName);
    localStorage.setItem("locationText" , locationText);
    setLocationState({
      latitude,
      longitude,
      locationName,
      locationText,
      isLoading: false,
      isLocationSet: true
    });
  };

  return (
    <LocationContext.Provider 
      value={{ 
        ...location, 
        setLocation,
        showLocationModal,
        setShowLocationModal
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};