'use client';
import React, { useState, useEffect } from 'react';
import { Download, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import OverviewTab from './overviewTab';
import RevenueTab from './revenue';
import ServicesTab from './servicesTab';
import BookingsTab from './BookingsTab';
import _ from 'lodash';
import { GET_REPORT_DATA_FN } from '@/services/ownerService';

const SalonFinanceDashboard = () => {
  // State management
  const [timeFilter, setTimeFilter] = useState('week');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [serviceFilter, setServiceFilter] = useState('all');
  const [defaultSalon, setDefaultSalon] = useState('');
  const [defaultSalonId, setDefaultSalonId] = useState('')
  const primaryColor = '#CE145B';
  const lightColor = '#FFEBF3';

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await GET_REPORT_DATA_FN(defaultSalonId);
        setReportData(response.data);
        setIsLoading(false);
        console.log('Report ==>', response.data);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [timeFilter, dateRange, defaultSalon, defaultSalonId]);

  useEffect(()=>{
    setDefaultSalon(localStorage.getItem('defaultSalon'))
    setDefaultSalonId(localStorage.getItem('defaultSalonId'))
  },[])

  function handleSalonChange(){

  }
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleDownloadReport = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let yPosition = margin;

    const checkPageBreak = (requiredHeight) => {
      if (yPosition + requiredHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Title
    doc.setFontSize(18);
    doc.setTextColor(primaryColor);
    doc.text('Salon Financial Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Date Range
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Period: ${getFormattedDateRange()}`, margin, yPosition);
    yPosition += 10;

    // Overview Section
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('Overview', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Total Revenue: ${formatCurrency(reportData.overview.totalRevenue)}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Total Bookings: ${reportData.overview.totalBookings}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Completion Rate: ${reportData.overview.completionRate.toFixed(1)}%`, margin, yPosition);
    yPosition += 6;
    doc.text(`Average Service Value: ${formatCurrency(reportData.overview.avgServiceValue)}`, margin, yPosition);
    yPosition += 10;

    // Revenue Section
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('Revenue', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Total Revenue: ${formatCurrency(reportData.revenue.totalRevenue)}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Average Ticket Value: ${formatCurrency(reportData.revenue.avgTicketValue)}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Average Daily Revenue: ${formatCurrency(reportData.revenue.avgDailyRevenue)}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Highest Day Revenue: ${formatCurrency(reportData.revenue.maxDailyRevenue)}`, margin, yPosition);
    yPosition += 10;

    // Services Section
    checkPageBreak(60);
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('Services', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text('Top Services:', margin, yPosition);
    yPosition += 6;
    reportData.services.servicePerformance.slice(0, 5).forEach(service => {
      doc.text(`${service.name}: ${service.totalBookings} bookings, ${formatCurrency(service.revenue)}, Avg. Duration: ${formatDuration(Math.round(service.avgDuration))}`, margin + 5, yPosition);
      yPosition += 6;
    });
    yPosition += 10;

    // Bookings Section
    checkPageBreak(60);
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('Bookings', margin, yPosition);
    yPosition += 10;

    const bookingMetrics = reportData.bookingMetrics;

    doc.setFontSize(10);
    doc.text(`Total Bookings: ${bookingMetrics.total}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Completed: ${bookingMetrics.completed}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Cancelled: ${bookingMetrics.cancelled}`, margin, yPosition);
    yPosition += 6;
    doc.text(`No-Show: ${bookingMetrics.noShow}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Average Duration: ${formatDuration(Math.round(bookingMetrics.avgDuration))}`, margin, yPosition);
    yPosition += 10;

    // Recent Bookings (Sample)
    checkPageBreak(40);
    doc.text('Recent Bookings (Sample):', margin, yPosition);
    yPosition += 6;
    reportData.bookings.slice(0, 5).forEach(booking => {
      const dateStr = new Date(booking.appointment_date).toLocaleDateString();
      doc.text(`Booking #${booking._id.slice(-5)}: ${dateStr}, ${booking.scheduled_start_time}, ${formatCurrency(booking.total_price)}, ${booking.status}`, margin + 5, yPosition);
      yPosition += 6;
    });

    doc.save(`Salon_Financial_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const getFormattedDateRange = () => {
    if (timeFilter === 'week') return 'Last 7 days';
    if (timeFilter === 'month') return 'Last 30 days';
    if (timeFilter === 'quarter') return 'Last 90 days';
    return 'Custom range';
  };

  const renderOverviewTab = () => <OverviewTab 
    bookings={reportData?.bookings || []} 
    overview={reportData?.overview || {}} 
    timeFilter={timeFilter} 
  />;
  
  const renderRevenueTab = () => <RevenueTab 
    bookings={reportData?.bookings || []} 
    revenue={reportData?.revenue || {}} 
    timeFilter={timeFilter} 
  />;
  
  const renderServicesTab = () => <ServicesTab 
    bookings={reportData?.bookings || []} 
    services={reportData?.services || {}} 
    timeFilter={timeFilter} 
  />;
  
  const renderBookingsTab = () => <BookingsTab 
    bookings={reportData?.bookings || []} 
    bookingMetrics={reportData?.bookingMetrics || {}} 
    timeFilter={timeFilter} 
  />;

  // If there's no report data yet, show only loading
  if (isLoading && !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  const totalRevenue = reportData?.overview?.totalRevenue || 0;
  const totalBookings = reportData?.overview?.totalBookings || 0;
  const completionRate = reportData?.overview?.completionRate || 0;
  const avgServiceValue = reportData?.overview?.avgServiceValue || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </button>
              <button 
                onClick={handleDownloadReport}
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {showFilters && (
        <div className="bg-white shadow-md p-4 mb-4 max-w-7xl mx-auto mt-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 90 days</option>
                <option value="custom">Custom range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Services</option>
                <option value="Haircut">Haircut</option>
                <option value="Color">Color</option>
                <option value="Blowout">Blowout</option>
                <option value="Styling">Styling</option>
                <option value="Highlights">Highlights</option>
                <option value="Treatment">Treatment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="revenue">Revenue Report</option>
                <option value="services">Service Analysis</option>
                <option value="bookings">Booking Performance</option>
              </select>
            </div>
          </div>
        </div>
      )}
          <div className="mt-2">
                                <select
                                    value={defaultSalon}
                                    onChange={handleSalonChange}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
                                >
                                  <option value={defaultSalonId}>{defaultSalon}</option>
                                    {/* {salons.map((salon, index) => (
                                        <option key={index} value={salon}>{salon}</option>
                                    ))} */}
                                </select>
                            </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: primaryColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {isLoading ? <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div> : formatCurrency(totalRevenue)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium" style={{ color: primaryColor }}>View breakdown</a>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: primaryColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {isLoading ? <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div> : totalBookings}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium" style={{ color: primaryColor }}>View all bookings</a>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: primaryColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {isLoading ? <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div> : `${completionRate.toFixed(1)}%`}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium" style={{ color: primaryColor }}>View details</a>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: lightColor }}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: primaryColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg. Service Value</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {isLoading ? <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div> : formatCurrency(avgServiceValue)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium" style={{ color: primaryColor }}>View analysis</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${activeTab === 'overview' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              style={activeTab === 'overview' ? { borderColor: primaryColor, color: primaryColor } : {}}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${activeTab === 'revenue' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              style={activeTab === 'revenue' ? { borderColor: primaryColor, color: primaryColor } : {}}
              onClick={() => setActiveTab('revenue')}
            >
              Revenue
            </button>
            <button
              className={`${activeTab === 'services' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              style={activeTab === 'services' ? { borderColor: primaryColor, color: primaryColor } : {}}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
            <button
              className={`${activeTab === 'bookings' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              style={activeTab === 'bookings' ? { borderColor: primaryColor, color: primaryColor } : {}}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
          </nav>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: primaryColor }}></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'revenue' && renderRevenueTab()}
            {activeTab === 'services' && renderServicesTab()}
            {activeTab === 'bookings' && renderBookingsTab()}
          </>
        )}
      </main>
    </div>
  );
};

export default SalonFinanceDashboard;