'use client';
import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, MapPin, User } from 'lucide-react';
import Script from 'next/script';
import { CREATE_ORDER_FN, CONFIRM_BOOKING_FN } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const BookingModal = ({ isOpen, onClose, selectedServices, setSelectedServices, totalPrice, totalDuration, salonData }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTime, setSelectedTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');
  const [customDate, setCustomDate] = useState('');
  const {user_id} = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Set default selected time to first available slot
      if (!selectedTime && timeSlots.length > 0) {
        setSelectedTime(timeSlots[0].time);
      }
      
      // Format the date based on selection
      updateFormattedDate();
    } else {
      document.body.style.overflow = 'unset';
      // Reset the success state when modal is closed
      setBookingSuccess(false);
      setBookingDetails(null);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, selectedDate, customDate]);

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
      day: 'numeric'
    });
  };

  const getISODateString = () => {
    const today = new Date();
    
    if (selectedDate === 'today') {
      return today.toISOString().split('T')[0];
    } else if (selectedDate === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    } else if (selectedDate === 'pick' && customDate) {
      return customDate;
    }
    
    return today.toISOString().split('T')[0];
  };

  if (!isOpen && !isAnimating) return null;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
    router.replace(`/bookings/${bookingDetails._id}`)
  };

  const timeSlots = [
    { id: 1, time: '9:00 AM' },
    { id: 2, time: '12:00 PM' },
    { id: 3, time: '2:00 PM' },
    { id: 4, time: '4:00 PM' }
  ];

  const handleBooking = async () => {
    // Validate selections
    if (!selectedTime || (selectedDate === 'pick' && !customDate)) {
      alert('Please select a valid date and time');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create an order in Razorpay
      const response = await CREATE_ORDER_FN(totalPrice);
      console.log("Order created:", response);
      
      if (!response.data || !response.data.orderId) {
        throw new Error("Failed to create order");
      }
      
      // Prepare Razorpay options
      const options = {
        key: 'rzp_test_SNNaKxo04yi7Lf',
        amount: totalPrice * 100,
        currency: 'INR',
        name: salonData?.name || "Salon Booking",
        description: `Booking for ${selectedServices.length} services`,
        order_id: response.data.orderId,
        handler: function(paymentResponse) {
          console.log("Payment Successful", paymentResponse);
          confirmBooking(paymentResponse);
        },
        prefill: {
          name: "John Doe",
          email: "john@gmail.com",
          contact: "8089568695",
        },
        theme: {
          color: "#CE145B",
        }
      };
      
      // Open Razorpay checkout
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
      // Format the booking details to send to the server
      const bookingData = {
        salon_id: salonData?.salon_id,
        salon_name: salonData?.name,
        user_id: user_id,
        services: selectedServices.map(service => ({
          service_id: service.service_id,
          name: service.name,
          price: service.price,
          duration: service.duration
        })),
        appointment_date: getISODateString(),
        appointment_time: selectedTime,
        total_price: totalPrice,
        total_duration: totalDuration,
        payment_details: {
          payment_id: paymentResponse.razorpay_payment_id,
          order_id: paymentResponse.razorpay_order_id,
          signature: paymentResponse.razorpay_signature
        },
        status: "confirmed",
        booking_date: new Date().toISOString()
      };
      
      // Send booking details to server
      const response = await CONFIRM_BOOKING_FN(bookingData);
      console.log(response);
      if (response.status === 200) {
        console.log("Booking confirmed:", response.data);
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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300 
        ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <Script src='https://checkout.razorpay.com/v1/checkout.js' />
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Modal Content */}
      <div
        className={`relative bg-white w-full sm:w-max-lg sm:rounded-t-xl rounded-t-xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          sm:max-w-md w-full`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="p-4">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {bookingSuccess ? (
            // Success screen
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
              
              <button 
                onClick={handleClose}
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium"
              >
                Done
              </button>
            </div>
          ) : (
            // Booking form
            <>
              {/* Selected Services */}
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

              {/* Date Selection */}
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
                  <button
                    className={`px-4 py-2 rounded-lg border flex-1 min-w-[100px] ${selectedDate === 'pick' ? 'bg-pink-100 border-pink-300' : 'border-gray-300'}`}
                    onClick={() => setSelectedDate('pick')}
                  >
                    Pick a Date
                  </button>
                </div>

                {/* Custom date picker */}
                {selectedDate === 'pick' && (
                  <div className="mb-6">
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg"
                      min={new Date().toISOString().split('T')[0]}
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                    />
                  </div>
                )}

                {/* Time Slots */}
                <p className="text-gray-600 mb-2">Slots</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      className={`px-4 py-2 rounded-lg border ${selectedTime === slot.time ? 'bg-pink-100 border-pink-300' : 'border-gray-300'}`}
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salon Details */}
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

        {/* Bottom Action - Fixed at bottom */}
        {!bookingSuccess && (
          <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
            <button
              className={`w-full py-4 rounded-lg font-medium ${isProcessing ? 'bg-gray-400 text-white' : 'bg-pink-600 text-white'}`}
              onClick={handleBooking}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ₹${totalPrice} and Confirm Booking`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;