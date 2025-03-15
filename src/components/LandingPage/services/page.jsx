'use client';
// components/ServicesSection.jsx
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const ServicesSection = () => {
  // State for horizontal scrolling position tracking
  const [scrollPosition, setScrollPosition] = useState({ 
    new: 0,
    booked: 0 
  });
  
  // New and noteworthy services
  const newServices = [
    {
      id: 1,
      title: 'Native Water Purifier',
      image: 'https://images.unsplash.com/photo-1625596170753-7a372761a82d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    },
    {
      id: 2,
      title: 'Full Home Painting',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 3,
      title: 'Ayurvedic Spa',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 4,
      title: 'Hair Studio for Women',
      image: 'https://images.unsplash.com/photo-1560869713-da86bd4b9d13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 5,
      title: 'AC Repair & Service',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
    },
    {
      id: 6,
      title: 'Home Automation',
      image: 'https://images.unsplash.com/photo-1558002038-bb0237f1bf4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
  ];

  // Most booked services
  const bookedServices = [
    {
      id: 1,
      title: 'Pest control (includes utensil removal)',
      rating: 4.79,
      reviews: '99K',
      price: '₹1,098',
      image: 'https://images.unsplash.com/photo-1632904227468-be9a58f5b716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 2,
      title: 'Apartment pest control (includes utensil removal)',
      rating: 4.81,
      reviews: '26K',
      price: '₹1,498',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 3,
      title: 'At-home consultation',
      rating: 4.80,
      reviews: '1K',
      price: '₹49',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 4,
      title: 'At-home consultation',
      rating: 4.79,
      reviews: '45K',
      price: '₹49',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 5,
      title: 'Intense bathroom cleaning',
      rating: 4.78,
      reviews: '2M',
      price: '₹519',
      image: 'https://images.unsplash.com/photo-1584771145729-0bd9fda6868b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80',
    },
    {
      id: 6,
      title: 'Deep Kitchen Cleaning',
      rating: 4.82,
      reviews: '1.5M',
      price: '₹599',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    },
  ];

  // Handle scrolling for new services
  const scrollNewServices = (direction) => {
    const container = document.getElementById('new-services-container');
    const scrollAmount = direction === 'right' ? 300 : -300;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
    // Update scroll position after scrolling
    setTimeout(() => {
      setScrollPosition({
        ...scrollPosition,
        new: container.scrollLeft + scrollAmount
      });
    }, 300);
  };

  // Handle scrolling for booked services
  const scrollBookedServices = (direction) => {
    const container = document.getElementById('booked-services-container');
    const scrollAmount = direction === 'right' ? 300 : -300;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
    // Update scroll position after scrolling
    setTimeout(() => {
      setScrollPosition({
        ...scrollPosition,
        booked: container.scrollLeft + scrollAmount
      });
    }, 300);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 md:px-6">
      {/* New and Noteworthy Section */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">New and noteworthy</h2>
        
        <div className="relative">
          {/* Services Scroll Container */}
          <div 
            id="new-services-container"
            className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar"
          >
            {newServices.map((service) => (
              <div 
                key={service.id} 
                className="flex-shrink-0 w-40 md:w-48 cursor-pointer"
              >
                <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square mb-2">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900">{service.title}</h3>
              </div>
            ))}
          </div>
          
          {/* Right scroll button */}
          <button 
            onClick={() => scrollNewServices('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-10 border border-gray-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Most Booked Services Section */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Most booked services</h2>
        
        <div className="relative">
          {/* Services Scroll Container */}
          <div 
            id="booked-services-container"
            className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar"
          >
            {bookedServices.map((service) => (
              <div 
                key={service.id} 
                className="flex-shrink-0 w-60 md:w-72 cursor-pointer"
              >
                <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square mb-2">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{service.title}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-sm">★</span>
                  <span className="text-sm font-medium">{service.rating}</span>
                  <span className="text-sm text-gray-500">({service.reviews})</span>
                </div>
                <p className="font-medium mt-1">{service.price}</p>
              </div>
            ))}
          </div>
          
          {/* Right scroll button */}
          <button 
            onClick={() => scrollBookedServices('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-10 border border-gray-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* CSS to hide scrollbar for cleaner UI */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;