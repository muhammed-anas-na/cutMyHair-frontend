import React from 'react';
import Head from 'next/head';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Head>
        <title>About Us - Salon Booking Platform</title>
        <meta name="description" content="Our mission and story behind the Salon Booking Platform" />
      </Head>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-[#CE145B]">About Us</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">Our Story</h2>
          <p className="mb-4">
            Founded in 2024, our Salon Booking Platform was born from a simple yet powerful idea: 
            to transform the way people book and experience salon services. We noticed the common 
            frustrations of long wait times, difficult scheduling, and the lack of transparency 
            in salon bookings.
          </p>
          <p>
            Our team of tech enthusiasts and beauty industry experts came together to create 
            a solution that makes salon bookings seamless, convenient, and stress-free.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">Our Mission</h2>
          <p className="mb-4">
            We aim to revolutionize the salon booking experience by:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Eliminating long waiting times</li>
            <li>Providing transparent pricing and service information</li>
            <li>Connecting customers with their favorite local salons effortlessly</li>
            <li>Empowering salon owners with smart booking and management tools</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#CE145B] mb-2">Customer First</h3>
              <p>We prioritize user experience and convenience above all else.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#CE145B] mb-2">Transparency</h3>
              <p>Clear pricing, no hidden fees, and honest communication.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#CE145B] mb-2">Innovation</h3>
              <p>Continuously improving our platform with cutting-edge technology.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#CE145B] mb-2">Community Support</h3>
              <p>Supporting local businesses and empowering salon professionals.</p>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">Our Technology</h2>
          <p className="mb-4">
            Powered by advanced geolocation, real-time booking, and smart scheduling algorithms, 
            our platform offers:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Precise location-based salon recommendations</li>
            <li>Instant booking and confirmation</li>
            <li>Seamless payment integration</li>
            <li>Comprehensive salon and service management tools</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">Our Commitment</h2>
          <p>
            We are committed to continuously improving the salon booking experience, 
            supporting local businesses, and making beauty services more accessible and convenient 
            for everyone.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">Contact Us</h2>
          <p>
            Have questions or suggestions? We'd love to hear from you!<br />
            Email: <span className="text-[#CE145B]">support@salonbookingplatform.com</span>
          </p>
        </section>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;