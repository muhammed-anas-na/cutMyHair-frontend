'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, Image } from 'lucide-react';

const SalonImageSlider = ({ images = [], altText = "Salon image" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-slide functionality (optional)
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        handleNext();
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning, images]);

  // Navigate to the next image
  const handleNext = () => {
    if (!images || images.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Navigate to the previous image
  const handlePrev = () => {
    if (!images || images.length <= 1) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // If no images are available
  if (!images || images.length === 0) {
    return (
      <div className="relative max-h-60 overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-400">
          <Image className="w-10 h-10 mb-2" />
          <p className="text-sm font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-h-60 overflow-hidden">
      {/* Current image */}
      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`${altText} ${currentIndex + 1}/${images.length}`}
        className="w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Favorite button */}
      <motion.button 
        className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-md z-10"
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsFavorite(!isFavorite)}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? 'text-[#CE145B] fill-[#CE145B]' : 'text-gray-500'}`} />
      </motion.button>

      {/* Navigation controls - only show if there are multiple images */}
      {images.length > 1 && (
        <>
          {/* Previous button */}
          <button
            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white z-10 hover:bg-black/50 transition-colors"
            onClick={handlePrev}
            disabled={isTransitioning}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next button */}
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white z-10 hover:bg-black/50 transition-colors"
            onClick={handleNext}
            disabled={isTransitioning}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicator dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full z-10">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

export default SalonImageSlider;