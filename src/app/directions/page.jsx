'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Navigation, Phone, Share2, Star, Clock, MapPin, ChevronDown } from 'lucide-react';
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

  // Get latitude and longitude from URL params
  const salonLatitude = searchParams.get('latitude');
  const salonLongitude = searchParams.get('longitude');
  const salonName = searchParams.get('name') || '';
  const locationText = searchParams.get('locationText') || '';
  const rating = searchParams.get('rating') || '';

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

      const salonMarker = new mapboxgl.Marker({ color: '#CE145B' })
        .setLngLat(salonLocation)
        .addTo(map);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [position.coords.longitude, position.coords.latitude];
          setUserLocation(userCoords);

          new mapboxgl.Marker({ color: '#3887be' })
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
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
        map.getSource('route').setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        });
      }

      const bounds = new mapboxgl.LngLatBounds();
      route.forEach((point) => bounds.extend(point));

      map.fitBounds(bounds, { padding: 70, maxZoom: 15 });
    } catch (err) {
      console.error('Error getting directions:', err);
      setError('Could not get directions to the salon. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <Link href="/home">
            <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </div>
          </Link>
          <h1 className="text-xl font-semibold">Directions to {salonName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-grow">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-50 z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CE145B]"></div>
          </div>
        )}
        {error && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-red-100 p-3 text-center">
            <p className="text-red-600">{error}</p>
            <button
              className="mt-2 bg-[#CE145B] text-white px-3 py-1 rounded-lg text-sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Bottom panel */}
      <div className="bg-white rounded-t-2xl shadow-lg z-10 transition-all duration-300 ease-in-out">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Estimated arrival</div>
              <div className="font-semibold text-lg">
                {routeDetails ? formatDuration(routeDetails.duration) : 'Calculating...'}
                {routeDetails ? ` (${formatDistance(routeDetails.distance)})` : ''}
              </div>
            </div>
            <button
              className="bg-[#CE145B] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
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
              Navigate
            </button>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <div className="bg-pink-100 rounded-lg p-2 flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#CE145B]" />
            </div>
            <div>
              <h3 className="font-medium">{salonName}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{rating}</span>
                <span className="mx-1">•</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{locationText}</p>
            </div>
          </div>
        </div>

        <div className="p-3">
          <button
            className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setExpandDirections(!expandDirections)}
          >
            <span className="font-medium">Turn-by-turn directions</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${expandDirections ? 'transform rotate-180' : ''}`}
            />
          </button>
          {expandDirections && routeDetails && (
            <div className="mt-2 space-y-3 max-h-60 overflow-y-auto px-2">
              {routeDetails.steps.map((step, index) => (
                <div key={index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: step.maneuver.instruction }} />
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDistance(step.distance)} • {formatDuration(step.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 pt-2 flex gap-3">
          <button
            onClick={() => {
              window.location.href = 'tel:+1234567890';
            }}
            className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Call Salon
          </button>
          <button
            className="flex-1 bg-[#CE145B] text-white rounded-lg py-3 font-medium hover:bg-pink-700 transition-colors"
            onClick={() => window.history.back()}
          >
            Back to Booking
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrap the content in Suspense
export default function Directions() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading directions...</div>}>
      <DirectionsContent />
    </Suspense>
  );
}