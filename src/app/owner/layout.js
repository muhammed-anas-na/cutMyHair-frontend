'use client';
// app/owner/layout.js
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../../components/owner/Sidebar/page';
import { SalonProvider } from '@/context/SalonContext';

export default function OwnerLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const pathname = usePathname();

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

    // If it's a full screen route, render just the children
    if (isFullScreenRoute) {
        return(
            <SalonProvider>  
                {children}
            </SalonProvider>
        );
    }

    // Otherwise, render the layout with sidebar
    return (
        <SalonProvider>
        <div className="flex min-h-screen">
            <Sidebar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <div className={`flex-1 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
                {children}
            </div>
        </div>
        </SalonProvider>
    );
}