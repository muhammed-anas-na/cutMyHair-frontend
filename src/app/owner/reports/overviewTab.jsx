import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import _ from 'lodash';

const OverviewTab = ({ bookings, overview, timeFilter }) => {
  const primaryColor = '#CE145B';
  const secondaryColor = '#FF69B4';
  
  // Data transformation functions
  const calculateDailyRevenue = () => {
    // Use the provided revenue data if available
    if (overview && overview.dailyRevenue) {
      return overview.dailyRevenue.slice(-7);
    }
    
    // Otherwise, calculate from bookings
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const grouped = _.groupBy(completedBookings, booking => 
      new Date(booking.appointment_date).toLocaleDateString()
    );
    
    return Object.entries(grouped).map(([date, bookings]) => ({
      date,
      revenue: bookings.reduce((sum, booking) => sum + booking.total_price, 0)
    })).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
  };

  const calculateServicePopularity = () => {
    const allServices = bookings.flatMap(booking => booking.services);
    const serviceCount = _.countBy(allServices, 'name');
    
    return Object.entries(serviceCount).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 6);
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
             status === 'in-progress' ? '#9C27B0' : '#757575'
    }));
  };

  const calculateTopServices = () => {
    // If we have services data from the backend
    if (overview && overview.servicePerformance) {
      return overview.servicePerformance
        .map(service => ({
          name: service.name,
          count: service.totalBookings,
          revenue: service.revenue,
          avgDuration: service.avgDuration
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }
    
    // Otherwise calculate from bookings
    const allServices = bookings.flatMap(booking => booking.services);
    const serviceGroups = _.groupBy(allServices, 'name');
    
    return Object.entries(serviceGroups)
      .map(([name, services]) => ({ 
        name, 
        count: services.length,
        revenue: services.reduce((sum, s) => sum + s.price, 0),
        avgDuration: Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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

  const dailyRevenueData = calculateDailyRevenue();
  const servicePopularityData = calculateServicePopularity();
  const bookingStatusData = calculateBookingStatusDistribution();
  const topServicesData = calculateTopServices();

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-5">Business Overview ({getFormattedDateRange()})</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-base font-medium text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyRevenueData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke={primaryColor} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-base font-medium text-gray-900 mb-4">Booking Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Service Popularity Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Service Popularity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={servicePopularityData}
              margin={{ top: 5, right: 20, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Bookings']} />
              <Bar dataKey="count" fill={primaryColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Services Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium text-gray-900">Top Services</h3>
          <button 
            className="text-sm font-medium" 
            style={{ color: primaryColor }}
          >
            View all services
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Popularity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topServicesData.map((service, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(service.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(service.avgDuration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${(service.count / topServicesData[0].count) * 100}%`,
                          backgroundColor: primaryColor 
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Bookings - Mobile Friendly Section */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium text-gray-900">Recent Bookings</h3>
          <button 
            className="text-sm font-medium" 
            style={{ color: primaryColor }}
          >
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {bookings.slice(0, 5).map((booking, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Booking #{booking._id.substring(booking._id.length - 5)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(booking.appointment_date).toLocaleDateString()} at {booking.scheduled_start_time}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    booking.status === 'no-show' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900">
                    {formatCurrency(booking.total_price)}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  Services: {booking.services.map(s => s.name).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;