'use client';
import React, { useEffect, useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Phone, 
  Mail, 
  Clock, 
  CreditCard, 
  Calendar, 
  User, 
  Store, 
  MapPin, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { GET_OWNER_SALON_FN } from '@/services/ownerService';
import { GET_APPOINTMENTS_OF_SALON_FN } from '@/services/ownerService';
import { useAuth } from '@/context/AuthContext';
import {useOwnerAuth} from "@/context/OwnerContext"

const SalonSchedule = () => {
  const [date, setDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStylist, setSelectedStylist] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [salonWorkingHours,setSalonWorkingHours] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSalonSwitcherOpen, setIsSalonSwitcherOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { owner_id } = useOwnerAuth();
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  // Generate time slots from 6 AM to 11:59 PM (IST)
  const timeSlots = Array.from({ length: 18 * 2 }, (_, i) => {
    const hour24 = Math.floor(i / 2) + 6;
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const minutes = i % 2 === 0 ? '00' : '30';
    const period = hour24 < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${period}`;
  });
 // Helper function to parse time from different formats
// Replace your existing parseTimeString function with this improved version
const parseTimeString = (timeString) => {
  if (!timeString) return null;
  
  try {
    // Handle IST timestamp format with timezone info
    if (timeString.includes('GMT+0530') || timeString.includes('Standard Time')) {
      return new Date(timeString);
    }
    
    // Handle "HH:MM AM/PM" format
    if (timeString.includes('AM') || timeString.includes('PM')) {
      const [hourMinute, period] = timeString.split(' ');
      const [hours, minutes] = hourMinute.split(':').map(num => parseInt(num, 10));
      
      // Convert to 24-hour format
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hours === 12) {
        hour24 = 0;
      }
      
      const result = new Date();
      result.setHours(hour24, minutes, 0, 0);
      return result;
    }
    
    // Handle format like "Tue, 29 Apr 2025 13:36:00 GMT"
    if (timeString.includes('GMT')) {
      return new Date(timeString);
    }
    
    // Try direct parsing as fallback
    return new Date(timeString);
  } catch (error) {
    console.error("Error parsing time:", error, timeString);
    return new Date(); // Return current time as fallback
  }
};

  // Helper function to format time in IST
  const formatTimeToIST = (date) => {
    if (!date) return '';
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Helper function to convert date object to hour integer for comparison

  const getMinutesFromDate = (date) => {
    if (!date) return null;
    try {
      return date.getMinutes();
    } catch (error) {
      console.error("Error getting minutes from date:", error);
      return null;
    }
  };
  const getHourFromDate = (date) => {
    if (!date) return null;
    return date.getHours();
  };

  // Fetch salons owned by the owner
  useEffect(() => {
    async function fetchSalons(userId) {
      if (!userId) return;
      
      setLoading(true);
      try {
        const response = await GET_OWNER_SALON_FN(userId, ['name', 'rating', 'address', 'stylists', 'stats', 'salon_id', 'working_hours']);
        if (response.data.data && response.data.data.length > 0) {
          setSalons(response.data.data);
          setSelectedSalon(response.data.data[0].salon_id); // Select first salon by default
        } else {
          setError('No salons found for this account');
        }
      } catch (err) {
        console.error("Error fetching salons:", err);
        setError('Failed to load salon data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSalons(owner_id);
  }, [owner_id]);

  // Fetch appointments for selected salon
  useEffect(() => {
    async function fetchAppointments(salonId) {
      if (!salonId) return;
      
      setLoading(true);
      try {
        const response = await GET_APPOINTMENTS_OF_SALON_FN(salonId, {
          date: date.toISOString().split('T')[0] // Format as YYYY-MM-DD
        });
        
        if (response.data && response.data.data && response.data.data.data) {
          // Process appointments to normalize time formats
          const processedAppointments = response.data.data.data.map(apt => {
            // Parse the start and end times
            const startTimeDate = parseTimeString(apt.scheduled_start_time);
            const endTimeDate = parseTimeString(apt.scheduled_end_time);
            
            return {
              ...apt,
              // Store parsed date objects
              startTimeDate,
              endTimeDate,
              // Format for display
              ist_start_time: formatTimeToIST(startTimeDate),
              ist_end_time: formatTimeToIST(endTimeDate),
              // Additional useful fields
              duration: apt.total_duration || 0,
              customer_name: apt.user_details?.name || "Customer",
              payment_status: apt.payment_details?.payment_status || 'pending'
            };
          });
          setAppointments(processedAppointments);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError('Failed to load appointment data');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (selectedSalon) {
      fetchAppointments(selectedSalon);
    }
  }, [selectedSalon, date]);

  // Get unique services from all appointments
  const allServices = React.useMemo(() => {
    if (!appointments || appointments.length === 0) return [];
    
    const services = appointments.flatMap(apt => 
      apt.services ? apt.services.map(service => service.name) : []
    );
    
    return [...new Set(services)];
  }, [appointments]);

const getAppointmentsForTimeSlot = (timeSlot) => {
  if (!appointments || appointments.length === 0) return [];

  // Parse the time slot to get the hour and whether it's AM/PM
  const [timePart, period] = timeSlot.split(' ');
  const [hourStr, minuteStr] = timePart.split(':');
  let slotHour = parseInt(hourStr, 10);
  const slotMinute = parseInt(minuteStr, 10);
  
  // Convert to 24-hour time
  if (period === 'PM' && slotHour !== 12) slotHour += 12;
  if (period === 'AM' && slotHour === 12) slotHour = 0;

  return appointments.filter(apt => {
    if (!apt.startTimeDate) return false;
    
    // Get the hour and minute from the appointment start time
    const aptHour = getHourFromDate(apt.startTimeDate);
    const aptMinute = getMinutesFromDate(apt.startTimeDate);
    
    // Check if the appointment starts in this time slot
    // For 30-minute slots: the appointment must start in the first 30 minutes of this slot's hour
    const matchesTimeSlot = aptHour === slotHour && 
      ((slotMinute === 0 && aptMinute < 30) || 
       (slotMinute === 30 && aptMinute >= 30));

       // Add this new helper function

    // Apply filters
    const matchesStylist = selectedStylist === 'all' || 
      apt.stylist === selectedStylist;

    const matchesService = selectedService === 'all' || 
      (apt.services && apt.services.some(service => 
        service.name === selectedService
      ));

    return matchesTimeSlot && matchesStylist && matchesService;
  });
};
  

  const handlePreviousDay = () => {
    setDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusColors = {
      'confirmed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    if (!status) return 'bg-yellow-100 text-yellow-800';
    
    return status === 'paid' || status === 'completed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const currentSalon = salons.find(salon => salon.salon_id === selectedSalon);

  const formatDateDisplay = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  function isCurrentTimeSlot(slotTime12h) {
    const now = new Date();
    const currentHour = now.getHours(); // 0–23
    const currentMinute = now.getMinutes();
  
    // Convert slot time to 24-hour format
    const [time, period] = slotTime12h.split(' ');
    let [hour, minute] = time.split(':').map(n => parseInt(n, 10));
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    // Check if the current time falls within this time slot
    if (hour === currentHour) {
      if (minute === 0) {
        return currentMinute < 30; // First half hour
      } else if (minute === 30) {
        return currentMinute >= 30; // Second half hour
      }
    }
    
    return false;
  }

// Update the handleStatusUpdate function to ensure appointment status is correctly updated
const handleStatusUpdate = (appointmentId, newStatus) => {
  // Update local state to reflect the change immediately
  setAppointments(prevAppointments => 
    prevAppointments.map(apt => 
      apt._id === appointmentId 
        ? { ...apt, status: newStatus } 
        : apt
    )
  );
  
  // If we're updating the currently selected appointment
  if (selectedAppointment && selectedAppointment._id === appointmentId) {
    setSelectedAppointment(prev => ({ ...prev, status: newStatus }));
  }
  
  // Close the detail panel after status update
  setIsDetailOpen(false);
};

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Calendar size={36} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">No appointments scheduled</h3>
      <p className="text-gray-500 max-w-md">
        There are no appointments scheduled for this day. You can create a new appointment or check another date.
      </p>
      <button className="mt-4 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors">
        Create Appointment
      </button>
    </div>
  );

  // Loading state component
  const LoadingState = () => (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex animate-pulse">
          <div className="w-24 h-16 bg-gray-200 rounded" />
          <div className="flex-1 ml-4 space-y-2">
            <div className="h-10 w-1/3 bg-gray-200 rounded" />
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  // Error state component
  const ErrorState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <AlertCircle size={36} className="text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Something went wrong</h3>
      <p className="text-gray-500 max-w-md">
        {message || "We couldn't load your appointment data. Please try again later."}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Refresh
      </button>
    </div>
  );

  // Salon switcher component
  const SalonSwitcher = () => (
    <div className="relative">
      <button
        onClick={() => setIsSalonSwitcherOpen(!isSalonSwitcherOpen)}
        className="flex items-center gap-2 bg-white bg-opacity-10 p-2 rounded-lg hover:bg-opacity-20 transition-colors"
      >
        <Store size={20} />
        <span>{currentSalon?.name || 'Select Salon'}</span>
        <ChevronRight size={16} className={`transform transition-transform ${isSalonSwitcherOpen ? 'rotate-90' : ''}`} />
      </button>

      {isSalonSwitcherOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
          {salons.map(salon => (
            <button
              key={salon.salon_id}
              onClick={() => {
                setSelectedSalon(salon.salon_id);
                setIsSalonSwitcherOpen(false);
                setSelectedStylist('all'); // Reset stylist filter when changing salon
              }}
              className={`w-full p-3 text-left flex items-start gap-3 hover:bg-gray-50 ${
                salon.salon_id === selectedSalon ? 'bg-pink-50' : ''
              }`}
            >
              <Store size={20} className="text-[#CE145B] mt-1" />
              <div>
                <div className="font-medium text-gray-900">{salon.name}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={12} />
                  {salon.address}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Create appointment card component
  const AppointmentCard = ({ appointment }) => {
    const isUpcoming = appointment.startTimeDate > currentTime;
    const isPast = appointment.endTimeDate < currentTime;
    const isInProgress = !isUpcoming && !isPast;
    
    // Calculate remaining time for in-progress appointments
    const getRemainingTime = () => {
      if (!isInProgress) return null;
      const minutesRemaining = Math.ceil((appointment.endTimeDate - currentTime) / (1000 * 60));
      return minutesRemaining;
    };
    
    // Get time until appointment starts
    const getWaitTime = () => {
      if (!isUpcoming) return null;
      const minutesUntil = Math.ceil((appointment.startTimeDate - currentTime) / (1000 * 60));
      return minutesUntil;
    };
    
    const remainingTime = getRemainingTime();
    const waitTime = getWaitTime();
    
    // Determine priority level for visual emphasis
    const isPriority = isInProgress || (isUpcoming && waitTime && waitTime < 30);
  
    return (
      <div 
        onClick={() => handleAppointmentClick(appointment)}
        className={`flex flex-col min-w-[180px] max-w-[220px] md:min-w-[260px] md:max-w-[300px] rounded-lg md:rounded-xl overflow-hidden shadow hover:shadow-md 
          transition-all duration-200 transform hover:-translate-y-1 cursor-pointer ${
          isPriority ? 'ring-1 md:ring-2 ring-[#CE145B]/30' : ''
        }`}
      >
        {/* Header - Status Banner */}
        <div className={`px-2 md:px-3 py-1 md:py-1.5 text-white text-[10px] md:text-xs font-medium flex items-center justify-between
          ${isInProgress ? 'bg-blue-600' : 
            isUpcoming ? 'bg-[#CE145B]' : 
            'bg-gray-600'}`}
        >
          <div className="flex items-center">
            {isInProgress ? (
              <>
                <span className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-white animate-pulse mr-1 md:mr-2"></span>
                <span>In Progress</span>
                {remainingTime && <span className="ml-0.5 md:ml-1 opacity-90">• {remainingTime}<span className="hidden md:inline"> min left</span><span className="inline md:hidden">m</span></span>}
              </>
            ) : isUpcoming ? (
              <>
                <Clock size={10} className="mr-1 md:hidden" />
                <Clock size={12} className="hidden md:inline mr-1.5" />
                <span>Upcoming</span>
                {waitTime && waitTime < 60 && <span className="ml-0.5 md:ml-1 opacity-90">• {waitTime}<span className="hidden md:inline"> min</span><span className="inline md:hidden">m</span></span>}
              </>
            ) : (
              <>
                <CheckCircle size={10} className="mr-1 md:hidden" />
                <CheckCircle size={12} className="hidden md:inline mr-1.5" />
                <span>Completed</span>
              </>
            )}
          </div>
          <span className="font-normal opacity-80 text-[9px] md:text-[10px]">
            {appointment.total_duration}<span className="hidden md:inline"> min</span><span className="inline md:hidden">m</span>
          </span>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col p-2 md:p-3 bg-white">
          {/* Customer */}
          <div className="lg:flex items-center justify-between mb-1.5 md:mb-2.5 hidden">
            <div className="flex items-center">
              <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#CE145B] text-xs md:font-medium mr-1.5 md:mr-2">
                {(appointment.customer_name || "C")[0]}
              </div>
              <span className="font-medium text-gray-900 text-xs md:text-base truncate max-w-[100px] md:max-w-[140px]">
                {appointment.customer_name || "Customer"}
              </span>
            </div>
            <div className={`px-1.5 md:px-2 py-0.5 rounded text-[9px] md:text-xs font-medium ${getStatusColor(appointment.status)}`}>
              {appointment.status?.toUpperCase() || 'PENDING'}
            </div>
          </div>
          
          {/* Time slot */}
          <div className="flex items-center mb-2 md:mb-3 text-gray-700 text-[9px] md:text-xs bg-gray-50 p-1 md:p-1.5 rounded">
            <Clock size={10} className="mr-1 md:hidden text-gray-500" />
            <Clock size={14} className="hidden md:inline mr-1.5 text-gray-500" />
            <span>{appointment.ist_start_time} - {appointment.ist_end_time}</span>
          </div>
          
          {/* Services */}
          <div className="mb-2 md:mb-3 hidden md:block">
            <div className="text-[9px] md:text-xs font-medium uppercase text-gray-500 mb-1 md:mb-1.5">Services</div>
            <div className="space-y-1 md:space-y-1.5">
              {appointment.services && appointment.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between text-[10px] md:text-sm">
                  <div className="flex items-center">
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#CE145B] mr-1 md:mr-2"></div>
                    <span className="text-gray-800">{service.name}</span>
                  </div>
                  <span className="text-gray-600">₹{service.price}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-1.5 md:pt-2 border-t border-gray-100">
            <div className="flex items-center text-[9px] md:text-xs text-gray-500">
              <User size={8} className="mr-1 md:hidden" />
              <User size={12} className="hidden md:inline mr-1.5" />
              <span>{appointment.stylist || "Any Available"}</span>
            </div>
            <div className={`flex items-center text-[9px] md:text-xs ${
              appointment.payment_details?.payment_status === 'success' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              <CreditCard size={8} className="mr-1 md:hidden" />
              <CreditCard size={12} className="hidden md:inline mr-1.5" />
              <span>{appointment.payment_details?.payment_status === 'success' ? 'PAID' : 'PENDING'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Check if we have any data to show
  const hasAppointments = appointments.length > 0;
  const anyAppointmentsForDay = timeSlots.some(time => {
    const aptsForTimeSlot = getAppointmentsForTimeSlot(time);
    return aptsForTimeSlot.length > 0;
  });

  // Current time indicator
  const CurrentTimeIndicator = () => {
    if (!isToday(date)) return null;
    
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    // Calculate position within timeline (0-100%)
    const minutePercentage = (currentMinute / 60) * 100;
    
    return (
      <div 
        className="absolute left-0 w-full border-t-2 border-red-500 z-10"
        style={{ 
          top: `${minutePercentage}%`,
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0) 100%)',
          height: '2px'
        }}
      >
        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-red-500"></div>
        <div className="absolute -top-3 -right-16 bg-red-100 text-red-800 text-xs font-medium px-1 py-0.5 rounded">
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 py-4 sm:py-5 bg-white rounded-lg sm:rounded-xl shadow-sm">
      {/* Header */}
      <div className="bg-[#CE145B] rounded-lg sm:rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold m-0">Salon Dashboard</h1>
            <p className="mt-1 opacity-90 text-sm sm:text-base">
              {isToday(date) ? 'Today\'s Schedule' : `Schedule for ${formatDateDisplay(date)}`}
            </p>
            {isToday(date) && (
              <p className="text-white bg-white bg-opacity-20 px-2 py-1 rounded-md mt-2 text-xs sm:text-sm inline-block">
                Current Time: {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            )}
          </div>
          {!loading && salons.length > 0 && <SalonSwitcher />}
        </div>
        
        {currentSalon && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white bg-opacity-10 p-2 sm:p-3 rounded-lg text-center">
              <span className="block text-lg sm:text-2xl font-semibold">{appointments.length || 0}</span>
              <span className="text-xs sm:text-sm opacity-90 truncate">{isToday(date) ? "Today's Appointments" : "Appointments"}</span>
            </div>
            <div className="bg-white bg-opacity-10 p-2 sm:p-3 rounded-lg text-center">
              <span className="block text-lg sm:text-2xl font-semibold">
                {appointments.filter(apt => apt.status === 'completed').length || 0}
              </span>
              <span className="text-xs sm:text-sm opacity-90 truncate">Completed</span>
            </div>
            <div className="bg-white bg-opacity-10 p-2 sm:p-3 rounded-lg text-center col-span-2 sm:col-span-1">
              <span className="block text-lg sm:text-2xl font-semibold">
                ₹{appointments.reduce((total, apt) => total + (apt.total_price || 0), 0).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm opacity-90 truncate">Total Revenue</span>
            </div>
          </div>
        )}
      </div>
  
      {/* Filters */}
      <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={handlePreviousDay}
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-[#CE145B]"
            disabled={loading}
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs sm:text-sm text-gray-600">
              {isToday(date) ? 'Today' : ''}
            </span>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              {formatDateDisplay(date)}
            </span>
          </div>
          <button 
            onClick={handleNextDay}
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-[#CE145B]"
            disabled={loading}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={selectedStylist}
            onChange={(e) => setSelectedStylist(e.target.value)}
            className="p-2 text-sm border rounded-lg bg-white text-gray-800 flex-1 sm:min-w-[150px]"
            disabled={loading || !currentSalon}
          >
            <option value="all">All Stylists</option>
            {currentSalon?.stylists?.map(stylist => (
              <option key={stylist} value={stylist}>{stylist}</option>
            ))}
          </select>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="p-2 text-sm border rounded-lg bg-white text-gray-800 flex-1 sm:min-w-[150px]"
            disabled={loading}
          >
            <option value="all">All Services</option>
            {allServices.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
      </div>
  
      {/* Content Area */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : !currentSalon ? (
        <ErrorState message="No salon selected. Please add a salon to your account." />
      ) : !hasAppointments ? (
        <EmptyState />
      ) : (
        /* Timeline */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex p-2 sm:p-3 bg-gray-50 border-b border-gray-200 font-medium text-sm">
            <div className="w-16 sm:w-24">Time</div>
            <div className="flex-1">Appointments</div>
          </div>
          
          <div className="overflow-x-auto">
  {timeSlots.map((time, index) => {
    const appointmentsForSlot = getAppointmentsForTimeSlot(time);
    const isCurrentSlot = isCurrentTimeSlot(time);
    
    // Only show indicator for the first matching time slot
    const showIndicator = isCurrentSlot && 
      timeSlots.findIndex(t => isCurrentTimeSlot(t)) === index;
    
    return (
      <div 
        key={time} 
        className={`flex min-h-[70px] sm:min-h-[80px] border-b border-gray-200 relative
          ${isCurrentSlot ? 'bg-yellow-50' : ''}`}
      >
        <div className={`w-16 sm:w-24 p-2 sm:p-3 ${isCurrentSlot ? 'bg-yellow-100 font-medium' : 'bg-gray-50'} text-gray-600 text-xs sm:text-sm flex items-center`}>
          {time}
          {isCurrentSlot && (
            <span className="ml-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </div>
        <div className="flex-1 p-1 sm:p-2 overflow-x-auto flex gap-2 relative">
          {showIndicator && <CurrentTimeIndicator />}
          
          {appointmentsForSlot.length > 0 ? (
            appointmentsForSlot.map(apt => (
              <AppointmentCard key={apt._id} appointment={apt} />
            ))
          ) : (
            <div className="flex items-center justify-center w-full p-2 text-gray-400 text-xs sm:text-sm">
              Available
            </div>
          )}
        </div>
      </div>
    );
  })}
  
  {/* No appointments message if filtered to none */}
  {hasAppointments && !anyAppointmentsForDay && (
    <div className="p-6 sm:p-8 text-center text-gray-500 text-sm">
      No appointments match your current filters.
    </div>
  )}
</div>
        </div>
      )}
  
      {/* Slide-over Panel */}
      {isDetailOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex justify-end">
          <div className="w-full max-w-md sm:max-w-xl bg-white shadow-lg h-full overflow-hidden animate-slide-in-right">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-lg sm:text-xl font-semibold">
                      {selectedAppointment.customer_name?.[0] || '?'}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {selectedAppointment.customer_name}
                      </h2>
                      <div className="flex gap-2 mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                          {selectedAppointment.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Close panel"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
  
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Contact Information */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone size={16} className="text-[#CE145B] flex-shrink-0" />
                      <a href={`tel:${selectedAppointment.user_details?.phone_number}`} className="hover:text-[#CE145B] truncate">
                      {selectedAppointment.user_details?.phone_number || "Not available"}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail size={16} className="text-[#CE145B] flex-shrink-0" />
                      <a href={`mailto:${selectedAppointment.user_details?.email}`} className="hover:text-[#CE145B] truncate">
                        {selectedAppointment.user_details?.email || "Not available"}
                      </a>
                    </div>
                  </div>
                </div>
  
                <hr className="my-4 sm:my-6 border-gray-200" />
  
                {/* Appointment Details */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">Appointment Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar size={16} className="text-[#CE145B] flex-shrink-0" />
                      <span>{formatDateDisplay(date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock size={16} className="text-[#CE145B] flex-shrink-0" />
                      <span>{selectedAppointment.ist_start_time} - {selectedAppointment.ist_end_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock size={16} className="text-[#CE145B] flex-shrink-0" />
                      <span>Duration: {selectedAppointment.total_duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User size={16} className="text-[#CE145B] flex-shrink-0" />
                      <span>Stylist: {selectedAppointment?.stylist || "Any Available"}</span>
                    </div>
                    
                    {/* Appointment Timing Status */}
                    {isToday(date) && (
                      <div className="mt-2 p-2 rounded text-xs sm:text-sm">
                        {selectedAppointment.startTimeDate > currentTime ? (
                          <div className="bg-blue-50 p-2 rounded text-blue-800 flex items-center gap-2">
                            <Clock size={16} className="flex-shrink-0" />
                            <span>Upcoming - Starts in {Math.ceil((selectedAppointment.startTimeDate - currentTime) / (1000 * 60))} minutes</span>
                          </div>
                        ) : selectedAppointment.endTimeDate < currentTime ? (
                          <div className="bg-gray-50 p-2 rounded text-gray-800 flex items-center gap-2">
                            <CheckCircle size={16} className="flex-shrink-0" />
                            <span>Completed {Math.ceil((currentTime - selectedAppointment.endTimeDate) / (1000 * 60))} minutes ago</span>
                          </div>
                        ) : (
                          <div className="bg-green-50 p-2 rounded text-green-800 flex items-center gap-2">
                            <Clock size={16} className="flex-shrink-0" />
                            <span>In Progress - Ends in {Math.ceil((selectedAppointment.endTimeDate - currentTime) / (1000 * 60))} minutes</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
  
                <hr className="my-4 sm:my-6 border-gray-200" />
  
                {/* Services & Payment */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">Services & Payment</h3>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
                    <div className="space-y-2 sm:space-y-3">
                      {selectedAppointment.services && selectedAppointment.services.map((service, index) => (
                        <div key={index} className="flex justify-between text-xs sm:text-sm text-gray-700">
                          <span className="font-medium">{service.name}</span>
                          <div className="text-right">
                            <div>₹{service.price.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">{service.duration} min</div>
                          </div>
                        </div>
                      ))}
                      <hr className="my-2 border-gray-200" />
                      <div className="flex justify-between font-bold text-gray-900 text-xs sm:text-sm">
                        <span>Total</span>
                        <span>₹{selectedAppointment.total_price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2 text-xs sm:text-sm">Payment Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Payment ID</span>
                        <span className="font-mono">{selectedAppointment.payment_details?.payment_id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Status</span>
                        <span className={`font-medium ${selectedAppointment.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {selectedAppointment.payment_status?.toUpperCase() || 'PENDING'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Method</span>
                        <span>Online</span>
                      </div>
                    </div>
                  </div>
                </div>
  
                <hr className="my-4 sm:my-6 border-gray-200" />
  
                {/* Booking Details */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">Booking Details</h3>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Booking ID</span>
                        <span className="font-mono text-right truncate ml-2">{selectedAppointment._id}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Booked On</span>
                        <span className="text-right">{new Date(selectedAppointment.booking_date).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Notes */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">Notes</h3>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-700">{selectedAppointment?.notes || 'No notes available'}</p>
                  </div>
                </div>
              </div>
  
              {/* Action Buttons */}
              <div className="p-4 sm:p-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <button className="w-full px-3 py-2 text-xs sm:text-sm bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors">
                    Edit Appointment
                  </button>
                  {selectedAppointment.status !== 'cancelled' && (
                    <button 
                      onClick={() => handleStatusUpdate(selectedAppointment._id, 'cancelled')}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
                
                {selectedAppointment.status !== 'completed' && (
                  <button 
                    onClick={() => handleStatusUpdate(selectedAppointment._id, 'completed')}
                    className="w-full mt-2 px-3 py-2 text-xs sm:text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
                
                {selectedAppointment.status === 'completed' && (
                  <button 
                    className="w-full mt-2 px-3 py-2 text-xs sm:text-sm border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    Send Feedback Request
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonSchedule;