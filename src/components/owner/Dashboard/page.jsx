'use client';

import React, { useState } from 'react';
import {
    Users, CalendarCheck, 
    MoreVertical, TrendingUp, TrendingDown, Clock,
    MapPin, Zap, Filter, ChevronDown, Menu, X,
    DollarSign, Bell
} from 'lucide-react';

// Stats Card Component with improved design
const StatsCard = ({ title, value, change, type, icon: Icon }) => {
    const getTypeStyles = () => {
        switch(type) {
            case 'customers':
                return { bg: 'bg-blue-50', text: 'text-blue-500' };
            case 'bookings':
                return { bg: 'bg-purple-50', text: 'text-purple-500' };
            case 'revenue':
                return { bg: 'bg-green-50', text: 'text-green-500' };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-500' };
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
                {change.direction === 'up' ? (
                    <TrendingUp className="text-green-500 flex-shrink-0" size={14} />
                ) : (
                    <TrendingDown className="text-red-500 flex-shrink-0" size={14} />
                )}
                <span className={`text-xs sm:text-sm truncate ${
                    change.direction === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                    {change.value} {change.text}
                </span>
            </div>
        </div>
    );
};

// Upcoming Appointment Card Component
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dateRange, setDateRange] = useState('This Week');
    const [currentLocation, setCurrentLocation] = useState('Downtown Salon');
    const [showNewBookingForm, setShowNewBookingForm] = useState(false);
    
    // Filter appointments based on selected date range
    const filterAppointmentsByDate = (appointments, selectedRange) => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // This is a simplified filter that would be more sophisticated in a real app
        switch(selectedRange) {
            case 'Today':
                return appointments.filter(app => app.date === today.toDateString());
            case 'This Week':
                return appointments;
            case 'This Month':
                return appointments;
            default:
                return appointments;
        }
    };
    
    // Sample statistics based on selected date range
    const stats = [
        {
            title: 'Total Customers',
            value: dateRange === 'Today' ? '42' : dateRange === 'This Week' ? '2,689' : '10,450',
            change: { value: '8.5%', direction: 'up', text: 'vs previous period' },
            type: 'customers',
            icon: Users
        },
        {
            title: 'Total Bookings',
            value: dateRange === 'Today' ? '8' : dateRange === 'This Week' ? '193' : '845',
            change: { value: '5.2%', direction: 'up', text: 'vs previous period' },
            type: 'bookings',
            icon: CalendarCheck
        },
        {
            title: 'Total Revenue',
            value: dateRange === 'Today' ? '$820' : dateRange === 'This Week' ? '$8,920' : '$36,780',
            change: { value: '3.1%', direction: 'down', text: 'vs previous period' },
            type: 'revenue',
            icon: DollarSign
        }
    ];
    
    // Upcoming appointments with dates for filtering
    const allAppointments = [
        // { 
        //     customer: { name: 'Emma Thompson', image: '' },
        //     service: 'Hair Coloring',
        //     time: '2:30 PM',
        //     stylist: 'Sarah Johnson',
        //     location: 'Downtown Salon',
        //     date: new Date().toDateString()
        // },
        // { 
        //     customer: { name: 'Michael Chen', image: '' },
        //     service: 'Men\'s Haircut',
        //     time: '3:45 PM',
        //     stylist: 'David Wilson',
        //     location: 'Downtown Salon',
        //     date: new Date().toDateString()
        // },
        // { 
        //     customer: { name: 'Sophia Martinez', image: '' },
        //     service: 'Manicure & Pedicure',
        //     time: '4:15 PM',
        //     stylist: 'Lisa Brown',
        //     location: 'Downtown Salon',
        //     date: new Date().toDateString()
        // },
        // { 
        //     customer: { name: 'James Miller', image: '' },
        //     service: 'Beard Trim',
        //     time: '5:00 PM',
        //     stylist: 'Mark Davis',
        //     location: 'Downtown Salon',
        //     date: new Date().toDateString()
        // }
    ];
    
    // Filter appointments based on date range
    const filteredAppointments = filterAppointmentsByDate(allAppointments, dateRange);
    
    // Quick action to handle new booking
    const handleNewBooking = () => {
        setShowNewBookingForm(true);
    };

    return (
        <>  
            {/* Main Content */}
            <div className="flex-1 lg:mt-0">
                <div className="max-w-full p-4 sm:p-6">
                    {/* Top Section with Date Range and Quick Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
                            <p className="text-sm text-gray-500 mt-1">{currentLocation}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
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
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {stats.map((stat, index) => (
                            <StatsCard key={index} {...stat} />
                        ))}
                    </div>
                    
                    {/* Dashboard Sections */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Quick Actions Section */}
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

                                                {/* Upcoming Appointments Section */}
                                                <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                                <button className="text-sm text-[#CE145B] hover:text-[#B71350]">View Schedule</button>
                            </div>
                            <div className="space-y-1">
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((appointment, index) => (
                                        <AppointmentCard key={index} {...appointment} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 py-4 text-center">No appointments for the selected period</p>
                                )}
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
            
            {/* New Booking Form Modal */}
            {showNewBookingForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">New Booking</h2>
                            <button 
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => setShowNewBookingForm(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                                <select className="w-full border border-gray-300 rounded-lg p-2 text-sm">
                                    <option>Select service</option>
                                    <option>Hair Coloring</option>
                                    <option>Women's Haircut</option>
                                    <option>Men's Haircut</option>
                                    <option>Manicure & Pedicure</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input type="date" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input type="time" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stylist</label>
                                <select className="w-full border border-gray-300 rounded-lg p-2 text-sm">
                                    <option>Any</option>
                                    <option>Sarah Johnson</option>
                                    <option>David Wilson</option>
                                    <option>Lisa Brown</option>
                                    <option>Mark Davis</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button 
                                    type="button" 
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                    onClick={() => setShowNewBookingForm(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="px-4 py-2 bg-[#CE145B] text-white rounded-lg text-sm"
                                    onClick={() => {
                                        // In a real app, this would save the booking
                                        setShowNewBookingForm(false);
                                        // Show confirmation or update UI
                                    }}
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Overlay for mobile menu */}
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