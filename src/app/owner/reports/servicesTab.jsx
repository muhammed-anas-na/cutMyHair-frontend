import React, { useState } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Filter, Clock, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import _ from 'lodash';

const ServicesTab = ({ bookings, services, timeFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const primaryColor = '#CE145B';
  const secondaryColor = '#FF69B4';
  const tertiaryColor = '#FF98CB';
  const lightColor = '#FFEBF3';
  
  // Extract all unique service categories from the data
  const allServices = bookings.flatMap(booking => booking.services);
  const serviceCategories = _.uniqBy(allServices, 'name').map(service => service.name);
  
  // Data transformation functions
  const calculateServicePopularity = () => {
    // Check if we have service performance data in the backend response
    if (services && services.servicePerformance) {
      return services.servicePerformance
        .filter(service => selectedCategory === 'all' || service.name === selectedCategory)
        .map(service => ({
          name: service.name,
          count: service.totalBookings
        }))
        .sort((a, b) => b.count - a.count);
    }
    
    // Otherwise calculate from bookings
    const filtered = selectedCategory === 'all' 
      ? allServices 
      : allServices.filter(service => service.name === selectedCategory);
    
    const serviceCount = _.countBy(filtered, 'name');
    
    return Object.entries(serviceCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };
  
  const calculateServiceRevenue = () => {
    // Use pre-calculated data if available
    if (services && services.servicePerformance) {
      return services.servicePerformance
        .filter(service => selectedCategory === 'all' || service.name === selectedCategory)
        .map(service => ({
          name: service.name,
          revenue: service.revenue
        }))
        .sort((a, b) => b.revenue - a.revenue);
    }
    
    // Otherwise calculate from bookings
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const servicesRevenue = {};
    
    completedBookings.forEach(booking => {
      booking.services.forEach(service => {
        if (selectedCategory === 'all' || service.name === selectedCategory) {
          if (!servicesRevenue[service.name]) {
            servicesRevenue[service.name] = 0;
          }
          servicesRevenue[service.name] += service.price;
        }
      });
    });
    
    return Object.entries(servicesRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  };
  
  const calculateServiceDuration = () => {
    // Use pre-calculated data if available
    if (services && services.servicePerformance) {
      return services.servicePerformance
        .filter(service => selectedCategory === 'all' || service.name === selectedCategory)
        .map(service => ({
          name: service.name,
          avgDuration: service.avgDuration,
          totalDuration: service.avgDuration * service.totalBookings,
          count: service.totalBookings
        }))
        .sort((a, b) => b.avgDuration - a.avgDuration);
    }
    
    // Otherwise calculate from bookings
    const servicesDuration = {};
    
    allServices.forEach(service => {
      if (selectedCategory === 'all' || service.name === selectedCategory) {
        if (!servicesDuration[service.name]) {
          servicesDuration[service.name] = {
            totalDuration: 0,
            count: 0
          };
        }
        servicesDuration[service.name].totalDuration += parseInt(service.duration);
        servicesDuration[service.name].count += 1;
      }
    });
    
    return Object.entries(servicesDuration)
      .map(([name, data]) => ({ 
        name, 
        avgDuration: data.totalDuration / data.count,
        totalDuration: data.totalDuration,
        count: data.count
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration);
  };
  
  const calculateServiceTrends = () => {
    // Group by month to see trends
    const monthlyData = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.appointment_date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {};
      }
      
      booking.services.forEach(service => {
        if (selectedCategory === 'all' || service.name === selectedCategory) {
          if (!monthlyData[monthYear][service.name]) {
            monthlyData[monthYear][service.name] = 0;
          }
          monthlyData[monthYear][service.name] += 1;
        }
      });
    });
    
    // Convert to chart format
    const serviceNames = Object.keys(_.countBy(allServices, 'name'));
    const chartData = Object.entries(monthlyData)
      .map(([month, services]) => {
        const dataPoint = { month };
        serviceNames.forEach(name => {
          dataPoint[name] = services[name] || 0;
        });
        return dataPoint;
      })
      .sort((a, b) => {
        const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month);
      });
    
    return {
      data: chartData,
      serviceNames: serviceNames
    };
  };
  
  const calculateServicePerformanceMetrics = () => {
    // Use pre-calculated data if available
    if (services && services.servicePerformance) {
      return services.servicePerformance
        .filter(service => selectedCategory === 'all' || service.name === selectedCategory)
        .map(service => {
          const completed = bookings.filter(b => 
            b.status === 'completed' && 
            b.services.some(s => s.name === service.name)
          ).length;
          
          const cancelled = bookings.filter(b => 
            (b.status === 'cancelled' || b.status === 'no-show') && 
            b.services.some(s => s.name === service.name)
          ).length;
          
          return {
            name: service.name,
            totalBookings: service.totalBookings,
            completed,
            cancelled,
            completionRate: service.totalBookings > 0 
              ? (completed / service.totalBookings) * 100 
              : 0,
            cancellationRate: service.totalBookings > 0 
              ? (cancelled / service.totalBookings) * 100 
              : 0,
            revenue: service.revenue,
            avgDuration: service.avgDuration,
            price: service.revenue / (completed || 1) // Estimate price if completion data is available
          };
        })
        .sort((a, b) => b.totalBookings - a.totalBookings);
    }
    
    // Otherwise calculate from bookings
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const cancelledBookings = bookings.filter(b => 
      b.status === 'cancelled' || b.status === 'no-show'
    );
    
    const serviceMetrics = {};
    
    // Initialize metrics for all services
    allServices.forEach(service => {
      if (selectedCategory === 'all' || service.name === selectedCategory) {
        if (!serviceMetrics[service.name]) {
          serviceMetrics[service.name] = {
            totalBookings: 0,
            completed: 0,
            cancelled: 0,
            revenue: 0,
            avgDuration: parseInt(service.duration),
            price: parseInt(service.price)
          };
        }
      }
    });
    
    // Count total bookings
    bookings.forEach(booking => {
      booking.services.forEach(service => {
        if ((selectedCategory === 'all' || service.name === selectedCategory) && serviceMetrics[service.name]) {
          serviceMetrics[service.name].totalBookings += 1;
        }
      });
    });
    
    // Count completed bookings and revenue
    completedBookings.forEach(booking => {
      booking.services.forEach(service => {
        if ((selectedCategory === 'all' || service.name === selectedCategory) && serviceMetrics[service.name]) {
          serviceMetrics[service.name].completed += 1;
          serviceMetrics[service.name].revenue += parseInt(service.price);
        }
      });
    });
    
    // Count cancelled bookings
    cancelledBookings.forEach(booking => {
      booking.services.forEach(service => {
        if ((selectedCategory === 'all' || service.name === selectedCategory) && serviceMetrics[service.name]) {
          serviceMetrics[service.name].cancelled += 1;
        }
      });
    });
    
    // Calculate completion rates and format for table
    return Object.entries(serviceMetrics).map(([name, metrics]) => ({
      name,
      totalBookings: metrics.totalBookings,
      completed: metrics.completed,
      cancelled: metrics.cancelled,
      completionRate: metrics.totalBookings > 0 
        ? (metrics.completed / metrics.totalBookings) * 100 
        : 0,
      cancellationRate: metrics.totalBookings > 0 
        ? (metrics.cancelled / metrics.totalBookings) * 100 
        : 0,
      revenue: metrics.revenue,
      avgDuration: metrics.avgDuration,
      price: metrics.price
    })).sort((a, b) => b.totalBookings - a.totalBookings);
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
  
  const COLORS = ['#CE145B', '#FF69B4', '#FF98CB', '#FF74B8', '#FF4B8C', '#FFB5D7', '#FF37A4', '#FF98CB'];
  
  const servicePerformanceMetrics = calculateServicePerformanceMetrics();
  const serviceDurations = calculateServiceDuration();
  const trendData = calculateServiceTrends();
  const servicePopularity = calculateServicePopularity();
  const serviceRevenue = calculateServiceRevenue();
  
  // Handle empty data cases
  const mostPopularService = servicePopularity.length > 0 ? servicePopularity[0] : { name: 'N/A', count: 0 };
  const mostProfitableService = serviceRevenue.length > 0 ? serviceRevenue[0] : { name: 'N/A', revenue: 0 };
  const longestService = serviceDurations.length > 0 ? serviceDurations[0] : { name: 'N/A', avgDuration: 0 };
  const bestCompletionService = servicePerformanceMetrics.length > 0 ? 
    servicePerformanceMetrics.sort((a, b) => b.completionRate - a.completionRate)[0] : 
    { name: 'N/A', completionRate: 0 };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5">
        <h2 className="text-lg font-medium text-gray-900">Services Analysis ({getFormattedDateRange()})</h2>
        <div className="mt-2 sm:mt-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Services</option>
            {serviceCategories.map((category, idx) => (
              <option key={idx} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Service Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Most Popular Service */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
              <Users className="h-6 w-6" style={{ color: primaryColor }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Most Popular Service</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {mostPopularService.name}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-500">
              {mostPopularService.count} bookings
            </span>
          </div>
        </div>
        
        {/* Most Profitable Service */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
              <TrendingUp className="h-6 w-6" style={{ color: primaryColor }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Most Profitable Service</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {mostProfitableService.name}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-500">
              {formatCurrency(mostProfitableService.revenue)} revenue
            </span>
          </div>
        </div>
        
        {/* Longest Service */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
              <Clock className="h-6 w-6" style={{ color: primaryColor }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Longest Service</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {longestService.name}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-500">
              Avg. {formatDuration(Math.round(longestService.avgDuration))}
            </span>
          </div>
        </div>
        
        {/* Highest Completion Rate */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: primaryColor }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Best Completion Rate</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {bestCompletionService.name}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-500">
              {bestCompletionService.completionRate.toFixed(1)}% completion
            </span>
          </div>
        </div>
      </div>
      
      {/* Service Popularity and Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Service Popularity Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-base font-medium text-gray-900 mb-4">Service Popularity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={servicePopularity}
                margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Bookings" fill={primaryColor} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Service Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-base font-medium text-gray-900 mb-4">Service Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  nameKey="name"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {serviceRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Service Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Service Booking Trends</h3>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData.data}
              margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tickMargin={20}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {trendData.serviceNames.slice(0, 5).map((service, index) => (
                <Line 
                  key={index}
                  type="monotone" 
                  dataKey={service} 
                  stroke={COLORS[index % COLORS.length]} 
                  activeDot={{ r: 8 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Service Performance Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-base font-medium text-gray-900 mb-4">Service Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicePerformanceMetrics.map((service, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(service.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(service.avgDuration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.totalBookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">
                        {service.completionRate.toFixed(1)}%
                      </span>
                      <div className="w-full max-w-24 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${service.completionRate}%`,
                            backgroundColor: primaryColor 
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(service.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile View Cards (displayed only on small screens) */}
        <div className="mt-6 sm:hidden space-y-4">
          {servicePerformanceMetrics.map((service, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">{service.name}</h4>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-gray-500">Price:</span>
                  <p className="text-sm font-medium">{formatCurrency(service.price)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Duration:</span>
                  <p className="text-sm font-medium">{formatDuration(service.avgDuration)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Bookings:</span>
                  <p className="text-sm font-medium">{service.totalBookings}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Completion:</span>
                  <p className="text-sm font-medium">{service.completionRate.toFixed(1)}%</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500">Revenue:</span>
                  <p className="text-sm font-medium">{formatCurrency(service.revenue)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesTab;