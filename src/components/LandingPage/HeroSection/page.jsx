// components/HeroSection.jsx
import Image from 'next/image';
import { Star, Users } from 'lucide-react';

const HeroSection = () => {
  const serviceCategories = [
    {
      title: "Men's Haircut",
      icon: "/service-icons/men-hair.png",
    },
    {
      title: "Women's Haircut",
      icon: "/service-icons/woman-hair.png",
    },
    {
      title: "Beard Styling",
      icon: "/service-icons/shaving-icon.png",
    },
    {
      title: "Hair Coloring",
      icon: "/service-icons/hair-coloring.png",
    },
    {
      title: "Facials",
      icon: "/service-icons/facial-treatment.png",
    },
    {
      title: "Waxing",
      icon: "/service-icons/waxing.png",
    },
    {
      title: "Massage",
      icon: "/service-icons/massage.png",
    },
    {
      title: "Makeup",
      icon: "/service-icons/makeup.png",
    },
  ];

  return (
    <section className="container py-12 md:py-16 bg-white px-6 md:px-52 mx-auto">
      <div className=" mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-8 lg:gap-12">
          {/* Left Column - Text and Service Categories */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Haircuts on Your Schedule.
            </h1>

            {/* Services Selector Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 mb-5">
                What are you looking for?
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {serviceCategories.map((service, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center bg-gray-50 rounded-md p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 relative mb-2">
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
            </div>

            {/* Rating and Customers Info */}
            <div className="flex items-center justify-start gap-10 mt-8">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-gray-900 mr-2 fill-current" />
                <div>
                  <p className="text-xl font-semibold text-gray-900">4.8</p>
                  <p className="text-sm text-gray-600">Service Rating</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="w-6 h-6 text-gray-900 mr-2" />
                <div>
                  <p className="text-xl font-semibold text-gray-900">12M+</p>
                  <p className="text-sm text-gray-600">Customers Globally</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Grid */}
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-2 gap-3">
              {/* Top-left image (larger) */}
              <div className="aspect-[3/4] col-span-1 row-span-2 relative rounded-lg overflow-hidden">
                <img
                  src="image01.jpg"
                  alt="Woman getting beauty service"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              
              {/* Top-right image */}
              <div className="aspect-square col-span-1 relative rounded-lg overflow-hidden">
                <img
                  src="image02.jpg"
                  alt="Man getting massage"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              
              {/* Bottom-left image */}
              <div className="aspect-square col-span-1 row-span-2 relative rounded-lg overflow-hidden">
                <img
                  src="image03.jpg"
                  alt="Kitchen repair service"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              
              {/* Bottom-right image */}
              <div className="aspect-square col-span-1 relative rounded-lg overflow-hidden">
                <img
                  src="image04.jpg"
                  alt="AC repair service"
                  layout="fill"
                  objectFit="cover"
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