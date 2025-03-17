import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/LandingPage/Footer/page';

const SalonLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Salon Insights & Beauty Blog</title>
        <meta name="description" content="Expert salon tips, wellness insights, and beauty trends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Cut My Hair Blog's</div>
          <div className="space-x-4">
            <button className='bg-white border border-1 border-green-600 p-2 rounded-md'>Book services</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <SalonBlogComponent />
      </main>

      {/* Footer */}
     <Footer/>
    </div>
  );
};

export default SalonLayout;



const salonBlogs = [
  {
    id: 1,
    category: 'SALON SERVICES',
    title: 'The Ultimate Guide to Choosing the Right Salon Treatment',
    description: 'Discover personalized salon treatments that match your unique beauty needs. From hair styling to skincare, learn how to select the perfect service...',
    imageUrl: '/image05.jpg',
    href: '/blog/salon-treatment-guide'
  },
  {
    id: 2,
    category: 'SALON HYGIENE',
    title: 'Salon Cleanliness: What to Look for Before Your Next Appointment',
    description: 'Explore the critical standards of salon hygiene. Learn about sterilization techniques, safety protocols, and how to ensure a clean, safe beauty experience...',
    imageUrl: '/image05.jpg',
    href: '/blog/salon-hygiene-standards'
  },
  {
    id: 3,
    category: 'BEAUTY TIPS',
    title: 'Mastering Professional Hair Styling Techniques at Home',
    description: 'Professional stylists reveal their secret techniques for achieving salon-quality hairstyles in the comfort of your own home. Tips, tricks, and insider knowledge...',
    imageUrl: '/image05.jpg',
    href: '/blog/pro-hair-styling-tips'
  },
  {
    id: 4,
    category: 'WELLNESS',
    title: 'The Holistic Approach to Salon Treatments and Self-Care',
    description: 'Beyond beauty: Understand how salon treatments contribute to mental wellness, stress reduction, and overall personal care. A comprehensive guide to holistic beauty...',
    imageUrl: '/image05.jpg',
    href: '/blog/holistic-salon-wellness'
  },
  {
    id: 5,
    category: 'TECHNOLOGY',
    title: 'How AI and Tech are Revolutionizing Salon Experiences',
    description: 'Explore cutting-edge technologies transforming the salon industry. From virtual consultations to personalized treatment recommendations...',
    imageUrl: '/image05.jpg',
    href: '/blog/salon-tech-innovation'
  },
  {
    id: 6,
    category: 'BEAUTY TRENDS',
    title: 'Sustainable Beauty: Eco-Friendly Salon Practices',
    description: 'Discover how modern salons are embracing sustainability. Learn about green beauty products, waste reduction, and environmentally conscious salon practices...',
    imageUrl: '/image05.jpg',
    href: '/blog/sustainable-salon-practices'
  }
];

const SalonBlogComponent = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Explore Our Salon Insights</h1>
      
      {/* Featured Blog Section */}
      <div className="mb-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-green-600 font-semibold">FEATURED BLOG</span>
            <h2 className="text-2xl font-bold mt-2 mb-4">The Ultimate Guide to Salon Wellness</h2>
            <p className="text-gray-600 mb-4">
              Dive deep into the world of comprehensive salon care. From selecting the right treatments to understanding the science behind beauty services, this guide covers everything you need to know about holistic salon experiences.
            </p>
            <Link href="/blog/salon-wellness-guide" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Read More
            </Link>
          </div>
          <div>
            <Image 
              src="/image01.jpg" 
              alt="Salon Wellness Guide" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {salonBlogs.map((blog) => (
          <div key={blog.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <Image 
              src={blog.imageUrl} 
              alt={blog.title} 
              width={400} 
              height={300} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <span className="text-green-600 text-sm font-semibold">{blog.category}</span>
              <h3 className="text-lg font-bold mt-2 mb-2">{blog.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{blog.description}</p>
              <Link 
                href={blog.href} 
                className="text-green-600 hover:text-green-800 font-semibold"
              >
                Continue Reading →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};