'use client';
import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, selectedServices, totalPrice, totalDuration }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const timeSlots = [
    { id: 1, time: '9:00AM' },
    { id: 2, time: '12:00PM' },
    { id: 3, time: '2:00PM' },
    { id: 4, time: 'Pick a Time' }
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300 
        ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
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
            <h2 className="text-2xl font-semibold mb-2">Book Appointment</h2>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>Approximately {totalDuration} Mins</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Selected Services */}
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium mb-4">Confirm your services</h3>
            {selectedServices.map((service) => (
              <div key={service.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">{service.name}</h4>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span>₹{service.price}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Approx. {service.duration} Mins</span>
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
                className={`px-4 py-2 rounded-lg border flex-1 min-w-[100px] ${
                  selectedDate === 'today' ? 'bg-pink-100 border-pink-300' : 'border-gray-300'
                }`}
                onClick={() => setSelectedDate('today')}
              >
                Today
              </button>
              <button
                className={`px-4 py-2 rounded-lg border flex-1 min-w-[100px] ${
                  selectedDate === 'tomorrow' ? 'bg-pink-100 border-pink-300' : 'border-gray-300'
                }`}
                onClick={() => setSelectedDate('tomorrow')}
              >
                Tomorrow
              </button>
              <button
                className={`px-4 py-2 rounded-lg border flex-1 min-w-[100px] ${
                  selectedDate === 'pick' ? 'bg-pink-100 border-pink-300' : 'border-gray-300'
                }`}
                onClick={() => setSelectedDate('pick')}
              >
                Pick a Date
              </button>
            </div>

            {/* Time Slots */}
            <p className="text-gray-600 mb-2">Slots</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedTime === slot.time ? 'bg-pink-100 border-pink-300' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
          <button 
            className="w-full bg-pink-600 text-white py-4 rounded-lg font-medium"
            onClick={() => {
              // Handle booking confirmation
              console.log('Booking confirmed:', {
                date: selectedDate,
                time: selectedTime,
                services: selectedServices,
                totalPrice,
              });
            }}
          >
            Pay ₹{totalPrice} and Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;