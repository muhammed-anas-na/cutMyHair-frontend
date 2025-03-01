'use client';

// src/context/SalonContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SalonContext = createContext(null);

export const SalonProvider = ({ children }) => {
  const [salonState, setSalonState] = useState({
    salon_id: null,
    isLoading: true
  });
  
  const { isAuthenticated } = useAuth();

  // Initialize salon state from storage on mount
  useEffect(() => {
    const initializeSalon = () => {
      // Only proceed if the user is authenticated
      if (isAuthenticated && typeof window !== 'undefined') {
        const salon_id = localStorage.getItem('salon_id');
        
        if (salon_id) {
          setSalonState({
            salon_id,
            isLoading: false
          });
        } else {
          setSalonState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeSalon();
  }, [isAuthenticated]);

  // Function to set the salon ID
  const setSalonId = (salon_id) => {
    // Store in localStorage for persistence
    localStorage.setItem('salon_id', salon_id);
    
    setSalonState({
      salon_id,
      isLoading: false
    });
  };

  // Function to clear the salon ID
  const clearSalonId = () => {
    // Remove from localStorage
    localStorage.removeItem('salon_id');
    
    setSalonState({
      salon_id: null,
      isLoading: false
    });
  };

  return (
    <SalonContext.Provider value={{ 
      salon_id: salonState.salon_id, 
      isLoading: salonState.isLoading,
      setSalonId,
      clearSalonId
    }}>
      {children}
    </SalonContext.Provider>
  );
};

// Custom hook for easy context usage
export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};