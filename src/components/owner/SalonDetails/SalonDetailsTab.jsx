import React, { useState, useEffect } from 'react';
import { Phone, Mail, Users, Clock, Copy, Info, X, ChevronDown, ChevronUp, Check, Save, Loader } from 'lucide-react';
import { formatTo12HourIST } from '@/helpers';
import { UPDATE_WORKING_HOUR_FN } from '@/services/ownerService';

// Card Components
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className || ''}`}>
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

// Modified TimeInput component to show IST time in the input directly
const TimeInput = ({ value, onChange, placeholder, disabled }) => {
  // Convert UTC time to IST for input display (assuming formatTo12HourIST can be adapted for this)
  const convertToIST = (time) => {
    if (!time) return '';
    
    // This would need to be implemented based on your actual conversion logic
    // Here we assume formatTo12HourIST can be modified to return IST time in HH:MM format
    // or you can create a new helper function to convert UTC time to IST in 24h format
    
    // For the purposes of this example, we'll assume a simple +5:30 conversion
    // In a real implementation, you would need proper timezone conversion
    const [hours, minutes] = time.split(':').map(Number);
    
    // Add 5 hours and 30 minutes for IST
    let istHours = hours + 5;
    let istMinutes = minutes + 30;
    
    // Handle minute overflow
    if (istMinutes >= 60) {
      istHours += 1;
      istMinutes -= 60;
    }
    
    // Handle hour overflow (wrap around to 0-23)
    istHours = istHours % 24;
    
    // Format as HH:MM
    return `${istHours.toString().padStart(2, '0')}:${istMinutes.toString().padStart(2, '0')}`;
  };
  
  // Convert IST time back to UTC when the input changes
  const handleTimeChange = (e) => {
    const istTime = e.target.value;
    if (!istTime) {
      onChange({ target: { value: '' } });
      return;
    }
    
    // Convert from IST back to UTC for storage
    const [hours, minutes] = istTime.split(':').map(Number);
    
    // Subtract 5 hours and 30 minutes to get UTC
    let utcHours = hours - 5;
    let utcMinutes = minutes - 30;
    
    // Handle minute underflow
    if (utcMinutes < 0) {
      utcHours -= 1;
      utcMinutes += 60;
    }
    
    // Handle hour underflow (wrap around to 0-23)
    if (utcHours < 0) {
      utcHours += 24;
    }
    
    // Format as HH:MM
    const utcTime = `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`;
    
    onChange({ target: { value: utcTime } });
  };
  
  const istValue = value ? convertToIST(value) : '';
  
  return (
    <div className="relative flex-1 min-w-[90px]">
      <input
        type="time"
        value={istValue} // Display IST time in the input
        onChange={handleTimeChange}
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
};

const Toast = ({ message, onClose, type = 'success' }) => {
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    loading: 'bg-blue-50 text-blue-800 border-blue-200'
  };
  
  const icons = {
    success: <Check size={16} className="text-green-600" />,
    error: <X size={16} className="text-red-600" />,
    loading: <Loader size={16} className="text-blue-600 animate-spin" />
  };
  
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className={`${colors[type]} rounded-lg shadow-lg px-4 py-3 flex items-center justify-between border max-w-sm mx-auto`}>
        <div className="flex items-center gap-2">
          {icons[type]}
          <span className="text-sm">{message}</span>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const DayRow = ({ day, times, onToggle, onChange, isExpanded, onExpand, disabled }) => {
  // Function to properly format the time for display
  const displayTime = (timeString) => {
    if (!timeString) return '';
    return formatTo12HourIST(timeString);
  };
  
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div 
        className={`p-3 flex items-center justify-between ${!disabled ? 'cursor-pointer' : ''}`}
        onClick={!disabled ? onExpand : undefined}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800 text-sm">{day}</span>
          {times.isOpen && (
            <span className="text-xs text-gray-500 hidden sm:inline-block">
              {displayTime(times.start)} - {displayTime(times.end)}
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
            disabled={disabled}
          />
          {!disabled && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>
      
      {/* Show expanded view for both open and closed days when in edit mode */}
      {isExpanded && !disabled && (
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg relative">
            <TimeInput
              value={times.start || '09:00'}
              onChange={(e) => onChange(day, 'start', e.target.value)}
              placeholder="Start"
              disabled={!times.isOpen || disabled}
            />
            <span className="text-gray-400 flex-shrink-0">to</span>
            <TimeInput
              value={times.end || '18:00'}
              onChange={(e) => onChange(day, 'end', e.target.value)}
              placeholder="End"
              disabled={!times.isOpen || disabled}
            />
          </div>
          {!times.isOpen && (
            <p className="mt-2 text-xs text-gray-500 italic">
              Toggle to "Open" to set working hours for {day}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const SalonDetailsTab = ({ salonData, isEditing, setSalonData }) => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Convert old openingHours format to the new format
  const mapDayKey = (oldKey) => {
    const map = {
      'mon': 'Monday',
      'tue': 'Tuesday',
      'wed': 'Wednesday',
      'thu': 'Thursday',
      'fri': 'Friday',
      'sat': 'Saturday',
      'sun': 'Sunday'
    };
    return map[oldKey] || oldKey;
  };

  // Convert old format hours to new format
  const convertHours = () => {
    const newFormat = {};
    
    Object.entries(salonData.openingHours || {}).forEach(([day, hours]) => {
      const newDay = mapDayKey(day);
      const isOpen = hours.open !== "closed";
      
      newFormat[newDay] = {
        start: isOpen ? hours.open : '09:00',
        end: isOpen ? hours.close : '18:00',
        isOpen: isOpen
      };
    });
    
    // Ensure all days exist
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    allDays.forEach(day => {
      if (!newFormat[day]) {
        newFormat[day] = {
          start: '09:00',
          end: '18:00',
          isOpen: false
        };
      }
    });
    
    return newFormat;
  };

  const [workingHours, setWorkingHours] = useState(convertHours());

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [workingHours]);

  const handleTimeChange = (day, type, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: value }
    }));
    
    // Update salonData
    updateSalonData(day, type, value);
  };

  const toggleDayStatus = (day) => {
    const updatedIsOpen = !workingHours[day].isOpen;
    
    setWorkingHours(prev => ({
      ...prev,
      [day]: { 
        ...prev[day], 
        isOpen: updatedIsOpen,
        start: updatedIsOpen ? prev[day].start || '09:00' : prev[day].start,
        end: updatedIsOpen ? prev[day].end || '18:00' : prev[day].end
      }
    }));
    
    // Update salonData
    const dayKey = Object.keys(salonData.openingHours).find(key => mapDayKey(key) === day);
    
    if (dayKey) {
      const updatedOpeningHours = { ...salonData.openingHours };
      updatedOpeningHours[dayKey] = {
        open: updatedIsOpen ? workingHours[day].start || '09:00' : 'closed',
        close: updatedIsOpen ? workingHours[day].end || '18:00' : 'closed'
      };
      
      setSalonData({ ...salonData, openingHours: updatedOpeningHours });
    }
    
    // If toggling open, automatically expand the row
    if (updatedIsOpen) {
      setExpandedDay(day);
    }
  };

  const updateSalonData = (day, type, value) => {
    // Find the corresponding key in salonData.openingHours
    const dayKey = Object.keys(salonData.openingHours || {}).find(key => mapDayKey(key) === day);
    
    // Get short key for the day (mon, tue, etc.)
    const getShortDayKey = (fullDay) => {
      const map = {
        'Monday': 'mon',
        'Tuesday': 'tue',
        'Wednesday': 'wed',
        'Thursday': 'thu',
        'Friday': 'fri',
        'Saturday': 'sat',
        'Sunday': 'sun'
      };
      return map[fullDay] || fullDay.toLowerCase().substring(0, 3);
    };
    
    // Create or update opening hours if needed
    const updatedOpeningHours = { ...(salonData.openingHours || {}) };
    const shortDayKey = dayKey || getShortDayKey(day);
    const openCloseKey = type === 'start' ? 'open' : 'close';
    
    // Initialize if not exist
    if (!updatedOpeningHours[shortDayKey]) {
      updatedOpeningHours[shortDayKey] = { open: 'closed', close: 'closed' };
    }
    
    updatedOpeningHours[shortDayKey] = {
      ...updatedOpeningHours[shortDayKey],
      [openCloseKey]: value
    };
    
    setSalonData({ 
      ...salonData, 
      openingHours: updatedOpeningHours 
    });
  };

  const applyMondayToAll = () => {
    const monday = workingHours.Monday;
    const updatedWorkingHours = {};
    
    Object.keys(workingHours).forEach(day => {
      updatedWorkingHours[day] = { ...monday };
    });
    
    setWorkingHours(updatedWorkingHours);
    
    // Update salonData
    const updatedOpeningHours = {};
    const mondaySettings = {
      open: monday.isOpen ? monday.start : 'closed',
      close: monday.isOpen ? monday.end : 'closed'
    };
    
    Object.keys(salonData.openingHours).forEach(day => {
      updatedOpeningHours[day] = { ...mondaySettings };
    });
    
    setSalonData({ ...salonData, openingHours: updatedOpeningHours });
    
    showToast('Applied Monday hours to all days', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    
    // Only auto-dismiss success messages
    if (type === 'success') {
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  const toggleExpandDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  // Format data for the UPDATE_WORKING_HOUR_FN to match backend requirements
  const prepareWorkingHoursData = () => {
    const formattedData = {};
    
    // Convert to the expected backend format
    Object.entries(workingHours).forEach(([fullDay, dayData]) => {
      // Convert full day name to lowercase shortened format (Monday -> mon)
      const dayKey = fullDay.toLowerCase().substring(0, 3);
      
      // Format the data according to backend expectations
      if (dayData.isOpen && dayData.start && dayData.end) {
        formattedData[dayKey] = {
          start: dayData.start, // Backend will parse these as IST times
          end: dayData.end
        };
      } else {
        formattedData[dayKey] = {
          start: '',
          end: ''
        };
      }
    });
    
    return {
      salon_id: salonData.id || salonData.salon_id,
      workingHours: formattedData
    };
  };

  // Save changes function
  const saveChanges = async () => {
    try {
      setIsSaving(true);
      showToast('Saving changes...', 'loading');
      
      const { salon_id, workingHours } = prepareWorkingHoursData();
      
      // Call the update function with proper parameters matching backend expectations
      await UPDATE_WORKING_HOUR_FN(salon_id, workingHours);
      
      setHasChanges(false);
      showToast('Working hours updated successfully', 'success');
    } catch (error) {
      console.error('Error updating working hours:', error);
      showToast(`Failed to save changes: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#CE145B]" />
                <span>Contact Information</span>
              </div>
            </CardTitle>
          </CardHeader>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={salonData.phone} 
                  onChange={(e) => setSalonData({ ...salonData, phone: e.target.value })} 
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#CE145B] focus:ring-1 focus:ring-[#CE145B]" 
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={16} />
                  <span>{salonData.phone}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={salonData.email || ''} 
                  onChange={(e) => setSalonData({ ...salonData, email: e.target.value })} 
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#CE145B] focus:ring-1 focus:ring-[#CE145B]" 
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={16} />
                  <span>{salonData.email || 'Not provided'}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Number of Seats</label>
              {isEditing ? (
                <input 
                  type="number" 
                  value={salonData.seats} 
                  onChange={(e) => setSalonData({ ...salonData, seats: parseInt(e.target.value) })} 
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-[#CE145B] focus:ring-1 focus:ring-[#CE145B]" 
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={16} />
                  <span>{salonData.seats} Styling Seats</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#CE145B]" />
                <span>Opening Hours</span>
              </div>
            </CardTitle>
          </CardHeader>
          <div className="p-4 sm:p-6">
            {isEditing && (
              <button
                onClick={applyMondayToAll}
                className="mb-3 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg 
                  bg-[#CE145B] bg-opacity-10 text-[#CE145B] hover:bg-opacity-20 transition-colors
                  text-sm font-medium"
              >
                <Copy size={14} />
                <span>Apply Monday's hours to all days</span>
              </button>
            )}
            
            <div className="divide-y divide-gray-100">
              {Object.entries(workingHours).map(([day, times]) => (
                <DayRow 
                  key={day}
                  day={day}
                  times={times}
                  onToggle={toggleDayStatus}
                  onChange={handleTimeChange}
                  isExpanded={expandedDay === day}
                  onExpand={() => toggleExpandDay(day)}
                  disabled={!isEditing}
                />
              ))}
            </div>
            
            {isEditing && (
              <div className="mt-4 bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 text-xs">
                  Tap a day row to expand and set specific hours. Set a day to "Closed" if your salon doesn't operate on that day.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* Save Button */}
      {isEditing && hasChanges && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={saveChanges}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg shadow-md hover:bg-[#B0124E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      )}
      
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })} 
        />
      )}
    </div>
  );
};

export default SalonDetailsTab;