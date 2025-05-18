'use client';
// app/components/owner/BottomBar/page.jsx
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Home, Users, Calendar, Briefcase,
    Bell, Settings, ChevronDown, ChevronUp,
    Sun, Moon, ChevronLeft, ChevronRight,
    Menu, X, Scissors, Package, DollarSign,
    Percent, Shield, HelpCircle, Wallet, MoreVertical
} from 'lucide-react';

const BottomBar = ({isVisible = true, isMobileView }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3); // Example notification count

    // Primary navigation items (visible in bottom bar)
    const primaryNavItems = [
        { id: '/owner/dashboard', label: 'Home', icon: Home },
        { id: '/owner/salons', label: 'Salons', icon: Briefcase },
        { id: '/owner/schedules', label: 'Schedule', icon: Calendar },
        { id: '/owner/finance', label: 'Finance', icon: Wallet },
    ];

    // Secondary navigation items (in expandable menu)
    const secondaryNavItems = [
        { id: '/owner/reports', label: 'Reports', icon: DollarSign },
        { id: '/owner/settings', label: 'Settings', icon: Settings },
        { id: '/owner/notifications', label: 'Notifications', icon: Bell },
    ];

    const handleNavigation = (route) => {
        router.push(route);
        setIsMoreMenuOpen(false);
        setIsNotificationMenuOpen(false);
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.more-menu') && !event.target.closest('.more-button')) {
                setIsMoreMenuOpen(false);
            }
            if (!event.target.closest('.notification-menu') && !event.target.closest('.notification-button')) {
                setIsNotificationMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const NotificationBadge = ({ count }) => (
        count > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                {count > 9 ? '9+' : count}
            </div>
        )
    );

    const MenuItem = ({ item, onClick }) => {
        const isActive = pathname === item.id;
        const IconComponent = item.icon;
        
        return (
            <button
                onClick={onClick || (() => handleNavigation(item.id))}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-200
                    ${isActive ? 'text-[#CE145B]' : 'text-gray-600 hover:text-gray-900'}
                    active:scale-95`}
            >
                <div className="relative">
                    <IconComponent 
                        size={22} 
                        className={isActive ? 'stroke-2' : 'stroke-[1.5]'}
                    />
                    {item.id === '/owner/notifications' && (
                        <NotificationBadge count={notificationCount} />
                    )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                </span>
                {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#CE145B] rounded-full" />
                )}
            </button>
        );
    };

    const MoreMenu = () => (
        <div 
            className={`more-menu absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 
                overflow-hidden transition-all duration-300 ${isMoreMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            style={{ width: '200px' }}
        >
            <div className="py-1">
                {secondaryNavItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isActive = pathname === item.id;
                    
                    return (
                        <React.Fragment key={item.id}>
                            {index > 0 && <div className="h-px bg-gray-100 mx-2" />}
                            <button
                                onClick={() => handleNavigation(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors
                                    ${isActive ? 'bg-[#FFDBD7] text-[#CE145B]' : 'hover:bg-gray-50'}`}
                            >
                                <div className="relative">
                                    <IconComponent size={18} />
                                    {item.id === '/owner/notifications' && (
                                        <NotificationBadge count={notificationCount} />
                                    )}
                                </div>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );

    return (
        <>
            {/* Optional backdrop for more menu */}
            {(isMoreMenuOpen || isNotificationMenuOpen) && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-0 z-40"
                    onClick={() => {
                        setIsMoreMenuOpen(false);
                        setIsNotificationMenuOpen(false);
                    }}
                />
            )}

            {/* Bottom navigation bar */}
            <nav 
                className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50
                    transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}
                    ${isMobileView ? 'block' : 'hidden sm:block'}`}
            >
                <div className="relative px-4">
                    <div className="flex items-center justify-between">
                        {primaryNavItems.map((item) => (
                            <MenuItem key={item.id} item={item} />
                        ))}
                        <div className="relative">
                            <button
                                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                className={`more-button flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all duration-200
                                    ${isMoreMenuOpen ? 'text-[#CE145B]' : 'text-gray-600 hover:text-gray-900'}
                                    active:scale-95`}
                            >
                                <MoreVertical 
                                    size={22} 
                                    className={isMoreMenuOpen ? 'stroke-2' : 'stroke-[1.5]'}
                                />
                                <span className={`text-xs font-medium ${isMoreMenuOpen ? 'font-semibold' : ''}`}>
                                    More
                                </span>
                                {isMoreMenuOpen && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#CE145B] rounded-full" />
                                )}
                            </button>
                            <MoreMenu />
                        </div>
                    </div>
                </div>
                <div className="h-safe-area-inset-bottom bg-white" />
            </nav>
        </>
    );
};

export default BottomBar;