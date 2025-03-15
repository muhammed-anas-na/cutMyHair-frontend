// components/AppShowcase.jsx
import Image from 'next/image';

const AppShowcase = () => {
  return (
    <section className="bg-gray-100 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-8">
              Engage, connect, and thrive in a dynamic social experience with Strivex.
            </h2>
            
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
          <div className="relative h-[500px] md:h-[600px]">
            {/* Main App Screenshot */}
            {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-48 md:w-56"> */}
              <div className="relative">
                <img 
                  src="phone-image.png" 
                  alt="Strivex mobile app main screen"
                />
              </div>
            {/* </div> */}
            
            

          </div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;