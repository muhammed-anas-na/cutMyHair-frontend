'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Navigation, Phone, Share2, Star, Clock, MapPin, ChevronDown, Info, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Suspense } from 'react';

// Separate the content that uses useSearchParams into its own component
const DirectionsContent = () => {
  const searchParams = useSearchParams();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [expandDirections, setExpandDirections] = useState(false);
  const transportMode = 'driving';
  const [isCallMenuOpen, setIsCallMenuOpen] = useState(false);

  // Get latitude and longitude from URL params
  const salonLatitude = searchParams.get('latitude');
  const salonLongitude = searchParams.get('longitude');
  const salonName = searchParams.get('name') || 'Salon';
  const locationText = searchParams.get('locationText') || '';
  const rating = searchParams.get('rating') || '4.5';
  const contactPhone = searchParams.get('phone') || '';

  // Format duration from seconds to minutes/hours
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes > 0 ? remainingMinutes + ' min' : ''}`;
  };

  // Format distance from meters to km
  const formatDistance = (meters) => {
    if (!meters) return '';
    if (meters < 1000) return `${meters.toFixed(0)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };



  // Initialize map when component mounts
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoicWlmeSIsImEiOiJjbTc2OGlvZ2IwNjNnMm5wejhybXNhbXd3In0.oiEiHV6rkY5IlL6qGJwkRA';

    if (!salonLatitude || !salonLongitude) {
      setError('Salon location information is missing');
      setLoading(false);
      return;
    }

    const salonLocation = [parseFloat(salonLongitude), parseFloat(salonLatitude)];

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: salonLocation,
        zoom: 14,
        minZoom: 10,
      });

      mapRef.current = map;

      // Create a custom marker element for the salon
      const salonMarkerEl = document.createElement('div');
      salonMarkerEl.className = 'salon-marker';
      salonMarkerEl.innerHTML = `
        <div class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center relative">
          <div class="absolute -top-8 bg-white px-2 py-1 rounded-lg shadow-md text-xs font-medium whitespace-nowrap">
            ${salonName}
          </div>
          <MapPin class="w-4 h-4 text-white" />
        </div>
      `;

      const salonMarker = new mapboxgl.Marker({ element: salonMarkerEl, anchor: 'bottom' })
        .setLngLat(salonLocation)
        .addTo(map);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [position.coords.longitude, position.coords.latitude];
          setUserLocation(userCoords);

          // Custom marker for user location
          const userMarkerEl = document.createElement('div');
          userMarkerEl.className = 'user-marker';
          userMarkerEl.innerHTML = `
            <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
          `;

          new mapboxgl.Marker({ element: userMarkerEl })
            .setLngLat(userCoords)
            .addTo(map);

          getRoute(map, userCoords, salonLocation);
        },
        (err) => {
          console.error('Error getting user location:', err);
          setError('Could not access your location. Please enable location services.');
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );

      map.on('load', () => setLoading(false));
      
      // Add zoom and rotation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to load the map. Please try again later.');
      setLoading(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [salonLatitude, salonLongitude]);

  // Get route between user location and salon
  const getRoute = async (map, start, end) => {
    try {
      setLoading(true);
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );

      const json = await query.json();

      if (!json.routes || json.routes.length === 0) {
        throw new Error('No routes found');
      }

      const data = json.routes[0];
      const route = data.geometry.coordinates;

      setRouteDetails({
        duration: data.duration,
        distance: data.distance,
        steps: data.legs[0].steps,
      });

      // Add the route source and layer if they don't exist yet
      if (!map.getSource('route')) {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route,
            },
          },
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#CE145B',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        });
      } else {
        // Update the existing route
        map.getSource('route').setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        });
      }

      // Fit the map to the route
      const bounds = new mapboxgl.LngLatBounds();
      route.forEach((point) => bounds.extend(point));

      map.fitBounds(bounds, { padding: 70, maxZoom: 15 });
      setLoading(false);
    } catch (err) {
      console.error('Error getting directions:', err);
      setError('Could not get directions to the salon. Please try again later.');
      setLoading(false);
    }
  };



  // Share location function
  const shareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: `Directions to ${salonName}`,
        text: `Check out ${salonName} at ${locationText}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${salonName} is located at ${locationText}. Get directions: ${window.location.href}`)
        .then(() => {
          alert('Location link copied to clipboard!');
        })
        .catch(err => console.error('Error copying to clipboard:', err));
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-white max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold truncate max-w-xs">
            {salonName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={shareLocation}
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-grow">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-50/80 backdrop-blur-sm z-20">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
              <p className="text-gray-600 font-medium">Finding the best route...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-red-100 p-4 m-4 rounded-lg shadow-md">
            <div className="flex gap-3 items-start">
              <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium mb-2">{error}</p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
              <button 
                className="ml-auto p-1 hover:bg-red-200 rounded-full"
                onClick={() => setError(null)}
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Bottom panel with salon details and directions */}
      <div className="bg-white rounded-t-2xl shadow-lg z-10 transition-all duration-300 ease-in-out border-t border-gray-200">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Estimated arrival</div>
              <div className="font-semibold text-lg flex items-center">
                {routeDetails ? formatDuration(routeDetails.duration) : 'Calculating...'}
                {routeDetails && (
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    ({formatDistance(routeDetails.distance)})
                  </span>
                )}
              </div>
            </div>
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-pink-600 transition-colors"
              onClick={() => {
                if (userLocation && salonLatitude && salonLongitude) {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&origin=${userLocation[1]},${userLocation[0]}&destination=${salonLatitude},${salonLongitude}&travelmode=driving`,
                    '_blank'
                  );
                }
              }}
            >
              <Navigation className="w-4 h-4" />
              Google Maps
            </button>
          </div>
          
          <div className="mt-4 flex items-start gap-3">
            <div className="bg-pink-100 rounded-lg p-2 flex-shrink-0">
              <MapPin className="w-5 h-5 text-pink-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-gray-900">{salonName}</h3>
              {rating && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{rating}</span>
                  <span className="mx-1">•</span>
                  <span className="text-pink-500">Salon</span>
                </div>
              )}
              <p className="text-sm text-gray-600 mt-1 break-words">{locationText}</p>
            </div>
          </div>
        </div>

        {/* Turn-by-turn directions */}
        <div className="px-4 pt-2 pb-1">
          <button
            className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setExpandDirections(!expandDirections)}
          >
            <span className="font-medium text-gray-800">Turn-by-turn directions</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${expandDirections ? 'transform rotate-180' : ''}`}
            />
          </button>
          
          {expandDirections && routeDetails && (
            <div className="mt-2 space-y-3 max-h-60 overflow-y-auto px-2 pb-3 custom-scrollbar">
              {routeDetails.steps.map((step, index) => (
                <div key={index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: step.maneuver.instruction }} />
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span>{formatDistance(step.distance)}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{formatDuration(step.duration)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="p-4 pt-2 flex gap-3 relative">
          <button
            onClick={() => setIsCallMenuOpen(!isCallMenuOpen)}
            className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 relative"
          >
            <Phone className="w-5 h-5" />
            Call Salon
          </button>
          
          {isCallMenuOpen && contactPhone && (
            <div className="absolute left-0 bottom-full mb-2 w-full bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-20">
              <div className="p-3 mb-2 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">Salon contact</p>
                <p className="font-medium text-lg">{contactPhone}</p>
              </div>
              <div className="flex gap-2">
                <a 
                  href={`tel:${contactPhone}`}
                  className="flex-1 bg-pink-500 text-white py-2 rounded-lg font-medium text-center hover:bg-pink-600 transition-colors"
                >
                  Call
                </a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(contactPhone);
                    alert('Phone number copied!');
                    setIsCallMenuOpen(false);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>
          )}
          
          <Link
            href="/bookings"
            className="flex-1 bg-pink-500 text-white rounded-lg py-3 font-medium hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5" />
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

// Wrap the content in Suspense
export default function Directions() {
  return (
    <div className="mx-auto max-w-screen-lg px-0 md:px-4 lg:px-6 h-screen relative">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-600 ml-3">Loading directions...</p>
        </div>
      }>
        <DirectionsContent />
      </Suspense>
    </div>
  );
}