'use client';
// app/owner/layout.js
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../../components/owner/Sidebar/page';
import { SalonProvider } from '@/context/SalonContext';
import { Menu } from 'lucide-react';

export default function OwnerLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const pathname = usePathname();

    // Check for mobile view on window resize
    useEffect(() => {
        const checkScreenSize = () => {
            const isMobile = window.innerWidth < 768;
            setIsMobileView(isMobile);
            
            // Only auto-hide sidebar on initial load for mobile, not when toggling
            if (isMobile && isSidebarVisible && !document.hidden) {
                setIsSidebarVisible(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Define routes that should bypass the layout
    const fullScreenRoutes = [
        '/owner/register',
        '/owner/login',
        '/owner/registerSalon',
        '/ownerRegistrationComplete',
        '/owner/success',
        '/owner/numberofseats',
        '/owner/salontime'
    ];

    // Check if current route should be full screen
    const isFullScreenRoute = fullScreenRoutes.includes(pathname);

    const toggleSidebar = () => {
        // Force a true toggle regardless of current state
        setIsSidebarVisible(prevState => !prevState);
    };

    // If it's a full screen route, render just the children
    if (isFullScreenRoute) {
        return (
            <SalonProvider>  
                {children}
            </SalonProvider>
        );
    }

    // Otherwise, render the layout with sidebar
    return (
        <SalonProvider>
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar Component */}
                <Sidebar 
                    isDarkMode={isDarkMode} 
                    setIsDarkMode={setIsDarkMode} 
                    isVisible={isSidebarVisible}
                    setIsVisible={setIsSidebarVisible}
                    isMobileView={isMobileView}
                />
                
                {/* Main Content Area */}
                <div 
                    className={`flex-1 transition-all duration-300 ${
                        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'
                    }`}
                    style={{ 
                        marginLeft: isMobileView ? 0 : (isSidebarVisible ? '0' : '0'),
                        width: '100%'
                    }}
                >
                    {/* Mobile Header with Menu Toggle */}
                    <div className="sticky top-0 z-10 bg-white border-b md:hidden p-4 flex items-center">
                        <button 
                            onClick={toggleSidebar}
                            className="p-2 mr-2 rounded-lg hover:bg-gray-100"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-semibold">Salon Dashboard</h1>
                    </div>
                    
                    {/* Desktop Header with Menu Toggle */}
                    <div className="hidden md:flex sticky top-0 z-10 bg-white border-b p-4 items-center">
                        <button 
                            onClick={toggleSidebar}
                            className="p-2 mr-4 rounded-lg hover:bg-gray-100"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-semibold">Salon Dashboard</h1>
                    </div>

                    {/* Content Area with Proper Padding */}
                    <div className="p-4 sm:p-6 md:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </SalonProvider>
    );
}