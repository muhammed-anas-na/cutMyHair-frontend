import React from 'react';
import Head from 'next/head';

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Head>
        <title>Cancellation Policy - Salon Booking Platform</title>
        <meta name="description" content="Cancellation and Refund Policy for our Salon Booking Platform" />
      </Head>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-[#CE145B]">Cancellation Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">1. Cancellation Timeframes</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>More than 24 hours before appointment:</strong> 
              Full refund will be processed automatically
            </li>
            <li>
              <strong>Within 24 hours of appointment:</strong> 
              50% refund or credit towards future booking
            </li>
            <li>
              <strong>No-show or cancellation after appointment start time:</strong> 
              No refund will be issued
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">2. Refund Process</h2>
          <p className="mb-4">
            Refunds will be processed according to the following guidelines:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Refunds are credited to the original payment method</li>
            <li>Processing time: 5-7 business days</li>
            <li>Refund amount excludes any transaction fees</li>
            <li>Partial refunds may be applied based on cancellation timing</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">3. Salon-Initiated Cancellations</h2>
          <p className="mb-4">
            In rare cases where a salon cancels your appointment:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Full refund will be processed immediately</li>
            <li>Additional compensation credit may be provided</li>
            <li>We will help reschedule your appointment if desired</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">4. How to Cancel</h2>
          <p className="mb-4">
            You can cancel your appointment through:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Mobile app cancellation feature</li>
            <li>Website booking management section</li>
            <li>Direct contact with the salon (must be confirmed in app)</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">5. Special Circumstances</h2>
          <p className="mb-4">
            Exceptions may be made for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Medical emergencies (requires documentation)</li>
            <li>Extreme weather conditions</li>
            <li>Official travel advisories</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">6. Repeated Cancellations</h2>
          <p className="mb-4">
            Users with frequent last-minute cancellations may:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Receive warnings</li>
            <li>Have restricted booking privileges</li>
            <li>Be subject to additional fees</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">7. Contact for Disputes</h2>
          <p className="mb-4">
            For any cancellation-related queries or disputes, please contact:
            support@salonbookingplatform.com
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

export default CancellationPolicy;