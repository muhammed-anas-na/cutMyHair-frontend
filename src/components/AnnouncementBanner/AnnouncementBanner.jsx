import React from 'react';

const AnnouncementBanner = () => {
  return (
    <>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
      
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee">
          <span className="text-sm font-medium px-4">
            🎉 USE coupon code USER15 to get 15% off on your first booking! 
            <span className="mx-8">•</span>
            Limited time offer - Book now and save! 
            <span className="mx-8">•</span>
            USE coupon code USER15 to get 15% off on your first booking!
            <span className="mx-8">•</span>
            🎉REFER a friend and get upto 50% off our next booking
          </span>
        </div>
      </div>
    </>
  );
};

export default AnnouncementBanner;