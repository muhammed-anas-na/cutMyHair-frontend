'use client';
// app/components/owner/Sidebar.jsx
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Home, Users, Calendar, Briefcase,
    BarChart2, Bell, Settings, ChevronDown,
    Sun, Moon, ChevronLeft, ChevronRight,
} from 'lucide-react';

const Sidebar = ({ isDarkMode, setIsDarkMode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isIncomeExpanded, setIsIncomeExpanded] = useState(false);

    const navItems = [
        { id: '/owner/dashboard', label: 'Dashboard', icon: Home },
        { id: '/owner/salons', label: 'My Salons', icon: Briefcase, hasSubmenu: true },
        { id: '/owner/clients', label: 'Clients', icon: Users },
        { id: '/owner/schedules', label: 'Schedules', icon: Calendar },
        { id: '/owner/workers', label: 'Workers', icon: Users },
        {
            id: '/owner/income',
            label: 'Income',
            icon: BarChart2,
            submenu: ['Earnings', 'Refunds', 'Declines', 'Payouts'],
            isExpanded: isIncomeExpanded
        }
    ];

    const MenuItem = ({ item }) => (
        <div className="space-y-1">
            <button
                onClick={() => {
                    router.push(item.id);
                    if (item.id === '/owner/income') {
                        setIsIncomeExpanded(!isIncomeExpanded);
                    }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
          ${pathname === item.id ? 'bg-[#FFDBD7] text-[#CE145B]' : 'hover:bg-gray-100'}
          ${!isExpanded ? 'justify-center' : ''}`}
            >
                {React.createElement(item.icon, { size: 20 })}
                {isExpanded && (
                    <div className="flex-1 flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.hasSubmenu && <ChevronDown size={16} />}
                    </div>
                )}
            </button>
            {item.submenu && isIncomeExpanded && isExpanded && (
                <div className="ml-12 space-y-1">
                    {item.submenu.map((subItem) => (
                        <button
                            key={subItem}
                            onClick={() => router.push(`/owner/income/${subItem.toLowerCase()}`)}
                            className={`w-full text-left py-2 px-4 rounded-lg transition-colors
                ${pathname === `/owner/income/${subItem.toLowerCase()}` ? 'bg-[#FFDBD7] text-[#CE145B]' : 'hover:bg-gray-100'}`}
                        >
                            {subItem}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className={`h-screen border-r flex flex-col bg-white transition-all ${isExpanded ? 'w-64' : 'w-20'}`}>
            <div className="p-4 border-b flex items-center justify-between">
                {isExpanded ? (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-full" />
                        <span className="font-semibold">Salon</span>
                    </div>
                ) : (
                    <div className="w-8 h-8 bg-black rounded-full mx-auto" />
                )}
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-gray-100 rounded">
                    {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <div className="flex-1 py-4 space-y-1">
                {isExpanded && <div className="px-4 text-sm text-gray-500 mb-2">MAIN</div>}
                {navItems.map((item) => (
                    <MenuItem key={item.id} item={item} />
                ))}
            </div>

            <div className="p-4 space-y-4">
                <div className="space-y-1">
                    {isExpanded && <div className="px-4 text-sm text-gray-500 mb-2">SETTINGS</div>}
                    <button
                        onClick={() => router.push('/owner/notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
              ${pathname === '/owner/notifications' ? 'bg-[#FFDBD7] text-[#CE145B]' : 'hover:bg-gray-100'}
              ${!isExpanded ? 'justify-center' : ''}`}
                    >
                        <Bell size={20} />
                        {isExpanded && <span>Notification</span>}
                    </button>
                    <button
                        onClick={() => router.push('/owner/settings')}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
              ${pathname === '/owner/settings' ? 'bg-[#FFDBD7] text-[#CE145B]' : 'hover:bg-gray-100'}
              ${!isExpanded ? 'justify-center' : ''}`}
                    >
                        <Settings size={20} />
                        {isExpanded && (
                            <div className="flex-1 flex items-center justify-between">
                                <span>Settings</span>
                                <ChevronDown size={16} />
                            </div>
                        )}
                    </button>
                </div>

                {isExpanded && (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <button
                            onClick={() => setIsDarkMode(false)}
                            className={`p-2 rounded ${!isDarkMode ? 'bg-white shadow' : ''}`}
                        >
                            <Sun size={16} />
                        </button>
                        <button
                            onClick={() => setIsDarkMode(true)}
                            className={`p-2 rounded ${isDarkMode ? 'bg-white shadow' : ''}`}
                        >
                            <Moon size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;