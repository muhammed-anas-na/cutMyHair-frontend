'use client';
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useSalon } from '@/context/SalonContext';
import { useRouter } from 'next/navigation';
import { UPDATE_WORKING_HOUR_FN } from '@/services/ownerService';

// Card Components
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className || ''}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`px-4 py-4 sm:px-6 border-b ${className || ''}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-lg sm:text-xl font-semibold ${className || ''}`}>
    {children}
  </h2>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 sm:p-6 ${className || ''}`}>
    {children}
  </div>
);

const TimeInput = ({ value, onChange, placeholder }) => (
  <div className="relative flex-1 min-w-[120px]">
    <input
      type="time"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 pr-8 rounded-lg border border-gray-200 focus:outline-none focus:border-[#CE145B] text-sm sm:text-base"
    />
  </div>
);

const WorkingHours = () => {
  const router = useRouter();
  const { salon_id } = useSalon();

  const [timeSlots, setTimeSlots] = useState({
    Monday: { start: '09:00', end: '18:00' },
    Tuesday: { start: '09:00', end: '18:00' },
    Wednesday: { start: '09:00', end: '18:00' },
    Thursday: { start: '09:00', end: '18:00' },
    Friday: { start: '09:00', end: '18:00' },
    Saturday: { start: '09:00', end: '16:00' },
    Sunday: { start: '', end: '' }
  });

  const handleTimeChange = (day, type, value) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: value }
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await UPDATE_WORKING_HOUR_FN(salon_id, timeSlots);
      if (response.status === 200) {
        router.replace(`/owner/success?message=Completed%20Successfully&redirect=/owner/dashboard`);
      }
    } catch (err) {
      console.error('Error updating working hours:', err);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">
            What are your <span className="text-[#CE145B]">working</span>
            <br /> hours?
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Working Hours</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(timeSlots).map(([day, times]) => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-medium w-full sm:w-32">{day}</span>
                  <div className="flex flex-1 items-center gap-2 sm:gap-3">
                    <TimeInput
                      value={times.start}
                      onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                      placeholder="Start time"
                    />
                    <span className="text-gray-500 px-1">to</span>
                    <TimeInput
                      value={times.end}
                      onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                      placeholder="End time"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <button 
          onClick={handleSubmit}
          className="w-full mt-6 p-3 sm:p-4 rounded-xl bg-[#CE145B] text-white font-semibold hover:bg-opacity-90 transition-colors text-sm sm:text-base"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default WorkingHours;
