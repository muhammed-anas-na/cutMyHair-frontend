'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Share2, Download, Heart, Image as ImageIcon } from 'lucide-react';

const SalonGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFavorite, setIsFavorite] = useState(false);
  const galleryRef = useRef(null);

  // Gallery categories
  const categories = ['All', 'Interior', 'Haircuts', 'Makeup', 'Events'];

  // Gallery images with varied aspect ratios
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      alt: "Salon interior design",
      aspectRatio: "portrait", // tall
      category: "Interior",
      featured: true
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f",
      alt: "Man getting haircut",
      aspectRatio: "landscape", // wide
      category: "Haircuts"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1562322140-8baeececf3df",
      alt: "Hair styling session",
      aspectRatio: "square",
      category: "Haircuts"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1",
      alt: "Salon products",
      aspectRatio: "landscape",
      category: "Interior"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
      alt: "Barber tools",
      aspectRatio: "portrait",
      category: "Interior"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486",
      alt: "Woman with makeup",
      aspectRatio: "landscape",
      category: "Makeup"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0",
      alt: "Salon event",
      aspectRatio: "portrait",
      category: "Events",
      featured: true
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a",
      alt: "Hairstyle showcase",
      aspectRatio: "square",
      category: "Haircuts"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1559599076-9c61d8e1b77c",
      alt: "Makeup session",
      aspectRatio: "landscape",
      category: "Makeup"
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1620331311520-246422fd82f9",
      alt: "Hair coloring",
      aspectRatio: "portrait",
      category: "Haircuts"
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1629774631753-88f827bf6447",
      alt: "Salon reception",
      aspectRatio: "landscape",
      category: "Interior"
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1634302086887-13b5585a8959",
      alt: "Special event styling",
      aspectRatio: "portrait",
      category: "Events"
    },
    {
      id: 13,
      src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f",
      alt: "Hair styling tools",
      aspectRatio: "square",
      category: "Interior"
    },
    {
      id: 14,
      src: "https://images.unsplash.com/photo-1584297091583-53385b921a9d",
      alt: "Salon experience",
      aspectRatio: "landscape",
      category: "Events"
    },
    {
      id: 15,
      src: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      alt: "Modern haircut",
      aspectRatio: "portrait",
      category: "Haircuts"
    },
    {
      id: 16,
      src: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60",
      alt: "Makeup products",
      aspectRatio: "square",
      category: "Makeup"
    }
  ];

  // Filter images based on active category
  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  // Open fullscreen viewer
  const openFullscreen = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Close fullscreen viewer
  const closeFullscreen = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  // Navigate to next/previous image in fullscreen mode
  const navigateImage = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(filteredImages[newIndex]);
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
  useState(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="pb-16">
      {/* Category Selector - Hide scrollbar using custom class */}
      <div className="px-4 py-3 border-b sticky top-16 z-10 bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 pb-1">
            {categories.map((category) => (
              <button
                key={category}
                className={`py-1.5 px-4 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category 
                    ? 'bg-[#FEE7EF] text-[#CE145B]' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image count */}
      <div className="px-4 pt-3 pb-1 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{filteredImages.length}</span> photos
        </p>
        <div className="flex items-center text-xs text-[#CE145B]">
          <ImageIcon size={14} className="mr-1" />
          Gallery by Signate
        </div>
      </div>

      {/* Gallery Grid - Masonry style layout */}
      <div className="p-3" ref={galleryRef}>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
          {filteredImages.map((image) => {
            // Determine if image should be larger based on featured status and position
            const isLarge = image.featured || image.id % 7 === 0;
            
            let gridClass = 'col-span-1';
            
            // Responsive column spans for different image types
            if (isLarge && image.aspectRatio === 'landscape') {
              gridClass = 'col-span-2 sm:col-span-2';
            } else if (isLarge && image.aspectRatio === 'portrait') {
              gridClass = 'col-span-1 row-span-2';
            }
            
            return (
              <motion.div
                key={image.id}
                className={`${gridClass} relative rounded-md overflow-hidden cursor-pointer`}
                whileHover={{ 
                  scale: 1.02, 
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openFullscreen(image)}
              >
                <div 
                  className="w-full bg-gray-100" 
                  style={{ 
                    paddingBottom: image.aspectRatio === 'portrait' ? '130%' : 
                                  image.aspectRatio === 'landscape' ? '66%' : '100%',
                  }}
                >
                  <img
                    src={`${image.src}?w=400&q=75&auto=format`}
                    alt={image.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="text-white text-xs font-medium truncate w-full">
                      {image.alt}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="py-12 text-center">
            <div className="inline-flex rounded-full bg-gray-100 p-3 mb-3">
              <ImageIcon size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No images found in this category</p>
            <button 
              className="mt-3 text-sm text-[#CE145B] font-medium"
              onClick={() => setActiveCategory('All')}
            >
              View all photos
            </button>
          </div>
        )}
      </div>
      
      {/* Fullscreen Image Viewer with improved UX */}
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
                {selectedImage.category}
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
                  {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
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
                  key={selectedImage.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  src={`${selectedImage.src}?w=1200&q=90&auto=format`}
                  alt={selectedImage.alt}
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {/* Caption */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg max-w-md text-center">
                  <p className="text-white text-sm">{selectedImage.alt}</p>
                </div>
              </div>
            </div>
            
            {/* Bottom thumbnails with horizontal scroll */}
            <div className="p-2 bg-black/70 backdrop-blur-sm">
              <div className="overflow-x-auto scrollbar-hide pb-1">
                <div className="flex gap-1.5 justify-center min-w-max px-2">
                  {filteredImages.map((image) => (
                    <motion.button
                      key={image.id}
                      className={`relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden ${
                        selectedImage.id === image.id ? 'ring-2 ring-[#CE145B]' : 'ring-1 ring-white/20'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(image);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={`${image.src}?w=100&h=100&fit=crop&q=60&auto=format`}
                        alt={`Thumbnail for ${image.alt}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage.id === image.id && (
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