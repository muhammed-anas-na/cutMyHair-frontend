import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Facebook, Instagram, Globe } from 'lucide-react';

const Footer = () => {
  // Company links
  const companyLinks = [
    { label: 'Blogs', href: '/blogs' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Cancellation Policy', href: '/cancelation-policy' },
    { label: 'Contact Us', href: '/contact-us' },
  ];

  // Customers links
  const customerLinks = [
    { label: 'Salon Reviews', href: '/reviews' },
    { label: 'Find Salons', href: '/salons' },
    { label: 'Book Appointment', href: '/book' },
    { label: 'Services', href: '/services' },
  ];

  // Partners links
  const partnerLinks = [
    { label: 'Register Your Salon', href: 'owner/login' },
    { label: 'Salon Dashboard', href: '/salon/dashboard' },
  ];

  // Social media links
  const socialLinks = [
    // { icon: <Twitter size={20} />, href: 'https://twitter.com/salonbookingplatform' },
    // { icon: <Facebook size={20} />, href: 'https://facebook.com/salonbookingplatform' },
    { icon: <Instagram size={20} />, href: 'https://instagram.com/cut_my_hair.in' },
    // { icon: <Globe size={20} />, href: 'https://salonbookingplatform.com' },
  ];

  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        {/* Logo and navigation sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo section */}
          <div>
            {/* <div className="inline-block mb-6">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-[#CE145B] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SB</span>
                </div>
                <div className="ml-2">
                  <p className="font-bold text-gray-900 leading-tight">Salon</p>
                  <p className="font-bold text-gray-900 leading-tight -mt-1">Booking</p>
                </div>
              </div>
            </div> */}
            <img src='white-logo.png'/>
          </div>

          {/* Company section */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-600 hover:text-[#CE145B] text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For customers section */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">For Customers</h3>
            <ul className="space-y-3">
              {customerLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-600 hover:text-[#CE145B] text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For partners and social sections */}
          <div>
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4">For Salon Partners</h3>
              <ul className="space-y-3">
                {partnerLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-gray-600 hover:text-[#CE145B] text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Social Links</h3>
              <div className="flex space-x-3">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.href} 
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-[#CE145B] hover:border-[#CE145B] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on social media ${index + 1}`}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* App Store and Play Store */}
            <div className="mt-6 space-y-3">
              <a 
                href="https://apps.apple.com/app/salonbookingplatform" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image 
                  src="/app-store.png"
                  alt="Download on the App Store"
                  width={140}
                  height={42}
                />
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=salonbookingplatform" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image 
                  src="/play-store.png"
                  alt="Get it on Google Play"
                  width={140}
                  height={42}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright line */}
        <div className="pt-6 border-t border-gray-200 text-sm text-gray-500 text-center md:text-left">
          © Copyright 2024 Salon Booking Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;