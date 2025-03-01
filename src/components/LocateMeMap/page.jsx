'use client';
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function LocateMeMap({ onLocationSelect }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoicWlmeSIsImEiOiJjbTc2OGlvZ2IwNjNnMm5wejhybXNhbXd3In0.oiEiHV6rkY5IlL6qGJwkRA';
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [77.6380511, 12.9173669],
      zoom: 12,
      minZoom: 8
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });

    mapRef.current.addControl(geolocate);

    // On map load
    mapRef.current.on('load', () => {
      setMapLoaded(true);
      // Trigger geolocation to center map on user's location
      geolocate.trigger();
    });

    // Setup geolocation events
    geolocate.on('geolocate', (e) => {
      const lon = e.coords.longitude;
      const lat = e.coords.latitude;
      const position = [lon, lat];
      
      mapRef.current.flyTo({
        center: position,
        zoom: 15
      });

      // Create initial marker at user's location
      if (!markerRef.current) {
        createMarker(lon, lat);
        
        // Get location information using reverse geocoding and pass to parent
        fetchLocationInfo(lat, lon);
      }
    });

    // Clean up on unmount
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // Create a marker at the specified coordinates
  const createMarker = (lng, lat) => {
    // Remove existing marker if any
    if (markerRef.current) {
      markerRef.current.remove();
    }
    
    // Create custom marker element
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '30px';
    el.style.height = '40px';
    el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 36'%3E%3Cpath d='M12 0C5.38 0 0 5.38 0 12c0 8.88 12 24 12 24s12-15.12 12-24C24 5.38 18.62 0 12 0z' fill='%23CE145B'/%3E%3Ccircle cx='12' cy='12' r='5' fill='white'/%3E%3C/svg%3E")`;
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    
    // Create and add the new marker
    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
  };

  // Fetch location information using reverse geocoding
  const fetchLocationInfo = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const locationData = {
          latitude: lat,
          longitude: lng,
          text: data.features[0].place_name,
          name: data.features[0].text || data.features[0].place_name.split(',')[0].trim()
        };
        
        // Pass location data to parent component
        onLocationSelect(locationData);
      }
    } catch (error) {
      console.error('Error fetching location information:', error);
    }
  };

  // Handle map click to set marker
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      mapRef.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        
        // Create marker at clicked position
        createMarker(lng, lat);
        
        // Get location information using reverse geocoding and pass to parent
        fetchLocationInfo(lat, lng);
      });
    }
  }, [mapLoaded]);

  return (
    <div className="relative w-full mb-4">
      <div 
        id="map-container" 
        ref={mapContainerRef} 
        className="w-full rounded-md border-2 overflow-hidden" 
        style={{ height: '400px' }}
      />
      <div className="text-sm text-gray-500 mt-2">
        Click on the map to set your salon location or use the location button to find your current position.
      </div>
    </div>
  );
}

export default LocateMeMap;