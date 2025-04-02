// components/AppShowcase.jsx
import Image from 'next/image';

const AppShowcase = () => {
  return (
    <section className="bg-gray-100 py-12 sm:py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4 sm:mb-6">
              Book your salon appointment with ease using our CutMyHair app
            </h2>
            
            <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
              Browse styles, find the best stylists, book appointments, and manage your hair journey all from your phone. No more waiting in line or calling the salon.
            </p>
            
            {/* App Features List */}
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#CE145B] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">Book appointments anytime, anywhere</p>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#CE145B] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">Browse stylist portfolios and reviews</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#CE145B] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">Receive appointment reminders and exclusive offers</p>
              </div>
            </div>
            
            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-4">
              <a 
                href="#" 
                className="inline-block transition-transform hover:scale-105"
                aria-label="Download on the App Store"
              >
                <Image 
                  src="/app-store.png" 
                  alt="Download on the App Store" 
                  width={170} 
                  height={50}
                  className="h-12 w-auto"
                />
              </a>
              <a 
                href="#" 
                className="inline-block transition-transform hover:scale-105"
                aria-label="Get it on Google Play"
              >
                <Image 
                  src="/play-store.png" 
                  alt="Get it on Google Play" 
                  width={170} 
                  height={50}
                  className="h-12 w-auto"
                />
              </a>
            </div>
          </div>
          
          {/* Mobile App Screenshots */}
          <div className="relative h-[400px] sm:h-[450px] md:h-[500px] flex justify-center items-center">
            {/* Main App Screenshot */}
            <div className="relative z-20 transform transition-transform hover:scale-105 duration-500">
              <img 
                src="phone-image.png" 
                alt="CutMyHair mobile app main screen"
                className="max-h-[500px] w-auto mx-auto drop-shadow-2xl"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] bg-[#CE145B]/10 rounded-full z-10"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px] border-2 border-[#CE145B]/20 rounded-full z-0"></div>
          </div>
        </div>
        
        {/* Download Stats */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-[#CE145B]">10k+</p>
            <p className="text-gray-600">Downloads</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-[#CE145B]">4.8</p>
            <p className="text-gray-600">App Rating</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-[#CE145B]">50+</p>
            <p className="text-gray-600">Salons</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-[#CE145B]">15k+</p>
            <p className="text-gray-600">Appointments</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;