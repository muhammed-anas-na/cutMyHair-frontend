// components/FeaturesGrid.jsx
import Image from 'next/image';
import Link from 'next/link';

const FeaturesGrid = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Why 
            <span className='bg-[#CE145B] p-2 text-white rounded-lg mx-2'>Cut My Hair</span>
            stands out
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Experience premium salon services with convenience, quality, and style that sets us apart.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Expert Stylists Card */}
          <div className="bg-[#CE145B] rounded-2xl p-6 sm:p-8 text-white flex flex-col h-full">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Expert Stylists</h3>
            <p className="text-white/90 mb-6">Trained professionals with years of experience in latest styling techniques</p>
            <div className="bg-white rounded-xl p-4 mt-auto">
              <Image
                src="/image05.jpg"
                alt="Professional stylist working"
                width={400}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Happy Customers Card */}
          <div className="bg-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col h-full">
            <div className="flex flex-col h-full justify-center items-center text-center">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Genuine Salons</h3>
              <div className="mb-2">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800">0</span>
              </div>
              <p className="text-gray-600 text-base sm:text-lg">Our team has physically visited the location, verified parking options, accessibility features, and the overall ambiance of the salon.</p>
            </div>
          </div>

          {/* Premium Products Card */}
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 text-white md:col-span-2 lg:col-span-1 flex flex-col">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
              Cut My Hair Verification
            </h3>
            <p className="text-white/90 mb-6">Our seal of quality assurance guarantees an exceptional salon experience.</p>
            <p>Pricing is transparent with no hidden costs, and service times are accurately represented based on actual observations.</p>
            <div className="mt-auto">
              <Image
                src="/image01.jpg"
                alt="Premium salon products"
                width={400}
                height={600}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>

          {/* Book Appointment Card - Wider card spans 2 columns on tablet and larger */}
          <div className="bg-gray-100 rounded-2xl p-6 sm:p-8 md:col-span-2 flex items-center">
            <div className="max-w-xl">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-4 text-gray-800">
                From appointment to amazing look
              </h3>
              <p className="text-gray-600 mb-6 sm:mb-8">
                Book your appointment in seconds and experience the transformation with our skilled stylists and premium services.
              </p>
              <Link 
                href={'/home'}
                className="bg-[#CE145B] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors hover:bg-[#A61049] focus:ring-2 focus:ring-[#CE145B] focus:ring-offset-2"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
        
        {/* Additional Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Feature 1 */}
          <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#CE145B]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#CE145B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Quick Booking</h4>
            <p className="text-gray-600 text-sm">Book appointments in under 30 seconds</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#CE145B]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#CE145B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Guaranteed Service</h4>
            <p className="text-gray-600 text-sm">100% satisfaction or free touch-up</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#CE145B]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#CE145B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Digital Records</h4>
            <p className="text-gray-600 text-sm">Your style history saved for future visits</p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#CE145B]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#CE145B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Great Value</h4>
            <p className="text-gray-600 text-sm">Premium services at competitive prices</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;