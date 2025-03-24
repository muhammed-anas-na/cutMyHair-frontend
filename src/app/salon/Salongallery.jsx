'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Share2, Download, Heart, Image as ImageIcon } from 'lucide-react';

const SalonGallery = ({ galleryImages = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Open fullscreen viewer
  const openFullscreen = (image, index) => {
    setSelectedImage({ url: image, index });
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Close fullscreen viewer
  const closeFullscreen = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  // Navigate to next/previous image in fullscreen mode
  const navigateImage = (direction) => {
    if (!selectedImage || galleryImages.length === 0) return;
    
    const currentIndex = selectedImage.index;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage({ url: galleryImages[newIndex], index: newIndex });
  };

  // Handle key press for navigation
  const handleKeyDown = (e) => {
    if (selectedImage) {
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'Escape') closeFullscreen();
    }
  };

  // Add event listener for keyboard navigation
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // Display empty state if no gallery images
  if (!galleryImages || galleryImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <ImageIcon size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Gallery Images</h3>
        <p className="text-gray-500 max-w-md">
          There are no photos available in this salon's gallery yet.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Image count */}
      <div className="px-4 pt-3 pb-1 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{galleryImages.length}</span> photos
        </p>
        <div className="flex items-center text-xs text-[#CE145B]">
          <ImageIcon size={14} className="mr-1" />
          Gallery by Signate
        </div>
      </div>

      {/* Gallery Grid - Masonry style layout */}
      <div className="p-3">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
          {galleryImages.map((imageUrl, index) => {
            // Make some images larger based on position for visual interest
            const isLarge = index % 7 === 0 || index % 11 === 0;
            
            let gridClass = 'col-span-1';
            
            // Responsive column spans for different positions
            if (isLarge) {
              // Alternate between wide and tall layouts for featured images
              gridClass = index % 2 === 0 
                ? 'col-span-2 sm:col-span-2' 
                : 'col-span-1 row-span-2';
            }
            
            return (
              <motion.div
                key={index}
                className={`${gridClass} relative rounded-md overflow-hidden cursor-pointer bg-gray-100`}
                whileHover={{ 
                  scale: 1.02, 
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openFullscreen(imageUrl, index)}
              >
                <div 
                  className="w-full bg-gray-100" 
                  style={{ 
                    paddingBottom: isLarge && index % 2 !== 0 ? '130%' : 
                                 isLarge && index % 2 === 0 ? '66%' : '100%',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Salon gallery image ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="text-white text-xs font-medium truncate w-full">
                      Image {index + 1}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col"
            onClick={closeFullscreen}
          >
            {/* Top bar with controls */}
            <div className="relative p-4 flex items-center justify-between text-white z-10">
              <motion.button 
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  closeFullscreen();
                }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-sm opacity-80">
                Salon Gallery
              </div>
              
              <div className="flex space-x-1">
                <motion.button 
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#CE145B] text-[#CE145B]' : ''}`} />
                </motion.button>
                <motion.button 
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
                <motion.button 
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            {/* Main image display with navigation */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Image counter */}
              <div className="absolute top-0 left-0 right-0 flex justify-center mt-2">
                <div className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white">
                  {selectedImage.index + 1} / {galleryImages.length}
                </div>
              </div>
              
              {/* Navigation arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4">
                <motion.button 
                  className="p-1 sm:p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
                <motion.button 
                  className="p-1 sm:p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </div>
              
              {/* Main image with animation */}
              <div className="w-full h-full flex items-center justify-center p-4">
                <motion.img
                  key={selectedImage.index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  src={selectedImage.url}
                  alt={`Gallery image ${selectedImage.index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            {/* Bottom thumbnails with horizontal scroll */}
            <div className="p-2 bg-black/70 backdrop-blur-sm">
              <div className="overflow-x-auto scrollbar-hide pb-1">
                <div className="flex gap-1.5 justify-center min-w-max px-2">
                  {galleryImages.map((imageUrl, index) => (
                    <motion.button
                      key={index}
                      className={`relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden ${
                        selectedImage.index === index ? 'ring-2 ring-[#CE145B]' : 'ring-1 ring-white/20'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage({ url: imageUrl, index });
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={imageUrl}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage.index === index && (
                        <div className="absolute inset-0 bg-[#CE145B]/20"></div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default SalonGallery;