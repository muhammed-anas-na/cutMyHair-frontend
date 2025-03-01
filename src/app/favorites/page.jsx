'use client';
import React from 'react';
import Image from 'next/image';
import Navigation from '@/components/Navigation/page';
import Header from '@/components/Header/page';

const Favorites = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content - Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        <div className="w-full max-w-[300px] mx-auto relative aspect-square mb-8">
          <Image
            src="/fav-image.png"
            alt="Empty favorites"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Uh-oh! You don't have any favourites yet.
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          Click the ♡ to add salons here.
        </p>
        <button className="bg-pink-600 text-white px-8 py-3 rounded-lg font-medium w-full max-w-[300px]">
          Browse Now
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto">
      <Navigation currentPage={'favorites'}/>
      </div>
    </div>
  );
};

export default Favorites;