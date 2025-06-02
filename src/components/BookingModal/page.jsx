'use client';
import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, MapPin, User, ChevronRight, ChevronUp } from 'lucide-react';
import Script from 'next/script';
import { CREATE_ORDER_FN, CONFIRM_BOOKING_FN, GET_TIME_SLOTS_FN } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { formatTo12HourIST } from '@/helpers';

const BookingModal = ({ isOpen, onClose, selectedServices, setSelectedServices, totalPrice, totalDuration, salonData }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTime, setSelectedTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const { user_id } = useAuth();
  const router = useRouter();

  // Number of time slots to show initially
  const initialSlotsToShow = 8;

  // Generate calendar days for the next 7 days starting from today
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      
      days.push({
        day: dayNames[date.getDay()],
        date: date.getDate().toString(),
        month: monthNames[date.getMonth()],
        fullDate: date.toISOString().split('T')[0],
        isToday: i === 0,
        dateObject: date
      });
    }
    
    return days;
  };

  const [calendarDays] = useState(generateCalendarDays());

  useEffect(() => {
    if (isOpen) {
      if (typeof window === 'undefined') return;
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      updateFormattedDate();
    } else {
      if (typeof window === 'undefined') return;
      document.body.style.overflow = 'unset';
      setBookingSuccess(false);
      setBookingDetails(null);
      setShowAllSlots(false);
    }

    return () => {
      if (typeof window === 'undefined') return;
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    async function fetchTimeSlots() {
      console.log("Fetching time slots");
      setIsLoadingSlots(true);
      setSelectedTime(null);
      const isoDate = getISODateString();
      console.log("Date==>", isoDate);
      const response = await GET_TIME_SLOTS_FN(salonData.salon_id, isoDate, totalDuration);
      console.log("Fetched Time slots ==>", response);
      
      // First check if salon is closed
      if (response.data && response.data.message === "Salon is closed on this date") {
        console.log("Salon is closed");
        setIsClosed(true);
        setTimeSlots([]);
        setSelectedTime(null);
      } 
      // Then check if we have time slots
      else if (response.data && response.data.success && response.data.data && response.data.data.timeSlots && response.data.data.timeSlots.length > 0) {
        console.log("Found time slots");
        setIsClosed(false);
        const fetchedSlots = response.data.data.timeSlots.map((slot, index) => ({
          id: index + 1,
          time: slot.formattedTime,
          rawTime: slot.formattedTime,
          displayTime: formatTo12HourIST(slot.formattedTime),
          availableSeats: slot.availableSeats,
        }));
        setTimeSlots(fetchedSlots);
        if (fetchedSlots.length > 0 && !selectedTime) {
          setSelectedTime(fetchedSlots[0].rawTime);
        }
      } 
      // Default case - no slots available but salon is open
      else {
        console.log("No slots available");
        setIsClosed(false);
        setTimeSlots([]);
        setSelectedTime(null);
      }
      setShowAllSlots(false);
      setIsLoadingSlots(false);
    }

    if (isOpen) {
      fetchTimeSlots();
    }
  }, [isOpen, selectedDate, customDate, salonData?.salon_id, totalDuration]);

  const updateFormattedDate = () => {
    const today = new Date();
    let dateToUse;

    if (selectedDate === 'today') {
      dateToUse = today;
      setFormattedDate(formatDate(today));
    } else if (selectedDate === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateToUse = tomorrow;
      setFormattedDate(formatDate(tomorrow));
    } else if (selectedDate === 'pick' && customDate) {
      dateToUse = new Date(customDate);
      setFormattedDate(formatDate(dateToUse));
    } else {
      const selectedDay = calendarDays.find(day => day.fullDate === selectedDate);
      if (selectedDay) {
        dateToUse = selectedDay.dateObject;
        setFormattedDate(formatDate(dateToUse));
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateHeader = (date) => {
    const selected = calendarDays.find(day => day.fullDate === date);
    if (selected) {
      const dayName = selected.dateObject.toLocaleDateString('en-US', { weekday: 'long' });
      return `${selected.isToday ? 'Today' : dayName} | ${selected.date} ${selected.month}, ${dayName}, ${selected.dateObject.getFullYear()}`;
    }
    return 'Select Date';
  };

  const getISODateString = () => {
    const today = new Date();
    let dateToUse = today;
  
    if (selectedDate === 'today') {
      dateToUse = today;
    } else if (selectedDate === 'tomorrow') {
      dateToUse = new Date(today);
      dateToUse.setDate(today.getDate() + 1);
    } else if (selectedDate === 'pick' && customDate) {
      try {
        const parsedDate = new Date(customDate);
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid custom date:", customDate);
          dateToUse = today;
        } else {
          dateToUse = parsedDate;
        }
      } catch (error) {
        console.error("Error parsing custom date:", error);
        dateToUse = today;
      }
    } else {
      const selectedDay = calendarDays.find(day => day.fullDate === selectedDate);
      if (selectedDay) {
        dateToUse = selectedDay.dateObject;
      }
    }
  
    const year = dateToUse.getFullYear();
    const month = String(dateToUse.getMonth() + 1).padStart(2, "0");
    const day = String(dateToUse.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (newDate) => {
    console.log("Date changed to:", newDate);
    setSelectedDate(newDate);
  };

  if (!isOpen && !isAnimating) return null;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
    if (bookingSuccess && bookingDetails?._id) {
      router.replace(`/bookings/${bookingDetails._id}`);
    }
  };

  const handleBooking = async () => {
    if (!selectedTime) {
      alert('Please select a valid time slot');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await CREATE_ORDER_FN(totalPrice);

      if (!response.data || !response.data.orderId) {
        throw new Error("Failed to create order");
      }

      const options = {
        key: 'rzp_test_SNNaKxo04yi7Lf',
        amount: totalPrice * 100,
        currency: 'INR',
        name: salonData?.name || "Salon Booking",
        description: `Booking for ${selectedServices.length} services`,
        order_id: response.data.orderId,
        handler: function (paymentResponse) {
          confirmBooking(paymentResponse);
        },
        prefill: {
          name: "John Doe",
          email: "john@gmail.com",
          contact: "8089568695",
        },
        theme: {
          color: "#CE145B",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmBooking = async (paymentResponse) => {
    try {
      const selectedSlot = timeSlots.find(slot => slot.rawTime === selectedTime);
      const displayTimeForBooking = selectedSlot ? selectedSlot.displayTime : formatTo12HourIST(selectedTime);
      
      const bookingData = {
        salon_id: salonData?.salon_id,
        salon_name: salonData?.name,
        user_id: user_id,
        services: selectedServices.map(service => ({
          service_id: service.service_id,
          name: service.name,
          price: service.price,
          duration: service.duration,
        })),
        appointment_date: getISODateString(),
        scheduled_start_time: displayTimeForBooking,
        total_price: totalPrice,
        total_duration: totalDuration,
        payment_details: {
          payment_id: paymentResponse.razorpay_payment_id,
          order_id: paymentResponse.razorpay_order_id,
          signature: paymentResponse.razorpay_signature,
        },
        status: "confirmed",
        booking_date: new Date().toISOString(),
      };
      
      const response = await CONFIRM_BOOKING_FN(bookingData);
      if (response.status === 200) {
        setBookingSuccess(true);
        setBookingDetails(response.data.data || bookingData);
      } else {
        throw new Error("Failed to confirm booking");
      }
    } catch (err) {
      console.error("Booking confirmation failed:", err);
      alert("Payment was successful, but we couldn't confirm your booking. Our team will contact you shortly.");
    }
  };

  const displayTimeSlots = showAllSlots 
    ? timeSlots 
    : timeSlots.slice(0, initialSlotsToShow);
    
  const getSelectedDisplayTime = () => {
    const slot = timeSlots.find(s => s.rawTime === selectedTime);
    return slot ? slot.displayTime : (selectedTime ? formatTo12HourIST(selectedTime) : '');
  };
  
  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300 
        ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <Script src='https://checkout.razorpay.com/v1/checkout.js' />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div
        className={`relative bg-white w-full sm:w-max-lg sm:rounded-t-xl rounded-t-xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'} sm:max-w-md w-full`}
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="p-4">
            <button onClick={handleClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-2">
              {bookingSuccess ? 'Booking Confirmed!' : 'Book Appointment'}
            </h2>
            {!bookingSuccess && (
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>Approximately {totalDuration} mins</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="overflow-y-auto">
          {bookingSuccess ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Your appointment is confirmed!</h3>
              <p className="text-gray-600 mb-6">We look forward to seeing you at the salon.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start mb-3">
                  <Calendar className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Date & Time</p>
                    <p className="font-medium">{formattedDate}</p>
                    <p className="font-medium">{getSelectedDisplayTime()}</p>
                  </div>
                </div>
                <div className="flex items-start mb-3">
                  <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="font-medium">{salonData?.name || 'Sample Salon'}</p>
                    <p className="text-gray-600 text-sm">{salonData?.location_text || 'Sample Location'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Booking Details</p>
                    <p className="font-medium">{selectedServices?.length || 0} Services</p>
                    <p className="text-gray-600 text-sm">Total: ₹{totalPrice}</p>
                  </div>
                </div>
              </div>
              <button onClick={handleClose} className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium">
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium mb-4">Confirm your services</h3>
                {selectedServices?.map((service, index) => (
                  <div key={service.service_id || index} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1"
                        onClick={() => {
                          const updatedServices = selectedServices.filter(s => s.service_id !== service.service_id);
                          setSelectedServices(updatedServices);
                          if (updatedServices.length === 0) {
                            onClose();
                          }
                        }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <span>₹{service.price}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Approx. {service.duration} mins</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{service.description}</p>
                  </div>
                )) || (
                  <div className="text-gray-500">No services selected</div>
                )}
                <button className="text-pink-600 font-medium mt-4" onClick={handleClose}>Add more services +</button>
              </div>

              <div className="p-4 border-b">
                <h3 className="text-lg font-medium mb-4">Select Date & Time Of Appointment</h3>
                
                <div className="mb-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-gray-700 font-medium text-sm">
                      {formatDateHeader(selectedDate)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between gap-2 overflow-auto scrollbar-hide">
                    <style jsx>{`
                      .calendar-container::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    <div className="flex gap-2 flex-1 calendar-container">
                      {calendarDays.map((day) => (
                        <button
                          key={day.fullDate}
                          onClick={() => handleDateChange(day.fullDate)}
                          className={`flex flex-col items-center p-2 rounded-xl min-w-[50px] transition-all flex-shrink-0 ${
                            selectedDate === day.fullDate
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span className="text-xs font-medium mb-1">{day.day}</span>
                          <span className="text-lg font-bold mb-1">{day.date}</span>
                          <span className="text-xs font-medium">{day.month}</span>
                        </button>
                      ))}
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isLoadingSlots ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading available slots...</p>
                  </div>
                ) : isClosed ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Salon is closed</h3>
                    <p className="text-gray-600 mb-4">
                      The salon is not open on this date.
                      Please try another date.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-3 text-sm">Available Time Slots</p>
                    {timeSlots.length > 0 ? (
                      <>
                        <div className="grid grid-cols-3 gap-3">
                          {displayTimeSlots.map((slot) => (
                            <button
                              key={slot.id}
                              className={`p-3 rounded-xl border-2 text-center font-medium transition-all ${
                                selectedTime === slot.rawTime
                                  ? 'bg-pink-50 border-pink-300 text-pink-700'
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedTime(slot.rawTime)}
                            >
                              {slot.displayTime}
                            </button>
                          ))}
                        </div>
                        {timeSlots.length > initialSlotsToShow && (
                          <button 
                            className="text-pink-600 font-medium text-center w-full mt-3"
                            onClick={() => setShowAllSlots(!showAllSlots)}
                          >
                            {showAllSlots ? 'Show Less' : `Show All (${timeSlots.length}) Slots`}
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No slots available</h3>
                        <p className="text-gray-600 mb-4">
                          We don't have any available slots for this date. 
                          Please try another date or contact the salon directly.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="p-4 border-b">
                <h3 className="text-lg font-medium mb-4">Salon Details</h3>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">{salonData?.name || 'Sample Salon'}</p>
                    <p className="text-gray-600 text-sm">{salonData?.location_text || 'Sample Location'}</p>
                    <a
                      href={`https://maps.google.com/?q=${salonData?.location_text || 'sample location'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 text-sm inline-block mt-1"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b flex justify-between items-center">
                <p className="text-gray-600 text-sm">View offers</p>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>

              <div className="p-4 border-b">
                <h3 className="text-lg font-medium mb-4">Apply Coupon</h3>
                <div className="flex items-start gap-3">
                  <input type="text" placeholder="Enter coupon code" className="w-full border border-gray-300 rounded-lg p-2" />
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-lg">Apply</button>
                </div>
              </div>

              <div className="bg-white mx-4 rounded-lg shadow-sm">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center mr-3">
                      <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-pink-600 rounded-sm"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 line-through mr-2">To Pay ₹{totalPrice}</span>
                        <span className="text-lg font-semibold text-gray-900">₹{totalPrice}</span>
                      </div>
                      <p className="text-sm text-green-600 font-medium">₹0 saved on the total!</p>
                    </div>
                  </div>
                  <ChevronUp className={`w-5 h-5 text-gray-400 transition-transform ${showDetails ? '' : 'rotate-180'}`} />
                </div>

                {showDetails && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="space-y-3 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Service Cost</span>
                        <span className="text-gray-900">₹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Extra discount for you</span>
                        <span className="text-green-600">-₹00.00</span>
                      </div>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-gray-900">To Pay</span>
                        <span className="text-gray-900">₹{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {!bookingSuccess && (
          <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
            <button
              className={`w-full py-4 rounded-lg font-medium ${
                !selectedTime || timeSlots.length === 0 || isProcessing || isLoadingSlots
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-pink-600 text-white'
              }`}
              onClick={handleBooking}
              disabled={!selectedTime || timeSlots.length === 0 || isProcessing || isLoadingSlots}
            >
              {isProcessing 
                ? 'Processing...' 
                : isLoadingSlots
                  ? 'Loading...'
                  : timeSlots.length === 0 
                    ? 'No Available Slots' 
                    : `Pay ₹${totalPrice} and Confirm Booking`
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;