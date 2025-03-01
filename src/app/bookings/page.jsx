'use client';
import React from 'react';
import { Bell, Search, MoreVertical, Phone, Send, Home, Calendar, Heart, User, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation/page';
import Header from '@/components/Header/page';

const MyBookings = () => {
  const bookings = [
    {
      id: 1,
      date: '24-04-2020',
      time: '2:00PM',
      salonName: 'Seurie Beauty Salon',
      location: 'Fort Kochi, Kerala',
      services: [
        { name: 'Hair Cut - Senior Stylist', price: 600 },
        { name: 'Beard Trim', price: 264 }
      ],
      status: 'Confirmed',
      statusColor: 'text-cyan-500'
    },
    {
      id: 2,
      date: '18-03-2020',
      time: '11:00AM',
      salonName: 'Matifs Salon',
      location: 'Fort Kochi, Kerala',
      services: [
        { name: 'Hair Cut', price: 500 },
        { name: 'Beard Trim', price: 220 }
      ],
      status: 'Completed',
      statusColor: 'text-orange-400'
    }
  ];

  const getTotal = (services) => {
    return services.reduce((sum, service) => sum + service.price, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>

      {/* Page Title */}
      <div className="p-4">
        <h1 className="text-2xl font-semibold">My Bookings</h1>
      </div>

      {/* Bookings List */}
      <div className="px-4 space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg p-4 shadow-sm">
            {/* Date and Time */}
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Clock className="w-5 h-5" />
              <span>{booking.date} at {booking.time}</span>
            </div>

            {/* Salon Details */}
            <div className="mb-3">
              <h3 className="font-medium text-lg">{booking.salonName}</h3>
              <p className="text-gray-500">{booking.location}</p>
            </div>

            {/* Services */}
            <div className="space-y-2 mb-4">
              {booking.services.map((service, index) => (
                <div key={index} className="text-gray-600">
                  {service.name}
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              <span className={`${booking.statusColor} font-medium`}>
                {booking.status}
              </span>
              <div className="flex items-center gap-4">
                <span className="font-medium">₹{getTotal(booking.services)}</span>
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-50 rounded-full">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-50 rounded-full">
                    <Send className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-50 rounded-full">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <Navigation currentPage={'bookings'}/>
    </div>
  );
};

export default MyBookings;