'use client';
import { useState } from 'react';
import Head from 'next/head';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/LandingPage/Header/page';
import Footer from '@/components/LandingPage/Footer/page';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneCode: '+91',
    phoneNumber: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <>
      <Head>
        <title>Contact Us - Salon Booking Platform</title>
        <meta name="description" content="Contact our Salon Booking Platform for support and inquiries" />
      </Head>
      <Header/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row">
          {/* Contact Form Section */}
          <div className="w-full lg:w-1/2 lg:pr-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Phone Number
                </label>
                <div className="flex">
                  <select
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleChange}
                    className="px-3 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:border-transparent"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+49">+49</option>
                  </select>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter message"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#CE145B] hover:bg-[#a10f46] rounded-md text-white font-medium transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          
          {/* Help Section */}
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 lg:pl-12 lg:border-l border-gray-200">
            <div className="space-y-6">
              {/* Need help card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Need Help?</h2>
                <p className="text-gray-600 mb-4">
                  For immediate assistance with your salon bookings, please log in and visit our Help Center. 
                  You can get instant support through our chat service.
                </p>
                <a href="#" className="text-[#CE145B] font-medium flex items-center hover:text-[#a10f46] transition-colors">
                  Open Help Center <ChevronRight size={18} className="ml-1" />
                </a>
              </div>
              
              {/* Still facing issues card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Still Facing Issues?</h2>
                <p className="text-gray-600">
                  If you&apos;ve already tried our chat support and aren&apos;t satisfied, 
                  please email us at support@salonbookingplatform.com. We&apos;ll respond within 24-48 hours.
                </p>
              </div>
              
              {/* Media inquiries card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Media Inquiries</h2>
                <p className="text-gray-600">
                  For media-related questions, email press@salonbookingplatform.com
                </p>
              </div>
              
              {/* Helpline info card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Support Approach</h2>
                <p className="text-gray-600">
                  We&apos;ve replaced traditional phone support with a quick, efficient chat-based system. 
                  Open our Help Center, select your issue, and start a chat with our support team.
                </p>
              </div>
              
              {/* Office addresses card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Locations</h2>
                <p className="text-gray-600">
                  View our office addresses and service locations
                </p>
                <a href="#" className="text-[#CE145B] font-medium flex items-center hover:text-[#a10f46] transition-colors mt-2">
                  View Addresses <ChevronRight size={18} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}