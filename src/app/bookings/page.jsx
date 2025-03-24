'use client';
import React, { useState, useEffect } from 'react';
import { Bell, Search, MoreVertical, Phone, Send, Calendar, CalendarCheck, MapPin, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation/page';
import Header from '@/components/Header/page';
import { useAuth } from '@/context/AuthContext';
import { GET_USER_BOOKINGS_BY_ID_FN } from '@/services/userService';
import Link from 'next/link';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
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
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Enhanced time formatting function to handle different formats
  const formatTime = (timeString) => {
    try {
      // Case 1: Format like "Sat Mar 22 2025 14:00:00 GMT+0530 (India Standard Time)"
      if (timeString && timeString.includes('GMT')) {
        const date = new Date(timeString);
        if (!isNaN(date.getTime())) {
          let hours = date.getHours();
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const period = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
          return `${hours}:${minutes} ${period}`;
        }
      }
      
      // Case 2: Format like "08:30 AM"
      if (timeString && (timeString.includes('AM') || timeString.includes('PM'))) {
        return timeString;
      }
      
      // Case 3: 24-hour format like "09:00"
      if (timeString && timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
      }
      
      return 'N/A';
    } catch (error) {
      console.error("Error formatting time:", error);
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-cyan-100 text-cyan-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isBookingUpcoming = (booking) => {
    const now = new Date();
    const appointmentDate = new Date(booking.appointment_date);
    
    // Check if the date is in the future
    if (appointmentDate > now) return true;
    
    // If it's today, check if the appointment time is in the future
    if (appointmentDate.toDateString() === now.toDateString()) {
      // Convert booking time to comparable format
      let bookingHour, bookingMinute;
      
      if (booking.scheduled_start_time.includes('GMT')) {
        // Full date string format
        const timeDate = new Date(booking.scheduled_start_time);
        bookingHour = timeDate.getHours();
        bookingMinute = timeDate.getMinutes();
      } else if (booking.scheduled_start_time.includes('AM') || booking.scheduled_start_time.includes('PM')) {
        // "08:30 AM" format
        const [timePart, period] = booking.scheduled_start_time.split(' ');
        const [hours, minutes] = timePart.split(':').map(Number);
        bookingHour = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
        bookingMinute = minutes;
      } else {
        // 24-hour format
        const [hours, minutes] = booking.scheduled_start_time.split(':').map(Number);
        bookingHour = hours;
        bookingMinute = minutes;
      }
      
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      if (bookingHour > currentHour || (bookingHour === currentHour && bookingMinute > currentMinute)) {
        return true;
      }
    }
    
    return false;
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return isBookingUpcoming(booking);
    } else {
      return !isBookingUpcoming(booking);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Page Title and Tabs */}
      <div className="p-4 pb-2">
        <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button 
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'upcoming' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'past' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-4 pt-2 pb-20">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center mt-4">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No {activeTab} bookings</h3>
            <p className="text-gray-500 mt-2 mb-6">You don't have any {activeTab} appointments.</p>
            {activeTab === 'upcoming' && (
              <Link href="/services" className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                Book a Service
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {filteredBookings.map((booking) => (
              <Link key={booking._id} href={`/bookings/${booking._id}`} className="block">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                  {/* Status Banner */}
                  <div className={`px-4 py-1.5 text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </div>
                  
                  <div className="p-4">
                    {/* Date and Time */}
                    <div className="flex items-center mb-3">
                      <div className="bg-pink-50 rounded-lg p-2 mr-3">
                        <Clock className="w-5 h-5 text-pink-500" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{formatDate(booking.appointment_date)}</p>
                        <p className="text-gray-600 text-sm">{formatTime(booking.scheduled_start_time)}</p>
                      </div>
                    </div>

                    {/* Salon Details */}
                    <div className="flex items-start mb-4">
                      <div className="bg-pink-50 rounded-lg p-2 mr-3">
                        <MapPin className="w-5 h-5 text-pink-500" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{booking.salon_name || "Salon"}</p>
                        <p className="text-gray-500 text-sm">Booking ID: {booking._id.substring(0, 10)}...</p>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Services Booked</h4>
                      <div className="space-y-2">
                        {booking.services.map((service, index) => (
                          <div key={index} className="flex justify-between text-gray-600 text-sm">
                            <span>{service.name}</span>
                            <span>₹{service.price}</span>
                          </div>
                        ))}
                        <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-medium">
                          <span>Total</span>
                          <span className="text-pink-600">₹{booking.total_price}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {booking.total_duration} mins
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-50 rounded-full" onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle contact functionality
                        }}>
                          <Phone className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-50 rounded-full" onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle share functionality
                        }}>
                          <Send className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <Navigation currentPage={'bookings'} />
    </div>
  );
};

export default MyBookings;