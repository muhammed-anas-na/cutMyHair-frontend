// components/OffersSlider.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const OffersSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slidesContainerRef = useRef(null);
  
  const offers = [
    {
      id: 1,
      title: 'MONSOON SPECIAL',
      subtitle: 'Haircut & Hair Spa',
      description: 'Refresh your look with our combo offer',
      cta: 'Book now',
      ctaType: 'book',
      bgColor: 'bg-gray-100',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80',
    },
    {
      id: 2,
      title: 'Transform your style',
      subtitle: 'with Keratin Treatment',
      description: 'Starts at ₹2,999 only',
      cta: 'Book now',
      ctaType: 'book',
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
      image: 'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
    },
    {
      id: 3,
      title: 'Bridal Package',
      subtitle: 'Complete makeover',
      description: 'Pre-wedding special offers',
      cta: 'Enquire now',
      ctaType: 'buy',
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      accentColor: 'text-orange-500',
      image: 'image05.jpg',
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? offers.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      nextSlide();
    } else if (touchStart - touchEnd < -75) {
      // Swipe right
      prevSlide();
    }
  };
  
  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);

  // Update slider position when currentSlide changes
  useEffect(() => {
    if (slidesContainerRef.current) {
      const slideWidth = slidesContainerRef.current.offsetWidth;
      slidesContainerRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-6 md:py-10">
      {/* Slider Container */}
      <div 
        ref={slidesContainerRef}
        className="flex overflow-hidden w-full rounded-xl md:rounded-2xl relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {offers.map((offer, index) => (
          <div
            key={offer.id}
            className={`flex-shrink-0 w-full transition-all duration-300 ease-in-out ${offer.bgColor} ${offer.textColor || 'text-gray-900'}`}
            style={{ 
              transform: `translateX(${(index - currentSlide) * 100}%)`,
              position: 'relative',
              minWidth: '100%'
            }}
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Text Content */}
              <div className="p-6 md:p-10 md:w-1/2 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-bold">{offer.title}</h3>
                <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-2 ${offer.accentColor || ''}`}>
                  {offer.subtitle}
                </h2>
                <p className="text-sm md:text-base mb-6 opacity-80">{offer.description}</p>
                <div>
                  <button 
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                    ${offer.ctaType === 'buy' 
                      ? 'bg-gray-800 text-white hover:bg-gray-700' 
                      : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                  >
                    {offer.cta}
                  </button>
                </div>
              </div>
              
              {/* Image */}
              <div className="md:w-1/2 h-48 md:h-auto relative">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-md z-10 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-md z-10 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
      </button>

      {/* Indicator Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? 'bg-gray-800 w-4' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default OffersSlider;