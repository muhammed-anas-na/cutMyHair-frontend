import { Bell, Search, MoreVertical } from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import Link from "next/link";

function Header() {
  const { locationName, locationText, setShowLocationModal } = useLocation();

  // Function to truncate text with ellipsis if longer than 15 characters
  const truncateText = (text) => {
    if (!text) return "";
    return text.length > 15 ? `${text.substring(0, 15)}...` : text;
  };
  const displayLocationText = locationText ? truncateText(locationText) : "Find My Location";
  const displayLocationName = locationName ? truncateText(locationName) : "Set your location";
 
  // Handle click on the location area
  const handleLocationClick = () => {
    setShowLocationModal(true);
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center justify-between p-4">
      {/* Logo - visible on all screens */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Location */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={handleLocationClick}
        >
          <div className="bg-pink-100 p-2 rounded-full">
            <svg className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div className="hidden sm:block">
            <h2 className="font-medium text-lg">{displayLocationText}</h2>
            <p className="text-gray-500 text-sm">{displayLocationName}</p>
          </div>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-4">
        <Bell className="hidden sm:block w-6 h-6 text-gray-600" />
        <Link href={'/search'}><Search className="w-6 h-6 text-gray-600" /></Link>
        <MoreVertical className="w-6 h-6 text-gray-600" />
      </div>
    </div>
  </div>
</div>
  );
}

export default Header;