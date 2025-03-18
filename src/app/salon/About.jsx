'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Scissors, 
  Award,
  ThumbsUp,
  MessageCircle,
  Share2
} from 'lucide-react';

const SalonAbout = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Salon information
  const salonInfo = {
    name: "Signate Unisex Salon",
    description: "Established in 2015, Signate is a premier unisex salon offering exceptional haircuts, styling, coloring, and beauty services. Our team of experienced stylists is dedicated to helping you look and feel your best.",
    longDescription: "At Signate, we believe that great hair can transform your day. Our salon combines technical expertise with creative vision to deliver personalized services that enhance your natural beauty. We use only premium products and stay updated with the latest trends and techniques to provide you with the best possible experience. Whether you're looking for a subtle change or a bold transformation, our stylists work closely with you to achieve your desired look.",
    address: "Lmd Square, Bavdhan, Pune",
    phone: "+91 98765 43210",
    email: "info@signatesalon.com",
    website: "www.signatesalon.com",
    rating: 4.8,
    reviews: 250,
    workingHours: [
      { day: "Monday", hours: "9:00 AM - 8:00 PM" },
      { day: "Tuesday", hours: "9:00 AM - 8:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 8:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 8:00 PM" },
      { day: "Friday", hours: "9:00 AM - 9:00 PM" },
      { day: "Saturday", hours: "8:00 AM - 9:00 PM" },
      { day: "Sunday", hours: "10:00 AM - 6:00 PM" }
    ],
    amenities: [
      "Free Wi-Fi",
      "Complimentary Beverages",
      "Air Conditioning",
      "Parking Available",
      "Wheelchair Accessible",
      "Premium Products"
    ],
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800"
    ],
    socialMedia: {
      instagram: "@signatesalon",
      facebook: "SignateUnisexSalon",
      twitter: "@SignateSalon"
    },
    achievements: [
      "Best Salon in Pune - 2022",
      "Excellence in Customer Service - 2021",
      "Top Rated Salon on BeautySphere - 2020"
    ]
  };
  
  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "Do I need to make an appointment?",
      answer: "While we accept walk-ins when possible, we recommend booking an appointment to ensure you get your preferred stylist at your desired time. You can book through our app, website, or by calling us directly."
    },
    {
      id: 2,
      question: "What happens if I need to cancel my appointment?",
      answer: "We understand that plans change. We appreciate at least 24 hours notice for cancellations. For cancellations with less than 24 hours notice, a small fee may be charged. Please contact us as soon as possible if you need to reschedule."
    },
    {
      id: 3,
      question: "Do you offer any loyalty programs or discounts?",
      answer: "Yes! We have a loyalty program where you earn points for every service and product purchase. We also offer seasonal promotions, referral bonuses, and special discounts for first-time clients. Download our app or sign up for our newsletter to stay updated on our latest offers."
    },
    {
      id: 4,
      question: "What brands do you use at the salon?",
      answer: "We use premium products from brands like Wella, Olaplex, Kérastase, L'Oréal Professional, and Moroccan Oil. We carefully select products that deliver excellent results while maintaining hair health and integrity."
    },
    {
      id: 5,
      question: "Are there parking facilities available?",
      answer: "Yes, we have dedicated parking spaces for our clients in the building's basement. Additionally, there's ample street parking available in the vicinity of the salon."
    }
  ];
  
  // Toggle FAQ expansion
  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };
  
  // Navigation sections
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'hours', label: 'Hours' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'faqs', label: 'FAQs' }
  ];

  return (
    <div className="pb-20">
      {/* Section navigation */}
      <div className="px-4 py-3 border-b sticky top-16 z-10 bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-5 pb-1">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`py-1 whitespace-nowrap text-sm font-medium transition-colors ${
                  activeSection === section.id 
                    ? 'text-[#CE145B] border-b-2 border-[#CE145B]' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="p-4">
        {/* Overview section */}
        {activeSection === 'overview' && (
          <div>
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{salonInfo.name}</h1>
                <div className="flex items-center mt-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 font-medium">{salonInfo.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({salonInfo.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex space-x-3 mt-3 sm:mt-0">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={18} className="text-gray-700" />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <ThumbsUp size={18} className="text-gray-700" />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <MessageCircle size={18} className="text-gray-700" />
                </motion.button>
              </div>
            </div>
            
            {/* Images gallery - horizontal scroll */}
            <div className="mb-6">
              <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                <div className="flex space-x-3 pb-2">
                  {salonInfo.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200"
                    >
                      <img 
                        src={image} 
                        alt={`${salonInfo.name} - ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-base font-semibold mb-2 text-gray-900">About Us</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">{salonInfo.description}</p>
              <p className="text-gray-700 text-sm leading-relaxed">{salonInfo.longDescription}</p>
            </div>
            
            {/* Achievements */}
            <div className="mb-6">
              <h2 className="text-base font-semibold mb-3 text-gray-900 flex items-center">
                <Award size={16} className="mr-1 text-[#CE145B]" />
                Achievements
              </h2>
              <div className="bg-gray-50 rounded-lg p-3">
                <ul className="space-y-2">
                  {salonInfo.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="text-yellow-500 mr-2 text-lg">🏆</div>
                      <span className="text-sm text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Contact information */}
            <div className="mb-6">
              <h2 className="text-base font-semibold mb-3 text-gray-900">Contact & Location</h2>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin size={16} className="mt-0.5 text-[#CE145B] mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{salonInfo.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="text-[#CE145B] mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{salonInfo.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="text-[#CE145B] mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{salonInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social media */}
            <div className="mb-3">
              <h2 className="text-base font-semibold mb-3 text-gray-900">Connect With Us</h2>
              <div className="flex space-x-3">
                <a href="#" className="flex items-center bg-[#FEF0F5] rounded-lg px-3 py-2 hover:bg-[#FEE7EF] transition-colors">
                  <Instagram size={18} className="text-[#CE145B] mr-2" />
                  <span className="text-sm text-gray-700">{salonInfo.socialMedia.instagram}</span>
                </a>
                <a href="#" className="flex items-center bg-[#FEF0F5] rounded-lg px-3 py-2 hover:bg-[#FEE7EF] transition-colors">
                  <Facebook size={18} className="text-[#CE145B] mr-2" />
                </a>
                <a href="#" className="flex items-center bg-[#FEF0F5] rounded-lg px-3 py-2 hover:bg-[#FEE7EF] transition-colors">
                  <Twitter size={18} className="text-[#CE145B] mr-2" />
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Hours section */}
        {activeSection === 'hours' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Opening Hours</h2>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Open now
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {salonInfo.workingHours.map((schedule, index) => (
                <div 
                  key={index}
                  className={`flex justify-between p-3 ${
                    index !== salonInfo.workingHours.length - 1 ? 'border-b border-gray-100' : ''
                  } ${schedule.day === 'Sunday' ? 'bg-gray-50' : ''}`}
                >
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-400 mr-2" />
                    <span className={`text-sm ${schedule.day === 'Sunday' ? 'font-medium' : ''}`}>
                      {schedule.day}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{schedule.hours}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-[#FEF0F5] rounded-lg flex items-center">
              <Scissors size={16} className="text-[#CE145B] mr-2" />
              <p className="text-sm text-gray-700">
                Hours may vary on holidays. Please call to confirm if you're visiting on a public holiday.
              </p>
            </div>
          </div>
        )}
        
        {/* Amenities section */}
        {activeSection === 'amenities' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Salon Amenities</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {salonInfo.amenities.map((amenity, index) => (
                <div 
                  key={index}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FEF0F5] flex items-center justify-center mr-3">
                    <Scissors size={16} className="text-[#CE145B]" />
                  </div>
                  <span className="text-sm text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Our Facilities</h3>
              <p className="text-sm text-gray-700 mb-4">
                We're committed to providing a comfortable and luxurious experience. Our salon is designed with your comfort in mind, featuring ergonomic chairs, premium products, and a relaxing atmosphere.
              </p>
              
              <div className="bg-[#FEF0F5] rounded-lg p-4">
                <h4 className="font-medium text-[#CE145B] mb-2">Special Accommodations</h4>
                <p className="text-sm text-gray-700">
                  Have special requirements or need specific accommodations? Please let us know in advance, and we'll do our best to make your visit comfortable and enjoyable.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* FAQs section */}
        {activeSection === 'faqs' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp size={18} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-500" />
                    )}
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="p-3 pt-0 bg-gray-50">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Have more questions?</h3>
              <p className="text-sm text-gray-700 mb-3">
                We're here to help! Feel free to reach out to us via phone, email, or social media.
              </p>
              <button className="text-sm font-medium text-[#CE145B] flex items-center">
                Contact us <ChevronDown size={16} className="ml-1 rotate-270" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Style to hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Custom rotation class */
        .rotate-270 {
          transform: rotate(270deg);
        }
      `}</style>
    </div>
  );
};

export default SalonAbout;