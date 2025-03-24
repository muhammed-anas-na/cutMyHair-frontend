'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Scissors,
  Image,
  ThumbsUp,
  MessageCircle,
  Share2
} from 'lucide-react';
import { checkIfOpenToday } from '@/helpers';

const SalonAbout = ({ salon = {} }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Extract working hours from salon data or provide empty array as fallback
  const workingHours = salon?.working_hours ? [
    { day: "Monday", hours: salon.working_hours.monday?.isOpen ? formatTime(salon.working_hours.monday.start) + " - " + formatTime(salon.working_hours.monday.end) : "Closed" },
    { day: "Tuesday", hours: salon.working_hours.tuesday?.isOpen ? formatTime(salon.working_hours.tuesday.start) + " - " + formatTime(salon.working_hours.tuesday.end) : "Closed" },
    { day: "Wednesday", hours: salon.working_hours.wednesday?.isOpen ? formatTime(salon.working_hours.wednesday.start) + " - " + formatTime(salon.working_hours.wednesday.end) : "Closed" },
    { day: "Thursday", hours: salon.working_hours.thursday?.isOpen ? formatTime(salon.working_hours.thursday.start) + " - " + formatTime(salon.working_hours.thursday.end) : "Closed" },
    { day: "Friday", hours: salon.working_hours.friday?.isOpen ? formatTime(salon.working_hours.friday.start) + " - " + formatTime(salon.working_hours.friday.end) : "Closed" },
    { day: "Saturday", hours: salon.working_hours.saturday?.isOpen ? formatTime(salon.working_hours.saturday.start) + " - " + formatTime(salon.working_hours.saturday.end) : "Closed" },
    { day: "Sunday", hours: salon.working_hours.sunday?.isOpen ? formatTime(salon.working_hours.sunday.start) + " - " + formatTime(salon.working_hours.sunday.end) : "Closed" }
  ] : [];
  
  // Helper function to format time string
  function formatTime(timeString) {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  }
  
  // Standard salon amenities - these will be shown even if not specifically mentioned in DB
  const amenities = [
    "Free Wi-Fi",
    "Air Conditioning",
    "Parking Available",
    "Wheelchair Accessible",
    "Premium Products"
  ];

  // FAQ data - kept static but could be moved to DB later
  const faqs = [
    {
      id: 1,
      question: "Do I need to make an appointment?",
      answer: "While we accept walk-ins when possible, we recommend booking an appointment to ensure you get your preferred stylist at your desired time. You can book through our app, website, or by calling us directly."
    },
    {
      id: 2,
      question: "What happens if I need to cancel my appointment?",
      answer: "We understand that plans change. We appreciate at least 24 hours notice for cancellations. For cancellations with less than 24 hours notice, a small fee may be charged. Please contact us as soon as possible if you need to reschedule."
    },
    {
      id: 3,
      question: "Do you offer any loyalty programs or discounts?",
      answer: "Yes! We have a loyalty program where you earn points for every service and product purchase. We also offer seasonal promotions, referral bonuses, and special discounts for first-time clients."
    },
    {
      id: 4,
      question: "What brands do you use at the salon?",
      answer: "We use premium products from well-known professional brands. We carefully select products that deliver excellent results while maintaining hair health and integrity."
    },
    {
      id: 5,
      question: "Are there parking facilities available?",
      answer: "Yes, we have dedicated parking spaces for our clients. Please check with us for specific parking instructions when you make your appointment."
    }
  ];
  
  // Toggle FAQ expansion
  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };
  
  // Navigation sections
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'hours', label: 'Hours' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'faqs', label: 'FAQs' }
  ];

  // Handle empty state for the entire salon data
  if (!salon || Object.keys(salon).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Scissors size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Information Available</h3>
        <p className="text-gray-500 max-w-md">
          There is no information available about this salon yet.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Section navigation */}
      <div className="px-4 py-3 border-b sticky top-16 z-10 bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-5 pb-1">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`py-1 whitespace-nowrap text-sm font-medium transition-colors ${
                  activeSection === section.id 
                    ? 'text-[#CE145B] border-b-2 border-[#CE145B]' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="p-4">
        {/* Overview section */}
        {activeSection === 'overview' && (
          <div>
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{salon.name || "Unnamed Salon"}</h1>
                {salon.rating && (
                  <div className="flex items-center mt-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{salon.rating}</span>
                    {salon.reviews && (
                      <span className="text-gray-500 text-sm ml-1">({salon.reviews} reviews)</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex space-x-3 mt-3 sm:mt-0">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={18} className="text-gray-700" />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <ThumbsUp size={18} className="text-gray-700" />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <MessageCircle size={18} className="text-gray-700" />
                </motion.button>
              </div>
            </div>
            
            {/* Images gallery - horizontal scroll */}
            {salon.images && salon.images.length > 0 ? (
              <div className="mb-6">
                <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                  <div className="flex space-x-3 pb-2">
                    {salon.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200"
                      >
                        <img 
                          src={image} 
                          alt={`${salon.name} - ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center h-40">
                <Image size={32} className="text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">No images available</p>
              </div>
            )}
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-base font-semibold mb-2 text-gray-900">About Us</h2>
              {salon.description ? (
                <>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{salon.description}</p>
                  {salon.longDescription && (
                    <p className="text-gray-700 text-sm leading-relaxed">{salon.longDescription}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm bg-gray-50 p-3 rounded-lg">
                  No description available for this salon yet.
                </p>
              )}
            </div>
            
            {/* Contact information */}
            <div className="mb-6">
              <h2 className="text-base font-semibold mb-3 text-gray-900">Contact & Location</h2>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="space-y-3">
                  {salon.address || salon.location_text ? (
                    <div className="flex items-start">
                      <MapPin size={16} className="mt-0.5 text-[#CE145B] mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{salon.address || salon.location_text}</span>
                    </div>
                  ) : null}
                  
                  {salon.contact_phone && (
                    <div className="flex items-center">
                      <Phone size={16} className="text-[#CE145B] mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{salon.contact_phone}</span>
                    </div>
                  )}
                  
                  {salon.email && (
                    <div className="flex items-center">
                      <Mail size={16} className="text-[#CE145B] mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{salon.email}</span>
                    </div>
                  )}
                  
                  {!salon.address && !salon.location_text && !salon.contact_phone && !salon.email && (
                    <div className="py-2 text-sm text-gray-500">
                      Contact information not available
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Social media - placeholder for future implementation */}
            <div className="mb-3">
              <h2 className="text-base font-semibold mb-3 text-gray-900">Connect With Us</h2>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">
                Social media information coming soon
              </div>
            </div>
          </div>
        )}
        
        {/* Hours section */}
        {activeSection === 'hours' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Opening Hours</h2>
              {
                checkIfOpenToday(salon) == true ? (
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Open now
                </div>
                ) : (
                  <div className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  Closed Now
                </div>
                )
              }
            </div>
            
            {workingHours.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {workingHours.map((schedule, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between p-3 ${
                      index !== workingHours.length - 1 ? 'border-b border-gray-100' : ''
                    } ${schedule.day === 'Sunday' ? 'bg-gray-50' : ''}`}
                  >
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <span className={`text-sm ${schedule.day === 'Sunday' ? 'font-medium' : ''}`}>
                        {schedule.day}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Clock size={24} className="mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Working hours information not available</p>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-[#FEF0F5] rounded-lg flex items-center">
              <Scissors size={16} className="text-[#CE145B] mr-2" />
              <p className="text-sm text-gray-700">
                Hours may vary on holidays. Please call to confirm if you're visiting on a public holiday.
              </p>
            </div>
          </div>
        )}
        
               {/* Amenities section */}
               {activeSection === 'amenities' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Scissors size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Amenities Coming Soon</h3>
            <p className="text-gray-500 max-w-md text-center">
              We're currently updating our amenities information. Please check back later for a complete list of salon amenities and facilities.
            </p>
          </div>
        )}
        
              {/* FAQs section */}
              {activeSection === 'faqs' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <MessageCircle size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">FAQs Coming Soon</h3>
            <p className="text-gray-500 max-w-md text-center">
              We're gathering the most common questions from our clients. Our FAQ section will be available soon to help answer your queries.
            </p>
          </div>
        )}
      </div>
      
      {/* Style to hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Custom rotation class */
        .rotate-270 {
          transform: rotate(270deg);
        }
      `}</style>
    </div>
  );
};

export default SalonAbout;