// SalonDetails.jsx (Main Component)
'use client';
import React, { useEffect, useState } from 'react';
import { FETCH_SALON_DETAILS_BY_ID_FN } from '@/services/ownerService';

import SalonHeader from './SalonHeader';
import ServicesTab from './ServiceTabs';
import SalonDetailsTab from './SalonDetailsTab';
import PhotosTab from './photos';
import EmployeesTab from './employees';
import DeleteConfirmModal from './DeleteModal';
import SalonTabs from './SalonTabs';

const SalonDetails = ({ salon_id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(true);
  const [salonData, setSalonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (salon_id) => {
      setIsLoading(true);
      try {
        const response = await FETCH_SALON_DETAILS_BY_ID_FN(salon_id);
        if (response?.data?.data) {
          const salon = response.data.data;
          const formattedHours = {};
          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          days.forEach(day => {
            const dayData = salon.working_hours[day];
            if (dayData.isOpen) {
              const startTime = dayData.start ? dayData.start.split('T')[1].slice(0, 5) : 'closed';
              const endTime = dayData.end ? dayData.end.split('T')[1].slice(0, 5) : 'closed';
              formattedHours[day.substring(0, 3)] = { open: startTime, close: endTime };
            } else {
              formattedHours[day.substring(0, 3)] = { open: 'closed', close: 'closed' };
            }
          });
          const formattedSalon = {
            salon_id: salon.salon_id,
            name: salon.name,
            location: salon.location_text || salon.address || '',
            phone: salon.contact_phone || '',
            email: salon.email || '',
            seats: salon.number_of_seats || 0,
            openingHours: formattedHours,
            photos: salon.images,
            employees: salon.employees || [],
            rating: salon.rating || 0,
            services: salon.services,
            categories: salon.categories || [],
          };
          setSalonData(formattedSalon);
        } else {
          setError('Failed to load salon data');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching salon data');
      } finally {
        setIsLoading(false);
      }
    };
    if (salon_id) fetchData(salon_id);
  }, [salon_id]);

  const handleSave = async () => {
    setIsEditing(false);
  };

  const handleDelete = () => setShowDeleteConfirm(true);
  const handleDeleteConfirm = async () => setShowDeleteConfirm(false);

  if (isLoading) return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-10">
      <div className="flex justify-center items-center min-h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#CE145B] mr-3"></div>
        <span className="text-gray-600">Loading salon details...</span>
      </div>
    </div>
  );
  
  if (error || !salonData) return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error || 'Could not load salon details'}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 py-4 sm:py-5">
      <SalonHeader 
        salonData={salonData} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
        handleSave={handleSave} 
        handleDelete={handleDelete} 
        setSalonData={setSalonData} 
      />
      
      <SalonTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-4 sm:mt-6">
        {activeTab === 'details' && 
          <SalonDetailsTab 
            salonData={salonData} 
            isEditing={isEditing} 
            setSalonData={setSalonData} 
          />
        }
        
        {activeTab === 'services' && 
          <ServicesTab 
            salonData={salonData} 
            setSalonData={setSalonData} 
            isEditing={isEditing} 
          />
        }
        
        {activeTab === 'employees' && 
          <EmployeesTab 
            salonData={salonData} 
            isEditing={isEditing} 
          />
        }
        
        {activeTab === 'photos' && 
          <PhotosTab 
            salonData={salonData} 
            isEditing={isEditing} 
          />
        }
      </div>
      
      <DeleteConfirmModal 
        salonData={salonData} 
        showDeleteConfirm={showDeleteConfirm} 
        setShowDeleteConfirm={setShowDeleteConfirm} 
        handleDeleteConfirm={handleDeleteConfirm} 
      />
    </div>
  );
};

export default SalonDetails;