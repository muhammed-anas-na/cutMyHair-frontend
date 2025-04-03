'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, MoreVertical, MapPin, Clock, Calendar, CheckCircle, PhoneCall, Share2, Star } from 'lucide-react';
import Link from 'next/link';
import { GET_BOOKING_DETAIL_BY_ID_FN } from '@/services/userService';

// Helper function to format time string to 12-hour format
const formatTime = (timeString) => {
  try {
    // If it's a Date object or a date string
    if (timeString) {
      // Handle full date string like "Sat Mar 22 2025 14:00:00 GMT+0530 (India Standard Time)"
      const date = new Date(timeString);

      if (!isNaN(date.getTime())) {
        // Format to 12-hour time (e.g., "2:00 PM")
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours from 24-hour to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        // Format minutes with leading zero if needed
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${formattedMinutes} ${ampm}`;
      }
    }
    return 'N/A';
  } catch (error) {
    console.error("Error formatting time:", error);
    return 'N/A';
  }
};

const BookingConfirmation = ({ params }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

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
    const displayTime = formatTime(bookingDetails.scheduled_start_time);
    return `http://localhost:3000/BOOKING:${bookingDetails._id}|DATE:${formatDate(bookingDetails.appointment_date)}|TIME:${displayTime}`;
  };

  const getDirectionsUrl = () => {
    if (!bookingDetails) return '';

    const { location, salon_name, location_text } = bookingDetails;

    // Check if location coordinates exist
    if (location && location.coordinates && location.coordinates.length === 2) {
      const [longitude, latitude] = location.coordinates;
      const encodedName = encodeURIComponent(salon_name || 'Salon');
      const encodedLocation = encodeURIComponent(location_text || '');

      return `http://localhost:3000/directions?latitude=${latitude}&&longitude=${longitude}&&name=${encodedName}&&locationText=${encodedLocation}`;
    }

    // Fallback to Google Maps with salon name if no coordinates
    return `https://maps.google.com/?q=${encodeURIComponent(salon_name || 'Salon')}`;
  };

  const shareBooking = () => {
    if (!bookingDetails) return;

    const shareText = `My booking at ${bookingDetails.salon_name} on ${formatDate(bookingDetails.appointment_date)} at ${formatTime(bookingDetails.scheduled_start_time)}`;

    if (navigator.share) {
      navigator.share({
        title: 'My Salon Booking',
        text: shareText,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareText + ' - ' + window.location.href)
        .then(() => {
          alert('Booking details copied to clipboard!');
        })
        .catch(err => console.error('Error copying to clipboard:', err));
    }

    setShowShareMenu(false);
  };

  const downloadBookingDetails = () => {
    if (!bookingDetails || typeof window === 'undefined') return;
    if (!bookingDetails) return;

    const bookingText = `
      Booking Details
      --------------
      Booking ID: ${bookingDetails._id}
      Date: ${formatDate(bookingDetails.appointment_date)}
      Time: ${formatTime(bookingDetails.scheduled_start_time)}
      Salon: ${bookingDetails.salon_name}
      Services: ${bookingDetails.services.map(s => s.name).join(', ')}
      Total Amount: ₹${bookingDetails.total_price}
      Status: ${bookingDetails.status}
      `;

    const blob = new Blob([bookingText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Booking-${bookingDetails._id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <h1 className="text-xl font-semibold">Booking Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={downloadBookingDetails}
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={shareBooking}
                  >
                    Share booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="p-6">
        <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${bookingDetails.status === 'confirmed' ? 'bg-cyan-50 text-cyan-800' :
            bookingDetails.status === 'completed' ? 'bg-green-50 text-green-800' :
              'bg-gray-50 text-gray-800'
          }`}>
          <CheckCircle className={`w-6 h-6 flex-shrink-0 ${bookingDetails.status === 'confirmed' ? 'text-cyan-500' :
              bookingDetails.status === 'completed' ? 'text-green-500' :
                'text-gray-500'
            }`} />
          <div>
            <p className="font-medium">
              {bookingDetails.status === 'confirmed' ? 'Your booking has been confirmed!' :
                bookingDetails.status === 'completed' ? 'Your appointment has been completed.' :
                  `Booking status: ${bookingDetails.status}`}
            </p>
            <p className="text-sm mt-1 opacity-90">
              {bookingDetails.status === 'confirmed' ? 'We\'ll remind you before your appointment.' : ''}
            </p>
          </div>
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
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium capitalize ${bookingDetails.status === 'confirmed' ? 'bg-cyan-100 text-cyan-800' :
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
              <div className="font-medium">{formatDate(bookingDetails.appointment_date)}</div>
            </div>
            <div className="flex items-start">
              <div className="w-24 text-gray-500">Time:</div>
              <div className="font-medium">
                {formatTime(bookingDetails.scheduled_start_time)}
              </div>
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
              {bookingDetails.location_text && (
                <p className="text-gray-600 text-sm line-clamp-2">{bookingDetails.location_text}</p>
              )}
            </div>
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-100 text-pink-700 text-sm px-3 py-1.5 rounded-lg hover:bg-pink-200 transition-colors flex items-center gap-1"
            >
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
              <span className="text-pink-600">₹{bookingDetails.total_price}</span>
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
              <span className="font-medium">{formatDate(bookingDetails.booking_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="font-medium text-green-600">{bookingDetails.payment_details?.payment_status || "Completed"}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <a
            href={`tel:${bookingDetails.contact_phone || ''}`}
            className="flex-1 bg-pink-500 text-white rounded-lg py-3 font-medium hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-5 h-5" />
            Contact Salon
          </a>
          <Link
            href={`/bookings/${bookingDetails._id}/cancel`}
            className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Cancel Booking
          </Link>
        </div>

        {/* Rate Experience (optional, for completed bookings) */}
        {bookingDetails.status === 'completed' && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-pink-500" />
              Rate Your Experience
            </h2>
            <p className="text-gray-600 text-sm mb-4">How was your experience at {bookingDetails.salon_name}?</p>
            <Link
              href={`/bookings/${bookingDetails._id}/review`}
              className="w-full bg-pink-100 text-pink-700 rounded-lg py-2.5 font-medium hover:bg-pink-200 transition-colors flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5" />
              Leave a Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;