'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Phone, Mail, Clock, CreditCard, Calendar, User, Store, MapPin } from 'lucide-react';

const SalonSchedule = () => {
  const [date, setDate] = useState(new Date());
  const [selectedStylist, setSelectedStylist] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedSalon, setSelectedSalon] = useState('1');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSalonSwitcherOpen, setIsSalonSwitcherOpen] = useState(false);

  // Enhanced sample data with more details
  const [appointments] = useState([
    {
      id: 1,
      salonId: '1',
      customerName: "Alice Johnson",
      service: "Haircut & Style",
      startTime: "10:00",
      endTime: "11:00",
      stylist: "Sarah",
      status: "confirmed",
      phone: "+1 (555) 123-4567",
      email: "alice.j@example.com",
      services: [
        { name: "Haircut & Style", price: 85 },
        { name: "Deep Conditioning", price: 45 }
      ],
      notes: "Prefers natural products. Allergic to strong fragrances.",
      paymentStatus: "paid",
      totalAmount: 130,
      lastVisit: "2024-01-15",
      profileImage: "/api/placeholder/64/64"
    },
    {
      id: 2,
      salonId: '2',
      customerName: "Bob Smith",
      service: "Hair Color",
      startTime: "10:00",
      endTime: "12:00",
      stylist: "Mike",
      status: "in-progress",
      phone: "+1 (555) 987-6543",
      email: "bob.s@example.com",
      services: [
        { name: "Full Color", price: 120 },
        { name: "Toner", price: 40 }
      ],
      notes: "Regular client - prefers cooler tones",
      paymentStatus: "pending",
      totalAmount: 160,
      lastVisit: "2024-02-01",
      profileImage: "/api/placeholder/64/64"
    }
  ]);

  const [salons] = useState([
    {
      id: '1',
      name: 'Downtown Salon',
      address: '123 Main St',
      stylists: ['Sarah', 'Mike', 'Emma'],
      stats: {
        todayAppointments: 12,
        availableSlots: 4
      }
    },
    {
      id: '2',
      name: 'Uptown Salon',
      address: '456 Park Ave',
      stylists: ['John', 'Lisa', 'David'],
      stats: {
        todayAppointments: 8,
        availableSlots: 6
      }
    }
  ]);

  // Generate time slots from 9 AM to 8 PM
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Filter appointments by selected salon
  const getAppointmentsForTimeSlot = (time) => {
    return appointments.filter(apt => 
      apt.startTime === time && 
      apt.salonId === selectedSalon &&
      (selectedStylist === 'all' || apt.stylist === selectedStylist)
    );
  };

  const handlePreviousDay = () => {
    setDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'confirmed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const currentSalon = salons.find(salon => salon.id === selectedSalon);

  // Salon switcher component
  const SalonSwitcher = () => (
    <div className="relative">
      <button
        onClick={() => setIsSalonSwitcherOpen(!isSalonSwitcherOpen)}
        className="flex items-center gap-2 bg-white bg-opacity-10 p-2 rounded-lg hover:bg-opacity-20 transition-colors"
      >
        <Store size={20} />
        <span>{currentSalon.name}</span>
        <ChevronRight size={16} className={`transform transition-transform ${isSalonSwitcherOpen ? 'rotate-90' : ''}`} />
      </button>

      {isSalonSwitcherOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
          {salons.map(salon => (
            <button
              key={salon.id}
              onClick={() => {
                setSelectedSalon(salon.id);
                setIsSalonSwitcherOpen(false);
                setSelectedStylist('all'); // Reset stylist filter when changing salon
              }}
              className={`w-full p-3 text-left flex items-start gap-3 hover:bg-gray-50 ${
                salon.id === selectedSalon ? 'bg-pink-50' : ''
              }`}
            >
              <Store size={20} className="text-[#CE145B] mt-1" />
              <div>
                <div className="font-medium text-gray-900">{salon.name}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={12} />
                  {salon.address}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
  return (
    <div className="max-w-6xl mx-auto p-5 bg-white">
      {/* Header */}
      <div className="bg-[#CE145B] rounded-xl p-5 mb-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold m-0">Salon Dashboard</h1>
            <p className="mt-1 opacity-90">Manage your appointments efficiently</p>
          </div>
          <SalonSwitcher />
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center">
            <span className="block text-2xl font-semibold">{currentSalon.stats.todayAppointments}</span>
            <span className="text-sm opacity-90">Today's Appointments</span>
          </div>
          <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center">
            <span className="block text-2xl font-semibold">{currentSalon.stats.availableSlots}</span>
            <span className="text-sm opacity-90">Available Slots</span>
          </div>
        </div>
      </div>

           {/* Filters */}
           <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePreviousDay}
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-[#CE145B]"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Today</span>
            <span className="font-semibold text-gray-800">
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <button 
            onClick={handleNextDay}
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-[#CE145B]"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={selectedStylist}
            onChange={(e) => setSelectedStylist(e.target.value)}
            className="p-2 border rounded-lg bg-white text-gray-800 min-w-[150px]"
          >
            <option value="all">All Stylists</option>
            {currentSalon.stylists.map(stylist => (
              <option key={stylist} value={stylist}>{stylist}</option>
            ))}
          </select>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="p-2 border rounded-lg bg-white text-gray-800 min-w-[150px]"
          >
            <option value="all">All Services</option>
            <option value="haircut">Haircut</option>
            <option value="color">Hair Color</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex p-3 bg-gray-50 border-b border-gray-200 font-semibold">
          <div className="w-24">Time</div>
          <div className="flex-1">Appointments</div>
        </div>
        
        <div>
          {timeSlots.map(time => (
            <div key={time} className="flex min-h-[80px] border-b border-gray-200">
              <div className="w-24 p-3 bg-gray-50 text-gray-600 text-sm">
                {time}
              </div>
              <div className="flex-1 p-2 flex flex-wrap gap-2">
                {getAppointmentsForTimeSlot(time).map(apt => (
                  <div 
                    key={apt.id}
                    onClick={() => handleAppointmentClick(apt)}
                    className="flex-1 min-w-[250px] max-w-[300px] bg-white rounded-lg shadow-sm p-3 border-l-4 border-l-[#CE145B] cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">
                        {apt.customerName}
                      </span>
                      <span className="text-sm text-gray-600">
                        {apt.startTime} - {apt.endTime}
                      </span>
                    </div>
                    <div>
                      <div className="text-[#CE145B] mb-1">{apt.service}</div>
                      <div className="text-gray-600">Stylist: {apt.stylist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-over Panel */}
      {isDetailOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedAppointment.profileImage}
                      alt={selectedAppointment.customerName}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedAppointment.customerName}
                      </h2>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Contact Information */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={16} />
                      <span>{selectedAppointment.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={16} />
                      <span>{selectedAppointment.email}</span>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Appointment Details */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Appointment Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} />
                      <span>{date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} />
                      <span>{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User size={16} />
                      <span>Stylist: {selectedAppointment.stylist}</span>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Services & Payment */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Services & Payment</h3>
                  <div className="space-y-3">
                    {selectedAppointment.services.map((service, index) => (
                      <div key={index} className="flex justify-between text-gray-700">
                        <span>{service.name}</span>
                        <span>${service.price}</span>
                      </div>
                    ))}
                    <hr className="my-2 border-gray-200" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${selectedAppointment.totalAmount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} />
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedAppointment.paymentStatus)}`}>
                        {selectedAppointment.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Notes */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200">
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors">
                    Edit Appointment
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonSchedule

