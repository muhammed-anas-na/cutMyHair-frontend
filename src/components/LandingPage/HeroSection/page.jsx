// components/HeroSection.jsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Users, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);
  
  // Primary brand color
  const primaryColor = '#CE145B';
  
  const serviceCategories = [
    {
      title: "Men's Haircut",
      icon: "/service-icons/men-hair.png",
      value: "Haircut"
    },
    {
      title: "Women's Haircut",
      icon: "/service-icons/woman-hair.png",
      value: "Haircut"
    },
    {
      title: "Beard Styling",
      icon: "/service-icons/shaving-icon.png",
      value: "Beard"
    },
    {
      title: "Hair Coloring",
      icon: "/service-icons/hair-coloring.png",
      value: "Haircolour"
    },
    {
      title: "Facials",
      icon: "/service-icons/facial-treatment.png",
      value: "Facials"
    },
    {
      title: "Waxing",
      icon: "/service-icons/waxing.png",
      value: "Waxing"
    },
    {
      title: "Massage",
      icon: "/service-icons/massage.png",
      value: "Massage"
    },
    {
      title: "Makeup",
      icon: "/service-icons/makeup.png",
      value: "Makeup"
    },
  ];

  const handleClick = (value) => {
    router.push(`/home?selected_category=${value}`);
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
          {/* Left Column - Clean, minimal text and services */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Haircuts on <span style={{ color: primaryColor }}>Your</span> Schedule
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Book premium salon services at your convenience. No waiting, just beautiful results.
            </p>

            {/* Simple Services Grid */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                What are you looking for?
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {serviceCategories.slice(0, 4).map((service, index) => (
                  <div 
                    onClick={() => handleClick(service.value)}
                    key={index} 
                    className="flex flex-col items-center bg-gray-50 rounded-md p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 relative mb-2">
                      <Image 
                        src={service.icon}
                        alt={service.title}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <p className="text-xs md:text-sm text-center text-gray-800">
                      {service.title}
                    </p>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => router.push('/home')}
                className="w-full mt-4 py-3 px-4 text-center rounded-md text-white font-medium transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                See All Services
              </button>
            </div>

            {/* Simple Trust Indicators */}
            <div className="flex items-center justify-start gap-10">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" />
                <div>
                  <p className="text-xl font-semibold text-gray-900">4.8</p>
                  <p className="text-sm text-gray-500">Service Rating</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-700 mr-2" />
                <div>
                  <p className="text-xl font-semibold text-gray-900">12M+</p>
                  <p className="text-sm text-gray-500">Customers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Grid with hover effects */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-12 gap-3">
              {/* Large image */}
              <div className="col-span-8 row-span-2 rounded-lg overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-70 transition-opacity z-10"></div>
                <div className="absolute bottom-0 left-0 p-4 z-20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white text-lg font-medium mb-1">Premium Haircuts</h3>
                  <button 
                    className="text-white text-sm flex items-center"
                    onClick={() => handleClick('Haircut')}
                  >
                    Book now <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
                <img
                  src="image01.jpg"
                  alt="Premium haircut service"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Top right */}
              <div className="col-span-4 rounded-lg overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-70 transition-opacity z-10"></div>
                <div className="absolute bottom-0 left-0 p-3 z-20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white text-sm font-medium mb-1">Coloring</h3>
                  <button 
                    className="text-white text-xs flex items-center"
                    onClick={() => handleClick('Haircolour')}
                  >
                    Book now <ArrowRight size={12} className="ml-1" />
                  </button>
                </div>
                <img
                  src="image02.jpg"
                  alt="Hair coloring service"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Bottom row */}
              <div className="col-span-4 rounded-lg overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-70 transition-opacity z-10"></div>
                <div className="absolute bottom-0 left-0 p-3 z-20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white text-sm font-medium mb-1">Facials</h3>
                  <button 
                    className="text-white text-xs flex items-center"
                    onClick={() => handleClick('Facials')}
                  >
                    Book now <ArrowRight size={12} className="ml-1" />
                  </button>
                </div>
                <img
                  src="image03.jpg"
                  alt="Facial treatment"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="col-span-4 rounded-lg overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-70 transition-opacity z-10"></div>
                <div className="absolute bottom-0 left-0 p-3 z-20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white text-sm font-medium mb-1">Massage</h3>
                  <button 
                    className="text-white text-xs flex items-center"
                    onClick={() => handleClick('Massage')}
                  >
                    Book now <ArrowRight size={12} className="ml-1" />
                  </button>
                </div>
                <img
                  src="image04.jpg"
                  alt="Massage therapy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;