import React, { useState, useEffect } from 'react';

const SalonBookingApp = () => {
  const config = {
    openTime: "9:00",
    closeTime: "18:00",
    timeSlotInterval: 15,
    seats: 4
  };
   
  // Service definitions
  const serviceTypes = [
    { id: 1, name: "Haircut", duration: 30, color: "#FFD6D6" },
    { id: 2, name: "Shaving", duration: 15, color: "#D6FFD6" }
  ];

  // State
  const [bookings, setBookings] = useState([]);
  const [selectedService, setSelectedService] = useState(serviceTypes[0]);
  const [currentTime, setCurrentTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingCounter, setBookingCounter] = useState(1);
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  
  // Initialize current time on component mount
  useEffect(() => {
    const now = new Date();
    setCurrentTime(formatTime(now));
    
    // Set interval to update current time every minute
    const intervalId = setInterval(() => {
      const updatedNow = new Date();
      setCurrentTime(formatTime(updatedNow));
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Update available slots when current time, selected service, or bookings change
  useEffect(() => {
    if (currentTime) {
      updateAvailableSlots();
    }
  }, [currentTime, selectedService, bookings]);
  
  // Helper functions
  function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  
  function convertTimeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  function convertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
  
  function roundToNextTimeSlot(timeString) {
    const totalMinutes = convertTimeToMinutes(timeString);
    const remainder = totalMinutes % config.timeSlotInterval;
    
    // If already on a time slot boundary, use the next slot
    const roundedMinutes = remainder === 0 
      ? totalMinutes + config.timeSlotInterval 
      : totalMinutes + (config.timeSlotInterval - remainder);
      
    return convertMinutesToTime(roundedMinutes);
  }
  
  function addMinutes(timeString, minutesToAdd) {
    const totalMinutes = convertTimeToMinutes(timeString) + minutesToAdd;
    return convertMinutesToTime(totalMinutes);
  }
  
  function isTimeSlotAvailable(startTime, serviceId, seatIndex = null) {
    // Find service duration
    const service = serviceTypes.find(s => s.id === serviceId);
    if (!service) return false;
    
    // Convert times to minutes for easier calculation
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = startMinutes + service.duration;
    const closeMinutes = convertTimeToMinutes(config.closeTime);
    
    // Don't allow bookings that would extend past closing time
    if (endMinutes > closeMinutes) return false;
    
    // If a specific seat is specified, check only that seat
    if (seatIndex !== null) {
      return !hasConflict(startMinutes, endMinutes, seatIndex);
    }
    
    // Otherwise, check each seat
    for (let seat = 0; seat < config.seats; seat++) {
      if (!hasConflict(startMinutes, endMinutes, seat)) {
        return true;
      }
    }
    
    // If we get here, no seat is available for this time slot
    return false;
  }
  
  function hasConflict(startMinutes, endMinutes, seatIndex) {
    return bookings.some(booking => {
      // Only check bookings for the same seat
      if (booking.seat !== seatIndex) return false;
      
      // Convert booking times to minutes
      const bookingStart = convertTimeToMinutes(booking.startTime);
      const bookingEnd = convertTimeToMinutes(booking.endTime);
      
      // Check for overlap
      return (startMinutes < bookingEnd && endMinutes > bookingStart);
    });
  }
  
  function findAvailableSeat(startTime, serviceId) {
    const service = serviceTypes.find(s => s.id === serviceId);
    if (!service) return -1;
    
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = startMinutes + service.duration;
    
    // Check each seat
    for (let seat = 0; seat < config.seats; seat++) {
      if (!hasConflict(startMinutes, endMinutes, seat)) {
        return seat;
      }
    }
    
    return -1; // No seat available
  }
  
  function updateAvailableSlots() {
    const slots = [];
    let timeToCheck = roundToNextTimeSlot(currentTime);
    const closeMinutes = convertTimeToMinutes(config.closeTime);
    const maxOptions = 10; // Show up to 10 options
    
    // Check each potential time slot
    while (slots.length < maxOptions) {
      const timeInMinutes = convertTimeToMinutes(timeToCheck);
      
      // Don't suggest times that would go past closing
      if (timeInMinutes + selectedService.duration > closeMinutes) break;
      
      // Check if this time slot is available
      if (isTimeSlotAvailable(timeToCheck, selectedService.id)) {
        slots.push(timeToCheck);
      }
      
      // Move to the next time slot
      timeToCheck = addMinutes(timeToCheck, config.timeSlotInterval);
    }
    
    setAvailableSlots(slots);
  }
  
  function bookAppointment() {
    if (!selectedSlot) return;
    
    const service = serviceTypes.find(s => s.id === selectedService.id);
    
    // If no seat was selected, find the first available one
    const seat = selectedSeat !== null 
      ? selectedSeat 
      : findAvailableSeat(selectedSlot, selectedService.id);
      
    if (seat === -1) {
      alert("No seats available for this time slot.");
      return;
    }
    
    const startTime = selectedSlot;
    const endTime = addMinutes(startTime, service.duration);
    
    const newBooking = {
      id: bookingCounter,
      serviceId: service.id,
      serviceName: service.name,
      seat: seat,
      startTime: startTime,
      endTime: endTime,
      color: service.color
    };
    
    setBookings([...bookings, newBooking]);
    setBookingCounter(bookingCounter + 1);
    setSelectedSlot(null);
    setSelectedSeat(null);
    
    // Update available slots
    updateAvailableSlots();
  }
  
  // Generate time grid for visualization
  const timeGrid = [];
  const openMinutes = convertTimeToMinutes(config.openTime);
  const closeMinutes = convertTimeToMinutes(config.closeTime);
  
  for (let minute = openMinutes; minute < closeMinutes; minute += config.timeSlotInterval) {
    const timeSlot = convertMinutesToTime(minute);
    timeGrid.push(timeSlot);
  }
  
  // Get current time indicator position
  const currentTimeMinutes = convertTimeToMinutes(currentTime);
  const isWithinBusinessHours = currentTimeMinutes >= openMinutes && currentTimeMinutes < closeMinutes;
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Salon Booking Application</h1>
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="text-lg font-semibold mb-2">Salon Information</h2>
            <p>Business Hours: {config.openTime} - {config.closeTime}</p>
            <p>Number of Seats: {config.seats}</p>
            <p>Current Time: {currentTime}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="text-lg font-semibold mb-2">Services</h2>
            <div className="flex flex-col space-y-2">
              {serviceTypes.map(service => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-2 rounded border ${
                    selectedService.id === service.id ? 
                    'bg-blue-100 border-blue-500' : 'border-gray-300'
                  }`}
                >
                  {service.name} ({service.duration} min)
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="text-lg font-semibold mb-2">Next Available Slots</h2>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 text-center rounded border ${
                      selectedSlot === slot ? 
                      'bg-green-100 border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-red-500">No available slots</p>
            )}
            
            {selectedSlot && (
              <div className="mt-4">
                <button
                  onClick={bookAppointment}
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Book {selectedService.name} at {selectedSlot}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Booking visualization */}
        <h2 className="text-xl font-semibold mb-2">Today's Schedule</h2>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-300">Time</th>
                {Array.from({ length: config.seats }).map((_, index) => (
                  <th key={index} className="p-2 border border-gray-300">
                    Seat {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeGrid.map((time, index) => {
                const isHourMark = time.endsWith(':00');
                const isCurrentTimeLine = isWithinBusinessHours && 
                  convertTimeToMinutes(time) <= currentTimeMinutes && 
                  convertTimeToMinutes(time) + config.timeSlotInterval > currentTimeMinutes;
                
                return (
                  <tr 
                    key={time}
                    className={`
                      ${isHourMark ? 'border-t-2 border-gray-400' : ''}
                      ${isCurrentTimeLine ? 'bg-yellow-50' : ''}
                    `}
                  >
                    <td className="p-2 border border-gray-300 text-center font-medium">
                      {time}
                      {isCurrentTimeLine && <span className="ml-2 text-red-500">•</span>}
                    </td>
                    
                    {Array.from({ length: config.seats }).map((_, seatIndex) => {
                      // Find booking for this time and seat
                      const booking = bookings.find(b => 
                        seatIndex === b.seat && 
                        convertTimeToMinutes(time) >= convertTimeToMinutes(b.startTime) && 
                        convertTimeToMinutes(time) < convertTimeToMinutes(b.endTime)
                      );
                      
                      const isBookingStart = booking && booking.startTime === time;
                      const isAvailable = !booking && isTimeSlotAvailable(time, selectedService.id, seatIndex);
                      const isPast = convertTimeToMinutes(time) < currentTimeMinutes;
                      
                      return (
                        <td 
                          key={seatIndex}
                          className={`
                            p-2 border border-gray-300 text-center h-12
                            ${isAvailable && !isPast ? 'cursor-pointer hover:bg-green-50' : ''}
                          `}
                          style={{
                            backgroundColor: booking ? booking.color : isPast ? '#f5f5f5' : 'white'
                          }}
                          onClick={() => {
                            if (isAvailable && !isPast) {
                              setSelectedSlot(time);
                              setSelectedSeat(seatIndex);
                            }
                          }}
                        >
                          {isBookingStart && <div className="font-medium">{booking.serviceName}</div>}
                        </td>
                      );
                    })}
                  </tr> 
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Current bookings */}
        <h2 className="text-xl font-semibold mb-2">Current Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300">ID</th>
                  <th className="p-2 border border-gray-300">Service</th>
                  <th className="p-2 border border-gray-300">Seat</th>
                  <th className="p-2 border border-gray-300">Start Time</th>
                  <th className="p-2 border border-gray-300">End Time</th>
                </tr>
              </thead>
              <tbody>
                {bookings.sort((a, b) => 
                  convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime)
                ).map(booking => (
                  <tr key={booking.id}>
                    <td className="p-2 border border-gray-300 text-center">{booking.id}</td>
                    <td className="p-2 border border-gray-300">{booking.serviceName}</td>
                    <td className="p-2 border border-gray-300 text-center">{booking.seat + 1}</td>
                    <td className="p-2 border border-gray-300 text-center">{booking.startTime}</td>
                    <td className="p-2 border border-gray-300 text-center">{booking.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
          <h2 className="text-lg font-semibold mb-2">How to Use</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Select a service from the buttons above</li>
            <li>The system will show you the next available time slots</li>
            <li>Click on a time slot to select it</li>
            <li>Click the "Book" button to confirm your appointment</li>
            <li>You can also click directly on the schedule grid to book a specific seat and time</li>
            <li>The yellow row indicates the current time</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SalonBookingApp;