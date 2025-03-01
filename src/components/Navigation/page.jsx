import React from 'react';
import { Home, Calendar, Heart, User } from 'lucide-react';
import Link from 'next/link';

const Navigation = ({currentPage}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {/* Home */}
          <div className="flex flex-col items-center">
            <Link href={'/home'} className="p-2 flex flex-col items-center">
              <Home className={`w-6 h-6 cursor-pointer ${currentPage == 'home' ? 'text-pink-500' : 'text-gray-600' } `} />
              <span className="text-xs mt-1 text-gray-600">Home</span>
            </Link>
          </div>

          {/* Bookings */}
          <div className="flex flex-col items-center">
            <Link href={'/bookings'} className="p-2 flex flex-col items-center">
              <Calendar className={`w-6 h-6 ${currentPage == 'bookings' ? 'text-pink-500' : 'text-gray-600' } cursor-pointer`}/>
              <span className="text-xs mt-1 text-gray-600">Bookings</span>
            </Link>
          </div>

          {/* Favourites */}
          <div className="flex flex-col items-center">
            <Link href={'/favorites'} className="p-2 flex flex-col items-center">
              <Heart className={`w-6 h-6 ${currentPage == 'favorites' ? 'text-pink-500' : 'text-gray-600' } cursor-pointer`}/>
              <span className="text-xs mt-1 text-gray-600">Favourites</span>
            </Link>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center">
            <Link href={'/profile'} className="p-2 flex flex-col items-center">
              <User className={`w-6 h-6 ${currentPage == 'profile' ? 'text-pink-500' : 'text-gray-600' } cursor-pointer`}/>
              <span className="text-xs mt-1 text-gray-600">Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Safe area spacing for iOS devices */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
};

export default Navigation;