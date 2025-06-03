'use client';

import React, { useState, useMemo } from 'react';

// Sample data generation
const sampleServices = [
  { name: 'Hair Cut & Style', duration: 60, price: 85.00 },
  { name: 'Hair Color', duration: 120, price: 150.00 },
  { name: 'Highlights', duration: 90, price: 120.00 },
  { name: 'Deep Conditioning', duration: 30, price: 45.00 },
  { name: 'Keratin Treatment', duration: 180, price: 280.00 },
  { name: 'Manicure', duration: 45, price: 35.00 },
  { name: 'Pedicure', duration: 60, price: 45.00 },
  { name: 'Gel Nails', duration: 75, price: 55.00 },
  { name: 'Facial Treatment', duration: 90, price: 95.00 },
  { name: 'Eyebrow Threading', duration: 20, price: 25.00 },
  { name: 'Massage Therapy', duration: 60, price: 80.00 },
  { name: 'Makeup Application', duration: 45, price: 65.00 }
];

const salonLocations = [
  'Downtown Salon',
  'Westside Beauty',
  'Uptown Studio',
  'Riverside Spa',
  'City Center Salon'
];

const customerNames = [
  'Emma Johnson', 'Sophia Brown', 'Olivia Davis', 'Ava Wilson', 'Isabella Moore',
  'Mia Taylor', 'Charlotte Anderson', 'Amelia Thomas', 'Harper Jackson', 'Evelyn White',
  'Madison Harris', 'Elizabeth Martin', 'Sofia Thompson', 'Avery Garcia', 'Ella Martinez'
];

const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

function getRandomDate(daysBack = 30) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split('T')[0];
}

function getRandomTime() {
  const hours = Math.floor(Math.random() * 12) + 8;
  const minutes = Math.random() < 0.5 ? 0 : 30;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function addMinutesToTime(time, minutes) {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

function generateRandomServices() {
  const numServices = Math.floor(Math.random() * 3) + 1;
  const selectedServices = [];
  
  for (let i = 0; i < numServices; i++) {
    const randomService = sampleServices[Math.floor(Math.random() * sampleServices.length)];
    if (!selectedServices.find(s => s.name === randomService.name)) {
      selectedServices.push(randomService);
    }
  }
  
  return selectedServices;
}

function generateSampleBookings(count = 20) {
  const bookings = [];
  
  for (let i = 0; i < count; i++) {
    const services = generateRandomServices();
    const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
    const totalAmount = services.reduce((sum, service) => sum + service.price, 0);
    const startTime = getRandomTime();
    const endTime = addMinutesToTime(startTime, totalDuration);
    
    const booking = {
      id: `booking-${i + 1}`,
      customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
      customerEmail: `${customerNames[Math.floor(Math.random() * customerNames.length)].toLowerCase().replace(' ', '.')}@email.com`,
      date: getRandomDate(),
      startTime,
      endTime,
      services,
      totalAmount,
      totalDuration,
      salonLocation: salonLocations[Math.floor(Math.random() * salonLocations.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
    
    bookings.push(booking);
  }
  
  return bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const SalonBookingDashboard = () => {
  const [bookings] = useState(generateSampleBookings());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSalon, setSelectedSalon] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());

  const salons = useMemo(() => {
    const uniqueSalons = [...new Set(bookings.map(booking => booking.salonLocation))];
    return uniqueSalons;
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const dateMatch = (!start || bookingDate >= start) && (!end || bookingDate <= end);
      const salonMatch = selectedSalon === 'all' || booking.salonLocation === selectedSalon;

      return dateMatch && salonMatch;
    });
  }, [bookings, startDate, endDate, selectedSalon]);

  const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const totalDuration = filteredBookings.reduce((sum, booking) => sum + booking.totalDuration, 0);

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

  const toggleCard = (bookingId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Recent Bookings</h1>
        <p className="text-gray-600 text-sm md:text-base">Manage and track your salon appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 md:p-3 bg-[#CE145B]/10 rounded-lg">
              <svg className="h-5 w-5 md:h-6 md:w-6 text-[#CE145B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 md:p-3 bg-[#CE145B]/10 rounded-lg">
              <svg className="h-5 w-5 md:h-6 md:w-6 text-[#CE145B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{filteredBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <div className="p-2 md:p-3 bg-[#CE145B]/10 rounded-lg">
              <svg className="h-5 w-5 md:h-6 md:w-6 text-[#CE145B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{(totalDuration / 60).toFixed(1)}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 md:px-4 py-2 border border-[#CE145B] text-[#CE145B] rounded-lg hover:bg-[#CE145B] hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm md:text-base"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span className="hidden sm:inline">{showFilters ? 'Hide' : 'Show'} Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:border-[#CE145B] text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:border-[#CE145B] text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salon Location</label>
              <select
                value={selectedSalon}
                onChange={(e) => setSelectedSalon(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:border-[#CE145B] bg-white text-sm md:text-base"
              >
                <option value="all">All Salons</option>
                {salons.map((salon) => (
                  <option key={salon} value={salon}>
                    {salon}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {(startDate || endDate || selectedSalon !== 'all') && (
          <div className="mt-4">
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setSelectedSalon('all');
              }}
              className="px-3 md:px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm md:text-base"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Bookings List */}
      <div className="space-y-3 md:space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
            <svg className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 text-sm md:text-base">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const isExpanded = expandedCards.has(booking.id);
            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                {/* Main Card Content - Always Visible */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
                    {/* Left Section - Customer & Basic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-[#CE145B]/10 rounded-lg flex-shrink-0">
                          <svg className="h-4 w-4 md:h-5 md:w-5 text-[#CE145B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">{booking.customerName}</h3>
                          <p className="text-xs md:text-sm text-gray-600 truncate">{booking.customerEmail}</p>
                        </div>
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      {/* Essential Info */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <svg className="h-3 w-3 md:h-4 md:w-4 text-[#CE145B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span className="font-semibold text-gray-900 truncate">${booking.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="h-3 w-3 md:h-4 md:w-4 text-[#CE145B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-gray-900 truncate">{booking.totalDuration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="h-3 w-3 md:h-4 md:w-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700 truncate">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="h-3 w-3 md:h-4 md:w-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700 truncate">{formatTime(booking.startTime)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => toggleCard(booking.id)}
                      className="flex items-center gap-2 px-3 py-2 text-[#CE145B] hover:bg-[#CE145B]/5 rounded-lg transition-colors duration-200 flex-shrink-0 self-start sm:self-center"
                    >
                      <span className="text-sm font-medium hidden sm:inline">
                        {isExpanded ? 'Less' : 'More'}
                      </span>
                      <svg 
                        className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="pt-4 md:pt-6">
                      {/* Services Details */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <svg className="h-4 w-4 text-[#CE145B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Services Booked
                        </h4>
                        <div className="space-y-2">
                          {booking.services.map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <div>
                                <p className="font-medium text-gray-900 text-sm md:text-base">{service.name}</p>
                                <p className="text-xs md:text-sm text-gray-600">{service.duration} minutes</p>
                              </div>
                              <p className="font-semibold text-[#CE145B] text-sm md:text-base">${service.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Information */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Salon Location</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{booking.salonLocation}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Time Slot</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 sm:col-span-2 lg:col-span-1">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Booking Date</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(booking.date)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SalonBookingDashboard;