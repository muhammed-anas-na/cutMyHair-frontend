// components/Footer.jsx
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Facebook, Instagram, Globe } from 'lucide-react';

const Footer = () => {
  // Company links
  const companyLinks = [
    { label: 'About us', href: '/about-us' },
    { label: 'Terms & conditions', href: '/terms' },
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Anti-discrimination policy', href: '/anti-discrimination' },
    { label: 'UC impact', href: '/impact' },
    { label: 'Careers', href: '/careers' },
  ];

  // Customers links
  const customerLinks = [
    { label: 'UC reviews', href: '/reviews' },
    { label: 'Categories near you', href: '/categories' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact us', href: '/contact' },
  ];

  // Partners links
  const partnerLinks = [
    { label: 'Register as a professional', href: '/owner/register' },
  ];

  // Social media links
  const socialLinks = [
    { icon: <Twitter size={20} />, href: 'https://twitter.com/urbancompany' },
    { icon: <Facebook size={20} />, href: 'https://facebook.com/urbancompany' },
    { icon: <Instagram size={20} />, href: 'https://instagram.com/urbancompany' },
    { icon: <Globe size={20} />, href: 'https://urbancompany.com' },
  ];

  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        {/* Logo and navigation sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo section */}
          <div>
            {/* <Link href="/" className="inline-block mb-6">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-black rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">UC</span>
                </div>
                <div className="ml-2">
                  <p className="font-bold text-gray-900 leading-tight">Urban</p>
                  <p className="font-bold text-gray-900 leading-tight -mt-1">Company</p>
                </div>
              </div>
            </Link> */}
            <img src='white-logo.png'/>
          </div>

          {/* Company section */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For customers section */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">For customers</h3>
            <ul className="space-y-3">
              {customerLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For partners and social sections */}
          <div>
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4">For partners</h3>
              <ul className="space-y-3">
                {partnerLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-gray-600 hover:text-gray-900 text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Social links</h3>
              <div className="flex space-x-3">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.href} 
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
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
                href="https://apps.apple.com/app/urbancompany" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image 
                  src="/images/app-store-badge.png"
                  alt="Download on the App Store"
                  width={140}
                  height={42}
                />
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=urbancompany" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image 
                  src="/images/google-play-badge.png"
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
          © Copyright 2024 Urban Company. All rights reserved. | CIN: U74140DL2014PTC274413
        </div>
      </div>
    </footer>
  );
};

export default Footer;