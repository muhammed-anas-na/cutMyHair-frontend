'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Image as ImageIcon,
  Filter,
  Check,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const SalonReviews = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('recent');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [expandedReview, setExpandedReview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const reviewsRef = useRef(null);
  
  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: '5', label: '5 ★' },
    { id: '4', label: '4 ★' },
    { id: '3', label: '3 ★' },
    { id: '2', label: '2 ★' },
    { id: '1', label: '1 ★' },
    { id: 'with_photo', label: 'With Photos' }
  ];
  
  // Sort options
  const sortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'highest', label: 'Highest Rating' },
    { id: 'lowest', label: 'Lowest Rating' },
    { id: 'photos', label: 'With Photos' }
  ];
  
  // Dummy review data
  const reviewsData = [
    {
      id: 1,
      user: {
        name: "Priya Singh",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        visits: 12
      },
      rating: 5,
      date: "2 days ago",
      text: "Absolutely loved my experience at Signate! Sarah was my stylist and she did an amazing job with my haircut. She took the time to understand what I wanted and offered great suggestions. The salon itself is beautiful, clean, and has a great ambiance. Highly recommend!",
      images: [
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
      ],
      likes: 24,
      comments: 3,
      service: "Haircut & Styling"
    },
    {
      id: 2,
      user: {
        name: "John Doe",
        image: null,
        visits: 3
      },
      rating: 4,
      date: "1 week ago",
      text: "Good service and a nice environment. David did a great job with my fade. Only reason it's not 5 stars is because I had to wait about 15 minutes past my appointment time.",
      images: [],
      likes: 8,
      comments: 1,
      service: "Men's Haircut"
    },
    {
      id: 3,
      user: {
        name: "Aisha Khan",
        image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150",
        visits: 7
      },
      rating: 5,
      date: "2 weeks ago",
      text: "I had a wonderful experience getting my hair colored here. Alexa understood exactly what I wanted and the result exceeded my expectations. The staff was friendly and offered me tea while I waited. The products they use are high quality and my color has lasted really well.",
      images: [
        "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400"
      ],
      likes: 32,
      comments: 5,
      service: "Hair Coloring"
    },
    {
      id: 4,
      user: {
        name: "Michael Chen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        visits: 1
      },
      rating: 3,
      date: "1 month ago",
      text: "The haircut was okay but not exactly what I asked for. The stylist was friendly but seemed rushed. The price was reasonable and the salon itself is clean and modern.",
      images: [],
      likes: 3,
      comments: 2,
      service: "Men's Haircut"
    },
    {
      id: 5,
      user: {
        name: "Sophia Williams",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        visits: 20
      },
      rating: 5,
      date: "1 month ago",
      text: "I've been coming to Signate for over a year now and have never been disappointed. The team is skilled, professional, and always makes me feel welcome. My recent facial with Priya was incredibly relaxing and effective. My skin has never looked better!",
      images: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
        "https://images.unsplash.com/photo-1614957004291-c1feff7b0c3f?w=400",
        "https://images.unsplash.com/photo-1614331586458-4e7c0c0b1a8f?w=400"
      ],
      likes: 45,
      comments: 8,
      service: "Facial Treatment"
    },
    {
      id: 6,
      user: {
        name: "Robert Johnson",
        image: null,
        visits: 2
      },
      rating: 2,
      date: "2 months ago",
      text: "Mediocre experience. The haircut was not what I expected and the stylist didn't seem to listen to my request. The salon is nice but I probably won't return.",
      images: [],
      likes: 1,
      comments: 4,
      service: "Men's Haircut"
    },
    {
      id: 7,
      user: {
        name: "Emma Garcia",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
        visits: 5
      },
      rating: 5,
      date: "2 months ago",
      text: "Had my first appointment here yesterday for a cut and color, and I'm already booking my next visit! The staff was attentive, the beverages offered were a nice touch, and most importantly - my hair looks amazing! Thank you to James for understanding exactly what I wanted.",
      images: [],
      likes: 19,
      comments: 2,
      service: "Haircut & Color"
    }
  ];
  
  // Filter reviews based on selected filter
  const filteredReviews = reviewsData.filter(review => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'with_photo') return review.images.length > 0;
    return review.rating.toString() === activeFilter;
  });
  
  // Sort filtered reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (activeSort === 'recent') {
      // Simple sorting for demo purposes - in a real app you'd parse the dates properly
      return a.id < b.id ? 1 : -1;
    } else if (activeSort === 'highest') {
      return b.rating - a.rating;
    } else if (activeSort === 'lowest') {
      return a.rating - b.rating;
    } else if (activeSort === 'photos') {
      return b.images.length - a.images.length;
    }
    return 0;
  });
  
  // Generate rating stars
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        size={14}
        className={`${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };
  
  // Toggle review expansion
  const toggleReviewExpansion = (id) => {
    setExpandedReview(expandedReview === id ? null : id);
  };
  
  // Calculate overall rating statistics
  const calculateRatingStats = () => {
    const totalReviews = reviewsData.length;
    const averageRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const ratingCounts = {
      5: reviewsData.filter(review => review.rating === 5).length,
      4: reviewsData.filter(review => review.rating === 4).length,
      3: reviewsData.filter(review => review.rating === 3).length,
      2: reviewsData.filter(review => review.rating === 2).length,
      1: reviewsData.filter(review => review.rating === 1).length
    };
    
    return {
      averageRating,
      totalReviews,
      ratingCounts
    };
  };
  
  const stats = calculateRatingStats();
  
  // Open image modal
  const openImageModal = (review, imageIndex) => {
    setSelectedImage({
      review,
      currentIndex: imageIndex
    });
    document.body.style.overflow = 'hidden';
  };
  
  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  
  // Navigate to next/previous image in the modal
  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const { review, currentIndex } = selectedImage;
    const totalImages = review.images.length;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % totalImages;
    } else {
      newIndex = (currentIndex - 1 + totalImages) % totalImages;
    }
    
    setSelectedImage({
      ...selectedImage,
      currentIndex: newIndex
    });
  };
  return (
    <div className="pb-16" ref={reviewsRef}>
      {/* Rating summary */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8">
          {/* Overall rating */}
          <div className="text-center mb-4 sm:mb-0">
            <div className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div>
            <div className="flex justify-center my-1">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <div className="text-sm text-gray-500">
              Based on {stats.totalReviews} reviews
            </div>
          </div>
          
          {/* Rating breakdown */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map(rating => {
              const percentage = (stats.ratingCounts[rating] / stats.totalReviews) * 100;
              return (
                <div key={rating} className="flex items-center mb-1.5">
                  <div className="flex items-center mr-2 w-10">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star size={12} className="ml-0.5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500 w-8">{stats.ratingCounts[rating]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Filters and sort */}
      <div className="px-4 pt-3 pb-2 sticky top-16 z-10 bg-white border-b">
        <div className="flex justify-between items-center">
          {/* Rating filters - scrollable */}
          <div className="overflow-x-auto scrollbar-hide flex-1">
            <div className="flex space-x-2 pb-1">
              {filterOptions.map(filter => (
                <button
                  key={filter.id}
                  className={`py-1.5 px-3 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter.id 
                      ? 'bg-[#FEE7EF] text-[#CE145B]' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sort dropdown */}
          <div className="relative ml-2">
            <button
              className="flex items-center py-1.5 px-3 bg-gray-100 rounded-full text-xs font-medium"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter size={12} className="mr-1" />
              Sort
              <ChevronDown size={14} className="ml-1" />
            </button>
            
            {/* Dropdown menu */}
            <AnimatePresence>
              {showFilterMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
                >
                  {sortOptions.map(option => (
                    <button
                      key={option.id}
                      className="flex items-center w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setActiveSort(option.id);
                        setShowFilterMenu(false);
                      }}
                    >
                      <span className="flex-1">{option.label}</span>
                      {activeSort === option.id && (
                        <Check size={14} className="text-[#CE145B]" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Reviews list */}
      <div className="divide-y">
        {sortedReviews.length > 0 ? (
          sortedReviews.map(review => {
            const isExpanded = expandedReview === review.id;
            const hasLongText = review.text.length > 150;
            
            return (
              <div key={review.id} className="p-4">
                {/* User info and rating */}
                <div className="flex items-center mb-3">
                  {/* User avatar */}
                  <div className="mr-3">
                    {review.user.image ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={review.user.image} 
                          alt={review.user.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={18} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* User details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                      <h3 className="font-medium text-gray-900">{review.user.name}</h3>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {review.date}
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {review.user.visits} {review.user.visits === 1 ? 'visit' : 'visits'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Review content */}
                <div>
                  {/* Service tag */}
                  <div className="mb-2">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {review.service}
                    </span>
                  </div>
                  
                  {/* Review text */}
                  <div className="mb-3">
                    <p className={`text-sm text-gray-700 leading-relaxed ${hasLongText && !isExpanded ? 'line-clamp-3' : ''}`}>
                      {review.text}
                    </p>
                    
                    {/* Read more/less button */}
                    {hasLongText && (
                      <button 
                        className="mt-1 text-xs font-medium text-[#CE145B] flex items-center"
                        onClick={() => toggleReviewExpansion(review.id)}
                      >
                        {isExpanded ? (
                          <>Show less <ChevronUp size={14} className="ml-1" /></>
                        ) : (
                          <>Read more <ChevronDown size={14} className="ml-1" /></>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Review images */}
                  {review.images.length > 0 && (
                    <div className="mb-3">
                      <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                        {review.images.map((image, index) => (
                          <div 
                            key={index}
                            className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer bg-gray-100"
                            onClick={() => openImageModal(review, index)}
                          >
                            <img 
                              src={image} 
                              alt={`Review by ${review.user.name} - ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center mt-2">
                    <button className="flex items-center text-gray-500 hover:text-gray-700 mr-5">
                      <ThumbsUp size={14} className="mr-1" />
                      <span className="text-xs">{review.likes}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-gray-700">
                      <MessageCircle size={14} className="mr-1" />
                      <span className="text-xs">{review.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // No reviews found
          <div className="py-10 text-center">
            <div className="inline-flex rounded-full bg-gray-100 p-3 mb-3">
              <MessageCircle size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No reviews found with this filter</p>
            <button 
              className="mt-3 text-sm text-[#CE145B] font-medium"
              onClick={() => setActiveFilter('all')}
            >
              View all reviews
            </button>
          </div>
        )}
      </div>
      
      {/* Add review button */}
      <div className="fixed bottom-20 right-4">
        <button className="bg-[#CE145B] text-white rounded-full px-4 py-3 shadow-lg flex items-center font-medium">
          <MessageCircle size={16} className="mr-1" />
          Write a review
        </button>
      </div>
      
      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col"
            onClick={closeImageModal}
          >
            {/* Top controls */}
            <div className="p-4 flex items-center justify-between text-white">
              <div className="flex items-center">
                {selectedImage.review.user.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <img 
                      src={selectedImage.review.user.image} 
                      alt={selectedImage.review.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    <User size={14} className="text-gray-500" />
                  </div>
                )}
                <span className="text-sm">{selectedImage.review.user.name}</span>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  closeImageModal();
                }}
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            
            {/* Image counter */}
            <div className="absolute top-14 left-0 right-0 flex justify-center">
              <div className="bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                {selectedImage.currentIndex + 1} / {selectedImage.review.images.length}
              </div>
            </div>
            
            {/* Main image */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Navigation arrows */}
              {selectedImage.review.images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 p-2 bg-black/40 rounded-full text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('prev');
                    }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="absolute right-4 p-2 bg-black/40 rounded-full text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('next');
                    }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              
              {/* Image */}
              <div className="w-full h-full flex items-center justify-center p-4">
                <motion.img
                  key={selectedImage.currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={selectedImage.review.images[selectedImage.currentIndex]}
                  alt={`Review by ${selectedImage.review.user.name}`}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            {/* Thumbnails */}
            {selectedImage.review.images.length > 1 && (
              <div className="p-2 bg-black/40">
                <div className="flex justify-center space-x-2 overflow-x-auto scrollbar-hide pb-1">
                  {selectedImage.review.images.map((image, index) => (
                    <button
                      key={index}
                      className={`w-12 h-12 rounded overflow-hidden flex-shrink-0 ${
                        index === selectedImage.currentIndex ? 'ring-2 ring-[#CE145B]' : 'opacity-70'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage({
                          ...selectedImage,
                          currentIndex: index
                        });
                      }}
                    >
                      <img 
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Style to hide scrollbar */}
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

export default SalonReviews;