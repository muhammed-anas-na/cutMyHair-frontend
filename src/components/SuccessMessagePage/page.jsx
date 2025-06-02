import React from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

const SuccessMessagePage = ({message, redirectURL}) => {
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center space-y-8">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#CE145B] flex items-center justify-center">
          <Check className="w-8 h-8 text-white" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          {message}
        </h1>

        {/* Continue Button */}
        <Link
        href={redirectURL}
        className="w-full bg-[#CE145B] text-white py-4 rounded-lg text-lg font-medium hover:bg-[#b01150] transition-colors text-center">
          Continuee
        </Link>
      </div>
    </div>
  );
};

export default SuccessMessagePage;