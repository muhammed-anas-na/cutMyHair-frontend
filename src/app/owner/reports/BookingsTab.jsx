import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Calendar, Users, Clock, AlertTriangle, ChevronDown, Download } from 'lucide-react';
import _ from 'lodash';

const BookingsTab = ({ bookings, timeFilter }) => {
  const [bookingView, setBookingView] = useState('daily');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCalendar, setShowCalendar] = useState(false);
  
  const primaryColor = '#CE145B';
  const secondaryColor = '#FF69B4';
  const tertiaryColor = '#FF98CB';
  const lightColor = '#FFEBF3';
  
  // Data transformation functions
  const calculateBookingsByTime = () => {
    // Create an array of hour slots (8am to 8pm)
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);
    
    // Initialize count for each hour
    const hourlyBookings = hours.reduce((acc, hour) => {
      acc[hour] = 0;
      return acc;
    }, {});
    
    // Count bookings for each hour
    const filteredBookings = statusFilter === 'all' ? 
      bookings : 
      bookings.filter(booking => booking.status === statusFilter);
      
    filteredBookings.forEach(booking => {
      const startTime = booking.scheduled_start_time;
      const hour = parseInt(startTime.split(':')[0]);
      
      if (hourlyBookings[hour] !== undefined) {
        hourlyBookings[hour] += 1;
      }
    });
    
    // Format for chart
    return Object.entries(hourlyBookings).map(([hour, count]) => ({
      hour: `${hour}:00`,
      count
    }));
  };
  
  const calculateBookingsByDay = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Initialize count for each day
    const dailyBookings = daysOfWeek.reduce((acc, day) => {
      acc[day] = 0;
      return acc;
    }, {});
    
    // Count bookings for each day
    const filteredBookings = statusFilter === 'all' ? 
      bookings : 
      bookings.filter(booking => booking.status === statusFilter);
      
    filteredBookings.forEach(booking => {
      const date = new Date(booking.appointment_date);
      const day = daysOfWeek[date.getDay()];
      dailyBookings[day] += 1;
    });
    
    // Format for chart
    return Object.entries(dailyBookings).map(([day, count]) => ({
      day,
      count
    })).sort((a, b) => {
      return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    });
  };
  
  const calculateBookingTrends = () => {
    const filteredBookings = statusFilter === 'all' ? 
      bookings : 
      bookings.filter(booking => booking.status === statusFilter);
      
    if (bookingView === 'daily') {
      // Group by day
      const groupedByDay = _.groupBy(filteredBookings, booking => 
        new Date(booking.appointment_date).toLocaleDateString()
      );
      
      return Object.entries(groupedByDay).map(([date, bookings]) => ({
        date,
        count: bookings.length
      })).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-14);
    } else if (bookingView === 'weekly') {
      // Group by week
      const weeklyData = {};
      
      filteredBookings.forEach(booking => {
        const date = new Date(booking.appointment_date);
        const year = date.getFullYear();
        const weekNumber = getWeekNumber(date);
        const key = `${year}-W${weekNumber}`;
        
        if (!weeklyData[key]) {
          weeklyData[key] = {
            label: `Week ${weekNumber}`,
            count: 0
          };
        }
        
        weeklyData[key].count += 1;
      });
      
      return Object.entries(weeklyData).map(([key, data]) => ({
        date: data.label,
        count: data.count
      })).sort((a, b) => {
        const [, weekA] = a.date.split('Week ');
        const [, weekB] = b.date.split('Week ');
        return parseInt(weekA) - parseInt(weekB);
      }).slice(-10);
    } else {
      // Group by month
      const monthlyData = {};
      
      filteredBookings.forEach(booking => {
        const date = new Date(booking.appointment_date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const key = `${year}-${month}`;
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        if (!monthlyData[key]) {
          monthlyData[key] = {
            label: `${monthName} ${year}`,
            count: 0
          };
        }
        
        monthlyData[key].count += 1;
      });
      
      return Object.entries(monthlyData).map(([key, data]) => ({
        date: data.label,
        count: data.count
      })).sort((a, b) => {
        const [monthA, yearA] = a.date.split(' ');
        const [monthB, yearB] = b.date.split(' ');
        return yearA === yearB ? 
          new Date(Date.parse(`${monthA} 1, 2000`)) - new Date(Date.parse(`${monthB} 1, 2000`)) : 
          yearA - yearB;
      }).slice(-12);
    }
  };
  
  const calculateBookingStatusDistribution = () => {
    const statusCount = _.countBy(bookings, 'status');
    
    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
      color: status === 'completed' ? '#4CAF50' : 
             status === 'cancelled' ? '#F44336' : 
             status === 'no-show' ? '#FF9800' : 
             status === 'confirmed' ? '#2196F3' : 
             status === 'in-progress' ? '#9C27B0' : '#607D8B'
    }));
  };
  
  const calculateBookingMetrics = () => {
    const total = bookings.length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const noShow = bookings.filter(b => b.status === 'no-show').length;
    const inProgress = bookings.filter(b => b.status === 'in-progress').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const cancellationRate = total > 0 ? ((cancelled + noShow) / total) * 100 : 0;
    
    // Calculate average booking lead time (days between booking and appointment)
    let totalLeadTime = 0;
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.booking_date);
      const appointmentDate = new Date(booking.appointment_date);
      const leadTime = (appointmentDate - bookingDate) / (1000 * 60 * 60 * 24); // convert ms to days
      totalLeadTime += leadTime;
    });
    const avgLeadTime = total > 0 ? totalLeadTime / total : 0;
    
    // Calculate average service duration
    const totalDuration = bookings.reduce((sum, booking) => sum + booking.total_duration, 0);
    const avgDuration = total > 0 ? totalDuration / total : 0;
    
    return {
      total,
      completed,
      cancelled,
      noShow,
      inProgress,
      confirmed,
      completionRate,
      cancellationRate,
      avgLeadTime,
      avgDuration
    };
  };
  
  const calculatePopularBookingTimes = () => {
    const bookingTimes = calculateBookingsByTime();
    return [...bookingTimes].sort((a, b) => b.count - a.count)[0];
  };
  
  const calculatePopularBookingDays = () => {
    const bookingDays = calculateBookingsByDay();
    return [...bookingDays].sort((a, b) => b.count - a.count)[0];
  };
  
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
  const getFormattedDateRange = () => {
    if (timeFilter === 'week') {
      return 'Last 7 days';
    } else if (timeFilter === 'month') {
      return 'Last 30 days';
    } else if (timeFilter === 'quarter') {
      return 'Last 90 days';
    } else {
      return 'Custom range';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const metrics = calculateBookingMetrics();
  const popularTime = calculatePopularBookingTimes();
  const popularDay = calculatePopularBookingDays();
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5">
        <h2 className="text-lg font-medium text-gray-900">Bookings Analysis ({getFormattedDateRange()})</h2>
        <div className="mt-2 sm:mt-0 flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
          
          <button 
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white"
            style={{ backgroundColor: primaryColor }}
            onClick={() => alert('Downloading bookings report...')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Booking Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
              <Calendar className="h-6 w-6" style={{ color: primaryColor }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{metrics.total}</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Completion Rate</span>
              <span className="text-sm font-medium text-gray-900">{metrics.completionRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div 
                className="h-2.5 rounded-full bg-green-500" 
                style={{ width: `${metrics.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Popular Booking Time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
              <Clock className="h-6 w-6" style={{ color: primaryColor }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Popular Time</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{popularTime?.hour || 'N/A'}</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-500">
              {popularTime?.count || 0} bookings at this time
            </span>
          </div>
        </div>
        
        {/* Popular Booking Day */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
              <Calendar className="h-6 w-6" style={{ color: primaryColor }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Popular Day</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{popularDay?.day || 'N/A'}</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-500">
              {popularDay?.count || 0} bookings on this day
            </span>
          </div>
        </div>
        
        {/* Cancellation Rate */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
              <AlertTriangle className="h-6 w-6" style={{ color: primaryColor }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Cancellation Rate</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{metrics.cancellationRate.toFixed(1)}%</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Cancelled</span>
              <span className="text-sm font-medium text-gray-900">{metrics.cancelled}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-500">No-show</span>
              <span className="text-sm font-medium text-gray-900">{metrics.noShow}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <h3 className="text-base font-medium text-gray-900">Booking Trends</h3>
          <div className="mt-2 sm:mt-0 inline-flex bg-gray-100 p-1 rounded-md">
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                bookingView === 'daily' 
                  ? 'bg-white shadow-sm text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBookingView('daily')}
            >
              Daily
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                bookingView === 'weekly' 
                  ? 'bg-white shadow-sm text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBookingView('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                bookingView === 'monthly' 
                  ? 'bg-white shadow-sm text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBookingView('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={calculateBookingTrends()}
              margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tickMargin={20}
              />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                name="Bookings" 
                stroke={primaryColor} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Booking Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Booking Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-base font-medium text-gray-900 mb-4">Booking Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calculateBookingStatusDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {calculateBookingStatusDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Bookings by Day of Week */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-base font-medium text-gray-900 mb-4">Bookings by Day of Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={calculateBookingsByDay()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Bookings" fill={primaryColor} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Bookings by Time of Day */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Bookings by Time of Day</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={calculateBookingsByTime()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" name="Bookings" fill={primaryColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium text-gray-900">Recent Bookings</h3>
          <button 
            className="text-sm font-medium" 
            style={{ color: primaryColor }}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {showCalendar ? 'Hide Calendar' : 'Show Calendar View'}
          </button>
        </div>
        
        {showCalendar ? (
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center">
            <p className="text-gray-500">Calendar View Placeholder</p>
            <p className="text-sm text-gray-400 mt-2">Calendar integration would be implemented here</p>
          </div>
        ) : null}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.slice(0, 10).map((booking, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking._id.substring(booking._id.length - 5)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.appointment_date).toLocaleDateString()} at {booking.scheduled_start_time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Customer {booking.user_id.substring(booking.user_id.length - 3)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {booking.services.map(s => s.name).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile View Cards (displayed only on small screens) */}
        <div className="mt-6 sm:hidden space-y-4">
          {bookings.slice(0, 5).map((booking, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">Booking #{booking._id.substring(booking._id.length - 5)}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(booking.appointment_date).toLocaleDateString()} at {booking.scheduled_start_time}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500">Customer</p>
                <p className="text-sm">Customer {booking.user_id.substring(booking.user_id.length - 3)}</p>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Services</p>
                <p className="text-sm">{booking.services.map(s => s.name).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center">
          <button 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
            onClick={() => alert('View all bookings')}
          >
            View all bookings
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsTab;