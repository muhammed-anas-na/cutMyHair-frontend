'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, Clock, X, ChevronDown, ChevronUp, CheckCircle, Award, ArrowRight, User } from 'lucide-react';

const SalonStylists = ({ stylists = [] }) => {
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [expandedBio, setExpandedBio] = useState(false);

  // Open stylist detail modal
  const openStylistDetail = (stylist) => {
    if ( typeof window === 'undefined') return;
    setSelectedStylist(stylist);
    setExpandedBio(false);
    document.body.style.overflow = 'hidden';
  };

  // Close stylist detail modal
  const closeStylistDetail = () => {
    if (typeof window === 'undefined') return;
    setSelectedStylist(null);
    document.body.style.overflow = 'auto';
  };

  // Toggle bio expansion
  const toggleBio = () => {
    setExpandedBio(!expandedBio);
  };

  // If no stylists are available, show an empty state
  if (!stylists || stylists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <User size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Stylists Available</h3>
        <p className="text-gray-500 max-w-md">
          There are no stylists available for this salon at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Stylist count */}
      <div className="p-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-800">{stylists.length}</span> stylists available
        </p>
        <p className="text-xs text-[#CE145B]">
          Expert professionals
        </p>
      </div>

      {/* Stylists grid */}
      <div className="px-3 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {stylists.map((stylist) => (
            <motion.div
              key={stylist.id || stylist._id}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => openStylistDetail(stylist)}
            >
              <div className="p-3 sm:p-4 flex flex-col items-center text-center">
                {/* Stylist image - with fallback for missing images */}
                <div className="relative mb-2 sm:mb-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {stylist.image ? (
                      <img 
                        src={stylist.image}
                        alt={stylist.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-400">
                        <User size={40} />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Stylist name and role */}
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-0.5">{stylist.name}</h3>
                {stylist.role && (
                  <p className="text-xs text-gray-500 mb-1.5">{stylist.role}</p>
                )}
                
                {/* Rating - only show if available */}
                {stylist.rating && (
                  <div className="flex items-center mb-2">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-xs font-medium">{stylist.rating}</span>
                    {stylist.reviews && (
                      <span className="text-xs text-gray-500 ml-1">({stylist.reviews})</span>
                    )}
                  </div>
                )}
                
                {/* Specialties - only show if available */}
                {stylist.specialties && stylist.specialties.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {stylist.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* View profile button */}
                <button className="mt-auto w-full py-1.5 px-3 text-xs font-medium text-[#CE145B] bg-[#FEF0F5] rounded-md hover:bg-[#FEE7EF] transition-colors">
                  View profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Stylist Detail Modal */}
      <AnimatePresence>
        {selectedStylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 p-4 flex items-center justify-center overflow-y-auto"
            onClick={closeStylistDetail}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white w-full max-w-md rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with close button */}
              <div className="relative h-32 bg-gradient-to-r from-[#CE145B]/80 to-purple-500/80">
                <button
                  className="absolute top-4 right-4 bg-black/30 rounded-full p-1.5"
                  onClick={closeStylistDetail}
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
              
              {/* Stylist profile section */}
              <div className="px-5 pb-5 -mt-16">
                {/* Image */}
                <div className="flex justify-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-white flex items-center justify-center">
                    {selectedStylist.image ? (
                      <img 
                        src={selectedStylist.image}
                        alt={selectedStylist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-400">
                        <User size={50} />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Name and role */}
                <div className="text-center mt-3">
                  <h2 className="text-xl font-bold text-gray-900">{selectedStylist.name}</h2>
                  {selectedStylist.role && (
                    <p className="text-gray-500">{selectedStylist.role}</p>
                  )}
                </div>
                
                {/* Stats - only show if available */}
                {(selectedStylist.rating || selectedStylist.reviews || selectedStylist.experience) && (
                  <div className="flex justify-center items-center mt-3 space-x-5">
                    {selectedStylist.rating && (
                      <>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="ml-1 font-semibold">{selectedStylist.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">Rating</span>
                        </div>
                        <div className="h-8 w-px bg-gray-300"></div>
                      </>
                    )}
                    
                    {selectedStylist.reviews && (
                      <>
                        <div className="flex flex-col items-center">
                          <div className="font-semibold">{selectedStylist.reviews}</div>
                          <span className="text-xs text-gray-500">Reviews</span>
                        </div>
                        <div className="h-8 w-px bg-gray-300"></div>
                      </>
                    )}
                    
                    {selectedStylist.experience && (
                      <div className="flex flex-col items-center">
                        <div className="font-semibold">{selectedStylist.experience}</div>
                        <span className="text-xs text-gray-500">Experience</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Awards - only show if available */}
                {selectedStylist.awards && selectedStylist.awards.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Award size={14} className="mr-1 text-[#CE145B]" />
                      Awards & Recognition
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStylist.awards.map((award, index) => (
                        <div key={index} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full flex items-center">
                          <span className="text-yellow-500 mr-1">🏆</span>
                          {award}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Specialties - only show if available */}
                {selectedStylist.specialties && selectedStylist.specialties.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStylist.specialties.map((specialty, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-[#FEF0F5] text-[#CE145B] px-3 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Bio - only show if available */}
                {selectedStylist.bio && (
                  <div className="mt-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
                    <p className={`text-sm text-gray-600 leading-relaxed ${!expandedBio ? 'line-clamp-3' : ''}`}>
                      {selectedStylist.bio}
                    </p>
                    {selectedStylist.bio.length > 120 && (
                      <button 
                        className="mt-1 text-xs font-medium text-[#CE145B] flex items-center"
                        onClick={toggleBio}
                      >
                        {expandedBio ? (
                          <>
                            Show less <ChevronUp size={14} className="ml-1" />
                          </>
                        ) : (
                          <>
                            Read more <ChevronDown size={14} className="ml-1" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
                
                {/* Availability - only show if available */}
                {selectedStylist.availability && (
                  <div className="mt-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Clock size={14} className="mr-1 text-[#CE145B]" />
                      Availability
                    </h3>
                    <p className="text-sm text-gray-600">{selectedStylist.availability}</p>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 py-2.5 border border-[#CE145B] text-[#CE145B] font-medium rounded-lg text-sm hover:bg-[#FEF0F5] transition-colors">
                    View services
                  </button>
                  <button className="flex-1 py-2.5 bg-[#CE145B] text-white font-medium rounded-lg text-sm hover:bg-[#B01050] transition-colors flex items-center justify-center">
                    Book now <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Styles to hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SalonStylists;