'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const trendingTopics = [
    { name: 'Haircuts', slug: 'haircuts' },
    { name: 'Styling', slug: 'styling' },
    { name: 'Products', slug: 'products' },
    { name: 'DIY', slug: 'diy' },
    { name: 'Salons', slug: 'salons' },
    { name: 'Hair Color', slug: 'hair-color' },
  ];

  // Handle scroll for nav bar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {/* Navigation - fixed position with transition effect */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/white-logo.png" 
                  alt="Cut My Hair Logo" 
                  width={140} 
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-8">
              <Link href="/" className="px-3 py-2 text-gray-800 hover:text-[#CE145B] font-medium transition-colors">
                Home
              </Link>
              <Link href="/about" className="px-3 py-2 text-gray-800 hover:text-[#CE145B] font-medium transition-colors">
                About us
              </Link>
              <Link href="/trending" className="px-3 py-2 text-gray-800 hover:text-[#CE145B] font-medium transition-colors">
                Trending
              </Link>
              <Link href="/team" className="px-3 py-2 text-gray-800 hover:text-[#CE145B] font-medium transition-colors">
                Team
              </Link>
              <Link href="/contact" className="px-3 py-2 text-gray-800 hover:text-[#CE145B] font-medium transition-colors">
                Contact
              </Link>
              <Link href="/appointment" className="ml-3 px-5 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#A81049] transition-colors font-medium">
                Book Now
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-800 hover:text-[#CE145B] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#CE145B] p-2 rounded-md"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-4 pt-2 pb-4 space-y-1 bg-white shadow-lg">
            <Link href="/" className="block px-3 py-2 text-gray-800 hover:text-[#CE145B] font-medium hover:bg-gray-50 rounded-md">
              Home
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-800 hover:text-[#CE145B] font-medium hover:bg-gray-50 rounded-md">
              About us
            </Link>
            <Link href="/trending" className="block px-3 py-2 text-gray-800 hover:text-[#CE145B] font-medium hover:bg-gray-50 rounded-md">
              Trending
            </Link>
            <Link href="/team" className="block px-3 py-2 text-gray-800 hover:text-[#CE145B] font-medium hover:bg-gray-50 rounded-md">
              Team
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-800 hover:text-[#CE145B] font-medium hover:bg-gray-50 rounded-md">
              Contact
            </Link>
            <Link href="/appointment" className="block px-3 py-2 bg-[#CE145B] text-white rounded-md hover:bg-[#A81049] transition-colors font-medium text-center">
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image and Design Elements */}
      <div className="relative pt-16 overflow-hidden">
        {/* Decorative elements */}
        <div className="hidden lg:block absolute top-20 right-10 w-64 h-64 bg-[#FFE4DE] rounded-full opacity-50 blur-3xl"></div>
        <div className="hidden lg:block absolute bottom-20 left-10 w-40 h-40 bg-[#FFE4DE] rounded-full opacity-50 blur-3xl"></div>
        
        {/* Background patterns */}
        <div className="absolute top-20 right-0 w-full h-full z-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#CE145B" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
        
        {/* Hero content with gradients */}
        <div className="relative bg-gradient-to-br from-[#FFF7F5] to-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7 xl:col-span-6">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                    <span className="block">Hair advice that</span>
                    <span className="block text-[#CE145B]">cuts through the noise</span>
                  </h1>
                  <p className="text-xl mb-10 max-w-2xl mx-auto lg:mx-0 text-gray-600">
                    Expert tips, tutorials and trends to help you look and feel your best. 
                    Find the perfect style for your hair type and face shape.
                  </p>
                  
                  {/* Search bar */}
                  <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0 mb-10 relative">
                    <input
                      type="text"
                      placeholder="Search hair tips, styles, products..."
                      className="w-full px-5 py-4 rounded-lg shadow-lg border-0 focus:ring-2 focus:ring-[#CE145B]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-2 bg-[#CE145B] text-white px-4 py-2 sm:px-6 rounded-lg hover:bg-[#A81049] transition-colors"
                    >
                      <span className="hidden sm:inline">Search Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:hidden">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </button>
                  </form>
                  
                  {/* Trending topics */}
                  <div className="text-center lg:text-left">
                    <p className="mb-3 font-medium text-gray-700">Trending now:</p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                      {trendingTopics.map((topic) => (
                        <Link 
                          key={topic.slug}
                          href={`/topics/${topic.slug}`}
                          className="px-4 py-1.5 rounded-full border border-[#CE145B] text-[#CE145B] hover:bg-[#CE145B] hover:text-white transition-colors text-sm font-medium"
                        >
                          {topic.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side image - shown only on larger screens */}
              <div className="hidden lg:block lg:col-span-5 xl:col-span-6 mt-10 lg:mt-0">
                <div className="relative h-full">
                  {/* Main hero image */}
                  <div className="relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300 bg-gradient-to-tr from-[#CE145B]/10 to-white p-1">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#CE145B]/10 rounded-full"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#CE145B]/10 rounded-full"></div>
                    <Image
                      src="/images/hair-background.jpg" 
                      alt="Hair styling professional" 
                      width={600} 
                      height={800}
                      className="rounded-lg object-cover h-[500px] w-full"
                      priority
                    />
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                      <p className="text-sm font-medium text-[#CE145B]">Professional Tips</p>
                      <p className="text-xs text-gray-600">From expert stylists</p>
                    </div>
                  </div>
                  
                  {/* Floating element with brand accent */}
                  <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#CE145B] rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                    <span className="text-white font-bold">NEW</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#FFF7F5" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
      </div>
    </>
  );
}