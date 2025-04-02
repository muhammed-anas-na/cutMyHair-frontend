import React from 'react';
import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Head>
        <title>Privacy Policy - Salon Booking Platform</title>
        <meta name="description" content="Privacy Policy for our Salon Booking Platform" />
      </Head>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-[#CE145B]">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">1. Information Collection</h2>
          <p className="mb-4">
            We collect personal information necessary to provide and improve our salon booking service. 
            This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email, and contact information</li>
            <li>Location and device information</li>
            <li>Booking and service preferences</li>
            <li>Payment information (processed securely through Razorpay)</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process and manage salon bookings</li>
            <li>Send appointment confirmations and reminders</li>
            <li>Improve our service and user experience</li>
            <li>Communicate important updates about your bookings</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">3. Information Protection</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Secure data encryption</li>
            <li>Limited access to personal information</li>
            <li>Regular security audits</li>
            <li>Compliance with data protection regulations</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">4. Data Sharing</h2>
          <p className="mb-4">
            We do not sell or rent your personal information to third parties. We may share information with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Salons for booking purposes</li>
            <li>Service providers necessary for platform operation</li>
            <li>Legal requirements or protection of our rights</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">5. User Rights</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">6. Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Improve user experience</li>
            <li>Analyze platform usage</li>
            <li>Personalize content and recommendations</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">7. Updates to Privacy Policy</h2>
          <p className="mb-4">
            We may update this privacy policy periodically. Users will be notified of significant changes.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#CE145B]">8. Contact Information</h2>
          <p className="mb-4">
            For any privacy-related questions or concerns, please contact us at:
            privacy@salonbookingplatform.com
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

export default PrivacyPolicy;