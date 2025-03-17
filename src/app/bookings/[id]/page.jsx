'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, MoreVertical, MapPin, Clock, Calendar, CheckCircle, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { GET_BOOKING_DETAIL_BY_ID_FN } from '@/services/userService';

const BookingConfirmation = ({ params }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await GET_BOOKING_DETAIL_BY_ID_FN(params.id);
        if (response?.data?.response) {
          setBookingDetails(response.data.response);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const generateQRData = () => {
    if (!bookingDetails) return '';
    // Create a QR-friendly string with essential booking details
    return `http://localhost:3000/BOOKING:${bookingDetails._id}|DATE:${bookingDetails.appointment_date}|TIME:${bookingDetails.scheduled_start_time}`;
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto bg-white min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="max-w-lg mx-auto bg-white min-h-screen flex flex-col justify-center items-center p-6">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
        <p className="text-gray-600 mb-6 text-center">We couldn't find the booking details you're looking for.</p>
        <Link href="/bookings" className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-200">
          Back to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <Link href="/bookings">
            <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </div>
          </Link>
          <h1 className="text-xl font-semibold">Booking Confirmation</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="p-6">
        <div className="bg-green-50 p-4 rounded-lg mb-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          <p className="text-green-800">
            Your booking has been confirmed!
          </p>
        </div>
        
        {/* Booking ID */}
        <div className="text-center mb-6">
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            Booking ID: {bookingDetails._id}
          </span>
        </div>

        {/* QR Code */}
        <div className="w-48 h-48 mx-auto mb-6 relative bg-gray-100 rounded-lg flex items-center justify-center">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateQRData())}`}
            alt="Booking QR Code"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Status Badge */}
        <div className="text-center mb-8">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
            bookingDetails.status === 'confirmed' ? 'bg-cyan-100 text-cyan-800' : 
            bookingDetails.status === 'completed' ? 'bg-green-100 text-green-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {bookingDetails.status}
          </span>
        </div>

        {/* Date and Time */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-500" />
            Date & Time
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-start">
              <div className="w-24 text-gray-500">Date:</div>
              <div className="font-medium">{bookingDetails.appointment_date}</div>
            </div>
            <div className="flex items-start">
              <div className="w-24 text-gray-500">Time:</div>
              <div className="font-medium">{bookingDetails.scheduled_start_time}</div>
            </div>
            <div className="flex items-start">
              <div className="w-24 text-gray-500">Duration:</div>
              <div className="font-medium">{bookingDetails.total_duration} mins</div>
            </div>
          </div>
        </div>

        {/* Salon Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-pink-500" />
            Salon Details
          </h2>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-900 font-medium mb-1">{bookingDetails.salon_name || "Salon"}</p>
              {/* <p className="text-gray-600 text-sm">Salon ID: {bookingDetails.salon_id}</p> */}
            </div>
            <a href="#" className="bg-pink-100 text-pink-700 text-sm px-3 py-1.5 rounded-lg hover:bg-pink-200 transition-colors flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Directions
            </a>
          </div>
        </div>

        {/* Services Booked */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-pink-500" />
            Services Booked
          </h2>
          <div className="space-y-3">
            {bookingDetails.services.map((service, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-gray-500 text-sm">{service.duration} mins</p>
                </div>
                <span className="font-medium">₹{service.price}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold text-lg">
              <span>Total</span>
              <span>₹{bookingDetails.total_price}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <span className="w-5 h-5 mr-2 flex items-center justify-center text-pink-500">₹</span>
            Payment Details
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Payment ID:</span>
              <span className="font-medium">{bookingDetails.payment_details?.payment_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-medium">{bookingDetails.payment_details?.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Date:</span>
              <span className="font-medium">{new Date(bookingDetails.booking_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button className="flex-1 bg-pink-500 text-white rounded-lg py-3 font-medium hover:bg-pink-600 transition-colors flex items-center justify-center gap-2">
            <PhoneCall className="w-5 h-5" />
            Contact Salon
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-50 transition-colors">
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};
export default BookingConfirmation;