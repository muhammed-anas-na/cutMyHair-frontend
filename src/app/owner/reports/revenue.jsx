import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Download, Calendar } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import _ from 'lodash';

const RevenueTab = ({ bookings, revenue, timeFilter }) => {
  const [revenueView, setRevenueView] = useState('daily'); // daily, weekly, monthly
  
  const primaryColor = '#CE145B';
  const secondaryColor = '#FF69B4';
  const tertiaryColor = '#FF98CB';
  const lightColor = '#FFEBF3';
  
  // Data transformation functions
  const calculateRevenueTrend = () => {
    // Use pre-calculated daily revenue from backend if available
    if (revenue && revenue.dailyRevenue && revenueView === 'daily') {
      return revenue.dailyRevenue.map(day => ({
        date: day.date,
        revenue: day.revenue,
        bookings: getBookingsCountForDay(day.date)
      }));
    }
    
    const completedBookings = bookings.filter(b => b.status === 'completed');
    
    if (revenueView === 'daily') {
      // Group by day
      const grouped = _.groupBy(completedBookings, booking => 
        new Date(booking.appointment_date).toLocaleDateString()
      );
      
      return Object.entries(grouped).map(([date, dayBookings]) => ({
        date,
        revenue: dayBookings.reduce((sum, booking) => sum + booking.total_price, 0),
        bookings: dayBookings.length
      })).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-14);
    } else if (revenueView === 'weekly') {
      // Group by week
      const weeklyData = {};
      
      completedBookings.forEach(booking => {
        const date = new Date(booking.appointment_date);
        const year = date.getFullYear();
        const weekNumber = getWeekNumber(date);
        const key = `${year}-W${weekNumber}`;
        
        if (!weeklyData[key]) {
          weeklyData[key] = {
            label: `Week ${weekNumber}`,
            revenue: 0,
            bookings: 0
          };
        }
        
        weeklyData[key].revenue += booking.total_price;
        weeklyData[key].bookings += 1;
      });
      
      return Object.entries(weeklyData).map(([key, data]) => ({
        date: data.label,
        revenue: data.revenue,
        bookings: data.bookings
      })).sort((a, b) => {
        const weekA = parseInt(a.date.split('Week ')[1]);
        const weekB = parseInt(b.date.split('Week ')[1]);
        return weekA - weekB;
      }).slice(-10);
    } else {
      // Group by month
      const monthlyData = {};
      
      completedBookings.forEach(booking => {
        const date = new Date(booking.appointment_date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const key = `${year}-${month}`;
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        if (!monthlyData[key]) {
          monthlyData[key] = {
            label: `${monthName}`,
            revenue: 0,
            bookings: 0
          };
        }
        
        monthlyData[key].revenue += booking.total_price;
        monthlyData[key].bookings += 1;
      });
      
      return Object.entries(monthlyData).map(([key, data]) => ({
        date: data.label,
        revenue: data.revenue,
        bookings: data.bookings
      })).sort((a, b) => {
        const monthA = new Date(Date.parse(`${a.date} 1, 2000`)).getMonth();
        const monthB = new Date(Date.parse(`${b.date} 1, 2000`)).getMonth();
        return monthA - monthB;
      }).slice(-12);
    }
  };

  const getBookingsCountForDay = (date) => {
    return bookings.filter(b => 
      new Date(b.appointment_date).toLocaleDateString() === date && 
      b.status === 'completed'
    ).length;
  };

  const calculateRevenueByService = () => {
    // Use pre-calculated service performance if available
    if (revenue && revenue.servicePerformance) {
      return revenue.servicePerformance.map(service => ({
        name: service.name,
        revenue: service.revenue
      })).sort((a, b) => b.revenue - a.revenue);
    }
    
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const servicesRevenue = {};
    
    completedBookings.forEach(booking => {
      booking.services.forEach(service => {
        if (!servicesRevenue[service.name]) {
          servicesRevenue[service.name] = 0;
        }
        servicesRevenue[service.name] += service.price;
      });
    });
    
    return Object.entries(servicesRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  };

  const calculateRevenueMetrics = () => {
    // Use pre-calculated metrics if available
    if (revenue) {
      return {
        totalRevenue: revenue.totalRevenue || 0,
        avgTicketValue: revenue.avgTicketValue || 0,
        avgDailyRevenue: revenue.avgDailyRevenue || 0,
        maxDailyRevenue: revenue.maxDailyRevenue || 0
      };
    }
    
    // Otherwise calculate from bookings
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.total_price, 0);
    const avgTicketValue = completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0;
    
    // Calculate revenue per day
    const revenueByDay = {};
    completedBookings.forEach(booking => {
      const day = new Date(booking.appointment_date).toLocaleDateString();
      if (!revenueByDay[day]) {
        revenueByDay[day] = 0;
      }
      revenueByDay[day] += booking.total_price;
    });
    
    const dailyRevenueValues = Object.values(revenueByDay);
    const avgDailyRevenue = dailyRevenueValues.length > 0 
      ? dailyRevenueValues.reduce((sum, value) => sum + value, 0) / dailyRevenueValues.length 
      : 0;
    
    // Highest day of revenue
    const maxDailyRevenue = dailyRevenueValues.length > 0 
      ? Math.max(...dailyRevenueValues) 
      : 0;
    
    return {
      totalRevenue,
      avgTicketValue,
      avgDailyRevenue,
      maxDailyRevenue
    };
  };

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  const metrics = calculateRevenueMetrics();
  const revenueTrendData = calculateRevenueTrend();
  const revenueByServiceData = calculateRevenueByService();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5">
        <h2 className="text-lg font-medium text-gray-900">Revenue Analysis ({getFormattedDateRange()})</h2>
        <div className="mt-2 sm:mt-0">
          <button 
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white"
            style={{ backgroundColor: primaryColor }}
            onClick={() => alert('Downloading revenue report...')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>
      
      {/* Revenue Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                <span>12.5% from last period</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Ticket Value</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(metrics.avgTicketValue)}</p>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                <span>3.2% from last period</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg. Daily Revenue</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(metrics.avgDailyRevenue)}</p>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex items-center text-sm text-red-600">
                <ArrowDownRight className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                <span>2.3% from last period</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Highest Day Revenue</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(metrics.maxDailyRevenue)}</p>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="self-center flex-shrink-0 h-5 w-5 text-gray-400 mr-1" />
                <span>Saturday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <h3 className="text-base font-medium text-gray-900">Revenue Trend</h3>
          <div className="mt-2 sm:mt-0 inline-flex bg-gray-100 p-1 rounded-md">
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                revenueView === 'daily' 
                  ? 'bg-white shadow-sm text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setRevenueView('daily')}
            >
              Daily
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                revenueView === 'weekly' 
                  ? 'bg-white shadow-sm text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setRevenueView('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                revenueView === 'monthly' 
                  ? 'bg-white shadow-sm text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setRevenueView('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueTrendData}
              margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
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
              <Tooltip formatter={(value, name) => {
                if (name === 'revenue') return formatCurrency(value);
                return value;
              }} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                name="Revenue" 
                stroke={primaryColor} 
                fill={lightColor} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                name="Bookings" 
                stroke={secondaryColor} 
                strokeWidth={2}
                dot={{ stroke: secondaryColor, strokeWidth: 2 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by Service Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Revenue by Service</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueByServiceData}
              margin={{ top: 5, right: 20, left: 20, bottom: 30 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill={primaryColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Breakdown Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-base font-medium text-gray-900 mb-4">Revenue Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Service Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueTrendData.slice(0, 7).map((day, idx) => {
                // Calculate completion rate for this day
                const dayBookings = bookings.filter(b => {
                  if (revenueView === 'daily') {
                    return new Date(b.appointment_date).toLocaleDateString() === day.date;
                  } else if (revenueView === 'weekly') {
                    const date = new Date(b.appointment_date);
                    const weekNum = getWeekNumber(date);
                    return `Week ${weekNum}` === day.date;
                  } else {
                    const month = new Date(b.appointment_date).toLocaleString('default', { month: 'short' });
                    return month === day.date;
                  }
                });
                
                const completed = dayBookings.filter(b => b.status === 'completed').length;
                const completionRate = dayBookings.length > 0 ? (completed / dayBookings.length) * 100 : 0;
                const avgServiceValue = day.bookings > 0 ? day.revenue / day.bookings : 0;
                
                return (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {completionRate.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(day.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(avgServiceValue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Responsive View for Mobile */}
        <div className="mt-4 sm:hidden">
          <p className="text-sm text-gray-500">Swipe horizontally to view more data</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueTab;