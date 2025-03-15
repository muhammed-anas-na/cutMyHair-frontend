// components/FeaturesGrid.jsx
import Image from 'next/image';

const Standout = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Why 
            <span className='bg-[#CE145B] p-2 text-white rounded-lg mx-2'>Cut My Hair</span>
            stands out
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Connect, share, and engage effortlessly with Strivex's innovative and user-friendly features.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Smart Notifications Card */}
          <div className="bg-[#CE145B] rounded-2xl p-8 text-white flex flex-col h-full">
            <h3 className="text-2xl font-semibold mb-6">Smart Notifications</h3>
            <div className="bg-white rounded-xl p-4 mt-auto">
              <Image
                src="/image02.jpg"
                alt="Smart notifications interface"
                width={400}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Communities Card */}
          <div className="bg-gray-100 rounded-2xl p-8 flex flex-col h-full">
            <div className="flex flex-col h-full justify-center items-center text-center">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Strivex Communities</h3>
              <div className="mb-2">
                <span className="text-5xl md:text-6xl font-bold text-gray-800">100k+</span>
              </div>
              <p className="text-gray-600 text-lg">Users</p>
            </div>
          </div>

          {/* Instant Communication Card */}
          <div className="bg-gray-900 rounded-2xl p-8 text-white md:col-span-2 lg:col-span-1">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6">
              Instant Real-Time Communication
            </h3>
            <div className="mt-auto">
              <Image
                src="/image01.jpg"
                alt="Chat interface"
                width={400}
                height={600}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>

          {/* Lasting Bonds Card - Wider card spans 2 columns on tablet and larger */}
          <div className="bg-gray-100 rounded-2xl p-8 md:col-span-2">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
                From simple clicks to lasting bonds
              </h3>
              <p className="text-gray-600 mb-8">
                Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
              </p>
              <button 
                className="bg-[#CE145B] text-white px-6 py-3 rounded-lg font-medium transition-colors hover:bg-teal-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Standout;