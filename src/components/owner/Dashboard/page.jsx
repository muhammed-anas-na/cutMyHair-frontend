'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Users, CalendarCheck, MoreVertical, TrendingUp, TrendingDown, Clock,
    MapPin, Zap, Filter, ChevronDown, Menu, X, DollarSign, Bell, PlusCircle, Search,IndianRupee
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ADD_NEW_APPOINMENT_FN, GET_DASHBOARD_DATA_FN, GET_STYLIST_DATA__FN } from '@/services/ownerService';
import { useRouter } from 'next/navigation';

// Simple debounce function
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Stats Card Component
const StatsCard = ({ title, value, change, type, icon: Icon }) => {
    const getTypeStyles = () => {
        switch(type) {
            case 'customers': return { bg: 'bg-blue-50', text: 'text-blue-500' };
            case 'bookings': return { bg: 'bg-purple-50', text: 'text-purple-500' };
            case 'revenue': return { bg: 'bg-green-50', text: 'text-green-500' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-500' };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="overflow-hidden">
                    <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1 uppercase">{title}</h3>
                    <p className="text-xl sm:text-2xl font-bold">{value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${styles.bg}`}>
                    <Icon className={styles.text} size={20} />
                </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
                {change?.direction === 'up' ? (
                    <TrendingUp className="text-green-500 flex-shrink-0" size={14} />
                ) : (
                    <TrendingDown className="text-red-500 flex-shrink-0" size={14} />
                )}
                <span className={`text-xs sm:text-sm truncate ${change?.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {change?.value || '0%'} {change?.text || 'change'}
                </span>
            </div>
        </div>
    );
};

// Appointment Card Component
const AppointmentCard = ({ customer, service, time, stylist, location }) => (
    <div className="flex items-center py-3 border-b border-gray-100 last:border-0">
        <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {customer.image ? (
                    <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
                ) : (
                    <Users className="text-gray-400" size={18} />
                )}
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{customer.name}</p>
            <div className="flex flex-wrap gap-1 mt-1">
                <span className="inline-flex items-center text-xs bg-[#FFDBD7] text-[#CE145B] px-2 py-0.5 rounded-full">
                    <Clock size={10} className="mr-1" /> {time}
                </span>
                <span className="inline-flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                    {service}
                </span>
            </div>
        </div>
        <div className="flex flex-col items-end ml-2 text-xs text-gray-500">
            <p className="truncate">{stylist}</p>
            <p className="flex items-center mt-1">
                <MapPin size={10} className="mr-1" /> {location}
            </p>
        </div>
    </div>
);

// Dashboard Content Component
const DashboardContent = () => {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dateRange, setDateRange] = useState('This Week');
    const [defaultSalon, setDefaultSalon] = useState('');
    const [defaultSalonId, setDefaultSalonId] = useState('');
    const [showNewBookingForm, setShowNewBookingForm] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState(null);
    const [salons, setSalons] = useState([]);
    const [stylists, setStylists] = useState([]);
    const [selectedStylist, setSelectedStylist] = useState('Any');
    const [stats, setStats] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const { user_id } = useAuth();
    // Get services for current salon
    const getServicesForCurrentSalon = () => {
        if (!dashboardData || !defaultSalon) return [];
        const currentSalon = dashboardData.find(salon => salon.name === defaultSalon);
        if (!currentSalon) return [];
        
        return currentSalon.services.filter(service => 
            service.name && 
            typeof service.name === 'string' && 
            service.name.trim().length > 2 &&
            service.service_id
        );
    };

    // Get filtered services
    const filteredServices = getServicesForCurrentSalon().filter(
        service => service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch initial data
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const response = await GET_DASHBOARD_DATA_FN(user_id);                
                const responseData = response.data;
                const salonData = responseData.data || [];
                
                if (Array.isArray(salonData) && salonData.length > 0) {
                    setDashboardData(salonData);
                    const salonNames = salonData.map(salon => salon.name);
                    setSalons(salonNames);

                    const storedSalon = localStorage.getItem('defaultSalon');
                    const storedSalonId = localStorage.getItem('defaultSalonId');
                    if (storedSalon && storedSalonId && salonNames.includes(storedSalon)) {
                        setDefaultSalon(storedSalon);
                        setDefaultSalonId(storedSalonId);
                    } else if (salonNames.length > 0) {
                        setDefaultSalon(salonNames[0]);
                        setDefaultSalonId(salonData[0].salon_id);
                    }
                    if (responseData.stats) setStats(responseData.stats);
                    if (responseData.appointments) setAppointments(responseData.appointments);
                }
            } catch (error) {
                console.log('Error fetching dashboard data:', error.message);
                // Redirect to login in case of error
                router.push('/owner/login');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user_id, router]);

    useEffect(()=>{
        const fetchSalonStylist=async()=>{
            const response = await GET_STYLIST_DATA__FN(defaultSalonId);
            console.log(response.data[0]?.stylists)
            setStylists(response.data[0]?.stylists)
        }
        fetchSalonStylist();
    },[defaultSalonId])

    // Save salon selection
    useEffect(() => {
        if (defaultSalon) localStorage.setItem('defaultSalon', defaultSalon);
        if (defaultSalonId) localStorage.setItem('defaultSalonId', defaultSalonId);
    }, [defaultSalon, defaultSalonId]);

    // Utility functions
    const getCurrentDate = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    };

    const getCurrentTime = () => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    };

    // Handlers
    const handleSalonChange = (e) => {
        const newSalon = e.target.value;
        const salonData = dashboardData.find(s => s.name === newSalon);
        setDefaultSalon(newSalon);
        setDefaultSalonId(salonData?.salon_id || '');
        setSelectedServices([]);
        setSearchTerm('');
    };

    const handleNewBooking = () => {
        setSelectedServices([]);
        setSelectedStylist('Any');
        setShowNewBookingForm(true);
        setError(null);
    };

    const addService = (service) => {
        if (!selectedServices.some(s => s.service_id === service.service_id)) {
            setSelectedServices([...selectedServices, service]);
            setSearchTerm('');
        }
    };

    const removeService = (serviceId) => {
        setSelectedServices(selectedServices.filter(s => s.service_id !== serviceId));
    };

    const debounceSearch = useCallback(
        debounce((value) => setSearchTerm(value), 300),
        []
    );

    const validateBooking = (data) => {
        if (!data.date) return 'Date is required';
        if (!data.time) return 'Time is required';
        if (!data.salon_id) return 'Salon selection is required';
        if (!data.services.length) return 'At least one service is required';
        return null;
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        setError(null);
        setBookingLoading(true);

        const formData = {
            customer: { name: 'New Customer' },
            services: selectedServices.map(service => ({
                name: service.name,
                service_id: service.service_id
            })),
            time: document.querySelector('input[type="time"]').value,
            date: document.querySelector('input[type="date"]').value,
            stylist: selectedStylist,
            salon: defaultSalon,
            salon_id: defaultSalonId
        };

        const validationError = validateBooking(formData);
        if (validationError) {
            setError(validationError);
            setBookingLoading(false);
            return;
        }

        try {
            const response = await ADD_NEW_APPOINMENT_FN(formData);
            if (response?.data?.success) {
                setAppointments([{
                    ...formData,
                    customer: formData.customer,
                    service: selectedServices.map(s => s.name).join(', ')
                }, ...appointments]);
                setShowNewBookingForm(false);
                setSelectedServices([]);
                setSelectedStylist('Any');
            } else {
                throw new Error('Booking failed');
            }
        } catch (err) {
            setError(err.message || 'Failed to create booking');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-t-4 border-[#CE145B] border-solid rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 lg:mt-0">
                <div className="max-w-full p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
                            <div className="mt-2">
                                <select
                                    value={defaultSalon}
                                    onChange={handleSalonChange}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
                                >
                                    {salons.map((salon, index) => (
                                        <option key={index} value={salon}>{salon}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            <div className="dropdown relative">
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none pl-9"
                                >
                                    <option>Today</option>
                                    <option>This Week</option>
                                    <option>This Month</option>
                                </select>
                                <Filter size={14} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                            </div>
                            <button 
                                className="bg-[#CE145B] hover:bg-[#B71350] text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center"
                                onClick={handleNewBooking}
                            >
                                <Zap size={16} className="mr-1" />
                                <span>Quick Add</span>
                            </button>
                        </div> */}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {stats.map((stat, index) => (
                            <StatsCard key={index} {...stat} />
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 gap-3">
                                <button 
                                    className="flex items-center space-x-2 py-3 px-4 text-left rounded-lg hover:bg-[#FFDBD7] border border-gray-200 transition-colors group"
                                    onClick={handleNewBooking}
                                >
                                    <CalendarCheck className="text-[#CE145B] group-hover:text-[#CE145B]" size={18} />
                                    <span className="text-gray-700 group-hover:text-[#CE145B]">New Booking</span>
                                </button>
                                <button 
                                    className="flex items-center space-x-2 py-3 px-4 text-left rounded-lg hover:bg-[#FFDBD7] border border-gray-200 transition-colors group"
                                >
                                    <Users className="text-[#CE145B] group-hover:text-[#CE145B]" size={18} />
                                    <span className="text-gray-700 group-hover:text-[#CE145B]">Add Customer</span>
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                                <button className="text-sm text-[#CE145B] hover:text-[#B71350]">View Schedule</button>
                            </div>
                            <div className="space-y-1">
                                {appointments.length > 0 ? (
                                    appointments.map((appointment, index) => (
                                        <AppointmentCard key={index} {...appointment} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 py-4 text-center">No appointments scheduled</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showNewBookingForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">New Booking</h2>
                            <button 
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => setShowNewBookingForm(false)}
                                disabled={bookingLoading}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {error && (
                            <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmitBooking} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Salon</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={defaultSalon}
                                    onChange={handleSalonChange}
                                    disabled={bookingLoading}
                                >
                                    {salons.map((salon, index) => (
                                        <option key={index} value={salon}>{salon}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                                <div className="relative mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="Search services..." 
                                        className="w-full border border-gray-300 rounded-lg p-2 pl-8 text-sm"
                                        value={searchTerm}
                                        onChange={(e) => debounceSearch(e.target.value)}
                                        disabled={bookingLoading}
                                    />
                                    <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                                </div>
                                {searchTerm && (
                                    <div className="border border-gray-200 rounded-lg mb-2 max-h-32 overflow-y-auto bg-white shadow-md">
                                        {filteredServices.length > 0 ? (
                                            filteredServices.map((service) => (
                                                <div 
                                                    key={service.service_id} 
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center justify-between border-b border-gray-100 last:border-0"
                                                    onClick={() => addService(service)}
                                                >
                                                    <span>{service.name}</span>
                                                    <PlusCircle size={14} className="text-[#CE145B]" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-sm text-gray-500">No services found</div>
                                        )}
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedServices.map((service) => (
                                        <div 
                                            key={service.service_id} 
                                            className="bg-[#FFDBD7] text-[#CE145B] text-xs rounded-full px-3 py-1 flex items-center"
                                        >
                                            <span className="mr-1">{service.name}</span>
                                            <X 
                                                size={12} 
                                                className="cursor-pointer" 
                                                onClick={() => removeService(service.service_id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {selectedServices.length === 0 && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Search and select services to add them here
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        defaultValue={getCurrentDate()}
                                        disabled={bookingLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input 
                                        type="time" 
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        defaultValue={getCurrentTime()}
                                        disabled={bookingLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stylist</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={selectedStylist}
                                    onChange={(e) => setSelectedStylist(e.target.value)}
                                    disabled={bookingLoading}
                                >
                                    <option>Any</option>
                                    {stylists?.map((stylist, index) => (
    <option key={index} value={stylist.name}>{stylist.name}</option>
))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <button 
                                    type="button" 
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                    onClick={() => setShowNewBookingForm(false)}
                                    disabled={bookingLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-[#CE145B] text-white rounded-lg text-sm disabled:bg-gray-400"
                                    disabled={bookingLoading}
                                >
                                    {bookingLoading ? 'Booking...' : 'Book Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

export default DashboardContent;