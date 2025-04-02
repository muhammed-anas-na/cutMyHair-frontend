'use client';
import React from 'react';
import {
    Users, Briefcase, BarChart2, MoreVertical,
    TrendingUp, TrendingDown
} from 'lucide-react';

// Stats Card Component
const StatsCard = ({ title, value, change, type, icon: Icon }) => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 h-full">
        <div className="flex items-start justify-between mb-4">
            <div className="overflow-hidden">
                <h3 className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2 truncate">{title}</h3>
                <p className="text-xl sm:text-2xl font-semibold">{value}</p>
            </div>
            <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                type === 'users' ? 'bg-blue-50' : 
                type === 'orders' ? 'bg-yellow-50' : 'bg-green-50'
            }`}>
                <Icon className={`${
                    type === 'users' ? 'text-blue-500' : 
                    type === 'orders' ? 'text-yellow-500' : 'text-green-500'
                }`} size={18} />
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

// Dashboard Content Component
const DashboardContent = () => {
    const stats = [
        {
            title: 'Total User',
            value: '40,689',
            change: { value: '8.5%', direction: 'up', text: 'Up from yesterday' },
            type: 'users',
            icon: Users
        },
        {
            title: 'Total Order',
            value: '10,293',
            change: { value: '1.3%', direction: 'up', text: 'Up from past week' },
            type: 'orders',
            icon: Briefcase
        },
        {
            title: 'Total Sales',
            value: '$89,000',
            change: { value: '4.3%', direction: 'down', text: 'Down from yesterday' },
            type: 'sales',
            icon: BarChart2
        }
    ];

    return (
        <div className="max-w-full">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <h1 className="text-xl sm:text-2xl font-semibold truncate">Dashboard Overview</h1>
                <button className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>
            
            {/* Additional Dashboard Sections */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Section */}
                <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 mr-3"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">User Activity #{item}</p>
                                    <p className="text-sm text-gray-500 truncate">Activity description here</p>
                                </div>
                                <span className="text-xs text-gray-400 flex-shrink-0">2h ago</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Quick Actions Section */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {['Create Appointment', 'Add New Client', 'View Schedule', 'Generate Report'].map((action, i) => (
                            <button 
                                key={i}
                                className="w-full py-2 px-4 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;