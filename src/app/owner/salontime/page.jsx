'use client';
import React, { useState } from 'react';
import { Clock, Copy, Info, X, ChevronDown, ChevronUp, Check } from 'lucide-react';
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
  <div className={`px-4 py-3 sm:px-5 sm:py-4 border-b ${className || ''}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-base sm:text-lg font-semibold ${className || ''}`}>
    {children}
  </h2>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 sm:p-6 ${className || ''}`}>
    {children}
  </div>
);

const TimeInput = ({ value, onChange, placeholder, disabled }) => (
  <div className="relative flex-1 min-w-[90px]">
    <input
      type="time"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full p-2 rounded-lg border text-sm
        ${disabled 
          ? 'bg-gray-100 border-gray-200 text-gray-500' 
          : 'border-gray-200 focus:outline-none focus:border-[#CE145B] focus:ring-1 focus:ring-[#CE145B]'
        }`}
    />
  </div>
);

const DayStatus = ({ isOpen, onToggle, disabled }) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors min-w-[62px]
      ${isOpen 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
  >
    {isOpen ? 'Open' : 'Closed'}
  </button>
);

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-4 left-4 right-4 z-50">
    <div className="bg-green-50 text-green-800 rounded-lg shadow-lg px-4 py-3 flex items-center justify-between border border-green-200 max-w-sm mx-auto">
      <div className="flex items-center gap-2">
        <Check size={16} className="text-green-600" />
        <span className="text-sm">{message}</span>
      </div>
      <button onClick={onClose} className="text-green-600 hover:text-green-800">
        <X size={16} />
      </button>
    </div>
  </div>
);

const DayRow = ({ day, times, onToggle, onChange, isExpanded, onExpand }) => (
  <div className="border-b border-gray-100 last:border-b-0">
    <div 
      className="p-3 flex items-center justify-between cursor-pointer"
      onClick={onExpand}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-800 text-sm">{day}</span>
        {times.isOpen && (
          <span className="text-xs text-gray-500 hidden sm:inline-block">
            {times.start} - {times.end}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DayStatus 
          isOpen={times.isOpen}
          onToggle={(e) => {
            e.stopPropagation();
            onToggle(day);
          }}
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </div>
    
    {isExpanded && times.isOpen && (
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
          <TimeInput
            value={times.start}
            onChange={(e) => onChange(day, 'start', e.target.value)}
            placeholder="Start"
            disabled={!times.isOpen}
          />
          <span className="text-gray-400 flex-shrink-0">to</span>
          <TimeInput
            value={times.end}
            onChange={(e) => onChange(day, 'end', e.target.value)}
            placeholder="End"
            disabled={!times.isOpen}
          />
        </div>
      </div>
    )}
  </div>
);

const WorkingHours = () => {
  const router = useRouter();
  const { salon_id } = useSalon();
  const [toast, setToast] = useState({ show: false, message: '' });
  const [expandedDay, setExpandedDay] = useState('Monday');

  const [timeSlots, setTimeSlots] = useState({
    Monday: { start: '09:00', end: '18:00', isOpen: true },
    Tuesday: { start: '09:00', end: '18:00', isOpen: true },
    Wednesday: { start: '09:00', end: '18:00', isOpen: true },
    Thursday: { start: '', end: '', isOpen: false },
    Friday: { start: '09:00', end: '18:00', isOpen: true },
    Saturday: { start: '09:00', end: '16:00', isOpen: true },
    Sunday: { start: '09:00', end: '16:00', isOpen: true }
  });

  const handleTimeChange = (day, type, value) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: value }
    }));
  };

  const toggleDayStatus = (day) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: { 
        ...prev[day], 
        isOpen: !prev[day].isOpen,
        start: !prev[day].isOpen ? prev[day].start || '09:00' : prev[day].start,
        end: !prev[day].isOpen ? prev[day].end || '18:00' : prev[day].end
      }
    }));
  };

  const applyMondayToAll = () => {
    const monday = timeSlots.Monday;
    const updatedTimeSlots = {};
    
    Object.keys(timeSlots).forEach(day => {
      updatedTimeSlots[day] = { ...monday };
    });
    
    setTimeSlots(updatedTimeSlots);
    showToast('Applied Monday hours to all days');
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleSubmit = async () => {
    try {
      // Convert to the format needed by the API
      const apiTimeSlots = {};
      Object.entries(timeSlots).forEach(([day, times]) => {
        apiTimeSlots[day] = times.isOpen ? { start: times.start, end: times.end } : { start: '', end: '' };
      });
      
      const response = await UPDATE_WORKING_HOUR_FN(salon_id, apiTimeSlots);
      if (response.status === 200) {
        router.replace(`/owner/success?message=Working%20Hours%20Updated%20Successfully&redirect=/owner/dashboard?from=register`);
      }
    } catch (err) {
      console.error('Error updating working hours:', err);
      showToast('Error updating working hours. Please try again.');
    }
  };

  const toggleExpandDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const isPending = false; // Add state if you want to show loading status

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            What are your <span className="text-[#CE145B]">working hours</span>?
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            Set your salon's operating hours for each day
          </p>
        </div>

        <div className="sticky top-0 z-10 bg-gray-50 pt-1 pb-2">
          <button
            onClick={applyMondayToAll}
            className="mb-3 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg 
              bg-[#CE145B] bg-opacity-10 text-[#CE145B] hover:bg-opacity-20 transition-colors
              text-sm font-medium shadow-sm"
          >
            <Copy size={14} />
            <span>Apply Monday's hours to all days</span>
          </button>
        </div>

        <Card className="mb-4">
          <CardHeader className="bg-gray-50">
            <CardTitle>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#CE145B]" />
                <span>Working Hours</span>
              </div>
            </CardTitle>
          </CardHeader>
          <div className="divide-y divide-gray-100">
            {Object.entries(timeSlots).map(([day, times]) => (
              <DayRow 
                key={day}
                day={day}
                times={times}
                onToggle={toggleDayStatus}
                onChange={handleTimeChange}
                isExpanded={expandedDay === day}
                onExpand={() => toggleExpandDay(day)}
              />
            ))}
          </div>
        </Card>

        <div className="bg-blue-50 rounded-lg p-3 mb-5 flex items-start gap-2">
          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-blue-700 text-xs">
            Tap a day row to expand and set specific hours. Set a day to "Closed" if your salon doesn't operate on that day.
          </p>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full py-3.5 rounded-xl bg-[#CE145B] text-white font-semibold 
            hover:bg-opacity-90 transition-colors text-base shadow-md
            disabled:bg-opacity-70 disabled:cursor-not-allowed flex justify-center items-center
            fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4"
        >
          {isPending ? 'Saving...' : 'Save Working Hours'}
        </button>
      </div>

      {toast.show && (
        <Toast message={toast.message} onClose={() => setToast({ show: false, message: '' })} />
      )}
    </div>
  );
};

export default WorkingHours;