'use client';
// app/components/owner/Sidebar/page.jsx
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Home, Users, Calendar, Briefcase,
     Bell, Settings, ChevronDown,
    Sun, Moon, ChevronLeft, ChevronRight,
    Menu, X, Scissors, Package, DollarSign,
    Percent, Shield, HelpCircle,Wallet
} from 'lucide-react';

const Sidebar = ({ isDarkMode, setIsDarkMode, isVisible, setIsVisible, isMobileView }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isIncomeExpanded, setIsIncomeExpanded] = useState(false);

    // Synchronize sidebar expansion state with visibility - using your existing logic
    useEffect(() => {
        if (!isVisible && isExpanded && !isMobileView) {
            setIsExpanded(false);
        } else if (isVisible && !isExpanded && !isMobileView) {
            setIsExpanded(true);
        }
        
        // For mobile, ensure the sidebar is always fully expanded when visible
        if (isMobileView && isVisible) {
            setIsExpanded(true);
        }
    }, [isVisible, isExpanded, isMobileView]);

    // Using your existing navItems structure with some salon-specific additions
    const navItems = [
        { id: '/owner/dashboard', label: 'Dashboard', icon: Home },
        { id: '/owner/salons', label: 'My Salons', icon: Briefcase },
        { id: '/owner/schedules', label: 'Schedules', icon: Calendar },
        { id: '/owner/reports', label: 'Reports', icon: DollarSign },
        {id: '/owner/finance', label: 'Finance', icon: Wallet}
    ];

    // Keeping your existing toggle functions
    const toggleSidebar = () => {
        // Force toggle using function form to ensure the latest state is used
        setIsVisible(prev => !prev);
        
        // For mobile, always make sure sidebar is expanded when visible
        if (isMobileView && !isVisible) {
            setIsExpanded(true);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleNavigation = (route) => {
        router.push(route);
        if (isMobileView) {
            setIsVisible(false);
        }
    };

    // Keeping your existing MenuItem component logic
    const MenuItem = ({ item }) => (
        <div className="space-y-1">
            <button
                onClick={() => {
                    handleNavigation(item.id);
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
                        <span className="whitespace-nowrap">{item.label}</span>
                    </div>
                )}
            </button>
            {item.submenu && isIncomeExpanded && isExpanded && (
                <div className="ml-12 space-y-1">
                    {item.submenu.map((subItem) => (
                        <button
                            key={subItem}
                            onClick={() => handleNavigation(`/owner/income/${subItem.toLowerCase()}`)}
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

    // Sidebar overlay for mobile - using your existing implementation
    const SidebarOverlay = () => (
        isVisible && isMobileView && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={toggleSidebar}
            />
        )
    );

    return (
        <>
            <SidebarOverlay />

            {/* Sidebar container with UI improvements but preserving your logic */}
            <aside 
                className={`h-screen flex flex-col bg-white transition-all duration-300 overflow-hidden
                    ${isExpanded ? 'w-64' : 'w-20'} 
                    ${isMobileView ? 'fixed left-0 top-0 z-40 shadow-xl' : 'sticky top-0'} 
                    ${isVisible ? 'translate-x-0' : isMobileView ? '-translate-x-full' : 'md:translate-x-0 md:w-0'}`}
            >
                <div className="p-4 border-b flex items-center justify-between">
                    {isExpanded ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#CE145B] rounded-full flex items-center justify-center text-white font-bold text-sm">SB</div>
                            <span className="font-semibold truncate">Salon Boss</span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-[#CE145B] rounded-full mx-auto flex-shrink-0" />
                    )}
                </div>

                <div className="flex-1 py-4 space-y-1 overflow-y-auto scrollbar-hide">
                    {isExpanded && <div className="px-4 text-sm text-gray-500 mb-2">MAIN</div>}
                    {navItems.map((item) => (
                        <MenuItem key={item.id} item={item} />
                    ))}
                </div>

                <div className="p-4 space-y-4 border-t">
                    <div className="space-y-1">
                        {isExpanded && <div className="px-4 text-sm text-gray-500 mb-2">SETTINGS</div>}
                        <button
                            onClick={() => handleNavigation('/owner/notifications')}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                                ${pathname === '/owner/notifications' ? 'bg-[#FFDBD7] text-[#CE145B]' : 'hover:bg-gray-100'}
                                ${!isExpanded ? 'justify-center' : ''}`}
                        >
                            <Bell size={20} />
                            {isExpanded && <span>Notification</span>}
                        </button>
                        <button
                            onClick={() => handleNavigation('/owner/settings')}
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
            </aside>
        </>
    );
};

export default Sidebar;