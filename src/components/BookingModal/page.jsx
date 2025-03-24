'use client';
import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, MapPin, User } from 'lucide-react';
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
  const { user_id } = useAuth();
  const router = useRouter();

  // Number of time slots to show initially
  const initialSlotsToShow = 8;

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      updateFormattedDate();
    } else {
      document.body.style.overflow = 'unset';
      setBookingSuccess(false);
      setBookingDetails(null);
      setShowAllSlots(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, selectedDate, customDate]);

  useEffect(() => {
    async function fetchTimeSlots() {
      console.log("Fetching time slots");
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
          availableSeats: slot.availableSeats,
        }));
        setTimeSlots(fetchedSlots);
        if (fetchedSlots.length > 0 && !selectedTime) {
          setSelectedTime(fetchedSlots[0].time);
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

  const getISODateString = () => {
    const today = new Date(); // Local time: e.g., March 22, 2025, 1:28 AM IST
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
    }
  
    // Use local IST date components
    const year = dateToUse.getFullYear();
    const month = String(dateToUse.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(dateToUse.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
        scheduled_start_time: formatTo12HourIST(selectedTime),
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

  // Prepare time slots for display with pagination
  const displayTimeSlots = showAllSlots 
    ? timeSlots 
    : timeSlots.slice(0, initialSlotsToShow);
  console.log(selectedTime);
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
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                </div>
                <div className="flex items-start mb-3">
                  <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="font-medium">{salonData?.name}</p>
                    <p className="text-gray-600 text-sm">{salonData?.location_text}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Booking Details</p>
                    <p className="font-medium">{selectedServices.length} Services</p>
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
                {selectedServices.map((service) => (
                  <div key={service.service_id} className="mb-4 last:mb-0">
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
                ))}
                <button className="text-pink-600 font-medium mt-4" onClick={handleClose}>Add more services +</button>
              </div>
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium mb-4">Select Date and Time</h3>
                <p className="text-gray-600 mb-2">Date</p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    className={`px-4 py-2 rounded-lg border flex-1 min-w-[100px] ${selectedDate === 'today' ? 'bg-pink-100 border-pink-300' : 'border-gray-300'}`}
                    onClick={() => setSelectedDate('today')}
                  >
                    Today
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg border flex-1 min-w-[100px] ${selectedDate === 'tomorrow' ? 'bg-pink-100 border-pink-300' : 'border-gray-300'}`}
                    onClick={() => setSelectedDate('tomorrow')}
                  >
                    Tomorrow
                  </button>
                </div>
            
                {isClosed ? (
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
                    <p className="text-gray-600 mb-2">Slots</p>
                    {timeSlots.length > 0 ? (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {displayTimeSlots.map((slot) => (
                            
                            <button
                              key={slot.id}
                              className={`px-4 py-2 rounded-lg border ${selectedTime === slot.time ? 'bg-pink-100 border-pink-300' : 'border-gray-300'}`}
                              onClick={() => setSelectedTime(formatTo12HourIST(slot.time))}
                            >
                              {formatTo12HourIST(slot.time)}
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
                        <div className="flex justify-center space-x-3">
                          <button
                            className="px-4 py-2 rounded-lg border border-pink-300 text-pink-600"
                            onClick={() => setSelectedDate(selectedDate === 'today' ? 'tomorrow' : 'today')}
                          >
                            Try {selectedDate === 'today' ? 'Tomorrow' : 'Today'}
                          </button>
                        </div>
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
                    <p className="font-medium">{salonData?.name}</p>
                    <p className="text-gray-600 text-sm">{salonData?.location_text}</p>
                    <a
                      href={`https://maps.google.com/?q=${salonData?.location_text}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 text-sm inline-block mt-1"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {!bookingSuccess && (
          <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
            <button
              className={`w-full py-4 rounded-lg font-medium ${
                !selectedTime || timeSlots.length === 0 || isProcessing 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-pink-600 text-white'
              }`}
              onClick={handleBooking}
              disabled={!selectedTime || timeSlots.length === 0 || isProcessing}
            >
              {isProcessing 
                ? 'Processing...' 
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