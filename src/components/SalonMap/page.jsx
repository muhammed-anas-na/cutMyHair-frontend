"use client";
import { useRef, useEffect, useState } from 'react';
import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createRoot } from 'react-dom/client';
import CustomMarker from '../CustomMarker/page';
import SalonFeedback from '../SalonReview/page';
import { useRouter } from "next/navigation";
import { useLocation } from '@/context/LocationContext';
import { GET_NEAREST_SALON_FN } from '@/services/userService';

function SalonMap() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { latitude, longitude, locationText } = useLocation();
  const router = useRouter();
  const [markers, setMarkers] = useState([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [userLocationSet, setUserLocationSet] = useState(false);

  // Initialize map first
  useEffect(() => {
    if (!mapContainerRef.current || mapInitialized) return;
    
    console.log("Initializing map");
    mapboxgl.accessToken = 'pk.eyJ1IjoicWlmeSIsImEiOiJjbTc2OGlvZ2IwNjNnMm5wejhybXNhbXd3In0.oiEiHV6rkY5IlL6qGJwkRA';
    
    // Start with default center, we'll zoom to user location after map loads
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [77.6380511, 12.9173669],
      zoom: 13,
      minZoom: 10
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });

    mapRef.current.addControl(geolocate);

    // When map loads, zoom to user location
    mapRef.current.on('load', () => {
      console.log("Map loaded");
      setMapInitialized(true);
      
      // If we already have user location from context, use it
      if (latitude && longitude && !userLocationSet) {
        console.log("Using context location:", latitude, longitude);
        mapRef.current.flyTo({
          center: [longitude, latitude],
          zoom: 15
        });
        setUserLocationSet(true);
      } else {
        // Otherwise try to get location from browser
        console.log("Triggering geolocation");
        geolocate.trigger();
      }
    });

    // When user location is found via GeolocateControl
    geolocate.on('geolocate', (e) => {
      const lon = e.coords.longitude;
      const lat = e.coords.latitude;
      console.log("User location found:", lat, lon);
      
      // Add a user location marker (blue dot)
      new mapboxgl.Marker({
        color: '#0078FF',
        scale: 0.8
      }).setLngLat([lon, lat]).addTo(mapRef.current);
      
      // Fly to user location
      mapRef.current.flyTo({
        center: [lon, lat],
        zoom: 15
      });
      
      setUserLocationSet(true);
    });

    // Clean up function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        setMapInitialized(false);
        setUserLocationSet(false);
      }
    };
  }, [mapContainerRef.current]);

  // Fly to user location when latitude/longitude changes in context
  useEffect(() => {
    if (!mapRef.current || !mapInitialized || !latitude || !longitude) return;
    
    if (!userLocationSet) {
      console.log("Location context updated, flying to:", latitude, longitude);
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15
      });
      setUserLocationSet(true);
      
      // Add a user location marker
      new mapboxgl.Marker({
        color: '#0078FF',
        scale: 0.8
      }).setLngLat([longitude, latitude]).addTo(mapRef.current);
    }
  }, [latitude, longitude, mapInitialized]);

  // Fetch salons data
  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (latitude && longitude) {
          console.log("Finding nearest salons for map");
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
        console.error('Failed to fetch salons for map:', err);
        setError('Failed to load salons. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [latitude, longitude]);

  // Function to get coordinates from a salon object
  const getSalonCoordinates = (salon) => {
    // First, check if coordinates are in location.coordinates format (from API)
    if (salon.location?.coordinates && 
        Array.isArray(salon.location.coordinates) && 
        salon.location.coordinates.length >= 2) {
      // GeoJSON format is [longitude, latitude]
      return {
        lng: salon.location.coordinates[0],
        lat: salon.location.coordinates[1]
      };
    }
    
    // Fallback to direct latitude/longitude properties
    return {
      lng: salon.longitude || salon.lng,
      lat: salon.latitude || salon.lat
    };
  };

  // Add salon markers when salon data is loaded and map is ready
  useEffect(() => {
    if (!mapRef.current || !mapInitialized || salons.length === 0) {
      console.log("Not adding markers yet:", { 
        mapExists: !!mapRef.current, 
        mapInitialized, 
        salonCount: salons.length 
      });
      return;
    }

    console.log("Adding markers for", salons.length, "salons");

    // Remove existing markers
    markers.forEach(marker => marker.remove());
    
    const newMarkers = [];
    const validSalonsCount = {total: 0, valid: 0};

    // Add new markers
    salons.forEach((salon) => {
      validSalonsCount.total++;
      
      const coordinates = getSalonCoordinates(salon);
      
      if (!coordinates.lng || !coordinates.lat) {
        console.warn(`Salon "${salon.name}" missing coordinates:`, coordinates);
        return;
      }
      
      validSalonsCount.valid++;
      console.log("Creating marker for:", salon.name, "at", coordinates.lat, coordinates.lng);
      
      const markerContainer = document.createElement('div');
      const root = createRoot(markerContainer);
      
      // Add click handler to container
      markerContainer.addEventListener('click', () => {
        setSelectedSalon(salon);
      });

      root.render(
        <CustomMarker
          name={salon.name}
          photo={salon.profile_image || salon.photo}
        />
      );

      try {
        const marker = new mapboxgl.Marker(markerContainer, {
          anchor: 'bottom',
          offset: [0, -5]
        }).setLngLat([coordinates.lng, coordinates.lat]).addTo(mapRef.current);

        newMarkers.push(marker);
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });

    setMarkers(newMarkers);
    console.log(`Added ${newMarkers.length} markers. Valid salons: ${validSalonsCount.valid}/${validSalonsCount.total}`);

    // Center the view to include all markers and user location
    if (newMarkers.length > 0 && userLocationSet) {
      // Create a bounds object
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add user location to bounds
      if (latitude && longitude) {
        bounds.extend([longitude, latitude]);
      }
      
      // Add all salon locations to bounds
      salons.forEach(salon => {
        const coordinates = getSalonCoordinates(salon);
        if (coordinates.lng && coordinates.lat) {
          bounds.extend([coordinates.lng, coordinates.lat]);
        }
      });
      
      // Fit the map to the bounds with padding
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [salons, mapInitialized, userLocationSet]);

  const handleViewServices = (salonId) => {
    router.push(`/services/${salonId}`);
  };

  const handleClose = () => {
    setSelectedSalon(null);
  };

  if (loading && !mapInitialized) {
    return (
      <div className="flex justify-center items-center p-10" style={{ height: '500px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CE145B]"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {error && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-red-100 p-2 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            className="mt-1 bg-[#CE145B] text-white px-2 py-1 rounded-lg text-sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {latitude == null && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-yellow-100 p-2 text-center">
          <p>Please set your location to see nearby salons.</p>
        </div>
      )}

      {salons.length === 0 && !loading && !error && latitude != null && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-yellow-100 p-2 text-center">
          <p>No salons found in your area.</p>
        </div>
      )}

      {markers.length === 0 && salons.length > 0 && !loading && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-yellow-100 p-2 text-center">
          <p>Found salons but couldn't display them on the map. Please try again later.</p>
        </div>
      )}

      <div id='map-container' ref={mapContainerRef} style={{ height: '500px' }}/>
      
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

export default SalonMap;