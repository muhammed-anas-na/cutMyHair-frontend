
import React from 'react';
import { Calendar, Clock, MapPin, DollarSign, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {  Booking } from '@/utils/sampleData';

const BookingCard = ({ booking }) => {
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Section - Customer & Services */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#CE145B]/10 rounded-lg">
              <User className="h-5 w-5 text-[#CE145B]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{booking.customerName}</h3>
              <p className="text-sm text-gray-600">{booking.customerEmail}</p>
            </div>
            <Badge className={`ml-auto ${getStatusColor(booking.status)} font-medium`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Services:</h4>
            {booking.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-600">{service.duration} minutes</p>
                </div>
                <p className="font-semibold text-[#CE145B]">${service.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Details */}
        <div className="lg:w-80 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{booking.salonLocation}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Start Time</p>
              <p className="text-sm font-semibold text-gray-900">{formatTime(booking.startTime)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">End Time</p>
              <p className="text-sm font-semibold text-gray-900">{formatTime(booking.endTime)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Duration</p>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-[#CE145B]" />
                <span className="text-sm font-semibold text-gray-900">{booking.totalDuration} min</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Amount</p>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-[#CE145B]" />
                <span className="text-sm font-semibold text-gray-900">${booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;