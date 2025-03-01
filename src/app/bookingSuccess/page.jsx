'use client';
import React from 'react';
import { ArrowLeft, Download, MoreVertical } from 'lucide-react';

const BookingConfirmation = ({ 
  bookingDetails = {
    date: 'Today, 24-04-2020',
    time: '2:00PM',
    customer: {
      name: 'John Doe',
      phone: '+91-9912345678'
    },
    salon: {
      name: 'Seurie Beauty Salon',
      location: 'Fort Kochi, Kerala'
    },
    services: [
      {
        name: 'Hair Cut - Senior Stylist',
        description: 'Be a cut above the rest with our wide range of stylish haircuts.'
      },
      {
        name: 'Beard Trim',
        description: 'Flaunt a style you love the most. We have just the right variety of styling services for you.'
      }
    ]
  }
}) => {
  return (
    <div className="max-w-lg mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
          <h1 className="text-xl font-semibold">Booking Confirmation</h1>
        </div>
        <div className="flex items-center gap-4">
          <Download className="w-6 h-6 text-gray-600" />
          <MoreVertical className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-6">
          Congratulations! Your booking at Seurie Beauty Salon has been confirmed. 🎉
        </p>
        
        {/* QR Code Placeholder */}
        <div className="w-48 h-48 mx-auto mb-6 relative">
          <img 
            src="qr-code.png"
            alt="Booking QR Code"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Date and Time */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Date and Time of Appointment</h2>
          <p className="text-gray-600">{`${bookingDetails.date} at ${bookingDetails.time}`}</p>
        </div>

        {/* Customer Details */}
        <div className="border-t pt-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Customer Details</h2>
          <div className="text-left">
            <p className="text-gray-900 mb-1">{bookingDetails.customer.name}</p>
            <p className="text-gray-600">{bookingDetails.customer.phone}</p>
          </div>
        </div>

        {/* Salon Details */}
        <div className="border-t pt-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Salon Details</h2>
          <div className="text-left flex justify-between items-start">
            <div>
              <p className="text-gray-900 mb-1">{bookingDetails.salon.name}</p>
              <p className="text-gray-600">{bookingDetails.salon.location}</p>
            </div>
            <a href="#" className="text-pink-600 text-sm">Get Directions</a>
          </div>
        </div>

        {/* Services Booked */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-medium mb-4 text-left">Services Booked</h2>
          <div className="space-y-4">
            {bookingDetails.services.map((service, index) => (
              <div key={index} className="text-left">
                <h3 className="font-medium mb-1">{service.name}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;