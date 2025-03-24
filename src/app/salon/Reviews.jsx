'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Calendar
} from 'lucide-react';

const SalonReviews = ({ salonRating, reviews = [] }) => {
  const [expandedReview, setExpandedReview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Calculate overall rating statistics
  const calculateRatingStats = () => {
    if (!reviews || reviews.length === 0) {
      return {
        averageRating: salonRating || 0,
        totalReviews: 0,
        ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    
    const totalReviews = reviews.length;
    // Use provided salon rating if available, otherwise calculate
    const averageRating = salonRating || (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews);
    
    const ratingCounts = {
      5: reviews.filter(review => review.rating === 5).length,
      4: reviews.filter(review => review.rating === 4).length,
      3: reviews.filter(review => review.rating === 3).length,
      2: reviews.filter(review => review.rating === 2).length,
      1: reviews.filter(review => review.rating === 1).length
    };
    
    return {
      averageRating,
      totalReviews,
      ratingCounts
    };
  };
  
  const stats = calculateRatingStats();
  
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
    if (!selectedImage || !selectedImage.review.images || selectedImage.review.images.length === 0) return;
    
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

  // If no reviews, show empty state
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <MessageCircle size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Reviews Yet</h3>
        <p className="text-gray-500 max-w-md">
          This salon hasn't received any reviews yet. Be the first to share your experience!
        </p>
        <button className="mt-4 bg-[#CE145B] text-white rounded-full px-4 py-2 shadow-md flex items-center font-medium">
          <MessageCircle size={16} className="mr-1" />
          Write a review
        </button>
      </div>
    );
  }

  return (
    <div className="pb-16">
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
              const percentage = stats.totalReviews > 0 
                ? (stats.ratingCounts[rating] / stats.totalReviews) * 100 
                : 0;
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
      
      {/* Reviews list */}
      <div className="divide-y">
        {reviews.map(review => {
          const isExpanded = expandedReview === review.id || expandedReview === review._id;
          const reviewId = review.id || review._id;
          const hasLongText = review.text && review.text.length > 150;
          const hasImages = review.images && review.images.length > 0;
          
          return (
            <div key={reviewId} className="p-4">
              {/* User info and rating */}
              <div className="flex items-center mb-3">
                {/* User avatar */}
                <div className="mr-3">
                  {review.user?.image ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={review.user.image} 
                        alt={review.user.name || "User"} 
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
                    <h3 className="font-medium text-gray-900">{review.user?.name || "Anonymous User"}</h3>
                    {review.date && (
                      <div className="text-xs text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {review.date}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    {review.user?.visits && (
                      <span className="text-xs text-gray-500 ml-2">
                        {review.user.visits} {review.user.visits === 1 ? 'visit' : 'visits'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Review content */}
              <div>
                {/* Service tag */}
                {review.service && (
                  <div className="mb-2">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {review.service}
                    </span>
                  </div>
                )}
                
                {/* Review text */}
                {review.text && (
                  <div className="mb-3">
                    <p className={`text-sm text-gray-700 leading-relaxed ${hasLongText && !isExpanded ? 'line-clamp-3' : ''}`}>
                      {review.text}
                    </p>
                    
                    {/* Read more/less button */}
                    {hasLongText && (
                      <button 
                        className="mt-1 text-xs font-medium text-[#CE145B] flex items-center"
                        onClick={() => toggleReviewExpansion(reviewId)}
                      >
                        {isExpanded ? (
                          <>Show less <ChevronUp size={14} className="ml-1" /></>
                        ) : (
                          <>Read more <ChevronDown size={14} className="ml-1" /></>
                        )}
                      </button>
                    )}
                  </div>
                )}
                
                {/* Review images */}
                {hasImages && (
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
                            alt={`Review by ${review.user?.name || "User"} - ${index + 1}`}
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
                    <span className="text-xs">{review.likes || 0}</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <MessageCircle size={14} className="mr-1" />
                    <span className="text-xs">{review.comments || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
                {selectedImage.review.user?.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <img 
                      src={selectedImage.review.user.image} 
                      alt={selectedImage.review.user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    <User size={14} className="text-gray-500" />
                  </div>
                )}
                <span className="text-sm">{selectedImage.review.user?.name || "Anonymous User"}</span>
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
            {selectedImage.review.images && selectedImage.review.images.length > 0 && (
              <div className="absolute top-14 left-0 right-0 flex justify-center">
                <div className="bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                  {selectedImage.currentIndex + 1} / {selectedImage.review.images.length}
                </div>
              </div>
            )}
            
            {/* Main image */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Navigation arrows */}
              {selectedImage.review.images && selectedImage.review.images.length > 1 && (
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
              {selectedImage.review.images && selectedImage.review.images.length > 0 && (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <motion.img
                    key={selectedImage.currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={selectedImage.review.images[selectedImage.currentIndex]}
                    alt={`Review by ${selectedImage.review.user?.name || "User"}`}
                    className="max-w-full max-h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {selectedImage.review.images && selectedImage.review.images.length > 1 && (
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