'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, Clock, X, ChevronDown, ChevronUp, CheckCircle, Award, ArrowRight } from 'lucide-react';

const SalonStylists = () => {
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedBio, setExpandedBio] = useState(false);
  
  // Stylist specialty filters
  const filters = ['All', 'Haircuts', 'Coloring', 'Styling', 'Makeup'];
  
  // Stylist data
  const stylists = [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format",
      role: "Senior Stylist",
      specialties: ["Haircuts", "Coloring"],
      experience: "8 years",
      rating: 4.9,
      reviews: 152,
      availability: "Mon-Fri",
      bio: "Sarah is an award-winning stylist specializing in precision cuts and vibrant coloring techniques. With 8 years of experience and continual education, she stays on top of the latest trends while ensuring each client's individual style is enhanced. Sarah is known for her attention to detail and ability to recommend styles that complement her clients' features and lifestyle.",
      featured: true,
      awards: ["Best Colorist 2023", "Style Innovation Award"]
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&auto=format",
      role: "Barber & Style Expert",
      specialties: ["Haircuts", "Beard Styling"],
      experience: "6 years",
      rating: 4.8,
      reviews: 98,
      availability: "Tue-Sat",
      bio: "Michael brings a modern approach to classic barbering techniques. His expertise in men's grooming has earned him a loyal clientele who appreciate his precision cuts and beard styling skills."
    },
    {
      id: 3,
      name: "Alexa Rivera",
      image: "https://images.unsplash.com/photo-1592621385612-4d7129426394?w=500&auto=format",
      role: "Color Specialist",
      specialties: ["Coloring", "Highlights"],
      experience: "5 years",
      rating: 4.7,
      reviews: 87,
      availability: "Wed-Sun",
      bio: "Alexa is passionate about creating custom color solutions for every client. From natural balayage to vivid fashion colors, she has the technical skill and artistic vision to bring your color dreams to life."
    },
    {
      id: 4,
      name: "David Wilson",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format",
      role: "Master Stylist",
      specialties: ["Haircuts", "Styling"],
      experience: "12 years",
      rating: 4.9,
      reviews: 215,
      availability: "Mon-Sat",
      bio: "With over a decade of experience working in top salons, David brings unparalleled expertise to every client. His approach combines classic techniques with contemporary style for timeless, wearable looks."
    },
    {
      id: 5,
      name: "Priya Patel",
      image: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=500&auto=format",
      role: "Makeup Artist & Stylist",
      specialties: ["Makeup", "Styling"],
      experience: "7 years",
      rating: 4.8,
      reviews: 129,
      availability: "Thu-Mon",
      bio: "Priya's dual expertise in makeup artistry and hair styling makes her the perfect choice for special events. From subtle everyday looks to glamorous evening styles, she understands how to bring out each client's natural beauty."
    },
    {
      id: 6,
      name: "James Thompson",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format",
      role: "Texture Specialist",
      specialties: ["Curly Hair", "Haircuts"],
      experience: "9 years",
      rating: 4.7,
      reviews: 106,
      availability: "Tue-Sun",
      bio: "James has dedicated his career to understanding and enhancing natural texture. His specialized cutting and styling techniques for curly, coily, and wavy hair have made him a sought-after expert in the field."
    }
  ];

  // Filter stylists based on selected specialty
  const filteredStylists = activeFilter === 'All' 
    ? stylists 
    : stylists.filter(stylist => stylist.specialties.includes(activeFilter));

  // Open stylist detail modal
  const openStylistDetail = (stylist) => {
    setSelectedStylist(stylist);
    setExpandedBio(false);
    document.body.style.overflow = 'hidden';
  };

  // Close stylist detail modal
  const closeStylistDetail = () => {
    setSelectedStylist(null);
    document.body.style.overflow = 'auto';
  };

  // Toggle bio expansion
  const toggleBio = () => {
    setExpandedBio(!expandedBio);
  };

  return (
    <div className="pb-16">
      {/* Filter section */}
      <div className="px-4 py-3 border-b sticky top-16 z-10 bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`py-1.5 px-4 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter 
                    ? 'bg-[#FEE7EF] text-[#CE145B]' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stylist count */}
      <div className="p-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-800">{filteredStylists.length}</span> stylists available
        </p>
        <p className="text-xs text-[#CE145B]">
          Expert professionals
        </p>
      </div>

      {/* Stylists grid */}
      <div className="px-3 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredStylists.map((stylist) => (
            <motion.div
              key={stylist.id}
              className={`bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
                stylist.featured ? 'ring-2 ring-[#CE145B]/20' : ''
              }`}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => openStylistDetail(stylist)}
            >
              <div className="p-3 sm:p-4 flex flex-col items-center text-center">
                {/* Stylist image */}
                <div className="relative mb-2 sm:mb-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-200">
                    <img 
                      src={stylist.image}
                      alt={stylist.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Featured badge */}
                  {stylist.featured && (
                    <div className="absolute -top-1 -right-1 bg-[#CE145B] text-white text-xs rounded-full p-1">
                      <CheckCircle size={12} />
                    </div>
                  )}
                </div>
                
                {/* Stylist name and role */}
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-0.5">{stylist.name}</h3>
                <p className="text-xs text-gray-500 mb-1.5">{stylist.role}</p>
                
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-xs font-medium">{stylist.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({stylist.reviews})</span>
                </div>
                
                {/* Specialties */}
                <div className="flex flex-wrap justify-center gap-1 mb-2">
                  {stylist.specialties.map((specialty) => (
                    <span 
                      key={specialty}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                {/* View profile button */}
                <button className="mt-auto w-full py-1.5 px-3 text-xs font-medium text-[#CE145B] bg-[#FEF0F5] rounded-md hover:bg-[#FEE7EF] transition-colors">
                  View profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Empty state */}
        {filteredStylists.length === 0 && (
          <div className="py-10 text-center">
            <div className="inline-flex rounded-full bg-gray-100 p-3 mb-3">
              <Award size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No stylists found with this specialty</p>
            <button 
              className="mt-3 text-sm text-[#CE145B] font-medium"
              onClick={() => setActiveFilter('All')}
            >
              View all stylists
            </button>
          </div>
        )}
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
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                    <img 
                      src={selectedStylist.image}
                      alt={selectedStylist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Name and role */}
                <div className="text-center mt-3">
                  <h2 className="text-xl font-bold text-gray-900">{selectedStylist.name}</h2>
                  <p className="text-gray-500">{selectedStylist.role}</p>
                </div>
                
                {/* Stats */}
                <div className="flex justify-center items-center mt-3 space-x-5">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-semibold">{selectedStylist.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">Rating</span>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <div className="font-semibold">{selectedStylist.reviews}</div>
                    <span className="text-xs text-gray-500">Reviews</span>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <div className="font-semibold">{selectedStylist.experience}</div>
                    <span className="text-xs text-gray-500">Experience</span>
                  </div>
                </div>
                
                {/* Awards */}
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
                
                {/* Specialties */}
                <div className="mt-5">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStylist.specialties.map((specialty) => (
                      <span 
                        key={specialty}
                        className="text-xs bg-[#FEF0F5] text-[#CE145B] px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Bio */}
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
                
                {/* Availability */}
                <div className="mt-5">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock size={14} className="mr-1 text-[#CE145B]" />
                    Availability
                  </h3>
                  <p className="text-sm text-gray-600">{selectedStylist.availability}</p>
                </div>
                
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