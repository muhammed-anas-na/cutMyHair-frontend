'use client';
import React, { useState, useEffect } from 'react';
import { Bell, Search, MoreVertical, Phone, Send, Home, Calendar, Heart, User, Clock, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import Navigation from '@/components/Navigation/page';
import Header from '@/components/Header/page';
import { useAuth } from '@/context/AuthContext';
import { GET_USER_BOOKINGS_BY_ID_FN } from '@/services/userService';
import Link from 'next/link';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user_id } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await GET_USER_BOOKINGS_BY_ID_FN(user_id);
        if (response?.data?.response) {
          setBookings(response.data.response);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user_id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // Format time from 24-hour format (e.g. "09:00") to 12-hour format with AM/PM
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes}${ampm}`;
  };

  const getTotal = (services) => {
    return services.reduce((sum, service) => sum + service.price, 0);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-cyan-500';
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Page Title */}
      <div className="p-4">
        <h1 className="text-2xl font-semibold">My Bookings</h1>
      </div>

      {/* Bookings List */}
      <div className="px-4 space-y-4 pb-20">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#CE145B]"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="text-gray-500 mt-1">You haven't made any bookings yet.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg p-4 shadow-sm">
              {/* Date and Time */}
              <Link href={`/bookings/${booking._id}`}>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Clock className="w-5 h-5" />
                <span>{formatDate(booking.appointment_date)} at {formatTime(booking.scheduled_start_time)}</span>
              </div>

              {/* Salon Details */}
              <div className="mb-3">
                <h3 className="font-medium text-lg">{booking.salon_name || "Salon"}</h3>
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <p className="truncate">Booking ID: {booking._id.substring(0, 8)}</p>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-2 mb-4">
                {booking.services.map((service, index) => (
                  <div key={index} className="flex justify-between text-gray-600">
                    <span>{service.name}</span>
                    <span>₹{service.price}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{booking.total_price}</span>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                <span className={`${getStatusColor(booking.status)} font-medium capitalize`}>
                  {booking.status}
                </span>
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
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <Navigation currentPage={'bookings'} />
    </div>
  );
};

export default MyBookings;