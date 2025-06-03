'use client';

import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingModal from '@/components/BookingModal/page';
import SalonCard from '@/components/SalonCard/page';
import Navigation from '@/components/Navigation/page';
import Header from '@/components/Header/page';
import ToggleSwitch from '@/components/ToggleSwitch/page';
import ListOfSalon from '@/components/ListofSalon/page';
import SalonMap from '@/components/SalonMap/page';
import { useLocation } from '@/context/LocationContext';
import LocationModal from '@/components/LocationModal/page';
import { GET_NEAREST_SALON_FN } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/LandingPage/Footer/page';

const HomeContent = () => {
  const [isMapView, setIsMapView] = useState(false);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const { latitude, longitude, locationText } = useLocation();
  const { user_id } = useAuth();
  const searchParams = useSearchParams(); // Directly use the hook
  const view = searchParams.get('view'); // Get 'view' query param

  // Handle initial map view based on URL query param
  useEffect(() => {
    if (view === 'map') {
      setIsMapView(true);
    } else {
      setIsMapView(false); // Optional: Reset to list view for other values
    }
  }, [view]);

  // Fetch salons based on location
  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      setError('');
      try {
        if (latitude && longitude) {
          const response = await GET_NEAREST_SALON_FN(latitude, longitude, user_id);
          if (response?.data?.data?.salons && Array.isArray(response.data.data.salons)) {
            setSalons(response.data.data.salons);
            if (response.data.data?.favorites) {
              setFavorites(response.data.data?.favorites);
            }
          } else {
            console.error('Unexpected API response structure:', response);
            setError('Invalid data format received from server.');
          }
        } else {
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
  }, [latitude, longitude, user_id]);

  const handleRetry = () => {
    if (!latitude || !longitude) {
      setIsLocationModalOpen(true);
    } else {
      setLoading(true);
      setError('');
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
            <SalonMap salons={salons} loading={loading} error={error} onRetry={handleRetry} />
          ) : (
            <ListOfSalon
              favorites={favorites}
              salons={salons}
              loading={loading}
              error={error}
              onRetry={handleRetry}
              onOpenLocationModal={
               
                () => {
                  setIsLocationModalOpen(true)}
              }
            />
          )}
        </div>
      </div>
      <Navigation currentPage={'home'} />
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
      <Footer />
    </div>
  );
};

const Home = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
};

export default Home;