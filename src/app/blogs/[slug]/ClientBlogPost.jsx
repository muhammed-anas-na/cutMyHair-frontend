'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ClientBlogPost({ blogData, slug }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Simulate subscription (replace with actual API call)
    setIsLoading(true);
    setEmailError('');
    
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const { title, description, image, imageAlt, category, createdAt } = blogData;
  
  // Format dates for display and metadata
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const isoDate = new Date(createdAt).toISOString();
  
  // Format category for display (Hair-Care -> Hair Care)
  const categoryDisplayName = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs for better SEO navigation signals */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ol className="flex flex-wrap space-x-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-[#CE145B]">Home</Link></li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mx-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <Link href="/blogs" className="hover:text-[#CE145B]">Blog</Link>
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mx-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <Link href={`/blogs/category/${category}`} className="hover:text-[#CE145B]">{categoryDisplayName}</Link>
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mx-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="truncate max-w-[150px]" aria-current="page">{title}</span>
          </li>
        </ol>
      </nav>

      {/* Back button and category */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <Link 
            href="/blogs" 
            className="inline-flex items-center text-gray-600 hover:text-[#CE145B] transition-colors"
            aria-label="Back to all blog posts"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            All posts
          </Link>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <Link 
              href={`/blogs/category/${category}`}
              className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full capitalize hover:bg-gray-200 transition-colors"
              aria-label={`View all ${categoryDisplayName} posts`}
            >
              {categoryDisplayName}
            </Link>
            <time dateTime={isoDate} className="text-gray-500 text-sm">
              {formattedDate}
            </time>
          </div>
        </div>
      </div>

      {/* Blog header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
      </header>

      {/* Featured image with semantic HTML and optimized attributes */}
      <figure className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] mb-8 overflow-hidden">
        <Image 
          src={image} 
          alt={imageAlt || title}
          fill
          className="object-cover md:object-contain w-full h-full hover:scale-105 transition-transform duration-700"
          priority
        />
        {imageAlt && <figcaption className="sr-only">{imageAlt}</figcaption>}
      </figure>

      {/* Blog content with semantic article tag */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div 
          className="prose prose-lg max-w-none prose-img:rounded-xl prose-headings:text-gray-900 prose-a:text-[#CE145B]"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </article>

      {/* Share section with proper accessible labels */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="border-t border-gray-200 pt-6 flex flex-wrap justify-center items-center space-x-4">
          <span className="text-sm text-gray-600">Share:</span>
          <button 
            onClick={copyToClipboard}
            className="text-gray-600 hover:text-[#CE145B] transition-colors"
            aria-label="Copy link to clipboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
            </svg>
          </button>
          <a 
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#CE145B] transition-colors"
            aria-label="Share on Twitter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
            </svg>
          </a>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#CE145B] transition-colors"
            aria-label="Share on Facebook"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Subscribe section with enhanced accessibility */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFF7F5] rounded-2xl p-6 sm:p-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Subscribe to newsletter</h2>
              <p className="text-gray-600">Subscribe to receive the latest blog posts to your inbox weekly.</p>
            </div>
            
            {isSubscribed ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Thank you for subscribing!</h3>
                <p className="text-gray-600">You'll now receive our latest blog posts and updates.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 rounded-lg shadow-sm border ${emailError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:border-transparent`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    aria-label="Email address"
                    aria-required="true"
                    aria-invalid={emailError ? "true" : "false"}
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bg-[#CE145B] text-white px-4 py-1 rounded-lg hover:bg-[#A81049] transition-colors disabled:bg-gray-400"
                    disabled={isLoading}
                    aria-label="Subscribe to newsletter"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {emailError && <p className="text-red-500 text-sm mt-1" role="alert">{emailError}</p>}
                <p className="text-xs text-gray-500 mt-3 text-center">
                  By subscribing you agree to with our <Link href="/privacy-policy" className="underline hover:text-[#CE145B]">Privacy Policy</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Related posts section for improved internal linking */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Related Posts</h2>
        <div className="text-center">
          <Link 
            href={`/blogs/category/${category}`} 
            className="inline-block bg-[#CE145B] text-white px-6 py-2 rounded-lg hover:bg-[#A81049] transition-colors"
          >
            Explore more {categoryDisplayName} posts
          </Link>
        </div>
      </div>
    </div>
  );
}