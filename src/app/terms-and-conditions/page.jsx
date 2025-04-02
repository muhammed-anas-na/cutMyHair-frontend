import React from 'react';
import Head from 'next/head';
import Footer from '@/components/LandingPage/Footer/page';

const TermsAndConditions = () => {
  return (
    <>
    <div className="min-h-screen bg-white text-gray-900">
      <Head>
        <title>Terms and Conditions - Salon Booking Platform</title>
        <meta name="description" content="Terms and Conditions for our Salon Booking Platform" />
      </Head>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-[#CE145B]">Terms and Conditions</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using our Salon Booking Platform, you agree to be bound by these Terms and Conditions. 
            If you do not agree with any part of these terms, you may not use our service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">2. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Users must provide accurate and current information during registration.</li>
            <li>You are responsible for maintaining the confidentiality of your account.</li>
            <li>You agree to accept responsibility for all activities that occur under your account.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">3. Booking Policy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Bookings are subject to salon availability and confirmation.</li>
            <li>A 15-minute buffer time is maintained between appointments.</li>
            <li>Late arrivals may result in reduced service time or rescheduling at the salon's discretion.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">4. Cancellation and Refund Policy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cancellations made at least 24 hours before the appointment will receive a full refund.</li>
            <li>Cancellations within 24 hours of the appointment may be subject to a cancellation fee.</li>
            <li>No-shows will not be eligible for a refund.</li>
            <li>Refunds will be processed to the original payment method within 5-7 business days.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">5. Payment Terms</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All payments are processed through our secure payment gateway (Razorpay).</li>
            <li>Prices listed are final and include all applicable taxes.</li>
            <li>We reserve the right to change prices without prior notice.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">6. User Conduct</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Users agree not to use the platform for any illegal or unauthorized purpose.</li>
            <li>Harassment, abusive language, or inappropriate behavior is strictly prohibited.</li>
            <li>We reserve the right to terminate accounts that violate these terms.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">7. Intellectual Property</h2>
          <p className="mb-4">
            All content, trademarks, and materials on our platform are the property of our company 
            and protected by intellectual property laws.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">8. Limitation of Liability</h2>
          <p className="mb-4">
            We are not liable for any indirect, incidental, or consequential damages arising from 
            the use of our platform or services provided by salons.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">9. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. Continued use of the platform 
            after changes constitutes acceptance of the new terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">10. Contact Information</h2>
          <p className="mb-4">
            For any questions about these terms, please contact us at support@salonbookingplatform.com
          </p>
        </section>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default TermsAndConditions;