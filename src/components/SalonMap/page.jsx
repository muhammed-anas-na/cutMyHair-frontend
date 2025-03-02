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

function SalonMap({ salons, loading, error }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const { latitude, longitude, locationText } = useLocation();
  const router = useRouter();
  const [markers, setMarkers] = useState([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [userLocationSet, setUserLocationSet] = useState(false);
  const rootsRef = useRef([]);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    console.log("Initializing map");
    mapboxgl.accessToken = 'pk.eyJ1IjoicWlmeSIsImEiOiJjbTc2OGlvZ2IwNjNnMm5wejhybXNhbXd3In0.oiEiHV6rkY5IlL6qGJwkRA';
    
    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [77.6380511, 12.9173669],
        zoom: 13,
        minZoom: 10
      });
      
      mapRef.current = map;
  
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: false,
      });
  
      map.addControl(geolocate);
  
      // When map loads, zoom to user location
      map.on('load', () => {
        console.log("Map loaded, mapRef exists:", !!mapRef.current);
        setMapInitialized(true);
        
        // If we already have user location from context, use it
        if (latitude && longitude && !userLocationSet) {
          console.log("Using context location:", latitude, longitude);
          map.flyTo({
            center: [longitude, latitude],
            zoom: 15
          });
          setUserLocationSet(true);
          
          // We've removed the user location marker code from here
        } else {
          // Otherwise try to get location from browser
          console.log("Triggering geolocation");
          geolocate.trigger();
        }
        
        // Add salon markers immediately after map is loaded
        addSalonMarkers();
      });
  
      // When user location is found via GeolocateControl
      geolocate.on('geolocate', (e) => {
        const lon = e.coords.longitude;
        const lat = e.coords.latitude;
        console.log("User location found:", lat, lon);
        
        // We've removed the user location marker code from here
        
        // Fly to user location
        map.flyTo({
          center: [lon, lat],
          zoom: 15
        });
        
        setUserLocationSet(true);
        
        // Add salon markers after user location is set
        addSalonMarkers();
      });
    } catch (err) {
      console.error("Error initializing map:", err);
    }

    // Clean up function
    return () => {
      if (mapRef.current) {
        // Clean up all roots
        rootsRef.current.forEach(root => {
          try {
            root.unmount();
          } catch (e) {
            console.error("Error unmounting root:", e);
          }
        });
        rootsRef.current = [];
        
        // Clean up markers
        markers.forEach(marker => {
          try {
            marker.remove();
          } catch (e) {
            console.error("Error removing marker:", e);
          }
        });
        
        // Remove map
        mapRef.current.remove();
        mapRef.current = null;
        setMapInitialized(false);
        setUserLocationSet(false);
      }
    };
  }, [mapContainerRef.current]); // Only run once when component mounts


  const addSalonMarkers = () => {
    if (!mapRef.current || !salons || !salons.length) {
      console.log("Cannot add markers:", { 
        mapExists: !!mapRef.current, 
        salonsExist: !!salons, 
        salonCount: salons?.length || 0 
      });
      return;
    }

    console.log("Adding markers for", salons.length, "salons");

    // Remove existing markers and clean up React roots
    markers.forEach(marker => {
      try {
        marker.remove();
      } catch (e) {
        console.error("Error removing marker:", e);
      }
    });
    
    rootsRef.current.forEach(root => {
      try {
        root.unmount();
      } catch (e) {
        console.error("Error unmounting root:", e);
      }
    });
    rootsRef.current = [];
    
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
      
      try {
        // Create a DOM element
        const el = document.createElement('div');
        el.className = 'mapboxgl-marker salon-marker';
        
        // Important: Append to document body to ensure element is in DOM
        document.body.appendChild(el);
        
        // Create a React root
        const root = createRoot(el);
        rootsRef.current.push(root);
        
        // Render the custom marker component
        root.render(
          <CustomMarker
            name={salon.name}
            photo={salon.images[0]}
          />
        );
        
        // Create the marker with the element
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom'
        }).setLngLat([coordinates.lng, coordinates.lat]);
        
        // Add click event listener
        el.addEventListener('click', () => {
          setSelectedSalon(salon);
        });
        
        // Add to map
        marker.addTo(mapRef.current);
        newMarkers.push(marker);
      } catch (error) {
        console.error("Error adding marker for salon:", salon.name, error);
      }
    });

    setMarkers(newMarkers);
    console.log(`Added ${newMarkers.length} markers. Valid salons: ${validSalonsCount.valid}/${validSalonsCount.total}`);

    // Center the view to include all markers and user location
    if (newMarkers.length > 0) {
      try {
        // Create a bounds object
        const bounds = new mapboxgl.LngLatBounds();
        
        // Add user location to bounds (we still want to include user location in the bounds)
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
        if (!bounds.isEmpty() && mapRef.current) {
          mapRef.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        }
      } catch (error) {
        console.error("Error setting map bounds:", error);
      }
    }
  };

  // Fly to user location when latitude/longitude changes in context
  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;
    
    if (!userLocationSet) {
      console.log("Location context updated, flying to:", latitude, longitude);
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15
      });
      setUserLocationSet(true);
      
      // We've removed the user location marker code from here
      
      // Try adding markers after location is set
      addSalonMarkers();
    }
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

  // Add salon markers when salon data is loaded or changes
  useEffect(() => {
    if (mapRef.current && mapInitialized && salons?.length > 0) {
      console.log("Salons data updated, adding markers");
      addSalonMarkers();
    }
  }, [salons, mapInitialized]);

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

      {salons?.length === 0 && !loading && !error && latitude != null && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-yellow-100 p-2 text-center">
          <p>No salons found in your area.</p>
        </div>
      )}

      {markers.length === 0 && salons?.length > 0 && !loading && mapInitialized && (
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