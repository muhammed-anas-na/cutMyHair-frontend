'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Phone, Mail, Clock, CreditCard, Calendar, User, Store, MapPin, AlertCircle } from 'lucide-react';
import { GET_OWNER_SALON_FN } from '@/services/ownerService';
import { GET_APPOINTMENTS_OF_SALON_FN } from '@/services/ownerService'; // Added missing import
import { useAuth } from '@/context/AuthContext';

const SalonSchedule = () => {
  const [date, setDate] = useState(new Date());
  const [selectedStylist, setSelectedStylist] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSalonSwitcherOpen, setIsSalonSwitcherOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user_id } = useAuth();

  // Generate time slots from 9 AM to 8 PM
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Fetch salons owned by the owner
  useEffect(() => {
    async function fetchSalons(userId) {
      if (!userId) return;
      
      setLoading(true);
      try {
        const response = await GET_OWNER_SALON_FN(userId, ['name', 'rating', 'address', 'stylists', 'stats', 'salon_id']);
        if (response.data.data && response.data.data.length > 0) {
          setSalons(response.data.data);
          setSelectedSalon(response.data.data[2].salon_id); // Select first salon by default
        } else {
          setError('No salons found for this account');
        }
      } catch (err) {
        console.error("Error fetching salons:", err);
        setError('Failed to load salon data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSalons(user_id);
  }, [user_id]);

  // Fetch appointments for selected salon
  useEffect(() => {
    async function fetchAppointments(salonId) {
      if (!salonId) return;
      
      setLoading(true);
      console.log(salonId)
      try {
        const response = await GET_APPOINTMENTS_OF_SALON_FN(salonId, {
          date: date.toISOString().split('T')[0] // Format as YYYY-MM-DD
        });
        
        if (response.data.data) {
          setAppointments(response.data.data.data);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError('Failed to load appointment data');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (selectedSalon) {
      fetchAppointments(selectedSalon);
    }
  }, [selectedSalon, date]);

  // Filter appointments by selected criteria
  const getAppointmentsForTimeSlot = (time) => {
    return appointments?.filter(apt => 
      apt.scheduled_start_time === time 
      && 
      (selectedStylist === 'all' || apt.stylist === selectedStylist) &&
      (selectedService === 'all' || apt.service.toLowerCase().includes(selectedService.toLowerCase()))
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

  const currentSalon = salons.find(salon => salon.salon_id=== selectedSalon);

  const formatDateDisplay = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Calendar size={36} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">No appointments scheduled</h3>
      <p className="text-gray-500 max-w-md">
        There are no appointments scheduled for this day. You can create a new appointment or check another date.
      </p>
      <button className="mt-4 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors">
        Create Appointment
      </button>
    </div>
  );

  // Loading state component
  const LoadingState = () => (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex animate-pulse">
          <div className="w-24 h-16 bg-gray-200 rounded" />
          <div className="flex-1 ml-4 space-y-2">
            <div className="h-10 w-1/3 bg-gray-200 rounded" />
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  // Error state component
  const ErrorState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <AlertCircle size={36} className="text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Something went wrong</h3>
      <p className="text-gray-500 max-w-md">
        {message || "We couldn't load your appointment data. Please try again later."}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Refresh
      </button>
    </div>
  );

  // Salon switcher component
  const SalonSwitcher = () => (
    <div className="relative">
      <button
        onClick={() => setIsSalonSwitcherOpen(!isSalonSwitcherOpen)}
        className="flex items-center gap-2 bg-white bg-opacity-10 p-2 rounded-lg hover:bg-opacity-20 transition-colors"
      >
        <Store size={20} />
        <span>{currentSalon?.name || 'Select Salon'}</span>
        <ChevronRight size={16} className={`transform transition-transform ${isSalonSwitcherOpen ? 'rotate-90' : ''}`} />
      </button>

      {isSalonSwitcherOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
          {salons.map(salon => (
            <button
              key={salon.salon_id}
              onClick={() => {
                setSelectedSalon(salon.salon_id);
                setIsSalonSwitcherOpen(false);
                setSelectedStylist('all'); // Reset stylist filter when changing salon
              }}
              className={`w-full p-3 text-left flex items-start gap-3 hover:bg-gray-50 ${
                salon.salon_id === selectedSalon ? 'bg-pink-50' : ''
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

  // Check if we have any data to show
  const hasAppointments = appointments.length > 0;
  const anyAppointmentsForDay = timeSlots.some(time => getAppointmentsForTimeSlot(time).length > 0);
  return (
    <div className="max-w-6xl mx-auto p-5 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="bg-[#CE145B] rounded-xl p-5 mb-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold m-0">Salon Dashboard</h1>
            <p className="mt-1 opacity-90">Manage your appointments efficiently</p>
          </div>
          {!loading && salons.length > 0 && <SalonSwitcher />}
        </div>
        
        {currentSalon && (
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center">
              <span className="block text-2xl font-semibold">{currentSalon?.stats?.todayAppointments || 0}</span>
              <span className="text-sm opacity-90">Today's Appointments</span>
            </div>
            <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center">
              <span className="block text-2xl font-semibold">{currentSalon?.stats?.availableSlots || 0}</span>
              <span className="text-sm opacity-90">Available Slots</span>
            </div>
            <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center">
              <span className="block text-2xl font-semibold">{currentSalon?.rating?.toFixed(1) || '-'}</span>
              <span className="text-sm opacity-90">Rating</span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePreviousDay}
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-[#CE145B]"
            disabled={loading}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">
              {isToday(date) ? 'Today' : ''}
            </span>
            <span className="font-semibold text-gray-800">
              {formatDateDisplay(date)}
            </span>
          </div>
          <button 
            onClick={handleNextDay}
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-[#CE145B]"
            disabled={loading}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={selectedStylist}
            onChange={(e) => setSelectedStylist(e.target.value)}
            className="p-2 border rounded-lg bg-white text-gray-800 min-w-[150px]"
            disabled={loading || !currentSalon}
          >
            <option value="all">All Stylists</option>
            {currentSalon?.stylists?.map(stylist => (
              <option key={stylist} value={stylist}>{stylist}</option>
            ))}
          </select>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="p-2 border rounded-lg bg-white text-gray-800 min-w-[150px]"
            disabled={loading}
          >
            <option value="all">All Services</option>
            <option value="haircut">Haircut</option>
            <option value="color">Hair Color</option>
            <option value="style">Style</option>
            <option value="treatment">Treatment</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : !currentSalon ? (
        <ErrorState message="No salon selected. Please add a salon to your account." />
      ) : !hasAppointments ? (
        <EmptyState />
      ) : (
        /* Timeline */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex p-3 bg-gray-50 border-b border-gray-200 font-semibold">
            <div className="w-24">Time</div>
            <div className="flex-1">Appointments</div>
          </div>
          
          <div>
            {timeSlots.map(time => {
              const appointmentsForSlot = getAppointmentsForTimeSlot(time);
              {console.log("appointmentsForSlot =>" , appointmentsForSlot)}
              return (
                <div key={time} className="flex min-h-[80px] border-b border-gray-200">
                  <div className="w-24 p-3 bg-gray-50 text-gray-600 text-sm flex items-center">
                    {time}
                  </div>
                  <div className="flex-1 p-2 flex flex-wrap gap-2">
                    {appointmentsForSlot.length > 0 ? (
                      appointmentsForSlot.map(apt => (
                       
                        <div 
                          key={apt._id}
                          onClick={() => handleAppointmentClick(apt)}
                          className="flex-1 min-w-[250px] max-w-[300px] bg-white rounded-lg shadow-sm p-3 border-l-4 border-l-[#CE145B] cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all"
                        >
                           
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold text-gray-800">
                              {apt.user_details.name}
                            </span>
                            <span className="text-sm text-gray-600">
                              {apt.scheduled_start_time} - {apt.scheduled_end_time}
                            </span>
                          </div>
                          <div>
        
                            {apt.services.length > 1 ? (<div className="text-[#CE145B] mb-1">{apt.services[0].name}+</div>): (<div className="text-[#CE145B] mb-1">{apt.services[0].name}</div>)}
                            
                            <div className="text-gray-600">Stylist: Any Avalible</div>
                            <div className="mt-2">
                              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(apt.status)}`}>
                                {apt.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center w-full p-2 text-gray-400 text-sm">
                        Available
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* No appointments message if filtered to none */}
            {hasAppointments && !anyAppointmentsForDay && (
              <div className="p-8 text-center text-gray-500">
                No appointments match your current filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-over Panel */}
      {isDetailOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-white shadow-lg h-full overflow-hidden animate-slide-in-right">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedAppointment?.profileImage || "/api/placeholder/64/64"}
                      alt={selectedAppointment.user_details.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedAppointment.user_details.name}
                      </h2>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Close panel"
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
                      <Phone size={16} className="text-[#CE145B]" />
                      <a href={`tel:${selectedAppointment.user_details.phone_number}`} className="hover:text-[#CE145B]">
                      {selectedAppointment.user_details.phone_number}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={16} className="text-[#CE145B]" />
                      <a href={`mailto:${selectedAppointment?.email}`} className="hover:text-[#CE145B]">
                        {selectedAppointment?.email}
                      </a>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Appointment Details */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Appointment Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} className="text-[#CE145B]" />
                      <span>{formatDateDisplay(date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-[#CE145B]" />
                      <span>{selectedAppointment.scheduled_start_time} - {selectedAppointment.scheduled_end_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User size={16} className="text-[#CE145B]" />
                      <span>Stylist: {selectedAppointment?.stylist}</span>
                    </div>
                    {selectedAppointment?.lastVisit && (
                      <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                        <p className="text-gray-600">
                          Last visit: {new Date(selectedAppointment?.lastVisit).toLocaleDateString()}
                        </p>
                      </div>
                    )}
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
                        <span>₹{service.price}</span>
                      </div>
                    ))}
                    <hr className="my-2 border-gray-200" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{selectedAppointment.total_price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-[#CE145B]" />
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedAppointment.payment_details.payment_status)}`}>
                        {selectedAppointment.payment_details.payment_status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Notes */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{selectedAppointment?.notes || 'No notes available'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <button className="w-full px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors">
                    Edit Appointment
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel Appointment
                  </button>
                </div>
                <button className="w-full mt-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Mark as Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Appointment Button (Fixed) */}
      <button className="fixed bottom-6 right-6 bg-[#CE145B] text-white rounded-full p-4 shadow-lg hover:bg-[#CE145B]/90 transition-all hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default SalonSchedule;