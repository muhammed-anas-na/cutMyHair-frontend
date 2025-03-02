'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { GET_LOCATION_FROM_TEXT_FN, GET_LOCATION_NAME_BY_COORDINATES_FN } from '@/services/userService';

export default function LocationModal() {
  const { showLocationModal, setShowLocationModal, setLocation } = useLocation();
  const [locationInput, setLocationInput] = useState('');
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (locationInput.trim()) {
      const fetchLocations = async () => {
        const response = await GET_LOCATION_FROM_TEXT_FN(locationInput);
        setSuggestedLocations(response.data.locations || []);
      };
      fetchLocations();
    } else {
      setSuggestedLocations([]);
    }
  }, [locationInput]);

  const handleSelectLocation = (location) => {
    
    setLocation({ 
      latitude: location.latitude, 
      longitude: location.longitude, 
      locationName: location.name, 
      locationText: location.text
    });
    setLocationInput('');
    setShowLocationModal(false);
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async(position) => {
          const { latitude, longitude } = position.coords;
          const response = await GET_LOCATION_NAME_BY_COORDINATES_FN(latitude, longitude);
          setLocation({ 
            latitude, 
            longitude, 
            locationName: response.data.locationName,
            locationText: response.data.locationText
          });
          setIsDetectingLocation(false);
          setShowLocationModal(false);
        },
        () => {
          setError('Unable to detect location. Please enter manually.');
          setIsDetectingLocation(false);
        }
      );
    } else {
      setError('Geolocation is not supported. Enter manually.');
      setIsDetectingLocation(false);
    }
  };

  if (!showLocationModal) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={(e) => e.target === e.currentTarget && setShowLocationModal(false)}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowLocationModal(false)}>
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#CE145B]">Set Your Location</h2>
        <p className="text-gray-600 mb-4">To show you the nearest salons, we need your location.</p>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <button className="w-full bg-[#CE145B] hover:bg-[#A81248] text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center mb-4" onClick={handleDetectLocation} disabled={isDetectingLocation}>
          {isDetectingLocation ? 'Detecting...' : 'Use Current Location'}
        </button>
        <div className="flex items-center border rounded-lg overflow-hidden mb-2">
          <input 
            type="text" 
            className="flex-grow p-2 outline-none" 
            placeholder="Enter location manually" 
            value={locationInput} 
            onChange={(e) => setLocationInput(e.target.value)} 
          />
        </div>
        {suggestedLocations.length > 0 && (
          <ul className="max-h-48 overflow-y-auto divide-y rounded-lg border">
            {suggestedLocations.map((location, index) => (
              <li key={index} onClick={() => handleSelectLocation(location)} className="py-2 px-4 cursor-pointer hover:bg-[#FCE4EC]">
                {location.text}<br/>
                <small>{location.name}</small> 
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
